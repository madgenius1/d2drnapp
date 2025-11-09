/**
 * Application constants
 */

export const PRICING_DEFAULTS = {
  SAME_ROUTE_DIVISOR: 1.8,     // Divisor for same-route calculation
  DIFFERENT_ROUTE_DIVISOR: 2,  // Divisor for different-route calculation
  BASE_FEE: 50,                // Base fee added to all calculations (KES)
} as const;

export const ORDER_STATUSES = {
  SCHEDULED: 'scheduled',
  PICKED: 'picked',
  ON_THE_WAY: 'onTheWay',
  DROPPED: 'dropped',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const PAYMENT_TYPES = {
  PAY_NOW: 'payNow',
  PAY_ON_PICKUP: 'payOnPickup',
} as const;

export const COLLECTIONS = {
  USERS: 'users',
  ROUTES: 'routes',
  ORDERS: 'orders',
} as const;

export const STATUS_LABELS: Record<string, string> = {
  scheduled: 'Scheduled',
  picked: 'Picked Up',
  onTheWay: 'On The Way',
  dropped: 'Dropped Off',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const STATUS_COLORS: Record<string, string> = {
  scheduled: '#2196F3',
  picked: '#FF9800',
  onTheWay: '#9C27B0',
  dropped: '#00BCD4',
  completed: '#4CAF50',
  cancelled: '#F44336',
};