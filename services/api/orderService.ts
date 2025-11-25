/**
 * Order Service
 * CRUD operations for orders using Firestore
 */

import { where, orderBy } from 'firebase/firestore';
import {
  getDocument,
  getDocuments,
  addDocument,
  updateDocument,
  queryDocuments,
  COLLECTIONS,
  timestampToISO,
} from '../../firebase/firestore';
import { Order, OrderStatus, CreateOrderRequest } from '../../types/models/Order';

/**
 * Create a new order
 */
export const createOrder = async (
  request: CreateOrderRequest
): Promise<{ success: boolean; order?: Order; error?: string }> => {
  try {
    const orderData = {
      ...request,
      status: OrderStatus.CREATED,
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const orderId = await addDocument(COLLECTIONS.ORDERS, orderData);

    const order: Order = {
      id: orderId,
      type: 'order',
      ...orderData,
    } as Order;

    // TODO: Log to Google Sheets
    await logOrderToGoogleSheets(order);

    return {
      success: true,
      order,
    };
  } catch (error: any) {
    console.error('Error creating order:', error);
    return {
      success: false,
      error: error.message || 'Failed to create order',
    };
  }
};

/**
 * Get order by ID
 */
export const getOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    return await getDocument<Order>(COLLECTIONS.ORDERS, orderId);
  } catch (error) {
    console.error('Error getting order:', error);
    return null;
  }
};

/**
 * Get all orders for a user
 */
export const getUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    return await queryDocuments<Order>(
      COLLECTIONS.ORDERS,
      [{ field: 'userId', operator: '==', value: userId }],
      'createdAt'
    );
  } catch (error) {
    console.error('Error getting user orders:', error);
    return [];
  }
};

/**
 * Get orders by status
 */
export const getOrdersByStatus = async (
  userId: string,
  status: OrderStatus
): Promise<Order[]> => {
  try {
    return await queryDocuments<Order>(
      COLLECTIONS.ORDERS,
      [
        { field: 'userId', operator: '==', value: userId },
        { field: 'status', operator: '==', value: status },
      ],
      'createdAt'
    );
  } catch (error) {
    console.error('Error getting orders by status:', error);
    return [];
  }
};

/**
 * Update order status
 */
export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus
): Promise<void> => {
  try {
    const updateData: any = {
      status,
      updatedAt: new Date().toISOString(),
    };

    if (status === OrderStatus.DELIVERED) {
      updateData.completedAt = new Date().toISOString();
    }

    await updateDocument(COLLECTIONS.ORDERS, orderId, updateData);

    // TODO: Send notification to user
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

/**
 * Cancel order
 */
export const cancelOrder = async (orderId: string): Promise<void> => {
  try {
    await updateOrderStatus(orderId, OrderStatus.CANCELLED);
  } catch (error) {
    console.error('Error cancelling order:', error);
    throw error;
  }
};

/**
 * Assign driver to order
 */
export const assignDriver = async (
  orderId: string,
  driverId: string,
  driverName: string,
  driverPhone: string
): Promise<void> => {
  try {
    await updateDocument(COLLECTIONS.ORDERS, orderId, {
      driverId,
      driverName,
      driverPhone,
    });
  } catch (error) {
    console.error('Error assigning driver:', error);
    throw error;
  }
};

/**
 * Log order to Google Sheets (placeholder)
 */
const logOrderToGoogleSheets = async (order: Order): Promise<void> => {
  try {
    const SCRIPT_URL = process.env.EXPO_PUBLIC_GOOGLE_SCRIPT_URL;

    if (!SCRIPT_URL) {
      console.warn('Google Sheets script URL not configured');
      return;
    }

    const logData = {
      orderId: order.id,
      timestamp: order.createdAt,
      customerName: order.recipient.name,
      customerPhone: order.recipient.phone,
      pickupRoute: order.pickupLocation.routeName,
      pickupStop: order.pickupLocation.stopName,
      dropoffRoute: order.dropoffLocation.routeName,
      dropoffStop: order.dropoffLocation.stopName,
      itemDescription: order.item.description,
      isFragile: order.item.isFragile,
      totalPrice: order.totalPrice,
      status: order.status,
      paymentMethod: order.paymentMethod,
    };

    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(logData),
    });

    if (!response.ok) {
      console.warn('Failed to log to Google Sheets:', response.statusText);
    }
  } catch (error) {
    // Don't fail order creation if logging fails
    console.warn('Error logging to Google Sheets:', error);
  }
};