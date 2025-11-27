/**
 * M-Pesa Payment Integration Service
 * Placeholder for future M-Pesa STK Push implementation
 * Requires backend Node.js server for actual implementation
 */

import { env } from '../../config/env';
import type {
    MpesaCallbackResponse,
    MpesaStkPushRequest,
    MpesaStkPushResponse,
} from '../../types';

/**
 * Format phone number for M-Pesa (254XXXXXXXXX)
 */
const formatPhoneNumber = (phone: string): string => {
  // Remove spaces, dashes, and special characters
  let cleaned = phone.replace(/[\s\-\(\)]/g, '');

  // Remove leading + or 0
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1);
  }
  if (cleaned.startsWith('0')) {
    cleaned = '254' + cleaned.substring(1);
  }

  // Ensure it starts with 254
  if (!cleaned.startsWith('254')) {
    cleaned = '254' + cleaned;
  }

  return cleaned;
};

/**
 * Initiate M-Pesa STK Push
 * NOTE: This is a placeholder. Actual implementation requires backend server
 */
export const initiateStkPush = async (
  phoneNumber: string,
  amount: number,
  orderId: string,
  accountReference: string = 'D2D'
): Promise<{ success: boolean; data?: MpesaStkPushResponse; error?: string }> => {
  try {
    // Feature flag check
    if (!env.features.enableMpesa) {
      console.warn('[M-Pesa] M-Pesa integration is disabled');
      return {
        success: false,
        error: 'M-Pesa payment is currently unavailable',
      };
    }

    const mpesaBaseUrl = env.api.mpesaBaseUrl;
    if (!mpesaBaseUrl) {
      return {
        success: false,
        error: 'M-Pesa endpoint not configured',
      };
    }

    const formattedPhone = formatPhoneNumber(phoneNumber);

    const request: MpesaStkPushRequest = {
      phoneNumber: formattedPhone,
      amount: Math.round(amount), // M-Pesa requires integer amount
      orderId,
      accountReference,
      transactionDesc: `D2D Order Payment - ${orderId}`,
    };

    // Call backend M-Pesa endpoint
    const response = await fetch(`${mpesaBaseUrl}/stk-push`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: MpesaStkPushResponse = await response.json();

    if (data.ResponseCode === '0') {
      console.log('[M-Pesa] STK Push initiated successfully:', data.CheckoutRequestID);
      return {
        success: true,
        data,
      };
    } else {
      return {
        success: false,
        error: data.ResponseDescription || 'M-Pesa request failed',
      };
    }
  } catch (error: any) {
    console.error('[M-Pesa] STK Push error:', error);
    return {
      success: false,
      error: error.message || 'Failed to initiate M-Pesa payment',
    };
  }
};

/**
 * Check M-Pesa payment status
 * NOTE: This is a placeholder. Actual implementation requires backend server
 */
export const checkPaymentStatus = async (
  checkoutRequestId: string
): Promise<{ success: boolean; data?: MpesaCallbackResponse; error?: string }> => {
  try {
    if (!env.features.enableMpesa) {
      return {
        success: false,
        error: 'M-Pesa integration is disabled',
      };
    }

    const mpesaBaseUrl = env.api.mpesaBaseUrl;
    if (!mpesaBaseUrl) {
      return {
        success: false,
        error: 'M-Pesa endpoint not configured',
      };
    }

    const response = await fetch(
      `${mpesaBaseUrl}/payment-status/${checkoutRequestId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: MpesaCallbackResponse = await response.json();

    return {
      success: data.ResultCode === 0,
      data,
    };
  } catch (error: any) {
    console.error('[M-Pesa] Check payment status error:', error);
    return {
      success: false,
      error: error.message || 'Failed to check payment status',
    };
  }
};

/**
 * Mock M-Pesa payment (for development/testing)
 */
export const mockMpesaPayment = async (
  orderId: string,
  amount: number
): Promise<{ success: boolean; transactionId?: string; error?: string }> => {
  console.log('[M-Pesa] Mock payment initiated:', { orderId, amount });

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Mock success response
  const mockTransactionId = `MOCK${Date.now()}`;

  return {
    success: true,
    transactionId: mockTransactionId,
  };
};

/**
 * Validate M-Pesa phone number format
 */
export const validateMpesaPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  const formattedPhone = formatPhoneNumber(cleaned);

  // Safaricom numbers start with 254(7xx) or 254(1xx)
  return /^254[71]\d{8}$/.test(formattedPhone);
};

export default {
  initiateStkPush,
  checkPaymentStatus,
  mockMpesaPayment,
  validateMpesaPhone,
};