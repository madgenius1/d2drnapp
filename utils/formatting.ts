/**
 * Formatting Utilities
 * Date, currency, phone number formatting helpers
 */

import { format, formatDistance, isToday, isYesterday } from 'date-fns';

/**
 * Format currency (Kenyan Shillings)
 */
export const formatCurrency = (amount: number | undefined | null): string => {
  // Handle undefined, null, or invalid values
  if (amount === undefined || amount === null || isNaN(amount)) {
    return 'KES 0';
  }

  try {
    return `KES ${amount.toLocaleString('en-KE', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  } catch (error) {
    console.warn('[formatCurrency] Error formatting:', error);
    return `KES ${amount}`;
  }
};

/**
 * Format phone number (Kenyan format)
 * Converts to: +254 712 345 678
 */
export const formatPhoneNumber = (phone: string | undefined | null): string => {
  if (!phone) return '';

  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');

  // Format as +254 XXX XXX XXX
  if (cleaned.startsWith('254') && cleaned.length === 12) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
  }

  // Format as 07XX XXX XXX
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }

  return phone;
};

/**
 * Format date (e.g., "Jan 15, 2024")
 */
export const formatDate = (
  date: Date | string | undefined | null,
  format: 'short' | 'long' | 'time' = 'short'
): string => {
  if (!date) return 'N/A';

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }

    switch (format) {
      case 'long':
        return dateObj.toLocaleDateString('en-KE', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      case 'time':
        return dateObj.toLocaleTimeString('en-KE', {
          hour: '2-digit',
          minute: '2-digit',
        });
      default:
        return dateObj.toLocaleDateString('en-KE', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
    }
  } catch (error) {
    console.warn('[formatDate] Error formatting:', error);
    return 'Invalid Date';
  }
};

/**
 * Format date and time (e.g., "Jan 15, 2024 • 2:30 PM")
 */
export const formatDateTime = (dateString: string): string => {
  try {
    return format(new Date(dateString), "MMM dd, yyyy • h:mm a");
  } catch (error) {
    return dateString;
  }
};

/**
 * Format time only (e.g., "2:30 PM")
 */
export const formatTime = (dateString: string): string => {
  try {
    return format(new Date(dateString), 'h:mm a');
  } catch (error) {
    return dateString;
  }
};

/**
 * Format relative time (e.g., "2 hours ago", "in 3 days")
 */
export const formatRelativeTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();

    if (isToday(date)) {
      return `Today at ${format(date, 'h:mm a')}`;
    }

    if (isYesterday(date)) {
      return `Yesterday at ${format(date, 'h:mm a')}`;
    }

    return formatDistance(date, now, { addSuffix: true });
  } catch (error) {
    return dateString;
  }
};

/**
 * Format day of week (e.g., "Monday, January 15")
 */
export const formatDayOfWeek = (dateString: string): string => {
  try {
    return format(new Date(dateString), 'EEEE, MMMM dd');
  } catch (error) {
    return dateString;
  }
};

/**
 * Format full date (e.g., "Monday, January 15, 2024")
 */
export const formatFullDate = (dateString: string): string => {
  try {
    return format(new Date(dateString), 'EEEE, MMMM dd, yyyy');
  } catch (error) {
    return dateString;
  }
};

/**
 * Format order ID (shorten for display)
 * D2D-123ABC456-XYZ789 → D2D-...XYZ789
 */
export const formatOrderId = (orderId: string, maxLength: number = 15): string => {
  if (orderId.length <= maxLength) {
    return orderId;
  }

  const start = orderId.substring(0, 7); // "D2D-123"
  const end = orderId.substring(orderId.length - 6); // Last 6 chars

  return `${start}...${end}`;
};

/**
 * Format text to title case
 */
export const toTitleCase = (text: string): string => {
  return text
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }

  return text.substring(0, maxLength - 3) + '...';
};

/**
 * Format file size (bytes to human readable)
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Format duration (seconds to human readable)
 */
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
};

/**
 * Format distance (meters to human readable)
 */
// export const formatDistance = (meters: number): string => {
//   if (meters < 1000) {
//     return `${Math.round(meters)}m`;
//   }

//   return `${(meters / 1000).toFixed(1)}km`;
// };

/**
 * Parse ISO date string to Date object safely
 */
export const parseDate = (dateString: string): Date | null => {
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  } catch (error) {
    return null;
  }
};

/**
 * Format order status
 */
export const formatOrderStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    scheduled: 'Scheduled',
    picked: 'Picked Up',
    onTheWay: 'On The Way',
    dropped: 'Dropped Off',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };

  return statusMap[status] || status;
};

/**
 * Format time ago (e.g., "2 hours ago")
 */
export const formatTimeAgo = (date: Date | string | undefined | null): string => {
  if (!date) return '';

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return '';
    }

    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return formatDate(dateObj, 'short');
  } catch (error) {
    console.warn('[formatTimeAgo] Error formatting:', error);
    return '';
  }
};

/**
 * Parse amount from string
 */
export const parseAmount = (value: string): number => {
  const cleaned = value.replace(/[^0-9.]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};


export default {
  formatCurrency,
  parseAmount,
  formatOrderStatus,
  formatTimeAgo,
  formatPhoneNumber,
  formatDate,
  formatDateTime,
  formatTime,
  formatRelativeTime,
  formatDayOfWeek,
  formatFullDate,
  formatOrderId,
  toTitleCase,
  truncateText,
  formatFileSize,
  formatDuration,
  formatDistance,
  parseDate,
};