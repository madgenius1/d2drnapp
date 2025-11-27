/**
 * Create Order Screen (Enhanced)
 * Complete order creation with recipient details, payment, and fragile toggle
 */

import { format } from 'date-fns';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Calendar, FileText, Package } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../../components/common/Button';
import Dropdown from '../../components/common/Dropdown';
import Input from '../../components/common/Input';
import KeyboardAvoidingAnimatedView from '../../components/KeyboardAvoidingAnimatedView';
import PaymentSelector from '../../components/order/PaymentSelector';
import PriceBreakdown from '../../components/order/PriceBreakdown';
import RecipientForm from '../../components/order/RecipientForm';
import RouteSelector from '../../components/order/RouteSelector';
import { PICKUP_TIME_OPTIONS } from '../../data/pickupTimes';
import { useOrders } from '../../hooks/useOrders';
import { usePricing } from '../../hooks/usePricing';
import { useRoutes } from '../../hooks/useRoutes';
import { useTheme } from '../../theme';
import type { CreateDeliveryOrderData, PaymentMethod, PricingResult } from '../../types';
import { validateKenyanPhone, validateName, validateRequired } from '../../utils/validation';

export default function CreateOrderScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { routes, getRouteById, getStopById } = useRoutes();
  const { createDeliveryOrder, isLoading } = useOrders();
  const { getPriceBreakdown } = usePricing();

  const [formData, setFormData] = useState({
    pickupRoute: '',
    pickupStop: '',
    dropoffRoute: '',
    dropoffStop: '',
    pickupDate: new Date().toISOString(),
    pickupTime: '',
    recipientName: '',
    recipientPhone: '',
    itemDescription: '',
    isFragile: false,
    specialNotes: '',
    paymentMethod: 'payOnPickup' as PaymentMethod,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [priceBreakdown, setPriceBreakdown] = useState<PricingResult>({
    pickupCost: 0,
    transferFee: 0,
    dropoffCost: 0,
    total: 0,
    isSameRoute: false,
    formula: '',
  });

  // Calculate pricing when route/stop changes
  useEffect(() => {
    if (
      formData.pickupRoute &&
      formData.pickupStop &&
      formData.dropoffRoute &&
      formData.dropoffStop
    ) {
      const pickupRoute = getRouteById(formData.pickupRoute);
      const dropoffRoute = getRouteById(formData.dropoffRoute);
      const pickupStop = getStopById(formData.pickupRoute, formData.pickupStop);
      const dropoffStop = getStopById(formData.dropoffRoute, formData.dropoffStop);

      if (pickupRoute && dropoffRoute && pickupStop && dropoffStop) {
        const breakdown = getPriceBreakdown(
          pickupRoute.name,
          pickupStop.name,
          dropoffRoute.name,
          dropoffStop.name
        );
        setPriceBreakdown(breakdown);
      }
    } else {
      setPriceBreakdown({
        pickupCost: 0,
        transferFee: 0,
        dropoffCost: 0,
        total: 0,
        isSameRoute: false,
        formula: '',
      });
    }
  }, [
    formData.pickupRoute,
    formData.pickupStop,
    formData.dropoffRoute,
    formData.dropoffStop,
  ]);

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

  const handleRouteChange = (type: 'pickup' | 'dropoff', routeId: string) => {
    if (type === 'pickup') {
      setFormData((prev) => ({
        ...prev,
        pickupRoute: routeId,
        pickupStop: '',
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        dropoffRoute: routeId,
        dropoffStop: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Pickup location
    if (!formData.pickupRoute) {
      newErrors.pickupRoute = 'Please select pickup route';
    }
    if (!formData.pickupStop) {
      newErrors.pickupStop = 'Please select pickup stop';
    }

    // Dropoff location
    if (!formData.dropoffRoute) {
      newErrors.dropoffRoute = 'Please select drop-off route';
    }
    if (!formData.dropoffStop) {
      newErrors.dropoffStop = 'Please select drop-off stop';
    }

    // Pickup time
    if (!formData.pickupTime) {
      newErrors.pickupTime = 'Please select pickup time';
    }

    // Recipient details
    const nameValidation = validateName(formData.recipientName);
    if (!nameValidation.isValid) {
      newErrors.recipientName = nameValidation.error!;
    }

    const phoneValidation = validateKenyanPhone(formData.recipientPhone);
    if (!phoneValidation.isValid) {
      newErrors.recipientPhone = phoneValidation.error!;
    }

    // Item description
    const descValidation = validateRequired(formData.itemDescription, 'Item description');
    if (!descValidation.isValid) {
      newErrors.itemDescription = descValidation.error!;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill in all required fields correctly');
      return;
    }

    const pickupRoute = getRouteById(formData.pickupRoute);
    const dropoffRoute = getRouteById(formData.dropoffRoute);
    const pickupStop = getStopById(formData.pickupRoute, formData.pickupStop);
    const dropoffStop = getStopById(formData.dropoffRoute, formData.dropoffStop);

    if (!pickupRoute || !dropoffRoute || !pickupStop || !dropoffStop) {
      Alert.alert('Error', 'Invalid route or stop selection');
      return;
    }

    const orderData: CreateDeliveryOrderData = {
      pickupRouteId: formData.pickupRoute,
      pickupStopId: formData.pickupStop,
      dropoffRouteId: formData.dropoffRoute,
      dropoffStopId: formData.dropoffStop,
      pickupDate: formData.pickupDate,
      pickupTime: formData.pickupTime,
      recipientName: formData.recipientName.trim(),
      recipientPhone: formData.recipientPhone.trim(),
      itemDescription: formData.itemDescription.trim(),
      isFragile: formData.isFragile,
      specialNotes: formData.specialNotes.trim(),
      paymentMethod: formData.paymentMethod,
    };

    const locationDetails = {
      pickupRouteName: pickupRoute.name,
      pickupStopName: pickupStop.name,
      dropoffRouteName: dropoffRoute.name,
      dropoffStopName: dropoffStop.name,
    };

    const result = await createDeliveryOrder(orderData, priceBreakdown, locationDetails);

    if (result.success && result.order) {
      Alert.alert(
        'Order Created!',
        'Your delivery order has been created successfully.',
        [
          {
            text: 'View Order',
            onPress: () => router.replace(`/order/order-details?id=${result.order!.id}`),
          },
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } else {
      Alert.alert('Error', result.error || 'Failed to create order');
    }
  };

  const isFormValid =
    formData.pickupRoute &&
    formData.pickupStop &&
    formData.dropoffRoute &&
    formData.dropoffStop &&
    formData.pickupTime &&
    formData.recipientName.trim() &&
    formData.recipientPhone.trim() &&
    formData.itemDescription.trim() &&
    priceBreakdown.total > 0;

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
              Create Order
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Quicksand-Regular',
                color: theme.colors.text.secondary,
              }}
            >
              Set up your delivery details
            </Text>
          </View>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingVertical: 20,
            paddingBottom: insets.bottom + 120,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Pickup Location */}
          <RouteSelector
            label="Pickup Location"
            routeValue={formData.pickupRoute}
            stopValue={formData.pickupStop}
            onRouteChange={(value) => handleRouteChange('pickup', value)}
            onStopChange={(value) => handleInputChange('pickupStop', value)}
            routeError={errors.pickupRoute}
            stopError={errors.pickupStop}
            style={{ marginBottom: 32 }}
          />

          {/* Dropoff Location */}
          <RouteSelector
            label="Drop-off Location"
            routeValue={formData.dropoffRoute}
            stopValue={formData.dropoffStop}
            onRouteChange={(value) => handleRouteChange('dropoff', value)}
            onStopChange={(value) => handleInputChange('dropoffStop', value)}
            routeError={errors.dropoffRoute}
            stopError={errors.dropoffStop}
            style={{ marginBottom: 32 }}
          />

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

          {/* Item Details */}
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
              Item Details
            </Text>

            <Input
              label="Item Description"
              placeholder="What are you sending?"
              value={formData.itemDescription}
              onChangeText={(value) => handleInputChange('itemDescription', value)}
              error={errors.itemDescription}
              leftIcon={Package}
              multiline
              numberOfLines={2}
              style={{ marginBottom: 16 }}
            />

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: theme.colors.input.background,
                borderWidth: 1,
                borderColor: theme.colors.input.border,
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 16,
                marginBottom: 16,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Package size={20} color={theme.colors.text.tertiary} strokeWidth={1.5} />
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'Quicksand-Medium',
                    color: theme.colors.text.primary,
                    marginLeft: 12,
                  }}
                >
                  Fragile Item
                </Text>
              </View>
              <Switch
                value={formData.isFragile}
                onValueChange={(value) => handleInputChange('isFragile', value)}
                trackColor={{
                  false: theme.colors.border,
                  true: theme.colors.primary + '40',
                }}
                thumbColor={formData.isFragile ? theme.colors.primary : theme.colors.text.tertiary}
              />
            </View>

            <Input
              label="Special Notes (Optional)"
              placeholder="Any special instructions..."
              value={formData.specialNotes}
              onChangeText={(value) => handleInputChange('specialNotes', value)}
              leftIcon={FileText}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Payment Method */}
          <PaymentSelector
            value={formData.paymentMethod}
            onChange={(value) => handleInputChange('paymentMethod', value)}
            style={{ marginBottom: 32 }}
          />

          {/* Price Breakdown */}
          {priceBreakdown.total > 0 && (
            <PriceBreakdown breakdown={priceBreakdown} style={{ marginBottom: 32 }} />
          )}

          {/* Submit Button */}
          <Button
            title="Create Order"
            onPress={handleSubmit}
            loading={isLoading}
            disabled={isLoading || !isFormValid}
            style={{ backgroundColor: theme.colors.primary, paddingVertical: 16 }}
            textStyle={{ fontSize: 18, fontFamily: 'Quicksand-SemiBold' }}
          />
        </ScrollView>
      </View>
    </KeyboardAvoidingAnimatedView>
  );
}