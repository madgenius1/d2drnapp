/**
 * Google Sheets Integration Service
 * Logs orders to Google Sheets for admin tracking via Apps Script
 */

import { env } from '../../config/env';
import type {
    GoogleSheetsOrderPayload,
    GoogleSheetsResponse,
    Order,
} from '../../types';

/**
 * Convert order to Google Sheets payload
 */
const orderToSheetPayload = (
  order: Order,
  userEmail: string
): GoogleSheetsOrderPayload => {
  return {
    orderId: order.id,
    timestamp: order.createdAt,
    userId: order.userId,
    userEmail,
    type: order.type,
    pickupLocation: order.pickup.fullAddress,
    dropoffLocation: order.dropoff.fullAddress,
    pickupDate: order.pickupDate,
    pickupTime: order.pickupTime,
    recipientName: order.recipient.name,
    recipientPhone: order.recipient.phone,
    itemDescription: order.type === 'delivery' ? order.itemDescription : undefined,
    errandDescription: order.type === 'errand' ? order.errandDescription : undefined,
    totalPrice: order.totalPrice,
    paymentMethod: order.paymentMethod,
    status: order.status,
  };
};

/**
 * Log order to Google Sheets
 */
export const logOrderToSheet = async (
  order: Order,
  userEmail: string
): Promise<GoogleSheetsResponse> => {
  try {
    const sheetsUrl = env.api.googleSheetsUrl;

    if (!sheetsUrl) {
      console.warn('[GoogleSheets] URL not configured');
      return {
        success: false,
        error: 'Google Sheets URL not configured',
      };
    }

    const payload = orderToSheetPayload(order, userEmail);

    const response = await fetch(sheetsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.success) {
      console.log('[GoogleSheets] Order logged successfully:', order.id);
      return {
        success: true,
        rowNumber: result.rowNumber,
      };
    } else {
      throw new Error(result.error || 'Unknown error');
    }
  } catch (error: any) {
    console.error('[GoogleSheets] Log order error:', error);
    return {
      success: false,
      error: error.message || 'Failed to log order to Google Sheets',
    };
  }
};

/**
 * Batch log multiple orders (for sync operations)
 */
export const batchLogOrders = async (
  orders: Order[],
  userEmail: string
): Promise<GoogleSheetsResponse[]> => {
  const results: GoogleSheetsResponse[] = [];

  for (const order of orders) {
    const result = await logOrderToSheet(order, userEmail);
    results.push(result);

    // Add delay between requests to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  return results;
};

/**
 * Health check for Google Sheets API
 */
export const checkSheetsConnection = async (): Promise<boolean> => {
  try {
    const sheetsUrl = env.api.googleSheetsUrl;
    if (!sheetsUrl) return false;

    // Simple ping to check if endpoint is reachable
    const response = await fetch(sheetsUrl, {
      method: 'GET',
    });

    return response.ok;
  } catch (error) {
    console.error('[GoogleSheets] Connection check failed:', error);
    return false;
  }
};

export default {
  logOrderToSheet,
  batchLogOrders,
  checkSheetsConnection,
};