/**
 * App-wide Constants
 * Centralized configuration values
 */

import type { OrderStatus, PaymentMethod } from '../types';

/**
 * App metadata
 */
export const APP_CONFIG = {
  NAME: 'd2dApp',
  TAGLINE: 'Pick. Drop. Done.',
  VERSION: '1.0.0',
  SUPPORT_EMAIL: 'support@d2dapp.com',
  SUPPORT_PHONE: '+254789872396',
} as const;

/**
 * Order status configurations
 */
export const ORDER_STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; icon: string }
> = {
  scheduled: {
    label: 'Scheduled',
    color: '#099d15',
    icon: 'Clock',
  },
  picked: {
    label: 'Picked Up',
    color: '#F59E0B',
    icon: 'Package',
  },
  onTheWay: {
    label: 'On The Way',
    color: '#1485FF',
    icon: 'Truck',
  },
  dropped: {
    label: 'Delivered',
    color: '#22C75A',
    icon: 'CheckCircle2',
  },
  completed: {
    label: 'Completed',
    color: '#22C75A',
    icon: 'CheckCircle',
  },
  cancelled: {
    label: 'Cancelled',
    color: '#EF4444',
    icon: 'XCircle',
  },
};

/**
 * Payment method configurations
 */
export const PAYMENT_METHOD_CONFIG: Record<
  PaymentMethod,
  { label: string; description: string; icon: string }
> = {
  payNow: {
    label: 'Pay Now',
    description: 'Pay immediately via M-Pesa',
    icon: 'Smartphone',
  },
  payOnPickup: {
    label: 'Pay on Pickup',
    description: 'Pay cash when driver arrives',
    icon: 'Banknote',
  },
};

/**
 * Order type labels
 */
export const ORDER_TYPE_LABELS = {
  delivery: 'Delivery',
  errand: 'Errand',
} as const;

/**
 * Date/Time constants
 */
export const DATE_FORMATS = {
  DISPLAY: 'dd MM, yyyy',
  DISPLAY_FULL: 'EEEE, dd MMMM, yyyy',
  DISPLAY_TIME: 'h:mm a',
  DISPLAY_DATETIME: 'dd MMM, yyyy • h:mm a',
  ISO: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
} as const;

/**
 * Validation limits
 */
export const VALIDATION_LIMITS = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  PASSWORD_MIN_LENGTH: 8,
  PHONE_LENGTH: 10, // Without country code
  DESCRIPTION_MIN_LENGTH: 10,
  DESCRIPTION_MAX_LENGTH: 500,
  NOTES_MAX_LENGTH: 200,
  ORDER_ID_LENGTH: 20,
} as const;

/**
 * Pagination
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

/**
 * Cache durations (milliseconds)
 */
export const CACHE_DURATION = {
  SHORT: 1000 * 60 * 5, // 5 minutes
  MEDIUM: 1000 * 60 * 30, // 30 minutes
  LONG: 1000 * 60 * 60, // 1 hour
  DAY: 1000 * 60 * 60 * 24, // 24 hours
} as const;

/**
 * Request timeouts (milliseconds)
 */
export const TIMEOUTS = {
  API_REQUEST: 30000, // 30 seconds
  FILE_UPLOAD: 120000, // 2 minutes
} as const;

/**
 * File upload limits
 */
export const FILE_LIMITS = {
  MAX_IMAGE_SIZE: 6 * 1024 * 1024, // 6 MB
  MAX_DOCUMENT_SIZE: 10 * 1024 * 1024, // 10 MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf'],
} as const;

/**
 * Map/Location constants
 */
export const LOCATION_CONFIG = {
  DEFAULT_ZOOM: 12,
  DEFAULT_CENTER: {
    latitude: -1.286389,
    longitude: 36.817223,
  }, // Nairobi
  MARKER_COLOR: '#099d15',
} as const;

/**
 * Animation durations (milliseconds)
 */
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

/**
 * Bottom sheet heights
 */
export const BOTTOM_SHEET = {
  SNAP_POINTS: ['25%', '50%', '75%', '90%'],
  DEFAULT_INDEX: 1,
} as const;

/**
 * Keyboard avoiding view offsets
 */
export const KEYBOARD_OFFSET = {
  IOS: 0,
  ANDROID: 20,
} as const;

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
  AUTH_REQUIRED: 'Please sign in to continue.',
  PERMISSION_DENIED: 'Permission denied.',
  NOT_FOUND: 'Resource not found.',
} as const;

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  ORDER_CREATED: 'Order created successfully!',
  ORDER_UPDATED: 'Order updated successfully!',
  ORDER_CANCELLED: 'Order cancelled successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  PAYMENT_SUCCESS: 'Payment completed successfully!',
} as const;

/**
 * Filter options
 */
export const FILTER_OPTIONS = {
  ORDER_STATUS: [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ],
  ORDER_TYPE: [
    { value: 'all', label: 'All Types' },
    { value: 'delivery', label: 'Delivery' },
    { value: 'errand', label: 'Errand' },
  ],
  DATE_RANGE: [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'all', label: 'All Time' },
  ],
} as const;

/**
 * Storage keys
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'd2d-auth-token',
  USER_DATA: 'd2d-user-data',
  THEME_MODE: 'd2d-theme-mode',
  ONBOARDING_COMPLETE: 'd2d-onboarding-complete',
  LAST_ROUTE_SELECTION: 'd2d-last-route-selection',
} as const;

export default {
  APP_CONFIG,
  ORDER_STATUS_CONFIG,
  PAYMENT_METHOD_CONFIG,
  ORDER_TYPE_LABELS,
  DATE_FORMATS,
  VALIDATION_LIMITS,
  PAGINATION,
  CACHE_DURATION,
  TIMEOUTS,
  FILE_LIMITS,
  LOCATION_CONFIG,
  ANIMATION_DURATION,
  BOTTOM_SHEET,
  KEYBOARD_OFFSET,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  FILTER_OPTIONS,
  STORAGE_KEYS,
};