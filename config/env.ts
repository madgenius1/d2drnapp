/**
 * Environment variables configuration
 * Centralizes access to environment variables with type safety
 */

import Constants from 'expo-constants';

interface EnvConfig {
  // Firebase configuration
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId?: string;
  };
  
  // API endpoints
  api: {
    googleSheetsUrl: string;
    mpesaBaseUrl?: string;
    backendUrl?: string;
  };
  
  // App configuration
  app: {
    name: string;
    version: string;
    environment: 'development' | 'staging' | 'production';
    enableAnalytics: boolean;
  };
  
  // Feature flags
  features: {
    enableMpesa: boolean;
    enableNotifications: boolean;
    enableRealTimeTracking: boolean;
  };
}

// Get environment variables from expo-constants
const expoConfig = Constants.expoConfig;
const extra = expoConfig?.extra || {};

// Environment configuration
export const env: EnvConfig = {
  firebase: {
    apiKey: extra.FIREBASE_API_KEY || process.env.EXPO_PUBLIC_FIREBASE_API_KEY || '',
    authDomain: extra.FIREBASE_AUTH_DOMAIN || process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
    projectId: extra.FIREBASE_PROJECT_ID || process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || '',
    storageBucket: extra.FIREBASE_STORAGE_BUCKET || process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: extra.FIREBASE_MESSAGING_SENDER_ID || process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: extra.FIREBASE_APP_ID || process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '',
    measurementId: extra.FIREBASE_MEASUREMENT_ID || process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
  },
  
  api: {
    googleSheetsUrl: extra.GOOGLE_SHEETS_URL || process.env.EXPO_PUBLIC_GOOGLE_SHEETS_URL || '',
    mpesaBaseUrl: extra.MPESA_BASE_URL || process.env.EXPO_PUBLIC_MPESA_BASE_URL,
    backendUrl: extra.BACKEND_URL || process.env.EXPO_PUBLIC_BACKEND_URL,
  },
  
  app: {
    name: 'D2D',
    version: expoConfig?.version || '1.0.0',
    environment: (extra.APP_ENV || process.env.EXPO_PUBLIC_APP_ENV || 'development') as EnvConfig['app']['environment'],
    enableAnalytics: extra.ENABLE_ANALYTICS === 'true' || process.env.EXPO_PUBLIC_ENABLE_ANALYTICS === 'true',
  },
  
  features: {
    enableMpesa: extra.ENABLE_MPESA === 'true' || process.env.EXPO_PUBLIC_ENABLE_MPESA === 'true',
    enableNotifications: extra.ENABLE_NOTIFICATIONS !== 'false' && process.env.EXPO_PUBLIC_ENABLE_NOTIFICATIONS !== 'false',
    enableRealTimeTracking: extra.ENABLE_REAL_TIME_TRACKING !== 'false' && process.env.EXPO_PUBLIC_ENABLE_REAL_TIME_TRACKING !== 'false',
  },
};

// Validation: Check required environment variables
export const validateEnv = (): { isValid: boolean; missingVars: string[] } => {
  const requiredVars = [
    { key: 'FIREBASE_API_KEY', value: env.firebase.apiKey },
    { key: 'FIREBASE_AUTH_DOMAIN', value: env.firebase.authDomain },
    { key: 'FIREBASE_PROJECT_ID', value: env.firebase.projectId },
    { key: 'FIREBASE_STORAGE_BUCKET', value: env.firebase.storageBucket },
    { key: 'FIREBASE_MESSAGING_SENDER_ID', value: env.firebase.messagingSenderId },
    { key: 'FIREBASE_APP_ID', value: env.firebase.appId },
  ];
  
  const missingVars = requiredVars
    .filter(({ value }) => !value || value === '')
    .map(({ key }) => key);
  
  return {
    isValid: missingVars.length === 0,
    missingVars,
  };
};

// Log environment info (development only)
if (__DEV__) {
  console.log('[ENV] Environment:', env.app.environment);
  console.log('[ENV] Version:', env.app.version);
  
  const validation = validateEnv();
  if (!validation.isValid) {
    console.warn('[ENV] Missing required environment variables:', validation.missingVars);
  }
}

export default env;