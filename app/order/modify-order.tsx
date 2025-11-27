/**
 * Modify Order Screen
 * Edit order details (only for scheduled orders)
 */

import { format } from 'date-fns';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Calendar, Save } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../../components/common/Button';
import Dropdown from '../../components/common/Dropdown';
import ErrorMessage from '../../components/common/ErrorMessage';
import Input from '../../components/common/Input';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import KeyboardAvoidingAnimatedView from '../../components/KeyboardAvoidingAnimatedView';
import RecipientForm from '../../components/order/RecipientForm';
import { PICKUP_TIME_OPTIONS } from '../../data/pickupTimes';
import { useOrders } from '../../hooks/useOrders';
import { useTheme } from '../../theme';
import type { DeliveryOrder, Order, UpdateOrderData } from '../../types';
import { validateKenyanPhone, validateName } from '../../utils/validation';

export default function ModifyOrderScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id: string }>();
  const { getOrder, updateOrder, isLoading } = useOrders();

  const [order, setOrder] = useState<Order | null>(null);
  const [formData, setFormData] = useState({
    pickupDate: new Date().toISOString(),
    pickupTime: '',
    recipientName: '',
    recipientPhone: '',
    itemDescription: '',
    specialNotes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (params.id) {
      loadOrder();
    }
  }, [params.id]);

  const loadOrder = async () => {
    if (!params.id) return;

    const result = await getOrder(params.id);
    if (result.success && result.order) {
      const ord = result.order;
      
      if (ord.status !== 'scheduled') {
        Alert.alert(
          'Cannot Modify',
          'Only scheduled orders can be modified.',
          [{ text: 'OK', onPress: () => router.back() }]
        );
        return;
      }

      setOrder(ord);
      setFormData({
        pickupDate: ord.pickupDate,
        pickupTime: ord.pickupTime,
        recipientName: ord.recipient.name,
        recipientPhone: ord.recipient.phone,
        itemDescription: ord.type === 'delivery' ? (ord as DeliveryOrder).itemDescription : '',
        specialNotes: ord.specialNotes || '',
      });
    } else {
      Alert.alert('Error', result.error || 'Order not found', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.pickupTime) {
      newErrors.pickupTime = 'Please select pickup time';
    }

    const nameValidation = validateName(formData.recipientName);
    if (!nameValidation.isValid) {
      newErrors.recipientName = nameValidation.error!;
    }

    const phoneValidation = validateKenyanPhone(formData.recipientPhone);
    if (!phoneValidation.isValid) {
      newErrors.recipientPhone = phoneValidation.error!;
    }

    if (order?.type === 'delivery' && !formData.itemDescription.trim()) {
      newErrors.itemDescription = 'Item description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!order || !validateForm()) return;

    setIsSaving(true);

    const updates: UpdateOrderData = {
      pickupDate: formData.pickupDate,
      pickupTime: formData.pickupTime,
      recipient: {
        name: formData.recipientName.trim(),
        phone: formData.recipientPhone.trim(),
      },
      specialNotes: formData.specialNotes.trim(),
    };

    if (order.type === 'delivery') {
      updates.itemDescription = formData.itemDescription.trim();
    }

    const result = await updateOrder(order.id, updates);
    setIsSaving(false);

    if (result.success) {
      Alert.alert('Order Updated', 'Your order has been updated successfully.', [
        {
          text: 'View Order',
          onPress: () => router.replace(`/order/order-details?id=${order.id}`),
        },
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } else {
      Alert.alert('Error', result.error || 'Failed to update order');
    }
  };

  if (isLoading && !order) {
    return <LoadingSpinner fullScreen message="Loading order..." />;
  }

  if (!order) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <ErrorMessage fullScreen message="Order not found" />
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
              Modify Order
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
          {/* Pickup Schedule */}
          <View style={{ marginBottom: 32 }}>
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

            <View
              style={{
                backgroundColor: theme.colors.input.background,
                borderWidth: 1,
                borderColor: theme.colors.input.border,
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 16,
                marginBottom: 16,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Calendar size={20} color={theme.colors.text.tertiary} strokeWidth={1.5} />
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'Quicksand-Regular',
                  color: theme.colors.text.primary,
                  marginLeft: 12,
                }}
              >
                {format(new Date(formData.pickupDate), 'EEEE, MMMM dd, yyyy')}
              </Text>
            </View>

            <Dropdown
              label="Pickup Time"
              placeholder="Select pickup time"
              value={formData.pickupTime}
              onSelect={(value) => handleInputChange('pickupTime', value)}
              options={PICKUP_TIME_OPTIONS}
              error={errors.pickupTime}
              keyExtractor={(item) => item.id}
              renderItem={(item) => item.label}
            />
          </View>

          {/* Recipient Details */}
          <RecipientForm
            recipientName={formData.recipientName}
            recipientPhone={formData.recipientPhone}
            onNameChange={(value) => handleInputChange('recipientName', value)}
            onPhoneChange={(value) => handleInputChange('recipientPhone', value)}
            nameError={errors.recipientName}
            phoneError={errors.recipientPhone}
            style={{ marginBottom: 32 }}
          />

          {/* Item Description (Delivery only) */}
          {order.type === 'delivery' && (
            <View style={{ marginBottom: 32 }}>
              <Input
                label="Item Description"
                placeholder="What are you sending?"
                value={formData.itemDescription}
                onChangeText={(value) => handleInputChange('itemDescription', value)}
                error={errors.itemDescription}
                multiline
                numberOfLines={2}
              />
            </View>
          )}

          {/* Special Notes */}
          <View style={{ marginBottom: 32 }}>
            <Input
              label="Special Notes (Optional)"
              placeholder="Any special instructions..."
              value={formData.specialNotes}
              onChangeText={(value) => handleInputChange('specialNotes', value)}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Save Button */}
          <Button
            title="Save Changes"
            leftIcon={Save}
            onPress={handleSave}
            loading={isSaving}
            disabled={isSaving}
            style={{ backgroundColor: theme.colors.primary, paddingVertical: 16 }}
            textStyle={{ fontSize: 18, fontFamily: 'Quicksand-SemiBold' }}
          />
        </ScrollView>
      </View>
    </KeyboardAvoidingAnimatedView>
  );
}