/**
 * Order Details Screen
 * Complete order information with timeline
 */

import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
    ArrowLeft,
    Calendar,
    Clock,
    Edit2,
    FileText,
    Package,
    Phone,
    User,
    XCircle
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import ErrorMessage from '../../components/common/ErrorMessage';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import OrderTimeline from '../../components/order/OrderTimeline';
import PriceBreakdown from '../../components/order/PriceBreakdown';
import { useOrders } from '../../hooks/useOrders';
import { useTheme } from '../../theme';
import type { Order } from '../../types';
import { ORDER_STATUS_CONFIG } from '../../utils/constants';
import { formatDateTime, formatPhoneNumber } from '../../utils/formatting';

export default function OrderDetailsScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id: string }>();
  const { getOrder, updateOrder, subscribeToOrder, isLoading } = useOrders();

  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (!params.id) {
      setError('Order ID is required');
      return;
    }

    loadOrder();

    // Subscribe to real-time updates
    const unsubscribe = subscribeToOrder(params.id, (updatedOrder) => {
      if (updatedOrder) {
        setOrder(updatedOrder);
      }
    });

    return () => unsubscribe();
  }, [params.id]);

  const loadOrder = async () => {
    if (!params.id) return;

    const result = await getOrder(params.id);
    if (result.success && result.order) {
      setOrder(result.order);
      setError(null);
    } else {
      setError(result.error || 'Order not found');
    }
  };

  const handleCancelOrder = async () => {
    if (!order) return;

    setIsCancelling(true);
    const result = await updateOrder(order.id, { status: 'cancelled' });

    setIsCancelling(false);
    setShowCancelDialog(false);

    if (result.success) {
      Alert.alert('Order Cancelled', 'Your order has been cancelled successfully');
    } else {
      Alert.alert('Error', result.error || 'Failed to cancel order');
    }
  };

  const handleModifyOrder = () => {
    if (!order) return;
    router.push(`/order/modify-order?id=${order.id}`);
  };

  if (isLoading && !order) {
    return <LoadingSpinner fullScreen message="Loading order details..." />;
  }

  if (error || !order) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <View
          style={{
            paddingTop: insets.top + 20,
            paddingHorizontal: 20,
            paddingBottom: 20,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.divider,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}>
            <ArrowLeft size={24} color={theme.colors.text.primary} strokeWidth={1.5} />
          </TouchableOpacity>
        </View>
        <ErrorMessage
          fullScreen
          message={error || 'Order not found'}
          onRetry={() => loadOrder()}
        />
      </View>
    );
  }

  const statusConfig = ORDER_STATUS_CONFIG[order.status];
  const canModify = order.status === 'scheduled';
  const canCancel = ['scheduled', 'picked'].includes(order.status);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />

      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 20,
          paddingHorizontal: 20,
          paddingBottom: 20,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.divider,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginRight: 16 }}>
          <ArrowLeft size={24} color={theme.colors.text.primary} strokeWidth={1.5} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 24,
              fontFamily: 'Quicksand-Bold',
              color: theme.colors.text.primary,
              fontWeight: '700',
            }}
          >
            Order Details
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Quicksand-Regular',
              color: theme.colors.text.secondary,
            }}
          >
            #{order.id.slice(-8)}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: statusConfig.color,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 16,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Quicksand-SemiBold',
              color: '#ffffff',
            }}
          >
            {statusConfig.label}
          </Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingVertical: 20,
          paddingBottom: insets.bottom + 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Order Timeline */}
        <Card style={{ marginBottom: 20 }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: 'Quicksand-SemiBold',
              color: theme.colors.text.primary,
              marginBottom: 16,
              fontWeight: '600',
            }}
          >
            Order Status
          </Text>
          <OrderTimeline order={order} />
        </Card>

        {/* Locations */}
        <Card style={{ marginBottom: 20 }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: 'Quicksand-SemiBold',
              color: theme.colors.text.primary,
              marginBottom: 16,
              fontWeight: '600',
            }}
          >
            Delivery Route
          </Text>

          <View style={{ marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: theme.colors.primary,
                  marginRight: 12,
                }}
              />
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Quicksand-Medium',
                  color: theme.colors.text.secondary,
                }}
              >
                Pickup
              </Text>
            </View>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Quicksand-SemiBold',
                color: theme.colors.text.primary,
                marginLeft: 20,
              }}
            >
              {order.pickup.fullAddress}
            </Text>
          </View>

          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: theme.colors.error,
                  marginRight: 12,
                }}
              />
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Quicksand-Medium',
                  color: theme.colors.text.secondary,
                }}
              >
                Drop-off
              </Text>
            </View>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Quicksand-SemiBold',
                color: theme.colors.text.primary,
                marginLeft: 20,
              }}
            >
              {order.dropoff.fullAddress}
            </Text>
          </View>
        </Card>

        {/* Schedule */}
        <Card style={{ marginBottom: 20 }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: 'Quicksand-SemiBold',
              color: theme.colors.text.primary,
              marginBottom: 16,
              fontWeight: '600',
            }}
          >
            Pickup Schedule
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Calendar size={20} color={theme.colors.text.tertiary} strokeWidth={1.5} />
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Quicksand-Regular',
                color: theme.colors.text.primary,
                marginLeft: 12,
              }}
            >
              {formatDateTime(order.pickupDate)}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Clock size={20} color={theme.colors.text.tertiary} strokeWidth={1.5} />
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Quicksand-Regular',
                color: theme.colors.text.primary,
                marginLeft: 12,
              }}
            >
              {order.pickupTime}
            </Text>
          </View>
        </Card>

        {/* Recipient Details */}
        <Card style={{ marginBottom: 20 }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: 'Quicksand-SemiBold',
              color: theme.colors.text.primary,
              marginBottom: 16,
              fontWeight: '600',
            }}
          >
            Recipient Details
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <User size={20} color={theme.colors.text.tertiary} strokeWidth={1.5} />
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Quicksand-Regular',
                color: theme.colors.text.primary,
                marginLeft: 12,
              }}
            >
              {order.recipient.name}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Phone size={20} color={theme.colors.text.tertiary} strokeWidth={1.5} />
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Quicksand-Regular',
                color: theme.colors.text.primary,
                marginLeft: 12,
              }}
            >
              {formatPhoneNumber(order.recipient.phone)}
            </Text>
          </View>
        </Card>

        {/* Item Details (Delivery Order) */}
        {order.type === 'delivery' && (
          <Card style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'Quicksand-SemiBold',
                color: theme.colors.text.primary,
                marginBottom: 16,
                fontWeight: '600',
              }}
            >
              Item Details
            </Text>

            <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 }}>
              <Package size={20} color={theme.colors.text.tertiary} strokeWidth={1.5} />
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'Quicksand-Regular',
                  color: theme.colors.text.primary,
                  marginLeft: 12,
                  flex: 1,
                }}
              >
                {order.itemDescription}
              </Text>
            </View>

            {order.isFragile && (
              <View
                style={{
                  backgroundColor: theme.colors.warning + '15',
                  padding: 12,
                  borderRadius: 8,
                  marginBottom: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'Quicksand-SemiBold',
                    color: theme.colors.warning,
                  }}
                >
                  ⚠️ Fragile Item - Handle with Care
                </Text>
              </View>
            )}

            {order.specialNotes && (
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <FileText size={20} color={theme.colors.text.tertiary} strokeWidth={1.5} />
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'Quicksand-Medium',
                      color: theme.colors.text.secondary,
                      marginBottom: 4,
                    }}
                  >
                    Special Notes:
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: 'Quicksand-Regular',
                      color: theme.colors.text.primary,
                    }}
                  >
                    {order.specialNotes}
                  </Text>
                </View>
              </View>
            )}
          </Card>
        )}

        {/* Price Breakdown */}
        <PriceBreakdown breakdown={order.priceBreakdown} style={{ marginBottom: 20 }} />

        {/* Action Buttons */}
        {(canModify || canCancel) && (
          <View style={{ gap: 12 }}>
            {canModify && (
              <Button
                title="Modify Order"
                leftIcon={Edit2}
                onPress={handleModifyOrder}
                variant="outline"
              />
            )}
            {canCancel && (
              <Button
                title="Cancel Order"
                leftIcon={XCircle}
                onPress={() => setShowCancelDialog(true)}
                variant="outline"
                style={{ borderColor: theme.colors.error }}
                textStyle={{ color: theme.colors.error }}
              />
            )}
          </View>
        )}
      </ScrollView>

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        visible={showCancelDialog}
        title="Cancel Order?"
        message="Are you sure you want to cancel this order? This action cannot be undone."
        confirmText="Yes, Cancel"
        cancelText="No, Keep It"
        icon="danger"
        onConfirm={handleCancelOrder}
        onCancel={() => setShowCancelDialog(false)}
      />
    </View>
  );
}