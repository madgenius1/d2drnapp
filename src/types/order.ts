/**
 * Type definitions for Orders
 */

export type OrderStatus =
  | 'scheduled'
  | 'picked'
  | 'onTheWay'
  | 'dropped'
  | 'completed'
  | 'cancelled';

export type PaymentType = 'payNow' | 'payOnPickup';

export interface OrderSender {
  routeName: string;
  stopName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  itemDescription: string;
}

export interface OrderRecipient {
  name: string;
  phone: string;
  routeName: string;
  stopName: string;
  notes?: string;
}

export interface Order {
  id: string;
  userId: string;
  sender: OrderSender;
  recipient: OrderRecipient;
  status: OrderStatus;
  price: number;
  paymentType: PaymentType;
  createdAt: number; // timestamp
  updatedAt?: number;
  rating?: number; // 1-5
  ratingComment?: string;
}

export interface OrderWithDetails extends Order {
  senderRouteName: string;
  senderStopName: string;
  recipientRouteName: string;
  recipientStopName: string;
}

export interface CreateOrderInput {
  sender: OrderSender;
  recipient: OrderRecipient;
  paymentType: PaymentType;
  price: number;
}