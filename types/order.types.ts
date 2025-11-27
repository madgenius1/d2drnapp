/**
 * Order-related TypeScript type definitions
 * Defines the structure of orders (delivery & errands)
 */

export type OrderType = 'delivery' | 'errand';

export type OrderStatus = 
  | 'scheduled'    // Just created, awaiting pickup
  | 'picked'       // Driver picked up item
  | 'onTheWay'     // In transit to destination
  | 'dropped'      // Delivered to recipient
  | 'completed'    // Confirmed by recipient/system
  | 'cancelled';   // Order cancelled

export type PaymentMethod = 'payNow' | 'payOnPickup';
export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface PriceBreakdown {
  pickupCost: number;
  transferFee: number;
  dropoffCost: number;
  total: number;
  isSameRoute: boolean;
}

export interface OrderLocation {
  routeId: string;
  routeName: string;
  stopId: string;
  stopName: string;
  fullAddress: string; // e.g., "Thika Road - Kasarani"
}

export interface RecipientDetails {
  name: string;
  phone: string;
}

export interface OrderBase {
  id: string;
  userId: string;
  type: OrderType;
  status: OrderStatus;
  
  // Pickup details
  pickup: OrderLocation;
  pickupDate: string; // ISO string
  pickupTime: string; // e.g., "9:00 AM"
  
  // Dropoff details
  dropoff: OrderLocation;
  recipient: RecipientDetails;
  
  // Payment
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  totalPrice: number;
  priceBreakdown: PriceBreakdown;
  
  // Item details
  isFragile: boolean;
  specialNotes?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  pickedAt?: string;
  deliveredAt?: string;
  completedAt?: string;
  cancelledAt?: string;
}

// Delivery Order (standard pickup/dropoff)
export interface DeliveryOrder extends OrderBase {
  type: 'delivery';
  itemDescription: string;
}

// Errand Order (service-based)
export interface ErrandOrder extends OrderBase {
  type: 'errand';
  errandDescription: string; // What needs to be done
  estimatedBudget?: string;  // User's budget estimate
  additionalNotes?: string;
}

// Union type for all orders
export type Order = DeliveryOrder | ErrandOrder;

// Create order payloads
export interface CreateDeliveryOrderData {
  pickupRouteId: string;
  pickupStopId: string;
  dropoffRouteId: string;
  dropoffStopId: string;
  pickupDate: string;
  pickupTime: string;
  recipientName: string;
  recipientPhone: string;
  itemDescription: string;
  isFragile: boolean;
  specialNotes?: string;
  paymentMethod: PaymentMethod;
}

export interface CreateErrandOrderData {
  pickupRouteId: string;
  pickupStopId: string;
  dropoffRouteId: string;
  dropoffStopId: string;
  pickupDate: string;
  pickupTime: string;
  recipientName: string;
  recipientPhone: string;
  errandDescription: string;
  estimatedBudget?: string;
  additionalNotes?: string;
  paymentMethod: PaymentMethod;
}

// Update order payload
export interface UpdateOrderData {
  status?: OrderStatus;
  pickupDate?: string;
  pickupTime?: string;
  recipient?: Partial<RecipientDetails>;
  itemDescription?: string;
  errandDescription?: string;
  isFragile?: boolean;
  specialNotes?: string;
  additionalNotes?: string;
  paymentStatus?: PaymentStatus;
}

// Order filters for listing
export interface OrderFilters {
  status?: OrderStatus[];
  type?: OrderType[];
  dateFrom?: string;
  dateTo?: string;
  searchQuery?: string;
}

// Order statistics
export interface OrderStats {
  created: number;
  pending: number;
  inProgress: number;
  completed: number;
  cancelled: number;
}

// Order result responses
export interface OrderResult {
  success: boolean;
  order?: Order;
  error?: string;
}

export interface OrdersResult {
  success: boolean;
  orders?: Order[];
  error?: string;
}