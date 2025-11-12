/**
 * Firebase Storage service for file uploads
 */

import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { app } from './firebase';

const storage = getStorage(app);

/**
 * Upload user profile photo
 * 
 * @param userId - User's UID
 * @param uri - Local file URI from image picker
 * @returns Download URL of uploaded image
 */
export const uploadProfilePhoto = async (
  userId: string,
  uri: string
): Promise<string> => {
  try {
    // Fetch the image as a blob
    const response = await fetch(uri);
    const blob = await response.blob();

    // Create a reference to the storage location
    const storageRef = ref(storage, `profile-photos/${userId}.jpg`);

    // Upload the file
    await uploadBytes(storageRef, blob);

    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  } catch (error) {
    console.error('Error uploading profile photo:', error);
    throw error;
  }
};

/**
 * Delete user profile photo
 * 
 * @param userId - User's UID
 */
export const deleteProfilePhoto = async (userId: string): Promise<void> => {
  try {
    const storageRef = ref(storage, `profile-photos/${userId}.jpg`);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting profile photo:', error);
    throw error;
  }
};

/**
 * Get profile photo URL
 * 
 * @param userId - User's UID
 * @returns Download URL or null if doesn't exist
 */
export const getProfilePhotoURL = async (
  userId: string
): Promise<string | null> => {
  try {
    const storageRef = ref(storage, `profile-photos/${userId}.jpg`);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error: any) {
    if (error.code === 'storage/object-not-found') {
      return null;
    }
    console.error('Error getting profile photo URL:', error);
    throw error;
  }
};