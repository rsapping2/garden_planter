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
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { getUSDAZone } from '../utils/usdaZones';
import { debugLog, errorLog } from '../utils/debugLogger';
import { validateName, validateZipCode, sanitizeString } from '../utils/validation';

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
    debugLog('🔥 Using Firebase authentication (emulators in dev, cloud in prod)');
    
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
            // Use Firestore emailVerified status as source of truth, fallback to Firebase Auth
            emailVerified: userData.emailVerified === true ? true : (userData.emailVerified === false ? false : firebaseUser.emailVerified),
            zipCode: userData.zipCode || '',
            usdaZone: userData.usdaZone || '',
            emailNotifications: userData.emailNotifications !== false,
            webPushNotifications: userData.webPushNotifications !== false
          };
          
          setUser(user);
        } catch (error) {
          errorLog('Error fetching user data:', error);
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
      errorLog('Firebase login error:', error);
      return { success: false, error: getFirebaseErrorMessage(error.code) };
    }
  };

  const signup = async (email, password, name, zipCode) => {
    try {
      // Validate and sanitize inputs before creating user
      const nameValidation = validateName(name);
      const zipValidation = validateZipCode(zipCode);
      
      if (!nameValidation.isValid) {
        return { success: false, error: nameValidation.error };
      }
      
      if (!zipValidation.isValid) {
        return { success: false, error: zipValidation.error };
      }
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Use sanitized data for display name
      const sanitizedName = nameValidation.sanitized;
      if (sanitizedName) {
        await updateFirebaseProfile(firebaseUser, { displayName: sanitizedName });
      }
      
      // Create user document in Firestore with sanitized and validated data
      const userData = {
        name: sanitizedName || sanitizeString(email.split('@')[0]) || 'User',
        email: firebaseUser.email, // Use Firebase's validated email
        zipCode: zipValidation.sanitized,
        usdaZone: getUSDAZone(zipValidation.sanitized || '90210'),
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
      errorLog('Firebase signup error:', error);
      return { success: false, error: getFirebaseErrorMessage(error.code) };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      return { success: true };
    } catch (error) {
      errorLog('Firebase logout error:', error);
      return { success: false, error: getFirebaseErrorMessage(error.code) };
    }
  };

  const updateProfile = async (updates) => {
    try {
      if (!user) {
        return { success: false, error: 'No user logged in' };
      }

      // Validate and sanitize updates
      const sanitizedUpdates = {};
      
      if (updates.name !== undefined) {
        const nameValidation = validateName(updates.name);
        if (!nameValidation.isValid) {
          return { success: false, error: nameValidation.error };
        }
        sanitizedUpdates.name = nameValidation.sanitized;
      }
      
      if (updates.zipCode !== undefined) {
        const zipValidation = validateZipCode(updates.zipCode);
        if (!zipValidation.isValid) {
          return { success: false, error: zipValidation.error };
        }
        sanitizedUpdates.zipCode = zipValidation.sanitized;
        sanitizedUpdates.usdaZone = getUSDAZone(zipValidation.sanitized);
      }
      
      // Copy over other safe updates (booleans, etc.)
      if (updates.emailNotifications !== undefined) {
        sanitizedUpdates.emailNotifications = Boolean(updates.emailNotifications);
      }
      if (updates.webPushNotifications !== undefined) {
        sanitizedUpdates.webPushNotifications = Boolean(updates.webPushNotifications);
      }
      if (updates.emailVerified !== undefined) {
        sanitizedUpdates.emailVerified = Boolean(updates.emailVerified);
      }

      // Update user document in Firestore
      await updateDoc(doc(db, 'users', user.id), sanitizedUpdates);

      // Update local user state
      const updatedUser = { ...user, ...sanitizedUpdates };
      setUser(updatedUser);
      
      return { success: true };
    } catch (error) {
      errorLog('Firebase profile update error:', error);
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
      errorLog('Firebase email update error:', error);
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
      errorLog('Firebase email verification error:', error);
      return { success: false, error: getFirebaseErrorMessage(error.code) };
    }
  };

  const markEmailAsVerified = async () => {
    try {
      if (!user || !auth.currentUser) {
        return { success: false, error: 'No user logged in' };
      }

      // Update email verification status in Firestore
      await updateDoc(doc(db, 'users', user.id), { 
        emailVerified: true,
        emailVerifiedAt: new Date().toISOString()
      });

      // Update local user state
      const updatedUser = { ...user, emailVerified: true };
      setUser(updatedUser);
      
      debugLog('Email marked as verified in Firestore');
      return { success: true };
    } catch (error) {
      errorLog('Error marking email as verified:', error);
      return { success: false, error: 'Failed to update email verification status' };
    }
  };

  const resetPassword = async (email) => {
    try {
      // SECURITY: Check if account exists and is verified before sending reset email
      // This prevents spam attacks on unverified accounts
      
      // Query Firestore for user with this email
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email.toLowerCase().trim()));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        // Don't reveal if account exists (security best practice)
        // Return success message anyway to prevent email enumeration
        return { 
          success: true, 
          message: 'If an account exists with this email, a password reset link has been sent.' 
        };
      }
      
      // Check if account is verified
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      
      if (!userData.emailVerified) {
        // SECURITY FIX: Return same generic message to prevent email enumeration
        // Don't reveal whether account is unverified vs non-existent
        return { 
          success: true, 
          message: 'If an account exists with this email, a password reset link has been sent.' 
        };
      }
      
      // Account exists and is verified - send reset email
      await sendPasswordResetEmail(auth, email);
      return { success: true, message: 'If an account exists with this email, a password reset link has been sent.' };
    } catch (error) {
      errorLog('Firebase password reset error:', error);
      return { success: false, error: getFirebaseErrorMessage(error.code) };
    }
  };

  const refreshUser = async () => {
    try {
      if (!auth.currentUser) {
        return { success: false, error: 'No user logged in' };
      }

      // Reload the user to get the latest email verification status
      await auth.currentUser.reload();
      
      // Get the updated user data
      const firebaseUser = auth.currentUser;
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      const userData = userDoc.exists() ? userDoc.data() : {};
      
      const updatedUser = {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        name: userData.name || firebaseUser.displayName || 'User',
        emailVerified: firebaseUser.emailVerified,
        zipCode: userData.zipCode || '',
        usdaZone: userData.usdaZone || '',
        emailNotifications: userData.emailNotifications !== false,
        webPushNotifications: userData.webPushNotifications !== false
      };
      
      setUser(updatedUser);
      return { success: true, user: updatedUser };
    } catch (error) {
      errorLog('Error refreshing user:', error);
      return { success: false, error: 'Failed to refresh user data' };
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
    markEmailAsVerified,
    resetPassword,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};