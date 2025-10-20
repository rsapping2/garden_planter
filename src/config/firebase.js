import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { debugLog, errorLog, infoLog } from '../utils/debugLogger';

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

// Validate required Firebase configuration
const requiredEnvVars = [
  'REACT_APP_FIREBASE_API_KEY',
  'REACT_APP_FIREBASE_AUTH_DOMAIN', 
  'REACT_APP_FIREBASE_PROJECT_ID',
  'REACT_APP_FIREBASE_APP_ID'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  errorLog('Missing required Firebase environment variables:', missingVars);
  errorLog('Please copy env.development.example to .env.local and update the values');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize Analytics (only in production)
let analytics = null;
if (process.env.NODE_ENV === 'production') {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    debugLog('Analytics initialization skipped:', error.message);
  }
}

// Connect to emulators in development
if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_EMULATORS === 'true') {
  // Connect to emulators (only once per session)
  try {
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    infoLog('🔥 Connected to Firebase Auth Emulator');
  } catch (error) {
    debugLog('Auth emulator connection skipped:', error.message);
  }
  
  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
    infoLog('🔥 Connected to Firestore Emulator');
  } catch (error) {
    debugLog('Firestore emulator connection skipped:', error.message);
  }
} else if (process.env.NODE_ENV === 'development') {
  infoLog('🔥 Firebase running in development mode without emulators');
} else {
  infoLog('🔥 Firebase running in production mode');
}

export { auth, db, analytics };
export default app;