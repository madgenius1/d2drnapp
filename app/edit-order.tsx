/**
 * Edit Order Screen
 * Edit order details (only if status = created)
 */

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Save, AlertTriangle } from 'lucide-react-native';
import { useTheme } from '../theme';
import { useOrderStore } from '../store';
import { Order, OrderStatus } from '../types/models/Order';
import { validateOrderForm } from '@/utils/validation/orderValidation';
import Button from '@/components/common/Button';
import RecipientDetailsForm from '../components/order/RecipientDetailsForm';
import ItemDetailsForm from '../components/order/ItemDetailsForm';
import DeliveryInstructionsForm from '@/components/order/DeliveryInstrucionsForm';
import Card from '@/components/common/Card';
import KeyboardAvoidingAnimatedView from '@/components/common/KeyboardAvoidingAnimatedView';

export default function EditOrderScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const { getOrderById } = useOrderStore();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    recipientName: '',
    recipientPhone: '',
    itemDescription: '',
    isFragile: false,
    specialInstructions: '',
    deliveryNotes: '',
  });

  useEffect(() => {
    const orderId = params.id as string;
    if (orderId) {
      const foundOrder = getOrderById(orderId);
      
      if (foundOrder) {
        if (foundOrder.status !== OrderStatus.CREATED) {
          Alert.alert(
            'Cannot Edit Order',
            'This order cannot be edited as it has already been picked up or is in transit.',
            [{ text: 'OK', onPress: () => router.back() }]
          );
          return;
        }

        setOrder(foundOrder);
        setFormData({
          recipientName: foundOrder.recipient.name,
          recipientPhone: foundOrder.recipient.phone,
          itemDescription: foundOrder.item.description,
          isFragile: foundOrder.item.isFragile,
          specialInstructions: foundOrder.instructions.specialInstructions || '',
          deliveryNotes: foundOrder.instructions.deliveryNotes || '',
        });
      }
    }
  }, [params.id]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSave = async () => {
    // Validate form
    const validation = validateOrderForm({
      ...formData,
      pickupRoute: order?.pickupLocation.routeId || '',
      pickupStop: order?.pickupLocation.stopId || '',
      dropoffRoute: order?.dropoffLocation.routeId || '',
      dropoffStop: order?.dropoffLocation.stopId || '',
      pickupDate: new Date(),
      pickupTime: order?.schedule.pickupTime || '',
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      Alert.alert('Validation Error', 'Please check all required fields');
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Update order in Firestore
      await new Promise(resolve => setTimeout(resolve, 1000));

      Alert.alert(
        'Order Updated',
        'Your order has been updated successfully.',
        [
          {
            text: 'View Order',
            onPress: () => router.replace(`/order-details?id=${order?.id}`),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!order) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontFamily: theme.fonts.regular, color: theme.colors.text.secondary }}>
          Loading order...
        </Text>
      </View>
    );
  }

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
              Edit Order
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: theme.fonts.regular,
                color: theme.colors.text.secondary,
              }}
            >
              Order #{order.id.slice(-6)}
            </Text>
          </View>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingVertical: 20,
            paddingBottom: insets.bottom + 100,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Warning Card */}
          <Card
            style={{
              marginBottom: 24,
              padding: 16,
              backgroundColor: theme.colors.warning + '10',
              borderColor: theme.colors.warning + '30',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <AlertTriangle size={20} color={theme.colors.warning} style={{ marginRight: 12, marginTop: 2 }} />
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
                  Edit Restrictions
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: theme.fonts.regular,
                    color: theme.colors.text.secondary,
                    lineHeight: 20,
                  }}
                >
                  You can only edit recipient details, item description, and delivery
                  instructions. Locations and pricing cannot be changed.
                </Text>
              </View>
            </View>
          </Card>

          {/* Route Info (Read-only) */}
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
              Route (Cannot be changed)
            </Text>

            <View style={{ marginBottom: 12 }}>
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
                  fontFamily: theme.fonts.regular,
                  color: theme.colors.text.primary,
                }}
              >
                {order.pickupLocation.fullAddress}
              </Text>
            </View>

            <View>
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
                  fontFamily: theme.fonts.regular,
                  color: theme.colors.text.primary,
                }}
              >
                {order.dropoffLocation.fullAddress}
              </Text>
            </View>
          </Card>

          {/* Editable Fields */}
          <RecipientDetailsForm
            recipientName={formData.recipientName}
            recipientPhone={formData.recipientPhone}
            onRecipientNameChange={(value) => handleInputChange('recipientName', value)}
            onRecipientPhoneChange={(value) => handleInputChange('recipientPhone', value)}
            errors={errors}
          />

          <ItemDetailsForm
            itemDescription={formData.itemDescription}
            isFragile={formData.isFragile}
            onItemDescriptionChange={(value) => handleInputChange('itemDescription', value)}
            onFragileToggle={(value) => handleInputChange('isFragile', value)}
            errors={errors}
          />

          <DeliveryInstructionsForm
            specialInstructions={formData.specialInstructions}
            deliveryNotes={formData.deliveryNotes}
            onSpecialInstructionsChange={(value) =>
              handleInputChange('specialInstructions', value)
            }
            onDeliveryNotesChange={(value) => handleInputChange('deliveryNotes', value)}
            errors={errors}
          />

          {/* Save Button */}
          <Button
            title="Save Changes"
            leftIcon={Save}
            onPress={handleSave}
            loading={isLoading}
            disabled={isLoading}
            style={{
              backgroundColor: theme.colors.primary,
              paddingVertical: 16,
            }}
            textStyle={{
              fontSize: 18,
              fontFamily: theme.fonts.semibold,
            }}
          />
        </ScrollView>
      </View>
    </KeyboardAvoidingAnimatedView>
  );
}