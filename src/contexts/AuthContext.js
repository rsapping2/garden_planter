import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendEmailVerification,
  updateProfile as updateFirebaseProfile,
  updateEmail as updateFirebaseEmail,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { getUSDAZone } from '../utils/usdaZones';

const AuthContext = createContext();

// Helper function to translate Firebase error codes to user-friendly messages
const getFirebaseErrorMessage = (errorCode) => {
  switch (errorCode) {
    case 'auth/invalid-credential':
      return 'Wrong email or password. Please try again.';
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/weak-password':
      return 'Password is too weak. Please choose a stronger password.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled. Please contact support.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection and try again.';
    default:
      return 'An error occurred. Please try again.';
  }
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔥 Using Firebase authentication (emulators in dev, cloud in prod)');
    
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
  }, []);

  const login = async (email, password) => {
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
      console.error('Firebase login error:', error);
      return { success: false, error: getFirebaseErrorMessage(error.code) };
    }
  };

  const signup = async (email, password, name, zipCode) => {
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
      console.error('Firebase signup error:', error);
      return { success: false, error: getFirebaseErrorMessage(error.code) };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      return { success: true };
    } catch (error) {
      console.error('Firebase logout error:', error);
      return { success: false, error: getFirebaseErrorMessage(error.code) };
    }
  };

  const updateProfile = async (updates) => {
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
      console.error('Firebase profile update error:', error);
      return { success: false, error: getFirebaseErrorMessage(error.code) };
    }
  };

  const updateEmail = async (newEmail) => {
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
      return { success: false, error: getFirebaseErrorMessage(error.code) };
    }
  };

  const verifyEmail = async () => {
    try {
      if (!auth.currentUser) {
        return { success: false, error: 'No user logged in' };
      }

      // Send verification email
      await sendEmailVerification(auth.currentUser);
      
      return { success: true };
    } catch (error) {
      console.error('Firebase email verification error:', error);
      return { success: false, error: getFirebaseErrorMessage(error.code) };
    }
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true, message: 'Password reset email sent successfully' };
    } catch (error) {
      console.error('Firebase password reset error:', error);
      return { success: false, error: getFirebaseErrorMessage(error.code) };
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
    verifyEmail,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};