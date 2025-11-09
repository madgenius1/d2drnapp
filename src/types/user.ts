/**
 * Type definitions for Users
 */

export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  phone?: string;
  photoURL?: string;
  createdAt: number;
  notificationsEnabled: boolean;
  emailNotificationsEnabled: boolean;
  smsNotificationsEnabled: boolean;
}

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}