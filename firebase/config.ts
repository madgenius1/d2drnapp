/**
 * Firebase Configuration
 * Initialize Firebase app with environment variables
 */

import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

/**
 * Firebase configuration from environment variables
 * Add these to your .env file:
 * 
 * EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
 * EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
 * EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
 * EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
 * EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
 * EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
 */
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

/**
 * Initialize Firebase
 * Only initialize if not already initialized
 */
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Initialize Firebase services
auth = getAuth(app);
db = getFirestore(app);

export { app, auth, db };

/**
 * Check if Firebase is properly configured
 */
export const isFirebaseConfigured = (): boolean => {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId
  );
};

/**
 * Get Firebase configuration status
 */
export const getFirebaseStatus = () => {
  return {
    configured: isFirebaseConfigured(),
    projectId: firebaseConfig.projectId || 'Not configured',
    hasAuth: !!auth,
    hasFirestore: !!db,
  };
};