/**
 * Track Order Screen
 * Real-time order tracking with status updates
 */

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Search, MapPin, Phone, Clock, Package, CheckCircle2 } from 'lucide-react-native';
import { useTheme } from '../theme';
import { useOrderStore } from '../store';
import { Order, OrderStatus } from '../types/models/Order';
import { formatDateTime, formatRelativeTime } from '../utils/formatting/dateFormatter';
import { formatPhoneForDisplay } from '../utils/formatting/phoneFormatter';
import Card from '../components/Card';
import Button from '../components/Button';
import OrderStatusBadge from '../components/order/OrderStatusBadge';
import ProgressTimeline from '../components/order/ProgressTimeline';

export default function TrackOrderScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const { getOrderById } = useOrderStore();

  const [orderId, setOrderId] = useState((params.id as string) || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (params.id) {
      handleSearch(params.id as string);
    }
  }, [params.id]);

  const handleSearch = (searchId?: string) => {
    const searchOrderId = searchId || orderId;
    
    if (!searchOrderId.trim()) {
      Alert.alert('Error', 'Please enter an order ID');
      return;
    }

    setIsSearching(true);

    // Simulate API call
    setTimeout(() => {
      const foundOrder = getOrderById(searchOrderId.trim());
      setOrder(foundOrder || null);
      setIsSearching(false);

      if (!foundOrder) {
        Alert.alert('Order Not Found', `No order found with ID: ${searchOrderId}`);
      }
    }, 500);
  };

  const getStatusUpdateMessage = (status: OrderStatus): string => {
    switch (status) {
      case OrderStatus.CREATED:
        return 'Your order has been created and is waiting for pickup';
      case OrderStatus.PICKED:
        return 'Driver has picked up your package';
      case OrderStatus.IN_TRANSIT:
        return 'Your package is on the way to destination';
      case OrderStatus.DELIVERED:
        return 'Your package has been delivered successfully';
      case OrderStatus.CANCELLED:
        return 'This order has been cancelled';
      default:
        return 'Status unknown';
    }
  };

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
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginRight: 16 }}>
            <ArrowLeft size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 24,
                fontFamily: theme.fonts.bold,
                color: theme.colors.text.primary,
                fontWeight: '700',
              }}
            >
              Track Order
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: theme.fonts.regular,
                color: theme.colors.text.secondary,
              }}
            >
              Enter your order ID to track
            </Text>
          </View>
        </View>

        {/* Search Input */}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: theme.colors.input.background,
              borderWidth: 1,
              borderColor: theme.colors.input.border,
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 12,
            }}
          >
            <Search size={20} color={theme.colors.text.tertiary} />
            <TextInput
              placeholder="Enter Order ID"
              placeholderTextColor={theme.colors.input.placeholder}
              value={orderId}
              onChangeText={setOrderId}
              onSubmitEditing={() => handleSearch()}
              autoCapitalize="characters"
              style={{
                flex: 1,
                fontSize: 16,
                fontFamily: theme.fonts.regular,
                color: theme.colors.text.primary,
                marginLeft: 12,
              }}
            />
          </View>

          <TouchableOpacity
            onPress={() => handleSearch()}
            disabled={isSearching}
            style={{
              backgroundColor: theme.colors.primary,
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderRadius: 12,
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: theme.fonts.semibold,
                color: '#ffffff',
                fontWeight: '600',
              }}
            >
              {isSearching ? 'Searching...' : 'Track'}
            </Text>
          </TouchableOpacity>
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
        {order ? (
          <>
            {/* Order Header */}
            <Card style={{ marginBottom: 24, padding: 20, alignItems: 'center' }}>
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: theme.colors.primary + '20',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 16,
                }}
              >
                <Package size={40} color={theme.colors.primary} />
              </View>

              <Text
                style={{
                  fontSize: 20,
                  fontFamily: theme.fonts.bold,
                  color: theme.colors.text.primary,
                  marginBottom: 8,
                  fontWeight: '700',
                }}
              >
                Order #{order.id.slice(-6)}
              </Text>

              <OrderStatusBadge status={order.status} size="medium" />

              <Text
                style={{
                  fontSize: 14,
                  fontFamily: theme.fonts.regular,
                  color: theme.colors.text.secondary,
                  marginTop: 12,
                  textAlign: 'center',
                }}
              >
                {getStatusUpdateMessage(order.status)}
              </Text>
            </Card>

            {/* Progress Timeline */}
            {order.status !== OrderStatus.CANCELLED && (
              <Card style={{ marginBottom: 24, padding: 20 }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: theme.fonts.semibold,
                    color: theme.colors.text.primary,
                    marginBottom: 20,
                    fontWeight: '600',
                  }}
                >
                  Delivery Progress
                </Text>
                <ProgressTimeline currentStatus={order.status} />
              </Card>
            )}

            {/* Route Details */}
            <Card style={{ marginBottom: 16, padding: 16 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: theme.fonts.semibold,
                  color: theme.colors.text.primary,
                  marginBottom: 16,
                  fontWeight: '600',
                }}
              >
                Route Details
              </Text>

              <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: theme.colors.primary + '20',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 12,
                  }}
                >
                  <MapPin size={20} color={theme.colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: theme.fonts.medium,
                      color: theme.colors.text.secondary,
                      marginBottom: 4,
                    }}
                  >
                    Pickup
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: theme.fonts.semibold,
                      color: theme.colors.text.primary,
                      fontWeight: '600',
                    }}
                  >
                    {order.pickupLocation.fullAddress}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  height: 20,
                  width: 2,
                  backgroundColor: theme.colors.divider,
                  marginLeft: 20,
                  marginBottom: 8,
                }}
              />

              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: theme.colors.success + '20',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 12,
                  }}
                >
                  <MapPin size={20} color={theme.colors.success} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: theme.fonts.medium,
                      color: theme.colors.text.secondary,
                      marginBottom: 4,
                    }}
                  >
                    Drop-off
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: theme.fonts.semibold,
                      color: theme.colors.text.primary,
                      fontWeight: '600',
                    }}
                  >
                    {order.dropoffLocation.fullAddress}
                  </Text>
                </View>
              </View>
            </Card>

            {/* Timestamps */}
            <Card style={{ marginBottom: 16, padding: 16 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: theme.fonts.semibold,
                  color: theme.colors.text.primary,
                  marginBottom: 16,
                  fontWeight: '600',
                }}
              >
                Timeline
              </Text>

              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <Clock size={18} color={theme.colors.text.secondary} style={{ marginRight: 12 }} />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: theme.fonts.medium,
                      color: theme.colors.text.secondary,
                      marginBottom: 2,
                    }}
                  >
                    Created
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: theme.fonts.regular,
                      color: theme.colors.text.primary,
                    }}
                  >
                    {formatDateTime(order.createdAt)} • {formatRelativeTime(order.createdAt)}
                  </Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <Clock size={18} color={theme.colors.text.secondary} style={{ marginRight: 12 }} />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: theme.fonts.medium,
                      color: theme.colors.text.secondary,
                      marginBottom: 2,
                    }}
                  >
                    Last Updated
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: theme.fonts.regular,
                      color: theme.colors.text.primary,
                    }}
                  >
                    {formatDateTime(order.updatedAt)} • {formatRelativeTime(order.updatedAt)}
                  </Text>
                </View>
              </View>

              {order.completedAt && (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <CheckCircle2 size={18} color={theme.colors.success} style={{ marginRight: 12 }} />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: theme.fonts.medium,
                        color: theme.colors.text.secondary,
                        marginBottom: 2,
                      }}
                    >
                      Delivered
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: theme.fonts.regular,
                        color: theme.colors.text.primary,
                      }}
                    >
                      {formatDateTime(order.completedAt)} • {formatRelativeTime(order.completedAt)}
                    </Text>
                  </View>
                </View>
              )}
            </Card>

            {/* Driver Info */}
            {order.driverName && (
              <Card style={{ marginBottom: 24, padding: 16 }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: theme.fonts.semibold,
                    color: theme.colors.text.primary,
                    marginBottom: 16,
                    fontWeight: '600',
                  }}
                >
                  Driver Information
                </Text>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 25,
                      backgroundColor: theme.colors.primary + '20',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 16,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        fontFamily: theme.fonts.bold,
                        color: theme.colors.primary,
                        fontWeight: '700',
                      }}
                    >
                      {order.driverName.charAt(0)}
                    </Text>
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: theme.fonts.semibold,
                        color: theme.colors.text.primary,
                        marginBottom: 4,
                        fontWeight: '600',
                      }}
                    >
                      {order.driverName}
                    </Text>
                    {order.driverPhone && (
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: theme.fonts.regular,
                          color: theme.colors.text.secondary,
                        }}
                      >
                        {formatPhoneForDisplay(order.driverPhone)}
                      </Text>
                    )}
                  </View>

                  {order.driverPhone && (
                    <TouchableOpacity
                      style={{
                        padding: 12,
                        backgroundColor: theme.colors.primary,
                        borderRadius: 8,
                      }}
                    >
                      <Phone size={20} color="#ffffff" />
                    </TouchableOpacity>
                  )}
                </View>
              </Card>
            )}

            {/* Action Button */}
            <Button
              title="View Full Order Details"
              onPress={() => router.push(`/order-details?id=${order.id}`)}
              style={{ backgroundColor: theme.colors.primary }}
            />
          </>
        ) : (
          <View style={{ alignItems: 'center', paddingVertical: 60 }}>
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: theme.colors.primary + '15',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 24,
              }}
            >
              <Search size={48} color={theme.colors.primary} />
            </View>

            <Text
              style={{
                fontSize: 20,
                fontFamily: theme.fonts.bold,
                color: theme.colors.text.primary,
                marginBottom: 8,
                textAlign: 'center',
                fontWeight: '700',
              }}
            >
              Track Your Order
            </Text>

            <Text
              style={{
                fontSize: 16,
                fontFamily: theme.fonts.regular,
                color: theme.colors.text.secondary,
                textAlign: 'center',
                paddingHorizontal: 40,
                lineHeight: 24,
              }}
            >
              Enter your order ID above to track your delivery in real-time
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}