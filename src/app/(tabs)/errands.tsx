/**
 * Errands screen - Request errands to be run
 * Replaces the Store/Shopping list functionality
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
import { DateTimePickerComponent } from '../../components/DateTimePicker';
import { RouteSelector } from '../../components/RouteSelector';
import { StopPicker } from '../../components/StopPicker';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useRoutes } from '../../hooks/useRoutes';
import { useTheme } from '../../hooks/useTheme';
import { logOrderToSheet } from '../../services/appsScript';
import { createOrder } from '../../services/firestore';
import type { PaymentType, Route } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { findStopPriceInDataSetOne } from '../../utils/pricing';
import {
  isFutureDate,
  isValidDateFormat,
  isValidTimeFormat,
} from '../../utils/validation';

export default function ErrandsScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();
  const { routes } = useRoutes();

  // Errand details
  const [errandDescription, setErrandDescription] = useState('');
  const [errandLocation, setErrandLocation] = useState('');
  const [errandDate, setErrandDate] = useState('');
  const [errandTime, setErrandTime] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');

  // Dropoff details
  const [dropoffRoute, setDropoffRoute] = useState<Route | null>(null);
  const [dropoffStopName, setDropoffStopName] = useState<string | null>(null);

  // UI state
  const [submitting, setSubmitting] = useState(false);

  // Calculate price based on dropoff location
  const price = useMemo(() => {
    if (!dropoffStopName) return 0;
    
    const stopPrice = findStopPriceInDataSetOne(dropoffStopName);
    if (!stopPrice) return 0;
    
    // Errand base fee + location price
    const errandBaseFee = 100;
    return stopPrice + errandBaseFee;
  }, [dropoffStopName]);

  // Validation
  const canSubmit = useMemo(() => {
    return (
      errandDescription.trim() &&
      errandLocation.trim() &&
      errandDate &&
      errandTime &&
      dropoffRoute &&
      dropoffStopName &&
      isValidDateFormat(errandDate) &&
      isValidTimeFormat(errandTime) &&
      isFutureDate(errandDate)
    );
  }, [
    errandDescription,
    errandLocation,
    errandDate,
    errandTime,
    dropoffRoute,
    dropoffStopName,
  ]);

  const handleSubmit = async (paymentType: PaymentType) => {
    if (!user || !dropoffRoute || !dropoffStopName) return;

    try {
      setSubmitting(true);

      // Create errand as an order in Firestore
      const orderId = await createOrder({
        userId: user.uid,
        sender: {
          routeName: 'Errand',
          stopName: errandLocation,
          date: errandDate,
          time: errandTime,
          itemDescription: errandDescription.trim(),
        },
        recipient: {
          name: user.email || 'User',
          phone: user.phoneNumber || '',
          routeName: dropoffRoute.name,
          stopName: dropoffStopName,
          notes: additionalDetails.trim() || undefined,
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
            routeName: 'Errand',
            stopName: errandLocation,
            date: errandDate,
            time: errandTime,
            itemDescription: errandDescription,
          },
          recipient: {
            name: user.email || 'User',
            phone: user.phoneNumber || '',
            routeName: dropoffRoute.name,
            stopName: dropoffStopName,
            notes: additionalDetails,
          },
          status: 'scheduled',
          price,
          paymentType,
          createdAt: Date.now(),
        },
        'Errand',
        errandLocation,
        dropoffRoute.name,
        dropoffStopName,
        `Errand Service: ${price} KES`
      );

      Alert.alert(
        'Success',
        'Your errand request has been submitted!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Clear form
              setErrandDescription('');
              setErrandLocation('');
              setErrandDate('');
              setErrandTime('');
              setAdditionalDetails('');
              setDropoffRoute(null);
              setDropoffStopName(null);
              router.push('/(tabs)/orders');
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error creating errand:', error);
      Alert.alert('Error', 'Failed to submit errand. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Request an Errand
          </Text>
          <Text style={[styles.subtitle, { color: colors.placeholder }]}>
            Tell us what you need done and where to deliver the results
          </Text>
        </View>

        {/* Errand Details */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            📋 Errand Details
          </Text>

          <TextInput
            label="What do you need done? *"
            value={errandDescription}
            onChangeText={setErrandDescription}
            mode="outlined"
            multiline
            numberOfLines={3}
            placeholder="e.g., Pick up documents, Buy groceries, Pay bills"
            style={styles.input}
          />

          <TextInput
            label="Location of Errand *"
            value={errandLocation}
            onChangeText={setErrandLocation}
            mode="outlined"
            placeholder="e.g., City Hall, Westlands Mall, KRA Office"
            style={styles.input}
          />

          <DateTimePickerComponent
            date={errandDate}
            time={errandTime}
            onDateChange={setErrandDate}
            onTimeChange={setErrandTime}
          />

          <TextInput
            label="Additional Details (Optional)"
            value={additionalDetails}
            onChangeText={setAdditionalDetails}
            mode="outlined"
            multiline
            numberOfLines={3}
            placeholder="Any specific instructions or requirements..."
            style={styles.input}
          />
        </View>

        <Divider style={styles.divider} />

        {/* Dropoff Location */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            📍 Where should we deliver the results?
          </Text>

          <RouteSelector
            routes={routes}
            selectedRoute={dropoffRoute}
            onSelect={(route) => {
              setDropoffRoute(route);
              setDropoffStopName(null);
            }}
            label="Delivery Route"
          />

          <StopPicker
            route={dropoffRoute}
            selectedStopName={dropoffStopName}
            onSelect={setDropoffStopName}
            label="Delivery Stop"
          />
        </View>

        <Divider style={styles.divider} />

        {/* Price Display */}
        <View style={styles.priceSection}>
          <View style={styles.priceRow}>
            <Text style={[styles.priceLabel, { color: colors.text }]}>
              Errand Fee
            </Text>
            <Text style={[styles.priceAmount, { color: colors.primary }]}>
              {price > 0 ? formatCurrency(price) : 'Select delivery location'}
            </Text>
          </View>
          <Text style={[styles.priceNote, { color: colors.placeholder }]}>
            Includes errand service + delivery to your location
          </Text>
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
            Pay on Delivery
          </Button>
        </View>
      </ScrollView>
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
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
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
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(9, 157, 21, 0.05)',
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
  priceNote: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  actions: {
    marginTop: 16,
  },
  button: {
    marginBottom: 12,
  },
});