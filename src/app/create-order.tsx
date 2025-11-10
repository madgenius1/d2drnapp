/**
 * Create Order screen
 */

import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Divider, Text, TextInput } from 'react-native-paper';
import { DateTimePicker } from '../components/DateTimePicker';
import { PriceDisplayModal } from '../components/PriceDisplayModal';
import { RouteSelector } from '../components/RouteSelector';
import { StopPicker } from '../components/StopPicker';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { useDifferentRoute } from '../hooks/useDifferentRoute';
import { useRoutes } from '../hooks/useRoutes';
import { useSameRoute } from '../hooks/useSameRoute';
import { useTheme } from '../hooks/useTheme';
import { logOrderToSheet } from '../services/appsScript';
import { createOrder } from '../services/firestore';
import type { PaymentType, Route } from '../types';
import { formatCurrency } from '../utils/formatters';
import {
  isFutureDate,
  isValidDateFormat,
  isValidKenyanPhone,
  isValidTimeFormat,
} from '../utils/validation';

export default function CreateOrderScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();
  const { routes, loading: routesLoading } = useRoutes();

  // Pickup details
  const [pickupRoute, setPickupRoute] = useState<Route | null>(null);
  const [pickupStopName, setPickupStopName] = useState<string | null>(null);
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [itemDescription, setItemDescription] = useState('');

  // Dropoff details
  const [dropoffRoute, setDropoffRoute] = useState<Route | null>(null);
  const [dropoffStopName, setDropoffStopName] = useState<string | null>(null);

  // Recipient details
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [recipientNotes, setRecipientNotes] = useState('');

  // UI state
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Calculate if same route
  const isSameRoute = pickupRoute?.name === dropoffRoute?.name;

  // Price calculations
  const sameRouteResult = useSameRoute({
    route: isSameRoute ? pickupRoute : null,
    pickupStopName,
    dropoffStopName,
  });

  const differentRouteResult = useDifferentRoute({
    pickupRoute: !isSameRoute ? pickupRoute : null,
    pickupStopName,
    dropoffRoute: !isSameRoute ? dropoffRoute : null,
    dropoffStopName,
  });

  const priceResult = isSameRoute ? sameRouteResult : differentRouteResult;
  const { price, isValid: isPriceValid, error: priceError } = priceResult;

  // Validation
  const canSubmit = useMemo(() => {
    return (
      pickupRoute &&
      pickupStopName &&
      dropoffRoute &&
      dropoffStopName &&
      pickupDate &&
      pickupTime &&
      itemDescription.trim() &&
      recipientName.trim() &&
      recipientPhone.trim() &&
      isPriceValid &&
      isValidDateFormat(pickupDate) &&
      isValidTimeFormat(pickupTime) &&
      isFutureDate(pickupDate) &&
      isValidKenyanPhone(recipientPhone)
    );
  }, [
    pickupRoute,
    pickupStopName,
    dropoffRoute,
    dropoffStopName,
    pickupDate,
    pickupTime,
    itemDescription,
    recipientName,
    recipientPhone,
    isPriceValid,
  ]);

  const handleSubmit = async (paymentType: PaymentType) => {
    if (!user || !pickupRoute || !dropoffRoute || !pickupStopName || !dropoffStopName) return;

    try {
      setSubmitting(true);

      // Create order in Firestore
      const orderId = await createOrder({
        userId: user.uid,
        sender: {
          routeName: pickupRoute.name,
          stopName: pickupStopName,
          date: pickupDate,
          time: pickupTime,
          itemDescription: itemDescription.trim(),
        },
        recipient: {
          name: recipientName.trim(),
          phone: recipientPhone.trim(),
          routeName: dropoffRoute.name,
          stopName: dropoffStopName,
          notes: recipientNotes.trim() || undefined,
        },
        status: 'scheduled',
        price,
        paymentType,
      });

      // Log to Google Sheets
      await logOrderToSheet(
        {
          id: orderId,
          userId: user.uid,
          sender: {
            routeName: pickupRoute.name,
            stopName: pickupStopName,
            date: pickupDate,
            time: pickupTime,
            itemDescription,
          },
          recipient: {
            name: recipientName,
            phone: recipientPhone,
            routeName: dropoffRoute.name,
            stopName: dropoffStopName,
            notes: recipientNotes,
          },
          status: 'scheduled',
          price,
          paymentType,
          createdAt: Date.now(),
        },
        pickupRoute.name,
        pickupStopName,
        dropoffRoute.name,
        dropoffStopName,
        `Price: ${price} KES (${isSameRoute ? 'Same Route' : 'Different Routes'})`
      );

      Alert.alert(
        'Success',
        'Your order has been created successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('Error creating order:', error);
      Alert.alert('Error', 'Failed to create order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (routesLoading) {
    return <LoadingSpinner message="Loading routes..." />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.title, { color: colors.text }]}>
          Create New Order
        </Text>

        {/* Pickup Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            📍 Pickup Details
          </Text>

          <RouteSelector
            routes={routes}
            selectedRoute={pickupRoute}
            onSelect={(route) => {
              setPickupRoute(route);
              setPickupStopName(null);
            }}
            label="Pickup Route"
          />

          <StopPicker
            route={pickupRoute}
            selectedStopName={pickupStopName}
            onSelect={setPickupStopName}
            label="Pickup Stop"
          />

          <DateTimePicker
            date={pickupDate}
            time={pickupTime}
            onDateChange={setPickupDate}
            onTimeChange={setPickupTime}
          />

          <TextInput
            label="Item Description"
            value={itemDescription}
            onChangeText={setItemDescription}
            mode="outlined"
            placeholder="e.g., Electronics, Documents, Clothes"
            style={styles.input}
          />
        </View>

        <Divider style={styles.divider} />

        {/* Dropoff Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            📦 Dropoff Details
          </Text>

          <RouteSelector
            routes={routes}
            selectedRoute={dropoffRoute}
            onSelect={(route) => {
              setDropoffRoute(route);
              setDropoffStopName(null);
            }}
            label="Dropoff Route"
          />

          <StopPicker
            route={dropoffRoute}
            selectedStopName={dropoffStopName}
            onSelect={setDropoffStopName}
            label="Dropoff Stop"
            excludeStopName={isSameRoute ? pickupStopName : null}
          />
        </View>

        <Divider style={styles.divider} />

        {/* Recipient Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            👤 Recipient Information
          </Text>

          <TextInput
            label="Recipient Name"
            value={recipientName}
            onChangeText={setRecipientName}
            mode="outlined"
            autoCapitalize="words"
            style={styles.input}
          />

          <TextInput
            label="Recipient Phone"
            value={recipientPhone}
            onChangeText={setRecipientPhone}
            mode="outlined"
            keyboardType="phone-pad"
            placeholder="0712345678"
            style={styles.input}
          />

          <TextInput
            label="Additional Notes (Optional)"
            value={recipientNotes}
            onChangeText={setRecipientNotes}
            mode="outlined"
            multiline
            numberOfLines={3}
            placeholder="Special delivery instructions..."
            style={styles.input}
          />
        </View>

        <Divider style={styles.divider} />

        {/* Price Section */}
        <View style={styles.priceSection}>
          <View style={styles.priceRow}>
            <Text style={[styles.priceLabel, { color: colors.text }]}>
              Delivery Rate
            </Text>
            <Text style={[styles.priceAmount, { color: colors.primary }]}>
              {isPriceValid ? formatCurrency(price) : 'Select routes'}
            </Text>
          </View>

          {priceError && (
            <Text style={[styles.errorText, { color: colors.error }]}>
              {priceError}
            </Text>
          )}

          {isPriceValid && (
            <Button
              variant="text"
              onPress={() => setShowPriceModal(true)}
              style={styles.viewPriceButton}
            >
              View Rate Details
            </Button>
          )}
        </View>

        {/* Submit Buttons */}
        <View style={styles.actions}>
          <Button
            onPress={() => handleSubmit('payNow')}
            disabled={!canSubmit || submitting}
            loading={submitting}
            style={styles.button}
          >
            Pay Now
          </Button>

          <Button
            onPress={() => handleSubmit('payOnPickup')}
            variant="outlined"
            disabled={!canSubmit || submitting}
            style={styles.button}
          >
            Pay on Pickup
          </Button>

          <Button
            variant="text"
            onPress={() => router.back()}
            disabled={submitting}
          >
            Cancel
          </Button>
        </View>
      </ScrollView>

      <PriceDisplayModal
        visible={showPriceModal}
        onDismiss={() => setShowPriceModal(false)}
        price={price}
        isSameRoute={isSameRoute}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  divider: {
    marginVertical: 24,
  },
  priceSection: {
    marginBottom: 24,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  priceAmount: {
    fontSize: 24,
    fontWeight: '700',
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  viewPriceButton: {
    alignSelf: 'flex-start',
  },
  actions: {
    marginTop: 16,
  },
  button: {
    marginBottom: 12,
  },
});