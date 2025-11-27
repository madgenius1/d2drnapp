/**
 * Firebase initialization and configuration
 * Provides singleton instances of Firebase services
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import {
  Auth, getAuth,
  // @ts-ignore
  getReactNativePersistence,
  initializeAuth
} from 'firebase/auth';
import { doc, Firestore, getDoc, getFirestore } from 'firebase/firestore';
import { FirebaseStorage, getStorage } from 'firebase/storage';
import { env, validateEnv } from '../../config/env';



// Validate environment variables
const envValidation = validateEnv();
if (!envValidation.isValid && __DEV__) {
  console.error(
    '[Firebase] Missing required environment variables:',
    envValidation.missingVars
  );
}

// Firebase configuration object
const firebaseConfig = {
  apiKey: env.firebase.apiKey,
  authDomain: env.firebase.authDomain,
  projectId: env.firebase.projectId,
  storageBucket: env.firebase.storageBucket,
  messagingSenderId: env.firebase.messagingSenderId,
  appId: env.firebase.appId,
  measurementId: env.firebase.measurementId,
};

// Initialize Firebase app (singleton pattern)
let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;
let storage: FirebaseStorage;

try {
  // Check if Firebase app already exists
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    if (__DEV__) {
      console.log('[Firebase] App initialized successfully');
    }
  } else {
    app = getApp();
    if (__DEV__) {
      console.log('[Firebase] Using existing app instance');
    }
  }

  // Initialize Firebase Auth with AsyncStorage persistence
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (error: any) {
    // Auth may already be initialized
    if (error.code === 'auth/already-initialized') {
      auth = getAuth(app);
    } else {
      throw error;
    }
  }

  // Initialize Firestore
  firestore = getFirestore(app);

  // Initialize Storage
  storage = getStorage(app);

  if (__DEV__) {
    console.log('[Firebase] All services initialized');
  }
} catch (error) {
  console.error('[Firebase] Initialization error:', error);
  throw new Error('Failed to initialize Firebase services');
}

// Export Firebase instances
export { app, auth, firestore, storage };

// Export Firebase app for re-initialization if needed
export const getFirebaseApp = (): FirebaseApp => {
  if (!app) {
    throw new Error('Firebase app not initialized');
  }
  return app;
};

// Export auth instance
export const getFirebaseAuth = (): Auth => {
  if (!auth) {
    throw new Error('Firebase Auth not initialized');
  }
  return auth;
};

// Export firestore instance
export const getFirebaseFirestore = (): Firestore => {
  if (!firestore) {
    throw new Error('Firestore not initialized');
  }
  return firestore;
};

// Export storage instance
export const getFirebaseStorage = (): FirebaseStorage => {
  if (!storage) {
    throw new Error('Firebase Storage not initialized');
  }
  return storage;
};

// Health check function
export const checkFirebaseConnection = async (): Promise<boolean> => {
  try {
    const testDocRef = doc(firestore, '_health', 'test');
    await getDoc(testDocRef);
    return true;
  } catch (error) {
    console.error('[Firebase] Connection check failed:', error);
    return false;
  }
};

export default {
  app,
  auth,
  firestore,
  storage,
};