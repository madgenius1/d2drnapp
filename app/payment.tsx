/**
 * Payment Screen
 * M-Pesa STK Push and payment confirmation
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  CreditCard,
  Smartphone,
  Wallet,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react-native';
import { useTheme } from '../theme';
import { formatPrice } from '../utils/formatting/priceFormatter';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import PhoneInput from '../components/forms/PhoneInput';

export default function PaymentScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'cash' | 'card'>('mpesa');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'pending' | 'success' | 'failed'>('idle');

  const orderId = params.orderId as string || 'ORD-001';
  const amount = parseInt(params.amount as string) || 250;

  const paymentMethods = [
    {
      id: 'mpesa',
      name: 'M-Pesa',
      icon: Smartphone,
      description: 'Pay with M-Pesa STK Push',
      enabled: true,
    },
    {
      id: 'cash',
      name: 'Cash',
      icon: Wallet,
      description: 'Pay cash on pickup',
      enabled: true,
    },
    {
      id: 'card',
      name: 'Card',
      icon: CreditCard,
      description: 'Pay with debit/credit card',
      enabled: false, // Coming soon
    },
  ];

  const handlePayment = async () => {
    if (paymentMethod === 'mpesa' && !phoneNumber) {
      Alert.alert('Error', 'Please enter your M-Pesa phone number');
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('pending');

    try {
      // Simulate M-Pesa STK Push
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Mock success
      setPaymentStatus('success');
      
      setTimeout(() => {
        Alert.alert(
          'Payment Successful!',
          `${formatPrice(amount)} has been paid via ${paymentMethod === 'mpesa' ? 'M-Pesa' : 'Cash'}`,
          [
            {
              text: 'View Order',
              onPress: () => router.replace(`/order-details?id=${orderId}`),
            },
          ]
        );
      }, 1000);
    } catch (error) {
      setPaymentStatus('failed');
      Alert.alert('Payment Failed', 'Unable to process payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderPaymentStatus = () => {
    if (paymentStatus === 'idle') return null;

    const statusConfig = {
      pending: {
        icon: AlertCircle,
        color: theme.colors.warning,
        title: 'Processing Payment',
        message: paymentMethod === 'mpesa' 
          ? 'Please check your phone and enter your M-Pesa PIN'
          : 'Processing your payment...',
      },
      success: {
        icon: CheckCircle2,
        color: theme.colors.success,
        title: 'Payment Successful!',
        message: 'Your payment has been confirmed',
      },
      failed: {
        icon: AlertCircle,
        color: theme.colors.error,
        title: 'Payment Failed',
        message: 'Unable to process payment. Please try again',
      },
    };

    const config = statusConfig[paymentStatus];
    const IconComponent = config.icon;

    return (
      <Card style={{ marginBottom: 24, padding: 20, alignItems: 'center' }}>
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: config.color + '20',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <IconComponent size={40} color={config.color} />
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
          {config.title}
        </Text>

        <Text
          style={{
            fontSize: 16,
            fontFamily: theme.fonts.regular,
            color: theme.colors.text.secondary,
            textAlign: 'center',
          }}
        >
          {config.message}
        </Text>
      </Card>
    );
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
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ padding: 8, marginRight: 16 }}
        >
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
            Payment
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: theme.fonts.regular,
              color: theme.colors.text.secondary,
            }}
          >
            Order #{orderId.slice(-6)}
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
        {/* Payment Status */}
        {renderPaymentStatus()}

        {/* Amount Card */}
        <Card style={{ marginBottom: 24, padding: 20, alignItems: 'center' }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: theme.fonts.regular,
              color: theme.colors.text.secondary,
              marginBottom: 8,
            }}
          >
            Amount to Pay
          </Text>
          <Text
            style={{
              fontSize: 36,
              fontFamily: theme.fonts.bold,
              color: theme.colors.primary,
              fontWeight: '700',
            }}
          >
            {formatPrice(amount)}
          </Text>
        </Card>

        {/* Payment Methods */}
        {paymentStatus === 'idle' && (
          <>
            <Text
              style={{
                fontSize: 18,
                fontFamily: theme.fonts.semibold,
                color: theme.colors.text.primary,
                marginBottom: 16,
                fontWeight: '600',
              }}
            >
              Select Payment Method
            </Text>

            {paymentMethods.map((method) => {
              const IconComponent = method.icon;
              const isSelected = paymentMethod === method.id;

              return (
                <TouchableOpacity
                  key={method.id}
                  onPress={() => method.enabled && setPaymentMethod(method.id as any)}
                  disabled={!method.enabled}
                  style={{
                    marginBottom: 12,
                  }}
                >
                  <Card
                    style={{
                      padding: 16,
                      borderWidth: 2,
                      borderColor: isSelected
                        ? theme.colors.primary
                        : theme.colors.border,
                      backgroundColor: isSelected
                        ? theme.colors.primary + '10'
                        : theme.colors.card.background,
                      opacity: method.enabled ? 1 : 0.5,
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 25,
                          backgroundColor: isSelected
                            ? theme.colors.primary + '20'
                            : theme.colors.elevated,
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginRight: 16,
                        }}
                      >
                        <IconComponent
                          size={24}
                          color={isSelected ? theme.colors.primary : theme.colors.text.secondary}
                        />
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
                          {method.name}
                          {!method.enabled && ' (Coming Soon)'}
                        </Text>
                        <Text
                          style={{
                            fontSize: 14,
                            fontFamily: theme.fonts.regular,
                            color: theme.colors.text.secondary,
                          }}
                        >
                          {method.description}
                        </Text>
                      </View>

                      {isSelected && (
                        <CheckCircle2 size={24} color={theme.colors.primary} />
                      )}
                    </View>
                  </Card>
                </TouchableOpacity>
              );
            })}

            {/* M-Pesa Phone Input */}
            {paymentMethod === 'mpesa' && (
              <View style={{ marginTop: 24 }}>
                <PhoneInput
                  label="M-Pesa Phone Number"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  placeholder="07XX XXX XXX"
                  autoFormat={true}
                />

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    marginTop: 12,
                    padding: 12,
                    backgroundColor: theme.colors.info + '10',
                    borderRadius: 8,
                  }}
                >
                  <AlertCircle
                    size={16}
                    color={theme.colors.info}
                    style={{ marginRight: 8, marginTop: 2 }}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: theme.fonts.regular,
                      color: theme.colors.text.secondary,
                      flex: 1,
                      lineHeight: 20,
                    }}
                  >
                    You will receive an M-Pesa prompt on your phone. Enter your PIN
                    to complete the payment.
                  </Text>
                </View>
              </View>
            )}

            {/* Cash Payment Info */}
            {paymentMethod === 'cash' && (
              <View
                style={{
                  marginTop: 24,
                  padding: 16,
                  backgroundColor: theme.colors.warning + '10',
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: theme.colors.warning + '30',
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <Wallet size={20} color={theme.colors.warning} />
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: theme.fonts.semibold,
                      color: theme.colors.text.primary,
                      marginLeft: 8,
                      fontWeight: '600',
                    }}
                  >
                    Cash Payment
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: theme.fonts.regular,
                    color: theme.colors.text.secondary,
                    lineHeight: 20,
                  }}
                >
                  Please have the exact amount ready. You will pay the driver upon
                  pickup.
                </Text>
              </View>
            )}

            {/* Payment Button */}
            <Button
              title={
                isProcessing
                  ? 'Processing...'
                  : paymentMethod === 'mpesa'
                  ? 'Pay with M-Pesa'
                  : 'Confirm Order'
              }
              onPress={handlePayment}
              loading={isProcessing}
              disabled={isProcessing || (paymentMethod === 'mpesa' && !phoneNumber)}
              style={{
                backgroundColor: theme.colors.primary,
                marginTop: 32,
                paddingVertical: 16,
              }}
              textStyle={{
                fontSize: 18,
                fontFamily: theme.fonts.semibold,
              }}
            />
          </>
        )}

        {/* Success Actions */}
        {paymentStatus === 'success' && (
          <Button
            title="View Order Details"
            onPress={() => router.replace(`/order-details?id=${orderId}`)}
            style={{ backgroundColor: theme.colors.primary }}
          />
        )}
      </ScrollView>
    </View>
  );
}