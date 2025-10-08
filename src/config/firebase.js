import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration - all values from environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Check if we should use localStorage instead of Firebase
const USE_LOCALSTORAGE = process.env.REACT_APP_USE_LOCALSTORAGE === 'true';

let app, auth, db;

if (!USE_LOCALSTORAGE) {
  // Validate required Firebase configuration
  const requiredEnvVars = [
    'REACT_APP_FIREBASE_API_KEY',
    'REACT_APP_FIREBASE_AUTH_DOMAIN', 
    'REACT_APP_FIREBASE_PROJECT_ID',
    'REACT_APP_FIREBASE_APP_ID'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  if (missingVars.length > 0) {
    console.error('Missing required Firebase environment variables:', missingVars);
    console.error('Please copy env.development.example to .env.local and update the values');
  }

  // Initialize Firebase
  app = initializeApp(firebaseConfig);

  // Initialize Firebase services
  auth = getAuth(app);
  db = getFirestore(app);
} else {
  console.log('🔄 Using localStorage mode - Firebase initialization skipped');
  // Create mock objects to prevent import errors
  app = null;
  auth = null;
  db = null;
}

export { auth, db };

// Initialize Analytics (only in production and when not using localStorage)
let analytics = null;
if (process.env.NODE_ENV === 'production' && !USE_LOCALSTORAGE && app) {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.log('Analytics initialization skipped:', error.message);
  }
}
export { analytics };

// Connect to emulators in development (only if explicitly enabled and not using localStorage)
if (!USE_LOCALSTORAGE && process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_EMULATORS === 'true' && auth && db) {
  // Connect to emulators (only once per session)
  try {
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    console.log('🔥 Connected to Firebase Auth Emulator');
  } catch (error) {
    console.log('Auth emulator connection skipped:', error.message);
  }
  
  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
    console.log('🔥 Connected to Firestore Emulator');
  } catch (error) {
    console.log('Firestore emulator connection skipped:', error.message);
  }
} else if (!USE_LOCALSTORAGE && process.env.NODE_ENV === 'development') {
  console.log('🔥 Firebase running in development mode without emulators');
}

export default app;


