/**
 * Track Order Screen
 * Real-time order tracking by ID
 */

import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, MapPin, Search } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import ErrorMessage from '../../components/common/ErrorMessage';
import Input from '../../components/common/Input';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import KeyboardAvoidingAnimatedView from '../../components/KeyboardAvoidingAnimatedView';
import OrderTimeline from '../../components/order/OrderTimeline';
import { useOrders } from '../../hooks/useOrders';
import { useTheme } from '../../theme';
import type { Order } from '../../types';
import { validateOrderId } from '../../utils/validation';

export default function TrackOrderScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string }>();
  const { subscribeToOrder } = useOrders();

  const [orderId, setOrderId] = useState(params.id || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      handleTrackOrder(params.id);
    }
  }, [params.id]);

  const handleTrackOrder = (id?: string) => {
    const trackId = id || orderId;

    // Validate order ID
    const validation = validateOrderId(trackId);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid order ID');
      return;
    }

    setIsTracking(true);
    setError(null);

    // Subscribe to order updates
    const unsubscribe = subscribeToOrder(trackId, (updatedOrder) => {
      if (updatedOrder) {
        setOrder(updatedOrder);
        setIsTracking(false);
      } else {
        setError('Order not found');
        setIsTracking(false);
      }
    });

    // Cleanup on unmount
    return () => unsubscribe();
  };

  const handleViewDetails = () => {
    if (order) {
      router.push(`/order/order-details?id=${order.id}`);
    }
  };

  return (
    <KeyboardAvoidingAnimatedView style={{ flex: 1 }} behavior="padding">
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
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ padding: 8, marginRight: 16 }}
          >
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
              Track Order
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Quicksand-Regular',
                color: theme.colors.text.secondary,
              }}
            >
              Enter order ID to track status
            </Text>
          </View>
        </View>

        <View
          style={{
            flex: 1,
            paddingHorizontal: 20,
            paddingTop: 32,
            paddingBottom: insets.bottom + 20,
          }}
        >
          {/* Search Input */}
          <View style={{ marginBottom: 32 }}>
            <Input
              label="Order ID"
              placeholder="D2D-XXXXX-XXXXX"
              value={orderId}
              onChangeText={setOrderId}
              leftIcon={Search}
              autoCapitalize="characters"
              style={{ marginBottom: 16 }}
            />

            <Button
              title="Track Order"
              onPress={() => handleTrackOrder()}
              loading={isTracking}
              disabled={isTracking || !orderId.trim()}
              style={{ backgroundColor: theme.colors.primary }}
            />
          </View>

          {/* Loading State */}
          {isTracking && <LoadingSpinner message="Tracking your order..." />}

          {/* Error State */}
          {error && !isTracking && (
            <ErrorMessage
              message={error}
              onRetry={() => handleTrackOrder()}
            />
          )}

          {/* Order Found */}
          {order && !isTracking && (
            <>
              {/* Order Info Card */}
              <Card style={{ marginBottom: 20 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 16,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily: 'Quicksand-SemiBold',
                      color: theme.colors.text.primary,
                      fontWeight: '600',
                    }}
                  >
                    Order #{order.id.slice(-8)}
                  </Text>
                  <View
                    style={{
                      backgroundColor: theme.colors.primary + '15',
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 12,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: 'Quicksand-Medium',
                        color: theme.colors.primary,
                      }}
                    >
                      {order.type === 'delivery' ? 'Delivery' : 'Errand'}
                    </Text>
                  </View>
                </View>

                <View style={{ marginBottom: 12 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 8,
                    }}
                  >
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
                      From
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
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 8,
                    }}
                  >
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
                      To
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
                  Delivery Status
                </Text>
                <OrderTimeline order={order} />
              </Card>

              {/* View Details Button */}
              <Button
                title="View Full Details"
                onPress={handleViewDetails}
                leftIcon={MapPin}
                style={{ backgroundColor: theme.colors.primary }}
              />
            </>
          )}
        </View>
      </View>
    </KeyboardAvoidingAnimatedView>
  );
}