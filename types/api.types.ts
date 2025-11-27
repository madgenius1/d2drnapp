/**
 * API-related TypeScript type definitions
 * Defines request/response structures for external APIs
 */

// Generic API response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
  timestamp?: string;
}

// Error structure
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// Google Sheets API types
export interface GoogleSheetsOrderPayload {
  orderId: string;
  timestamp: string;
  userId: string;
  userEmail: string;
  type: 'delivery' | 'errand';
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  pickupTime: string;
  recipientName: string;
  recipientPhone: string;
  itemDescription?: string;
  errandDescription?: string;
  totalPrice: number;
  paymentMethod: string;
  status: string;
}

export interface GoogleSheetsResponse {
  success: boolean;
  rowNumber?: number;
  error?: string;
}

// M-Pesa API types (placeholder for future implementation)
export interface MpesaStkPushRequest {
  phoneNumber: string;
  amount: number;
  orderId: string;
  accountReference: string;
  transactionDesc: string;
}

export interface MpesaStkPushResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

export interface MpesaCallbackResponse {
  ResultCode: number;
  ResultDesc: string;
  CheckoutRequestID: string;
}

// Firebase Cloud Functions types (if using)
export interface CloudFunctionResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Webhook payload types
export interface OrderStatusWebhook {
  orderId: string;
  status: string;
  timestamp: string;
  driverId?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

// Pagination
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}