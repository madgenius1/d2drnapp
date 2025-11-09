/**
 * Validation utility functions
 */

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate Kenyan phone number
 * Accepts formats: 0712345678, 712345678, +254712345678, 254712345678
 */
export const isValidKenyanPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  
  // Check for valid Kenyan phone number patterns
  if (cleaned.startsWith('254') && cleaned.length === 12) {
    return /^254[71]\d{8}$/.test(cleaned);
  }
  
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    return /^0[71]\d{8}$/.test(cleaned);
  }
  
  if (cleaned.length === 9) {
    return /^[71]\d{8}$/.test(cleaned);
  }
  
  return false;
};

/**
 * Validate password strength
 * Requirements: At least 8 characters, 1 uppercase, 1 lowercase, 1 number
 */
export const isValidPassword = (password: string): boolean => {
  if (password.length < 8) return false;
  
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  
  return hasUppercase && hasLowercase && hasNumber;
};

/**
 * Get password strength message
 */
export const getPasswordStrengthMessage = (password: string): string => {
  if (password.length < 8) {
    return 'Password must be at least 8 characters';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  if (!/\d/.test(password)) {
    return 'Password must contain at least one number';
  }
  return 'Password is strong';
};

/**
 * Validate date format (YYYY-MM-DD)
 */
export const isValidDateFormat = (date: string): boolean => {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
};

/**
 * Validate time format (HH:MM)
 */
export const isValidTimeFormat = (time: string): boolean => {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);
};

/**
 * Check if a date is in the future
 */
export const isFutureDate = (dateString: string): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const inputDate = new Date(dateString);
  return inputDate >= today;
};