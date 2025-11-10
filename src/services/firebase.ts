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
  apiKey: "AIzaSyDDLl8YZM2agfVauR-vg8MrJyANNMBPgI4",
  authDomain: "d2dapp-a4bad.firebaseapp.com",
  projectId: "d2dapp-a4bad",
  storageBucket: "d2dapp-a4bad.firebasestorage.app",
  messagingSenderId: "230779280017",
  appId: "1:230779280017:web:1c1c5c093040d09e497d30",
  measurementId: "G-XPQ8LEY69F"
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

