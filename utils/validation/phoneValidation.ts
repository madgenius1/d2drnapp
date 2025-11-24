/**
 * Phone Validation Utilities
 * Validates and formats Kenyan phone numbers
 */

import { PHONE_FORMATS } from '../../data/constants/appConstants';

/**
 * Clean phone number (remove spaces, hyphens, parentheses)
 */
export const cleanPhoneNumber = (phone: string): string => {
  return phone.replace(/[\s\-\(\)]/g, '');
};

/**
 * Check if phone number is valid Kenyan format
 */
export const isValidKenyanPhone = (phone: string): boolean => {
  const cleaned = cleanPhoneNumber(phone);

  // Check against all Kenyan formats
  return (
    PHONE_FORMATS.KENYA_LOCAL.test(cleaned) ||
    PHONE_FORMATS.KENYA_INTL_PLUS.test(cleaned) ||
    PHONE_FORMATS.KENYA_INTL.test(cleaned)
  );
};

/**
 * Format phone number for display (07XX XXX XXX)
 */
export const formatPhoneForDisplay = (phone: string): string => {
  const cleaned = cleanPhoneNumber(phone);

  // Handle international format +2547XXXXXXXX
  if (cleaned.startsWith('+254')) {
    const local = '0' + cleaned.substring(4);
    return formatLocalPhone(local);
  }

  // Handle international format without + (2547XXXXXXXX)
  if (cleaned.startsWith('254') && cleaned.length === 12) {
    const local = '0' + cleaned.substring(3);
    return formatLocalPhone(local);
  }

  // Handle local format 07XXXXXXXX
  if (cleaned.startsWith('07') && cleaned.length === 10) {
    return formatLocalPhone(cleaned);
  }

  // Return as-is if format not recognized
  return phone;
};

/**
 * Format local phone number with spaces (07XX XXX XXX)
 */
const formatLocalPhone = (phone: string): string => {
  if (phone.length !== 10) {
    return phone;
  }

  const part1 = phone.substring(0, 4); // 07XX
  const part2 = phone.substring(4, 7); // XXX
  const part3 = phone.substring(7); // XXX

  return `${part1} ${part2} ${part3}`;
};

/**
 * Convert to international format (+254...)
 */
export const convertToInternational = (phone: string): string => {
  const cleaned = cleanPhoneNumber(phone);

  // Already international with +
  if (cleaned.startsWith('+254')) {
    return cleaned;
  }

  // Already international without +
  if (cleaned.startsWith('254')) {
    return '+' + cleaned;
  }

  // Local format 07XXXXXXXX
  if (cleaned.startsWith('07') && cleaned.length === 10) {
    return '+254' + cleaned.substring(1);
  }

  return phone;
};

/**
 * Get phone validation error message
 */
export const getPhoneValidationError = (phone: string): string | null => {
  if (!phone || phone.trim().length === 0) {
    return 'Phone number is required';
  }

  if (!isValidKenyanPhone(phone)) {
    return 'Enter valid phone (07XX XXX XXX)';
  }

  return null;
};

/**
 * Validate phone with detailed result
 */
export interface PhoneValidationResult {
  isValid: boolean;
  error?: string;
  formatted?: string;
  international?: string;
}

export const validatePhone = (phone: string): PhoneValidationResult => {
  const error = getPhoneValidationError(phone);

  if (error) {
    return {
      isValid: false,
      error,
    };
  }

  return {
    isValid: true,
    formatted: formatPhoneForDisplay(phone),
    international: convertToInternational(phone),
  };
};