/**
 * Phone Number Formatting Utilities
 * Format and display Kenyan phone numbers
 */

import {
  cleanPhoneNumber,
  formatPhoneForDisplay,
  convertToInternational,
} from '../validation/phoneValidation';

/**
 * Format phone for display (re-export for convenience)
 */
export { formatPhoneForDisplay };

/**
 * Format phone for call (clickable link)
 */
export const formatPhoneForCall = (phone: string): string => {
  return `tel:${convertToInternational(phone)}`;
};

/**
 * Format phone for SMS
 */
export const formatPhoneForSMS = (phone: string): string => {
  return `sms:${convertToInternational(phone)}`;
};

/**
 * Format phone for WhatsApp
 */
export const formatPhoneForWhatsApp = (phone: string): string => {
  const international = convertToInternational(phone);
  const cleaned = cleanPhoneNumber(international);
  return `https://wa.me/${cleaned}`;
};

/**
 * Mask phone number (e.g., "07XX XXX X78")
 */
export const maskPhoneNumber = (phone: string): string => {
  const formatted = formatPhoneForDisplay(phone);
  
  if (formatted.length < 12) {
    return formatted;
  }
  
  // Keep first 4 and last 3 characters, mask the rest
  const visible = formatted.substring(0, 4) + ' XXX X' + formatted.substring(formatted.length - 2);
  return visible;
};