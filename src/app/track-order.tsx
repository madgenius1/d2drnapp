/**
 * Track Order screen
 */

import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { Button } from '../components/ui/Button';
import { useTheme } from '../hooks/useTheme';
import { getOrder } from '../services/firestore';

export default function TrackOrderScreen() {
  const [orderNumber, setOrderNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { colors } = useTheme();
  const router = useRouter();

  const handleTrack = async () => {
    setError('');

    if (!orderNumber.trim()) {
      setError('Please enter an order number');
      return;
    }

    try {
      setLoading(true);
      
      // Try to fetch the order
      const order = await getOrder(orderNumber.trim());

      if (!order) {
        setError('Order not found. Please check the order number.');
        return;
      }

      // Navigate to order details
      router.push({
        pathname: '/order-details',
        params: { orderId: order.id },
      });
    } catch (err) {
      console.error('Error tracking order:', err);
      setError('Failed to track order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>
          Track Your Order
        </Text>
        <Text style={[styles.subtitle, { color: colors.placeholder }]}>
          Enter your order number to track its status
        </Text>

        <TextInput
          label="Order Number"
          value={orderNumber}
          onChangeText={(text) => {
            setOrderNumber(text);
            setError('');
          }}
          mode="outlined"
          placeholder="Enter order ID"
          autoCapitalize="none"
          style={styles.input}
          error={!!error}
        />

        {error ? (
          <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
        ) : null}

        <Button
          onPress={handleTrack}
          loading={loading}
          disabled={loading || !orderNumber.trim()}
          icon="magnify"
          style={styles.button}
        >
          Track Order
        </Button>

        <Button
          variant="text"
          onPress={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>

        <View style={styles.hint}>
          <Text style={[styles.hintText, { color: colors.placeholder }]}>
            💡 Tip: You can find your order number in the Orders tab or in your
            order confirmation email.
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    marginBottom: 8,
  },
  error: {
    fontSize: 12,
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    marginBottom: 16,
  },
  hint: {
    marginTop: 32,
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(9, 157, 21, 0.1)',
  },
  hintText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});