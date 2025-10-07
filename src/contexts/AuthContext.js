import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendEmailVerification,
  updateProfile as updateFirebaseProfile,
  updateEmail as updateFirebaseEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { getUSDAZone } from '../utils/usdaZones';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Check if we should use localStorage instead of Firebase
// Only use localStorage when explicitly requested
const USE_LOCALSTORAGE = process.env.REACT_APP_USE_LOCALSTORAGE === 'true';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (USE_LOCALSTORAGE) {
      // Use localStorage for local development
      console.log('🔄 Using localStorage authentication (local development mode)');
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          // Ensure we have the latest user data from their persistent storage
          const userKey = `user_${parsedUser.email.replace(/[^a-zA-Z0-9]/g, '_')}`;
          const persistentUser = localStorage.getItem(userKey);
          if (persistentUser) {
            const latestUser = JSON.parse(persistentUser);
            setUser(latestUser);
            // Update currentUser with latest data
            localStorage.setItem('currentUser', JSON.stringify(latestUser));
          } else {
            setUser(parsedUser);
          }
        } catch (error) {
          console.error('Error parsing saved user:', error);
          localStorage.removeItem('currentUser');
        }
      }
      setLoading(false);
    } else {
      // Use Firebase authentication (emulators in dev, cloud in prod)
      console.log('🔥 Using Firebase authentication');
      
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          // User is signed in
          try {
            // Get additional user data from Firestore
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            const userData = userDoc.exists() ? userDoc.data() : {};
            
            const user = {
              id: firebaseUser.uid,
              email: firebaseUser.email,
              name: userData.name || firebaseUser.displayName || 'User',
              emailVerified: firebaseUser.emailVerified,
              zipCode: userData.zipCode || '',
              usdaZone: userData.usdaZone || '',
              emailNotifications: userData.emailNotifications !== false,
              webPushNotifications: userData.webPushNotifications !== false
            };
            
            setUser(user);
          } catch (error) {
            console.error('Error fetching user data:', error);
            setUser(null);
          }
        } else {
          // User is signed out
          setUser(null);
        }
        setLoading(false);
      });
      
      // Cleanup subscription on unmount
      return () => unsubscribe();
    }
  }, []);

  const login = async (email, password) => {
    if (USE_LOCALSTORAGE) {
      // Check if user already exists in localStorage
      const existingUserKey = `user_${email.replace(/[^a-zA-Z0-9]/g, '_')}`;
      const existingUser = localStorage.getItem(existingUserKey);
      
      let mockUser;
      if (existingUser) {
        // Use existing user data
        mockUser = JSON.parse(existingUser);
      } else {
        // Create new user with consistent ID based on email
        mockUser = {
          id: existingUserKey,
          email: email,
          emailVerified: true,
          name: email.split('@')[0] || 'Rob',
          zipCode: '90210',
          timezone: 'America/Los_Angeles',
          usdaZone: getUSDAZone('90210'),
          emailNotifications: true,
          webPushNotifications: true,
          createdAt: new Date().toISOString()
        };
        // Save user data for future logins
        localStorage.setItem(existingUserKey, JSON.stringify(mockUser));
      }
      
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      setUser(mockUser);
      
      return { success: true };
    } else {
      // Firebase authentication
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;
        
        // Get additional user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        const userData = userDoc.exists() ? userDoc.data() : {};
        
        const user = {
          id: firebaseUser.uid,
          email: firebaseUser.email,
          name: userData.name || firebaseUser.displayName || 'User',
          emailVerified: firebaseUser.emailVerified,
          zipCode: userData.zipCode || '',
          usdaZone: userData.usdaZone || '',
          emailNotifications: userData.emailNotifications !== false,
          webPushNotifications: userData.webPushNotifications !== false
        };
        
        setUser(user);
        return { success: true };
      } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: error.message };
      }
    }
  };

  const signup = async (email, password, name, zipCode) => {
    if (USE_LOCALSTORAGE) {
      // Create consistent user ID based on email
      const userKey = `user_${email.replace(/[^a-zA-Z0-9]/g, '_')}`;
      
      // Mock signup for local development
      const mockUser = {
        id: userKey,
        email: email,
        emailVerified: false,
        name: name || email.split('@')[0] || 'User',
        zipCode: zipCode || '90210',
        timezone: 'America/Los_Angeles',
        usdaZone: getUSDAZone(zipCode || '90210'),
        emailNotifications: true,
        webPushNotifications: true,
        createdAt: new Date().toISOString()
      };
      
      // Save user data for future logins
      localStorage.setItem(userKey, JSON.stringify(mockUser));
      
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      setUser(mockUser);
      
      return { success: true, user: mockUser };
    } else {
      // Firebase authentication
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;
        
        // Update the user's display name
        if (name) {
          await updateFirebaseProfile(firebaseUser, { displayName: name });
        }
        
        // Create user document in Firestore
        const userData = {
          name: name || email.split('@')[0] || 'User',
          email: email,
          zipCode: zipCode || '',
          usdaZone: getUSDAZone(zipCode || '90210'),
          emailNotifications: true,
          webPushNotifications: true,
          createdAt: new Date().toISOString()
        };
        
        await setDoc(doc(db, 'users', firebaseUser.uid), userData);
        
        // Send email verification
        await sendEmailVerification(firebaseUser);
        
        const user = {
          id: firebaseUser.uid,
          email: firebaseUser.email,
          name: userData.name,
          emailVerified: firebaseUser.emailVerified,
          zipCode: userData.zipCode,
          usdaZone: userData.usdaZone,
          emailNotifications: userData.emailNotifications,
          webPushNotifications: userData.webPushNotifications
        };
        
        setUser(user);
        return { success: true, user };
      } catch (error) {
        console.error('Signup error:', error);
        return { success: false, error: error.message };
      }
    }
  };

  const logout = async () => {
    if (USE_LOCALSTORAGE) {
      localStorage.removeItem('currentUser');
      setUser(null);
      return { success: true };
    } else {
      // Firebase authentication
      try {
        await signOut(auth);
        setUser(null);
        return { success: true };
      } catch (error) {
        console.error('Logout error:', error);
        return { success: false, error: error.message };
      }
    }
  };

  const updateProfile = async (updates) => {
    if (USE_LOCALSTORAGE && user) {
      // Update USDA zone if zipCode is being updated
      if (updates.zipCode && updates.zipCode !== user.zipCode) {
        updates.usdaZone = getUSDAZone(updates.zipCode);
      }
      
      const updatedUser = { ...user, ...updates };
      
      // Save to both currentUser and the persistent user key
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      const userKey = `user_${updatedUser.email.replace(/[^a-zA-Z0-9]/g, '_')}`;
      localStorage.setItem(userKey, JSON.stringify(updatedUser));
      
      setUser(updatedUser);
      return { success: true };
    } else {
      // Firebase profile update
      try {
        if (!user) {
          return { success: false, error: 'No user logged in' };
        }

        // Update USDA zone if zipCode is being updated
        if (updates.zipCode && updates.zipCode !== user.zipCode) {
          updates.usdaZone = getUSDAZone(updates.zipCode);
        }

        // Update user document in Firestore
        await updateDoc(doc(db, 'users', user.id), updates);

        // Update local user state
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        
        return { success: true };
      } catch (error) {
        console.error('Profile update error:', error);
        return { success: false, error: error.message };
      }
    }
  };

  const updateEmail = async (newEmail) => {
    if (USE_LOCALSTORAGE && user) {
      const updatedUser = { 
        ...user, 
        email: newEmail, 
        emailVerified: false // Reset verification status
      };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { success: true };
    } else {
      // Firebase email update
      try {
        if (!user || !auth.currentUser) {
          return { success: false, error: 'No user logged in' };
        }

        // Update email in Firebase Auth
        await updateFirebaseEmail(auth.currentUser, newEmail);
        
        // Update email in Firestore
        await updateDoc(doc(db, 'users', user.id), { email: newEmail });

        // Update local user state
        const updatedUser = { ...user, email: newEmail, emailVerified: false };
        setUser(updatedUser);
        
        return { success: true };
      } catch (error) {
        console.error('Firebase email update error:', error);
        return { success: false, error: error.message };
      }
    }
  };

  const verifyEmail = async () => {
    if (USE_LOCALSTORAGE && user) {
      const updatedUser = { ...user, emailVerified: true };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { success: true };
    } else {
      // Firebase email verification
      try {
        if (!auth.currentUser) {
          return { success: false, error: 'No user logged in' };
        }

        // Send verification email
        await sendEmailVerification(auth.currentUser);
        
        return { success: true };
      } catch (error) {
        console.error('Firebase email verification error:', error);
        return { success: false, error: error.message };
      }
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updateProfile,
    updateEmail,
    verifyEmail
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};