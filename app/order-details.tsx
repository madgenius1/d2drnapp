/**
 * Order Details Screen
 * Complete order information with progress timeline
 */

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  MapPin,
  User,
  Phone,
  Package,
  FileText,
  Calendar,
  Clock,
  DollarSign,
  MessageSquare,
  Share2,
  XCircle,
  AlertTriangle,
} from 'lucide-react-native';
import { useTheme } from '../theme';
import { useOrderStore } from '../store';
import { Order, OrderStatus } from '../types/models/Order';
import { formatDateTime, formatTime } from '../utils/formatting/dateFormatter';
import { formatPrice } from '../utils/formatting/priceFormatter';
import { formatPhoneForDisplay, formatPhoneForCall } from '../utils/formatting/phoneFormatter';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import OrderStatusBadge from '../components/order/OrderStatusBadge';
import ProgressTimeline from '../components/order/ProgressTimeline';

export default function OrderDetailsScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const { getOrderById, cancelOrder } = useOrderStore();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const orderId = params.id as string;
    if (orderId) {
      const foundOrder = getOrderById(orderId);
      setOrder(foundOrder || null);
      setIsLoading(false);
    }
  }, [params.id]);

  const handleCallRecipient = () => {
    if (order?.recipient.phone) {
      Linking.openURL(formatPhoneForCall(order.recipient.phone));
    }
  };

  const handleCallDriver = () => {
    if (order?.driverPhone) {
      Linking.openURL(formatPhoneForCall(order.driverPhone));
    }
  };

  const handleCancelOrder = () => {
    if (!order) return;

    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order? This action cannot be undone.',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            await cancelOrder(order.id);
            Alert.alert('Order Cancelled', 'Your order has been cancelled successfully.');
            router.back();
          },
        },
      ]
    );
  };

  const handleShareOrder = () => {
    Alert.alert('Share Order', `Order ID: ${order?.id}\nTrack at: d2d.app/track/${order?.id}`);
  };

  const canCancelOrder = order?.status === OrderStatus.CREATED;
  const canModifyOrder = order?.status === OrderStatus.CREATED;

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontFamily: theme.fonts.regular, color: theme.colors.text.secondary }}>
          Loading order...
        </Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 }}>
        <Package size={64} color={theme.colors.text.tertiary} />
        <Text style={{ fontSize: 20, fontFamily: theme.fonts.bold, color: theme.colors.text.primary, marginTop: 16, textAlign: 'center' }}>
          Order Not Found
        </Text>
        <Text style={{ fontSize: 16, fontFamily: theme.fonts.regular, color: theme.colors.text.secondary, marginTop: 8, textAlign: 'center' }}>
          The order you're looking for doesn't exist or has been removed.
        </Text>
        <Button title="Go Back" onPress={() => router.back()} style={{ marginTop: 24 }} />
      </View>
    );
  }

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
          justifyContent: 'space-between',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginRight: 16 }}>
            <ArrowLeft size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 24, fontFamily: theme.fonts.bold, color: theme.colors.text.primary, fontWeight: '700' }}>
              Order #{order.id.slice(-6)}
            </Text>
            <Text style={{ fontSize: 14, fontFamily: theme.fonts.regular, color: theme.colors.text.secondary }}>
              {formatDateTime(order.createdAt)}
            </Text>
          </View>
        </View>

        <TouchableOpacity onPress={handleShareOrder} style={{ padding: 8 }}>
          <Share2 size={20} color={theme.colors.primary} />
        </TouchableOpacity>
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
        {/* Status Badge */}
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <OrderStatusBadge status={order.status} size="large" />
        </View>

        {/* Progress Timeline */}
        {order.status !== OrderStatus.CANCELLED && (
          <Card style={{ marginBottom: 24, padding: 20 }}>
            <ProgressTimeline currentStatus={order.status} />
          </Card>
        )}

        {/* Route Information */}
        <Card style={{ marginBottom: 16, padding: 16 }}>
          <Text style={{ fontSize: 18, fontFamily: theme.fonts.semibold, color: theme.colors.text.primary, marginBottom: 16, fontWeight: '600' }}>
            Route
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: theme.colors.primary + '20', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
              <MapPin size={20} color={theme.colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontFamily: theme.fonts.medium, color: theme.colors.text.secondary, marginBottom: 4 }}>
                Pickup
              </Text>
              <Text style={{ fontSize: 16, fontFamily: theme.fonts.semibold, color: theme.colors.text.primary, fontWeight: '600' }}>
                {order.pickupLocation.fullAddress}
              </Text>
            </View>
          </View>

          <View style={{ height: 20, width: 2, backgroundColor: theme.colors.divider, marginLeft: 20, marginBottom: 8 }} />

          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: theme.colors.success + '20', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
              <MapPin size={20} color={theme.colors.success} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontFamily: theme.fonts.medium, color: theme.colors.text.secondary, marginBottom: 4 }}>
                Drop-off
              </Text>
              <Text style={{ fontSize: 16, fontFamily: theme.fonts.semibold, color: theme.colors.text.primary, fontWeight: '600' }}>
                {order.dropoffLocation.fullAddress}
              </Text>
            </View>
          </View>
        </Card>

        {/* Recipient Details */}
        <Card style={{ marginBottom: 16, padding: 16 }}>
          <Text style={{ fontSize: 18, fontFamily: theme.fonts.semibold, color: theme.colors.text.primary, marginBottom: 16, fontWeight: '600' }}>
            Recipient
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <User size={18} color={theme.colors.text.secondary} style={{ marginRight: 12 }} />
            <Text style={{ fontSize: 16, fontFamily: theme.fonts.regular, color: theme.colors.text.primary }}>
              {order.recipient.name}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <Phone size={18} color={theme.colors.text.secondary} style={{ marginRight: 12 }} />
              <Text style={{ fontSize: 16, fontFamily: theme.fonts.regular, color: theme.colors.text.primary }}>
                {formatPhoneForDisplay(order.recipient.phone)}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleCallRecipient}
              style={{ padding: 8, backgroundColor: theme.colors.primary + '15', borderRadius: 8 }}
            >
              <Phone size={18} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
        </Card>

        {/* Item Details */}
        <Card style={{ marginBottom: 16, padding: 16 }}>
          <Text style={{ fontSize: 18, fontFamily: theme.fonts.semibold, color: theme.colors.text.primary, marginBottom: 16, fontWeight: '600' }}>
            Item Information
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 }}>
            <Package size={18} color={theme.colors.text.secondary} style={{ marginRight: 12, marginTop: 2 }} />
            <Text style={{ fontSize: 16, fontFamily: theme.fonts.regular, color: theme.colors.text.primary, flex: 1, lineHeight: 24 }}>
              {order.item.description}
            </Text>
          </View>

          {order.item.isFragile && (
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.warning + '15', borderRadius: 8, padding: 12, borderWidth: 1, borderColor: theme.colors.warning + '30' }}>
              <AlertTriangle size={16} color={theme.colors.warning} />
              <Text style={{ fontSize: 14, fontFamily: theme.fonts.medium, color: theme.colors.warning, marginLeft: 8 }}>
                Fragile - Handle with Care
              </Text>
            </View>
          )}
        </Card>

        {/* Instructions */}
        {(order.instructions.specialInstructions || order.instructions.deliveryNotes) && (
          <Card style={{ marginBottom: 16, padding: 16 }}>
            <Text style={{ fontSize: 18, fontFamily: theme.fonts.semibold, color: theme.colors.text.primary, marginBottom: 16, fontWeight: '600' }}>
              Delivery Instructions
            </Text>

            {order.instructions.specialInstructions && (
              <View style={{ marginBottom: order.instructions.deliveryNotes ? 12 : 0 }}>
                <Text style={{ fontSize: 14, fontFamily: theme.fonts.medium, color: theme.colors.text.secondary, marginBottom: 4 }}>
                  Special Instructions
                </Text>
                <Text style={{ fontSize: 16, fontFamily: theme.fonts.regular, color: theme.colors.text.primary, lineHeight: 24 }}>
                  {order.instructions.specialInstructions}
                </Text>
              </View>
            )}

            {order.instructions.deliveryNotes && (
              <View>
                <Text style={{ fontSize: 14, fontFamily: theme.fonts.medium, color: theme.colors.text.secondary, marginBottom: 4 }}>
                  Delivery Notes
                </Text>
                <Text style={{ fontSize: 16, fontFamily: theme.fonts.regular, color: theme.colors.text.primary, lineHeight: 24 }}>
                  {order.instructions.deliveryNotes}
                </Text>
              </View>
            )}
          </Card>
        )}

        {/* Schedule */}
        <Card style={{ marginBottom: 16, padding: 16 }}>
          <Text style={{ fontSize: 18, fontFamily: theme.fonts.semibold, color: theme.colors.text.primary, marginBottom: 16, fontWeight: '600' }}>
            Schedule
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Calendar size={18} color={theme.colors.text.secondary} style={{ marginRight: 12 }} />
            <Text style={{ fontSize: 16, fontFamily: theme.fonts.regular, color: theme.colors.text.primary }}>
              {formatDateTime(order.schedule.pickupDate)}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Clock size={18} color={theme.colors.text.secondary} style={{ marginRight: 12 }} />
            <Text style={{ fontSize: 16, fontFamily: theme.fonts.regular, color: theme.colors.text.primary }}>
              {order.schedule.pickupTime}
            </Text>
          </View>
        </Card>

        {/* Price Breakdown */}
        <Card style={{ marginBottom: 16, padding: 16 }}>
          <Text style={{ fontSize: 18, fontFamily: theme.fonts.semibold, color: theme.colors.text.primary, marginBottom: 16, fontWeight: '600' }}>
            Price Breakdown
          </Text>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ fontSize: 14, fontFamily: theme.fonts.regular, color: theme.colors.text.secondary }}>
              {order.priceBreakdown.isSameRoute ? 'Same Route Price' : 'Transfer Price'}
            </Text>
            <Text style={{ fontSize: 14, fontFamily: theme.fonts.medium, color: theme.colors.text.primary }}>
              {formatPrice(order.priceBreakdown.isSameRoute ? order.totalPrice : order.priceBreakdown.transferFee)}
            </Text>
          </View>

          <View style={{ borderTopWidth: 1, borderTopColor: theme.colors.divider, paddingTop: 12, marginTop: 4, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 18, fontFamily: theme.fonts.bold, color: theme.colors.text.primary, fontWeight: '700' }}>
              Total
            </Text>
            <Text style={{ fontSize: 24, fontFamily: theme.fonts.bold, color: theme.colors.primary, fontWeight: '700' }}>
              {formatPrice(order.totalPrice)}
            </Text>
          </View>
        </Card>

        {/* Driver Info (if assigned) */}
        {order.driverName && (
          <Card style={{ marginBottom: 24, padding: 16 }}>
            <Text style={{ fontSize: 18, fontFamily: theme.fonts.semibold, color: theme.colors.text.primary, marginBottom: 16, fontWeight: '600' }}>
              Driver
            </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontFamily: theme.fonts.semibold, color: theme.colors.text.primary, marginBottom: 4, fontWeight: '600' }}>
                  {order.driverName}
                </Text>
                {order.driverPhone && (
                  <Text style={{ fontSize: 14, fontFamily: theme.fonts.regular, color: theme.colors.text.secondary }}>
                    {formatPhoneForDisplay(order.driverPhone)}
                  </Text>
                )}
              </View>
              {order.driverPhone && (
                <TouchableOpacity
                  onPress={handleCallDriver}
                  style={{ padding: 12, backgroundColor: theme.colors.primary, borderRadius: 8 }}
                >
                  <Phone size={20} color="#ffffff" />
                </TouchableOpacity>
              )}
            </View>
          </Card>
        )}

        {/* Action Buttons */}
        <View style={{ gap: 12 }}>
          <Button
            title="Track Order Live"
            onPress={() => router.push(`/track-order?id=${order.id}`)}
            style={{ backgroundColor: theme.colors.primary }}
          />

          {canCancelOrder && (
            <Button
              title="Cancel Order"
              leftIcon={XCircle}
              onPress={handleCancelOrder}
              variant="outline"
              style={{ borderColor: theme.colors.error }}
              textStyle={{ color: theme.colors.error }}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}