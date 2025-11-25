/**
 * Google Sheets Integration
 * Log orders and errands to Google Sheets via Apps Script
 */

import { Order } from '../../types/models/Order';
import { Errand } from '../../types/models/Errand';

/**
 * Google Sheets configuration
 */
const GOOGLE_SHEETS_CONFIG = {
  scriptUrl: process.env.EXPO_PUBLIC_GOOGLE_SCRIPT_URL || '',
  enabled: process.env.EXPO_PUBLIC_GOOGLE_SHEETS_ENABLED === 'true',
};

/**
 * Check if Google Sheets is configured
 */
export const isGoogleSheetsEnabled = (): boolean => {
  return GOOGLE_SHEETS_CONFIG.enabled && !!GOOGLE_SHEETS_CONFIG.scriptUrl;
};

/**
 * Log order to Google Sheets
 */
export const logOrderToSheets = async (order: Order): Promise<void> => {
  if (!isGoogleSheetsEnabled()) {
    console.log('Google Sheets logging is disabled');
    return;
  }

  try {
    const payload = {
      type: 'order',
      orderId: order.id,
      timestamp: order.createdAt,
      userId: order.userId,
      
      // Customer info
      recipientName: order.recipient.name,
      recipientPhone: order.recipient.phone,
      
      // Location
      pickupRoute: order.pickupLocation.routeName,
      pickupStop: order.pickupLocation.stopName,
      dropoffRoute: order.dropoffLocation.routeName,
      dropoffStop: order.dropoffLocation.stopName,
      
      // Item
      itemDescription: order.item.description,
      isFragile: order.item.isFragile,
      
      // Instructions
      specialInstructions: order.instructions.specialInstructions || '',
      deliveryNotes: order.instructions.deliveryNotes || '',
      
      // Schedule
      pickupDate: order.schedule.pickupDate,
      pickupTime: order.schedule.pickupTime,
      
      // Pricing
      totalPrice: order.totalPrice,
      isSameRoute: order.priceBreakdown.isSameRoute,
      
      // Status
      status: order.status,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
    };

    const response = await fetch(GOOGLE_SHEETS_CONFIG.scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    console.log('Order logged to Google Sheets successfully');
  } catch (error) {
    console.error('Failed to log order to Google Sheets:', error);
    // Don't throw - logging failure shouldn't break order creation
  }
};

/**
 * Log errand to Google Sheets
 */
export const logErrandToSheets = async (errand: Errand): Promise<void> => {
  if (!isGoogleSheetsEnabled()) {
    console.log('Google Sheets logging is disabled');
    return;
  }

  try {
    const payload = {
      type: 'errand',
      errandId: errand.id,
      timestamp: errand.createdAt,
      userId: errand.userId,
      
      // Description
      description: errand.description,
      naturalLanguageRequest: errand.naturalLanguageRequest || '',
      
      // Location
      pickupRoute: errand.pickupLocation.routeName,
      pickupStop: errand.pickupLocation.stopName,
      dropoffRoute: errand.dropoffLocation.routeName,
      dropoffStop: errand.dropoffLocation.stopName,
      
      // Details
      preferredTime: errand.preferredTime,
      estimatedBudget: errand.estimatedBudget,
      additionalNotes: errand.additionalNotes || '',
      
      // Status
      status: errand.status,
    };

    const response = await fetch(GOOGLE_SHEETS_CONFIG.scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    console.log('Errand logged to Google Sheets successfully');
  } catch (error) {
    console.error('Failed to log errand to Google Sheets:', error);
    // Don't throw - logging failure shouldn't break errand creation
  }
};

/**
 * Batch log multiple orders
 */
export const logOrdersBatch = async (orders: Order[]): Promise<void> => {
  if (!isGoogleSheetsEnabled()) {
    return;
  }

  for (const order of orders) {
    await logOrderToSheets(order);
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }
};

/**
 * Get Google Sheets status
 */
export const getGoogleSheetsStatus = () => {
  return {
    enabled: GOOGLE_SHEETS_CONFIG.enabled,
    configured: !!GOOGLE_SHEETS_CONFIG.scriptUrl,
    scriptUrl: GOOGLE_SHEETS_CONFIG.scriptUrl
      ? GOOGLE_SHEETS_CONFIG.scriptUrl.substring(0, 30) + '...'
      : 'Not configured',
  };
};