/**
 * Order Type Definitions
 * Defines all types for orders and order management
 */

import { PriceBreakdown } from './PriceBreakdown';

/**
 * Order status enum
 */
export enum OrderStatus {
  CREATED = 'created',
  PICKED = 'picked',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

/**
 * Payment status enum
 */
export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
}

/**
 * Payment method enum
 */
export enum PaymentMethod {
  MPESA = 'mpesa',
  CASH = 'cash',
  CARD = 'card',
}

/**
 * Recipient details
 */
export interface RecipientDetails {
  name: string;
  phone: string;
}

/**
 * Item details
 */
export interface ItemDetails {
  description: string;
  isFragile: boolean;
}

/**
 * Delivery instructions
 */
export interface DeliveryInstructions {
  specialInstructions?: string;
  deliveryNotes?: string;
}

/**
 * Location information
 */
export interface OrderLocation {
  routeId: string;
  routeName: string;
  stopId: string;
  stopName: string;
  fullAddress: string; // "Thika Road - Ngara"
}

/**
 * Schedule information
 */
export interface OrderSchedule {
  pickupDate: string; // ISO date string
  pickupTime: string; // "8.30 AM"
  estimatedDeliveryTime?: string;
}

/**
 * Order base interface
 */
export interface Order {
  id: string;
  type: 'order' | 'errand';
  userId: string;
  
  // Locations
  pickupLocation: OrderLocation;
  dropoffLocation: OrderLocation;
  
  // Recipient
  recipient: RecipientDetails;
  
  // Item
  item: ItemDetails;
  
  // Instructions
  instructions: DeliveryInstructions;
  
  // Schedule
  schedule: OrderSchedule;
  
  // Pricing
  priceBreakdown: PriceBreakdown;
  totalPrice: number;
  
  // Payment
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  
  // Status
  status: OrderStatus;
  
  // Timestamps
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  completedAt?: string; // ISO timestamp
  
  // Optional fields
  trackingNumber?: string;
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  notes?: string;
}

/**
 * Create order form data
 */
export interface CreateOrderFormData {
  // Locations
  pickupRoute: string;
  pickupStop: string;
  dropoffRoute: string;
  dropoffStop: string;
  
  // Recipient
  recipientName: string;
  recipientPhone: string;
  
  // Item
  itemDescription: string;
  isFragile: boolean;
  
  // Instructions
  specialInstructions?: string;
  deliveryNotes?: string;
  
  // Schedule
  pickupDate: Date;
  pickupTime: string;
}

/**
 * Create order request payload
 */
export interface CreateOrderRequest {
  userId: string;
  pickupLocation: OrderLocation;
  dropoffLocation: OrderLocation;
  recipient: RecipientDetails;
  item: ItemDetails;
  instructions: DeliveryInstructions;
  schedule: OrderSchedule;
  priceBreakdown: PriceBreakdown;
  totalPrice: number;
  paymentMethod: PaymentMethod;
}

/**
 * Order filter options
 */
export interface OrderFilterOptions {
  status?: OrderStatus | OrderStatus[];
  startDate?: string;
  endDate?: string;
  searchQuery?: string;
}

/**
 * Order statistics
 */
export interface OrderStats {
  created: number;
  pending: number;
  completed: number;
  total: number;
}

/**
 * Order validation error
 */
export interface OrderValidationError {
  field: string;
  message: string;
}

/**
 * Order validation result
 */
export interface OrderValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}