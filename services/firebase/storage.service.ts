/**
 * Firebase Storage Service
 * Handles file uploads (profile pictures, order images, etc.)
 */

import {
    deleteObject,
    getDownloadURL,
    ref,
    uploadBytes,
    uploadBytesResumable,
    UploadTask,
} from 'firebase/storage';
import { storage } from './config';

export interface UploadProgress {
  bytesTransferred: number;
  totalBytes: number;
  progress: number; // 0-100
}

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Convert blob/URI to Blob for upload
 */
const uriToBlob = async (uri: string): Promise<Blob> => {
  const response = await fetch(uri);
  return await response.blob();
};

/**
 * Upload user avatar
 */
export const uploadAvatar = async (
  userId: string,
  imageUri: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> => {
  try {
    // Create storage reference
    const avatarRef = ref(storage, `avatars/${userId}/profile.jpg`);

    // Convert URI to Blob
    const blob = await uriToBlob(imageUri);

    // Upload with progress tracking
    if (onProgress) {
      const uploadTask: UploadTask = uploadBytesResumable(avatarRef, blob);

      return new Promise((resolve) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress: UploadProgress = {
              bytesTransferred: snapshot.bytesTransferred,
              totalBytes: snapshot.totalBytes,
              progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
            };
            onProgress(progress);
          },
          (error) => {
            console.error('[Storage] Upload avatar error:', error);
            resolve({
              success: false,
              error: 'Failed to upload avatar. Please try again.',
            });
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve({
                success: true,
                url: downloadURL,
              });
            } catch (error) {
              resolve({
                success: false,
                error: 'Failed to get avatar URL',
              });
            }
          }
        );
      });
    } else {
      // Simple upload without progress
      await uploadBytes(avatarRef, blob);
      const downloadURL = await getDownloadURL(avatarRef);

      return {
        success: true,
        url: downloadURL,
      };
    }
  } catch (error) {
    console.error('[Storage] Upload avatar error:', error);
    return {
      success: false,
      error: 'Failed to upload avatar. Please try again.',
    };
  }
};

/**
 * Get avatar URL
 */
export const getAvatarUrl = async (userId: string): Promise<string | null> => {
  try {
    const avatarRef = ref(storage, `avatars/${userId}/profile.jpg`);
    return await getDownloadURL(avatarRef);
  } catch (error) {
    console.error('[Storage] Get avatar URL error:', error);
    return null;
  }
};

/**
 * Delete avatar
 */
export const deleteAvatar = async (userId: string): Promise<boolean> => {
  try {
    const avatarRef = ref(storage, `avatars/${userId}/profile.jpg`);
    await deleteObject(avatarRef);
    return true;
  } catch (error) {
    console.error('[Storage] Delete avatar error:', error);
    return false;
  }
};

/**
 * Upload order image (for proof of delivery, etc.)
 */
export const uploadOrderImage = async (
  orderId: string,
  imageUri: string,
  imageType: 'pickup' | 'delivery' | 'proof',
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> => {
  try {
    const timestamp = Date.now();
    const imageRef = ref(
      storage,
      `orders/${orderId}/${imageType}-${timestamp}.jpg`
    );

    const blob = await uriToBlob(imageUri);

    if (onProgress) {
      const uploadTask: UploadTask = uploadBytesResumable(imageRef, blob);

      return new Promise((resolve) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress: UploadProgress = {
              bytesTransferred: snapshot.bytesTransferred,
              totalBytes: snapshot.totalBytes,
              progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
            };
            onProgress(progress);
          },
          (error) => {
            console.error('[Storage] Upload order image error:', error);
            resolve({
              success: false,
              error: 'Failed to upload image',
            });
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve({
                success: true,
                url: downloadURL,
              });
            } catch (error) {
              resolve({
                success: false,
                error: 'Failed to get image URL',
              });
            }
          }
        );
      });
    } else {
      await uploadBytes(imageRef, blob);
      const downloadURL = await getDownloadURL(imageRef);

      return {
        success: true,
        url: downloadURL,
      };
    }
  } catch (error) {
    console.error('[Storage] Upload order image error:', error);
    return {
      success: false,
      error: 'Failed to upload image',
    };
  }
};

export default {
  uploadAvatar,
  getAvatarUrl,
  deleteAvatar,
  uploadOrderImage,
};