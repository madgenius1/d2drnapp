/**
 * Firebase initialization and configuration
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a Firebase project at https://console.firebase.google.com
 * 2. Enable Email/Password authentication
 * 3. Create a Firestore database
 * 4. Get your web app configuration
 * 5. Replace the firebaseConfig below with your actual values
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Replace with your Firebase project configuration
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Cloud Firestore
export const db = getFirestore(app);

// Export types for convenience
export type { User } from 'firebase/auth';
export type {
    CollectionReference, DocumentData,
    DocumentReference, DocumentSnapshot, QuerySnapshot
} from 'firebase/firestore';

