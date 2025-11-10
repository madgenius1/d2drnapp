/**
 * Google Apps Script integration for order logging
  */

import type { Order } from '../types';


const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz-7JBlpWRd_b9qdDS7cu4tPRQt-Rf9cjfBua4a3duMEtznal1tgpcq0_jgH1n32Vz2/exec';

export interface OrderLogData {
  timestamp: string;
  orderId: string;
  userId: string;
  pickupRoute: string;
  pickupStop: string;
  dropRoute: string;
  dropStop: string;
  price: number;
  paymentType: string;
  status: string;
  itemDescription: string;
  recipientName: string;
  recipientPhone: string;
  notes: string;
  createdAt: number;
}

/**
 * Log order to Google Sheets via Apps Script
 * 
 * This function is called after an order is successfully created in Firestore.
 * It sends order data to Google Sheets for admin tracking and analytics.
 * 
 * NOTE: This is non-blocking - if it fails, order creation still succeeds.
 */
export const logOrderToSheet = async (
  order: Order,
  pickupRouteName: string,
  pickupStopName: string,
  dropoffRouteName: string,
  dropoffStopName: string,
  additionalNotes?: string
): Promise<void> => {
  try {
    // Skip if no URL configured
    if (APPS_SCRIPT_URL === 'https://script.google.com/macros/s/AKfycbz-7JBlpWRd_b9qdDS7cu4tPRQt-Rf9cjfBua4a3duMEtznal1tgpcq0_jgH1n32Vz2/exec') {
      console.warn('Apps Script URL not configured. Skipping order logging.');
      console.warn('To enable logging: Update APPS_SCRIPT_URL in src/services/appsScript.ts');
      return;
    }

    // Prepare log data
    const logData: OrderLogData = {
      timestamp: new Date(order.createdAt).toISOString(),
      orderId: order.id,
      userId: order.userId,
      pickupRoute: pickupRouteName,
      pickupStop: pickupStopName,
      dropRoute: dropoffRouteName,
      dropStop: dropoffStopName,
      price: order.price,
      paymentType: order.paymentType,
      status: order.status,
      itemDescription: order.sender.itemDescription,
      recipientName: order.recipient.name,
      recipientPhone: order.recipient.phone,
      notes: order.recipient.notes || additionalNotes || '',
      createdAt: order.createdAt,
    };

    // Send POST request to Apps Script
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(logData),
    });

    // Check response
    if (!response.ok) {
      throw new Error(`Apps Script request failed: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Order logged to sheet:', {
        orderId: result.orderId,
        rowNumber: result.rowNumber,
      });
    } else {
      console.error('❌ Sheet logging failed:', result.error);
    }
  } catch (error) {
    // Don't throw error - logging failure shouldn't block order creation
    console.error('⚠️ Error logging to Apps Script:', error);
    console.warn('Order was created successfully, but logging to Google Sheets failed.');
  }
};

/**
 * Test the Apps Script connection
 * 
 * This function sends a GET request to verify the Apps Script is deployed
 * and accessible. Run this to test your setup.
 */
export const testAppsScriptConnection = async (): Promise<boolean> => {
  try {
    if (APPS_SCRIPT_URL === 'https://script.google.com/macros/s/AKfycbz-7JBlpWRd_b9qdDS7cu4tPRQt-Rf9cjfBua4a3duMEtznal1tgpcq0_jgH1n32Vz2/exec') {
      console.error('Apps Script URL not configured.');
      return false;
    }

    console.log('Testing Apps Script connection...');
    
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'GET',
    });

    if (!response.ok) {
      console.error('Connection failed:', response.statusText);
      return false;
    }

    const result = await response.json();
    console.log('✅ Apps Script is active:', result);
    return true;
  } catch (error) {
    console.error('❌ Connection test failed:', error);
    return false;
  }
};

/**
 * Format price breakdown for logging
 * 
 * Converts price calculation details into a readable string
 * for the Google Sheet notes column.
 */
export const formatBreakdownForLog = (
  price: number,
  pickupPrice: number,
  dropoffPrice: number,
  isSameRoute: boolean
): string => {
  if (isSameRoute) {
    return `Same Route: (${pickupPrice} + ${dropoffPrice}) / 1.8 + 50 = ${price} KES`;
  } else {
    return `Different Routes: (${pickupPrice} + ${dropoffPrice}) / 2 + 50 = ${price} KES`;
  }
};

/**
 * Batch log multiple orders (future enhancement)
 * 
 * For high-volume scenarios, batch logging reduces API calls.
 * Currently not used, but available for future optimization.
 */
export const batchLogOrders = async (
  orders: Array<{
    order: Order;
    routeNames: {
      pickup: string;
      pickupStop: string;
      dropoff: string;
      dropoffStop: string;
    };
  }>
): Promise<void> => {
  try {
    if (APPS_SCRIPT_URL === 'https://script.google.com/macros/s/AKfycbz-7JBlpWRd_b9qdDS7cu4tPRQt-Rf9cjfBua4a3duMEtznal1tgpcq0_jgH1n32Vz2/exec') {
      console.warn('Apps Script URL not configured. Skipping batch logging.');
      return;
    }

    const batchData = orders.map(({ order, routeNames }) => ({
      timestamp: new Date(order.createdAt).toISOString(),
      orderId: order.id,
      userId: order.userId,
      pickupRoute: routeNames.pickup,
      pickupStop: routeNames.pickupStop,
      dropRoute: routeNames.dropoff,
      dropStop: routeNames.dropoffStop,
      price: order.price,
      paymentType: order.paymentType,
      status: order.status,
      itemDescription: order.sender.itemDescription,
      recipientName: order.recipient.name,
      recipientPhone: order.recipient.phone,
      notes: order.recipient.notes || '',
      createdAt: order.createdAt,
    }));

    // Note: Apps Script needs to be modified to handle batch requests
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ batch: true, orders: batchData }),
    });

    if (!response.ok) {
      throw new Error(`Batch logging failed: ${response.statusText}`);
    }

    console.log(`✅ Batch logged ${orders.length} orders`);
  } catch (error) {
    console.error('⚠️ Batch logging error:', error);
  }
};

/**
 * Get Apps Script configuration status
 * 
 * Returns whether the Apps Script is properly configured
 */
export const isAppsScriptConfigured = (): boolean => {
  return APPS_SCRIPT_URL !== 'https://script.google.com/macros/s/AKfycbz-7JBlpWRd_b9qdDS7cu4tPRQt-Rf9cjfBua4a3duMEtznal1tgpcq0_jgH1n32Vz2/exec';
};

/**
 * Get the configured Apps Script URL
 * 
 * Useful for debugging and configuration checks
 */
export const getAppsScriptUrl = (): string => {
  return APPS_SCRIPT_URL;
};