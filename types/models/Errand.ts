/**
 * Errand Type Definitions
 * Defines all types for errands and errand templates
 */

import { OrderStatus, PaymentStatus, PaymentMethod } from './Order';

/**
 * Errand template
 */
export interface ErrandTemplate {
  id: string;
  title: string;
  description: string;
  icon: string; // Icon name from lucide-react-native
  category: ErrandCategory;
  estimatedDuration?: string; // "30-45 mins"
  popularityScore?: number;
}

/**
 * Errand category
 */
export enum ErrandCategory {
  SHOPPING = 'shopping',
  PICKUP = 'pickup',
  DELIVERY = 'delivery',
  BILLS = 'bills',
  MEDICAL = 'medical',
  DOCUMENTS = 'documents',
  FOOD = 'food',
  OTHER = 'other',
}

/**
 * Errand time preference
 */
export interface ErrandTimePreference {
  id: string;
  name: string;
  description: string;
}

/**
 * Errand location
 */
export interface ErrandLocation {
  routeId: string;
  routeName: string;
  stopId: string;
  stopName: string;
  fullAddress: string;
}

/**
 * Errand details
 */
export interface Errand {
  id: string;
  userId: string;
  type: 'errand';
  
  // Description
  description: string;
  naturalLanguageRequest?: string; // Original user input
  
  // Locations
  pickupLocation: ErrandLocation;
  dropoffLocation: ErrandLocation;
  
  // Time
  preferredTime: string;
  estimatedBudget: string;
  
  // Instructions
  additionalNotes?: string;
  
  // Status
  status: OrderStatus;
  
  // Payment
  paymentMethod?: PaymentMethod;
  paymentStatus: PaymentStatus;
  actualCost?: number;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  
  // Assignment
  assignedTo?: string;
  assignedToName?: string;
  
  // Tracking
  trackingNumber?: string;
}

/**
 * Create errand form data
 */
export interface CreateErrandFormData {
  description: string;
  pickupRoute: string;
  pickupStop: string;
  dropoffRoute: string;
  dropoffStop: string;
  preferredTime: string;
  additionalNotes?: string;
}

/**
 * Create errand request
 */
export interface CreateErrandRequest {
  userId: string;
  description: string;
  pickupLocation: ErrandLocation;
  dropoffLocation: ErrandLocation;
  preferredTime: string;
  estimatedBudget: string;
  additionalNotes?: string;
}

/**
 * Errand validation result
 */
export interface ErrandValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}