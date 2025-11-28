/**
 * Firebase Configuration
 * Initialize Firebase services
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';

import {
  Auth,
  getAuth,
  // @ts-ignore
  getReactNativePersistence,
  initializeAuth
} from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { FirebaseStorage } from 'firebase/storage';
import { validateEnv } from '../../config/env';

// Validate environment variables
const envValidation = validateEnv();
if (!envValidation.isValid && __DEV__) {
  console.error(
    '[Firebase] Missing required environment variables:',
    envValidation.missingVars
  );
}


// Your Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "YOUR_AUTH_DOMAIN",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "YOUR_STORAGE_BUCKET",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "YOUR_APP_ID",
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || ""
};

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;
let storage: FirebaseStorage;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  console.log('[Firebase] App initialized successfully');
} else {
  app = getApp();
  console.log('[Firebase] Using existing Firebase app');
}

// Initialize Auth with AsyncStorage persistence
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
  console.log('[Firebase] Auth initialized with persistence');
} catch (error) {
  // Auth might already be initialized
  auth = getAuth(app);
  console.log('[Firebase] Using existing Auth instance');
}

// Initialize Firestore
const db = getFirestore(app);
console.log('[Firebase] Firestore initialized');

// Initialize Storage (for future use - profile pictures, etc.)storage = getStorage(app);
console.log('[Firebase] Storage initialized');

console.log('[Firebase] All services initialized');

// Export initialized services
export { app, auth, db, storage };

// Export Firebase config for reference
  export { firebaseConfig };

