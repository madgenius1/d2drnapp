/**
 * Errands Screen (TypeScript)
 * Create and manage errand requests
 */

import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { FileText, MessageSquare } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../../components/common/Button';
import Dropdown from '../../components/common/Dropdown';
import Input from '../../components/common/Input';
import KeyboardAvoidingAnimatedView from '../../components/KeyboardAvoidingAnimatedView';
import PaymentSelector from '../../components/order/PaymentSelector';
import RecipientForm from '../../components/order/RecipientForm';
import RouteSelector from '../../components/order/RouteSelector';
import { PICKUP_TIME_OPTIONS } from '../../data/pickupTimes';
import { useOrders } from '../../hooks/useOrders';
import { usePricing } from '../../hooks/usePricing';
import { useRoutes } from '../../hooks/useRoutes';
import { useTheme } from '../../theme';
import type { CreateErrandOrderData, PaymentMethod } from '../../types';

interface ErrandFormData {
  description: string;
  pickupRoute: string;
  pickupStop: string;
  dropoffRoute: string;
  dropoffStop: string;
  pickupDate: string;
  pickupTime: string;
  recipientName: string;
  recipientPhone: string;
  estimatedBudget: string;
  additionalNotes: string;
  paymentMethod: PaymentMethod;
}

export default function ErrandsScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ template?: string }>();
  const { createErrandOrder, isLoading } = useOrders();
  const { getRouteById, getStopById } = useRoutes();
  const { getPriceBreakdown } = usePricing();

  const [formData, setFormData] = useState<ErrandFormData>({
    description: '',
    pickupRoute: '',
    pickupStop: '',
    dropoffRoute: '',
    dropoffStop: '',
    pickupDate: new Date().toISOString(),
    pickupTime: '',
    recipientName: '',
    recipientPhone: '',
    estimatedBudget: '',
    additionalNotes: '',
    paymentMethod: 'payOnPickup',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (params.template) {
      setFormData((prev) => ({
        ...prev,
        description: `Help with: ${params.template}`,
      }));
    }
  }, [params.template]);

  const handleInputChange = (field: keyof ErrandFormData, value: any) => {
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
    if (!formData.description.trim() || formData.description.length < 10) {
      newErrors.description = 'Please provide details (at least 10 characters)';
    }
    if (!formData.pickupRoute) newErrors.pickupRoute = 'Required';
    if (!formData.pickupStop) newErrors.pickupStop = 'Required';
    if (!formData.dropoffRoute) newErrors.dropoffRoute = 'Required';
    if (!formData.dropoffStop) newErrors.dropoffStop = 'Required';
    if (!formData.pickupTime) newErrors.pickupTime = 'Required';
    if (!formData.recipientName.trim()) newErrors.recipientName = 'Required';
    if (!formData.recipientPhone.trim()) newErrors.recipientPhone = 'Required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const pickupRoute = getRouteById(formData.pickupRoute);
    const dropoffRoute = getRouteById(formData.dropoffRoute);
    const pickupStop = getStopById(formData.pickupRoute, formData.pickupStop);
    const dropoffStop = getStopById(formData.dropoffRoute, formData.dropoffStop);

    if (!pickupRoute || !dropoffRoute || !pickupStop || !dropoffStop) {
      Alert.alert('Error', 'Invalid location selection');
      return;
    }

    const priceBreakdown = getPriceBreakdown(
      pickupRoute.name,
      pickupStop.name,
      dropoffRoute.name,
      dropoffStop.name
    );

    const errandData: CreateErrandOrderData = {
      pickupRouteId: formData.pickupRoute,
      pickupStopId: formData.pickupStop,
      dropoffRouteId: formData.dropoffRoute,
      dropoffStopId: formData.dropoffStop,
      pickupDate: formData.pickupDate,
      pickupTime: formData.pickupTime,
      recipientName: formData.recipientName.trim(),
      recipientPhone: formData.recipientPhone.trim(),
      errandDescription: formData.description.trim(),
      estimatedBudget: formData.estimatedBudget.trim(),
      additionalNotes: formData.additionalNotes.trim(),
      paymentMethod: formData.paymentMethod,
    };

    const result = await createErrandOrder(
      errandData,
      priceBreakdown,
      {
        pickupRouteName: pickupRoute.name,
        pickupStopName: pickupStop.name,
        dropoffRouteName: dropoffRoute.name,
        dropoffStopName: dropoffStop.name,
      }
    );

    if (result.success) {
      Alert.alert('Errand Submitted!', 'Your errand has been created.', [
        { text: 'OK', onPress: () => router.push('/(tabs)/orders') },
      ]);
    } else {
      Alert.alert('Error', result.error || 'Failed to create errand');
    }
  };

  return (
    <KeyboardAvoidingAnimatedView style={{ flex: 1 }} behavior="padding">
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <StatusBar style={theme.isDark ? 'light' : 'dark'} />
        <ScrollView
          contentContainerStyle={{
            paddingTop: insets.top + 20,
            paddingHorizontal: 20,
            paddingBottom: insets.bottom + 100,
          }}
          showsVerticalScrollIndicator={false}
        >
          <Text style={{ fontSize: 28, fontFamily: 'Quicksand-Bold', color: theme.colors.text.primary, marginBottom: 8, fontWeight: '700' }}>
            Run an Errand
          </Text>
          <Text style={{ fontSize: 16, fontFamily: 'Quicksand-Regular', color: theme.colors.text.secondary, marginBottom: 32 }}>
            Describe what you need and we'll handle it
          </Text>

          <Input
            label="Describe Your Errand"
            placeholder="e.g., Buy groceries at Naivas, deliver to Kilimani"
            value={formData.description}
            onChangeText={(value) => handleInputChange('description', value)}
            error={errors.description}
            leftIcon={MessageSquare}
            multiline
            numberOfLines={4}
            style={{ marginBottom: 24 }}
          />

          <RouteSelector
            label="Pickup Location"
            routeValue={formData.pickupRoute}
            stopValue={formData.pickupStop}
            onRouteChange={(value) => handleInputChange('pickupRoute', value)}
            onStopChange={(value) => handleInputChange('pickupStop', value)}
            routeError={errors.pickupRoute}
            stopError={errors.pickupStop}
            style={{ marginBottom: 24 }}
          />

          <RouteSelector
            label="Drop-off Location"
            routeValue={formData.dropoffRoute}
            stopValue={formData.dropoffStop}
            onRouteChange={(value) => handleInputChange('dropoffRoute', value)}
            onStopChange={(value) => handleInputChange('dropoffStop', value)}
            routeError={errors.dropoffRoute}
            stopError={errors.dropoffStop}
            style={{ marginBottom: 24 }}
          />

          <Dropdown
            label="Preferred Time"
            placeholder="When would you like this done?"
            value={formData.pickupTime}
            onSelect={(value) => handleInputChange('pickupTime', value)}
            options={PICKUP_TIME_OPTIONS}
            error={errors.pickupTime}
            keyExtractor={(item: any) => item.id}
            renderItem={(item: any) => item.label}
            style={{ marginBottom: 24 }}
          />

          <RecipientForm
            recipientName={formData.recipientName}
            recipientPhone={formData.recipientPhone}
            onNameChange={(value) => handleInputChange('recipientName', value)}
            onPhoneChange={(value) => handleInputChange('recipientPhone', value)}
            nameError={errors.recipientName}
            phoneError={errors.recipientPhone}
            style={{ marginBottom: 24 }}
          />

          <Input
            label="Additional Notes (Optional)"
            placeholder="Special instructions..."
            value={formData.additionalNotes}
            onChangeText={(value) => handleInputChange('additionalNotes', value)}
            leftIcon={FileText}
            multiline
            numberOfLines={3}
            style={{ marginBottom: 24 }}
          />

          <PaymentSelector
            value={formData.paymentMethod}
            onChange={(value) => handleInputChange('paymentMethod', value)}
            style={{ marginBottom: 32 }}
          />

          <Button
            title="Submit Errand Order"
            onPress={handleSubmit}
            loading={isLoading}
            disabled={isLoading}
            style={{ backgroundColor: theme.colors.primary }}
          />
        </ScrollView>
      </View>
    </KeyboardAvoidingAnimatedView>
  );
}