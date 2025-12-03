/**
 * Formatting Utilities
 * Helper functions for formatting dates, currency, phone numbers, etc.
 */

/**
 * Format currency to KES
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
 * Format date to readable string
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
 * Format phone number
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
 * Format date and time together
 */
export const formatDateTime = (
  date: Date | string | undefined | null,
  includeTime: boolean = true
): string => {
  if (!date) return 'N/A';

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }

    const dateStr = dateObj.toLocaleDateString('en-KE', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    if (!includeTime) {
      return dateStr;
    }

    const timeStr = dateObj.toLocaleTimeString('en-KE', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return `${dateStr} • ${timeStr}`;
  } catch (error) {
    console.warn('[formatDateTime] Error formatting:', error);
    return 'Invalid Date';
  }
};

/**
 * Truncate text
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text || '';
  return text.slice(0, maxLength) + '...';
};