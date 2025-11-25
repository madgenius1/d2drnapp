/**
 * Enhanced Create Order Screen
 * Complete order form with recipient, item, and instruction fields
 */

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { ArrowLeft, Calendar } from 'lucide-react-native';
import { format } from 'date-fns';
import { useTheme } from '../theme';
import { usePriceBreakdown } from '../hooks/pricing/usePriceBreakdown';
import { useLocationValidation } from '../hooks/routes/useLocationValidation';
import { validateOrderForm, isOrderFormComplete } from '@/utils/validation/orderValidation';
import { CreateOrderFormData } from '../types/models/Order';
import { getPickupTimeOptions } from '../data/constants/pickupTimes';
import Button from '@/components/common/Button';
import Dropdown from '@/components/common/Dropdown';
import RecipientDetailsForm from '../components/order/RecipientDetailsForm';
import ItemDetailsForm from '../components/order/ItemDetailsForm';
import DeliveryInstructionsForm from '@/components/order/DeliveryInstrucionsForm';
import PriceBreakdownComponent from '../components/order/PriceBreakdown';
import KeyboardAvoidingAnimatedView from '@/components/common/KeyboardAvoidingAnimatedView';

export default function CreateOrderScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { getPriceBreakdown } = usePriceBreakdown();
  const { validateLocations, getValidationError } = useLocationValidation();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateOrderFormData>({
    pickupRoute: '',
    pickupStop: '',
    dropoffRoute: '',
    dropoffStop: '',
    recipientName: '',
    recipientPhone: '',
    itemDescription: '',
    isFragile: false,
    specialInstructions: '',
    deliveryNotes: '',
    pickupDate: new Date(),
    pickupTime: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [priceBreakdown, setPriceBreakdown] = useState<any>(null);

  // Mock routes data - replace with actual store data
  const routes = [
    { id: 'route_1', name: 'Nairobi CBD' },
    { id: 'route_2', name: 'Thika Road' },
    { id: 'route_3', name: 'Ngong Road' },
  ];

  const getStopOptions = (routeId: string) => {
    // Mock stops - replace with actual route data
    if (routeId === 'route_2') {
      return [
        { id: 'stop_1', name: 'Ngara' },
        { id: 'stop_2', name: 'Kasarani' },
      ];
    }
    return [];
  };

  const pickupStopOptions = getStopOptions(formData.pickupRoute);
  const dropoffStopOptions = getStopOptions(formData.dropoffRoute);
  const timeOptions = getPickupTimeOptions();

  // Recalculate pricing when locations change
  useEffect(() => {
    if (
      formData.pickupRoute &&
      formData.pickupStop &&
      formData.dropoffRoute &&
      formData.dropoffStop
    ) {
      // Validate same location
      const locationError = getValidationError(
        formData.pickupRoute,
        formData.pickupStop,
        formData.dropoffRoute,
        formData.dropoffStop
      );

      if (locationError) {
        setErrors(prev => ({ ...prev, dropoffStop: locationError }));
        setPriceBreakdown(null);
        return;
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.dropoffStop;
          return newErrors;
        });
      }

      // Calculate price
      const result = getPriceBreakdown({
        pickupRouteId: formData.pickupRoute,
        pickupRouteName: 'Thika Road',
        pickupStopName: 'Ngara',
        dropoffRouteId: formData.dropoffRoute,
        dropoffRouteName: 'Thika Road',
        dropoffStopName: 'Kasarani',
      });

      if (result.isValid && result.priceBreakdown) {
        setPriceBreakdown(result.priceBreakdown);
      }
    }
  }, [
    formData.pickupRoute,
    formData.pickupStop,
    formData.dropoffRoute,
    formData.dropoffStop,
  ]);

  const handleInputChange = (field: keyof CreateOrderFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleRouteChange = (type: 'pickup' | 'dropoff', routeId: string) => {
    if (type === 'pickup') {
      setFormData(prev => ({
        ...prev,
        pickupRoute: routeId,
        pickupStop: '',
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        dropoffRoute: routeId,
        dropoffStop: '',
      }));
    }
  };

  const handleSubmit = async () => {
    const validation = validateOrderForm(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      Alert.alert('Validation Error', 'Please check all required fields');
      return;
    }

    setIsLoading(true);

    try {
      // Create order logic here
      await new Promise(resolve => setTimeout(resolve, 1500));

      Alert.alert(
        'Order Created!',
        'Your delivery order has been created successfully.',
        [
          {
            text: 'View Order',
            onPress: () => router.push('/order-details?id=ORD-001'),
          },
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = isOrderFormComplete(formData) && priceBreakdown !== null;

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
              Create Order
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: theme.fonts.regular,
                color: theme.colors.text.secondary,
              }}
            >
              Set up your pickup and delivery
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
          {/* Location Selection */}
          <View style={{ marginBottom: 32 }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: theme.fonts.semibold,
                color: theme.colors.text.primary,
                marginBottom: 16,
                fontWeight: '600',
              }}
            >
              Pickup Location
            </Text>

            <Dropdown
              label="Pickup Route"
              placeholder="Select pickup route"
              value={formData.pickupRoute}
              onSelect={(value) => handleRouteChange('pickup', value)}
              options={routes}
              error={errors.pickupRoute}
              keyExtractor={(item) => item.id}
              renderItem={(item) => item.name}
              style={{ marginBottom: 16 }}
            />

            <Dropdown
              label="Pickup Stop"
              placeholder="Select pickup stop"
              value={formData.pickupStop}
              onSelect={(value) => handleInputChange('pickupStop', value)}
              options={pickupStopOptions}
              error={errors.pickupStop}
              disabled={!formData.pickupRoute}
              keyExtractor={(item) => item.id}
              renderItem={(item) => item.name}
            />
          </View>

          <View style={{ marginBottom: 32 }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: theme.fonts.semibold,
                color: theme.colors.text.primary,
                marginBottom: 16,
                fontWeight: '600',
              }}
            >
              Drop-off Location
            </Text>

            <Dropdown
              label="Drop-off Route"
              placeholder="Select drop-off route"
              value={formData.dropoffRoute}
              onSelect={(value) => handleRouteChange('dropoff', value)}
              options={routes}
              error={errors.dropoffRoute}
              keyExtractor={(item) => item.id}
              renderItem={(item) => item.name}
              style={{ marginBottom: 16 }}
            />

            <Dropdown
              label="Drop-off Stop"
              placeholder="Select drop-off stop"
              value={formData.dropoffStop}
              onSelect={(value) => handleInputChange('dropoffStop', value)}
              options={dropoffStopOptions}
              error={errors.dropoffStop}
              disabled={!formData.dropoffRoute}
              keyExtractor={(item) => item.id}
              renderItem={(item) => item.name}
            />
          </View>

          {/* Recipient Details */}
          <RecipientDetailsForm
            recipientName={formData.recipientName}
            recipientPhone={formData.recipientPhone}
            onRecipientNameChange={(value) =>
              handleInputChange('recipientName', value)
            }
            onRecipientPhoneChange={(value) =>
              handleInputChange('recipientPhone', value)
            }
            errors={errors}
          />

          {/* Item Details */}
          <ItemDetailsForm
            itemDescription={formData.itemDescription}
            isFragile={formData.isFragile}
            onItemDescriptionChange={(value) =>
              handleInputChange('itemDescription', value)
            }
            onFragileToggle={(value) => handleInputChange('isFragile', value)}
            errors={errors}
          />

          {/* Delivery Instructions */}
          <DeliveryInstructionsForm
            specialInstructions={formData.specialInstructions || ''}
            deliveryNotes={formData.deliveryNotes || ''}
            onSpecialInstructionsChange={(value) =>
              handleInputChange('specialInstructions', value)
            }
            onDeliveryNotesChange={(value) =>
              handleInputChange('deliveryNotes', value)
            }
            errors={errors}
          />

          {/* Pickup Schedule */}
          <View style={{ marginBottom: 32 }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: theme.fonts.semibold,
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
              <Calendar size={20} color={theme.colors.text.tertiary} />
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: theme.fonts.regular,
                  color: theme.colors.text.primary,
                  marginLeft: 12,
                }}
              >
                {format(formData.pickupDate, 'EEEE, MMMM dd, yyyy')}
              </Text>
            </View>

            <Dropdown
              label="Pickup Time"
              placeholder="Select pickup time"
              value={formData.pickupTime}
              onSelect={(value) => handleInputChange('pickupTime', value)}
              options={timeOptions}
              error={errors.pickupTime}
              keyExtractor={(item) => item.id}
              renderItem={(item) => item.name}
            />
          </View>

          {/* Price Breakdown */}
          {priceBreakdown && (
            <PriceBreakdownComponent
              priceBreakdown={priceBreakdown}
              showBreakdown={true}
              style={{ marginBottom: 32 }}
            />
          )}

          {/* Submit Button */}
          <Button
            title="Create Order"
            onPress={handleSubmit}
            loading={isLoading}
            disabled={isLoading || !isFormValid}
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