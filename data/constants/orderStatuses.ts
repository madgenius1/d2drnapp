/**
 * Order Status Constants
 * Defines status configurations and transitions
 */

import { OrderStatus } from '../../types/models/Order';

/**
 * Status configuration
 */
export interface StatusConfig {
  status: OrderStatus;
  label: string;
  color: string;
  description: string;
  icon: string; // Icon name
}

/**
 * Status configurations
 */
export const ORDER_STATUS_CONFIG: Record<OrderStatus, StatusConfig> = {
  [OrderStatus.CREATED]: {
    status: OrderStatus.CREATED,
    label: 'Created',
    color: '#099d15',
    description: 'Order has been created and is awaiting pickup',
    icon: 'PlusCircle',
  },
  [OrderStatus.PICKED]: {
    status: OrderStatus.PICKED,
    label: 'Picked Up',
    color: '#F59E0B',
    description: 'Item has been picked up by driver',
    icon: 'PackageCheck',
  },
  [OrderStatus.IN_TRANSIT]: {
    status: OrderStatus.IN_TRANSIT,
    label: 'In Transit',
    color: '#1485FF',
    description: 'Item is on the way to destination',
    icon: 'Truck',
  },
  [OrderStatus.DELIVERED]: {
    status: OrderStatus.DELIVERED,
    label: 'Delivered',
    color: '#22C75A',
    description: 'Item has been delivered successfully',
    icon: 'CheckCircle2',
  },
  [OrderStatus.CANCELLED]: {
    status: OrderStatus.CANCELLED,
    label: 'Cancelled',
    color: '#EF4444',
    description: 'Order has been cancelled',
    icon: 'XCircle',
  },
};

/**
 * Get status config by status
 */
export const getStatusConfig = (status: OrderStatus): StatusConfig => {
  return ORDER_STATUS_CONFIG[status];
};

/**
 * Status transition map (which statuses can transition to which)
 */
export const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.CREATED]: [OrderStatus.PICKED, OrderStatus.CANCELLED],
  [OrderStatus.PICKED]: [OrderStatus.IN_TRANSIT, OrderStatus.CANCELLED],
  [OrderStatus.IN_TRANSIT]: [OrderStatus.DELIVERED, OrderStatus.CANCELLED],
  [OrderStatus.DELIVERED]: [], // Terminal state
  [OrderStatus.CANCELLED]: [], // Terminal state
};

/**
 * Check if status transition is valid
 */
export const isValidTransition = (
  currentStatus: OrderStatus,
  newStatus: OrderStatus
): boolean => {
  return STATUS_TRANSITIONS[currentStatus].includes(newStatus);
};

/**
 * Get timeline steps
 */
export interface TimelineStep {
  status: OrderStatus;
  label: string;
  icon: string;
  color: string;
}

export const TIMELINE_STEPS: TimelineStep[] = [
  {
    status: OrderStatus.CREATED,
    label: 'Created',
    icon: 'PlusCircle',
    color: '#099d15',
  },
  {
    status: OrderStatus.PICKED,
    label: 'Picked',
    icon: 'PackageCheck',
    color: '#F59E0B',
  },
  {
    status: OrderStatus.IN_TRANSIT,
    label: 'In Transit',
    icon: 'Truck',
    color: '#1485FF',
  },
  {
    status: OrderStatus.DELIVERED,
    label: 'Delivered',
    icon: 'CheckCircle2',
    color: '#22C75A',
  },
];

/**
 * Get current step index in timeline
 */
export const getCurrentStepIndex = (status: OrderStatus): number => {
  if (status === OrderStatus.CANCELLED) {
    return -1; // Not in normal timeline
  }
  return TIMELINE_STEPS.findIndex(step => step.status === status);
};