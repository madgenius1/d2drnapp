/**
 * Firebase Authentication service
 */

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    User,
    UserCredential,
} from 'firebase/auth';
import { auth } from './firebase';
import { createUserProfile } from './firestore';

/**
 * Sign up a new user with email and password
 */
export const signUp = async (
  email: string,
  password: string,
  displayName?: string
): Promise<User> => {
  try {
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    // Update display name if provided
    if (displayName) {
      await updateProfile(user, { displayName });
    }

    // Create user profile in Firestore
    await createUserProfile({
      id: user.uid,
      email: user.email || email,
      displayName: displayName || null,
      phone: null,
      photoURL: null,
      createdAt: Date.now(),
      notificationsEnabled: true,
      emailNotificationsEnabled: true,
      smsNotificationsEnabled: false,
    });

    return user;
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
};

/**
 * Sign in an existing user with email and password
 */
export const signIn = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
};

/**
 * Sign out the current user
 */
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (updates: {
  displayName?: string;
  photoURL?: string;
}): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No user logged in');

    await updateProfile(user, updates);
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};

/**
 * Get current user
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// TODO: Placeholder for phone/OTP authentication
// This would require additional Firebase setup and react-native-firebase
/**
 * Sign in with phone number (Placeholder)
 * 
 * Implementation would require:
 * 1. Install @react-native-firebase/auth
 * 2. Configure iOS and Android native modules
 * 3. Use signInWithPhoneNumber from Firebase Auth
 */
export const signInWithPhone = async (
  phoneNumber: string
): Promise<void> => {
  // TODO: Implement phone authentication
  console.warn('Phone authentication not yet implemented');
  throw new Error('Phone authentication not yet implemented');
};

/**
 * Verify OTP code (Placeholder)
 */
export const verifyOTP = async (
  verificationId: string,
  code: string
): Promise<User> => {
  // TODO: Implement OTP verification
  console.warn('OTP verification not yet implemented');
  throw new Error('OTP verification not yet implemented');
};