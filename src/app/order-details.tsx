/**
 * Order Details screen
 */

import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import { Divider, Text, TextInput } from 'react-native-paper';
import { StatusBadge } from '../components/StatusBadge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useTheme } from '../hooks/useTheme';
import { getRoute, rateOrder, subscribeToOrder } from '../services/firestore';
import type { Order, Route } from '../types';
import { formatCurrency, formatDate, formatPhoneNumber, formatTime } from '../utils/formatters';

export default function OrderDetailsScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const { colors } = useTheme();
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [pickupRoute, setPickupRoute] = useState<Route | null>(null);
  const [dropoffRoute, setDropoffRoute] = useState<Route | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Rating state
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(5);
  const [ratingComment, setRatingComment] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);

  useEffect(() => {
    if (!orderId) return;

    const unsubscribe = subscribeToOrder(orderId, async (fetchedOrder) => {
      if (fetchedOrder) {
        setOrder(fetchedOrder);

        // Fetch route details
        const pickup = await getRoute(fetchedOrder.sender.routeId);
        const dropoff = await getRoute(fetchedOrder.recipient.routeId);
        setPickupRoute(pickup);
        setDropoffRoute(dropoff);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [orderId]);

  const handleRate = async () => {
    if (!order) return;

    try {
      setSubmittingRating(true);
      await rateOrder(order.id, rating, ratingComment.trim() || undefined);
      Alert.alert('Success', 'Thank you for your feedback!');
      setShowRating(false);
    } catch (error) {
      console.error('Error rating order:', error);
      Alert.alert('Error', 'Failed to submit rating. Please try again.');
    } finally {
      setSubmittingRating(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading order..." />;
  }

  if (!order) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorState}>
          <Text style={[styles.errorText, { color: colors.text }]}>
            Order not found
          </Text>
          <Button onPress={() => router.back()} style={styles.backButton}>
            Go Back
          </Button>
        </View>
      </View>
    );
  }

  const pickupStop = pickupRoute?.stops.find((s) => s.id === order.sender.stopId);
  const dropoffStop = dropoffRoute?.stops.find((s) => s.id === order.recipient.stopId);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Order #{order.id.slice(0, 8)}
        </Text>
        <StatusBadge status={order.status} />
      </View>

      {/* Pickup Details */}
      <Card style={styles.card}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          📍 Pickup Details
        </Text>
        <Divider style={styles.divider} />

        <InfoRow
          label="Route"
          value={pickupRoute?.name || 'Unknown'}
          colors={colors}
        />
        <InfoRow
          label="Stop"
          value={pickupStop?.name || 'Unknown'}
          colors={colors}
        />
        <InfoRow
          label="Date"
          value={formatDate(order.sender.date)}
          colors={colors}
        />
        <InfoRow
          label="Time"
          value={formatTime(order.sender.time)}
          colors={colors}
        />
        <InfoRow
          label="Item"
          value={order.sender.itemDescription}
          colors={colors}
        />
      </Card>

      {/* Dropoff Details */}
      <Card style={styles.card}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          📦 Dropoff Details
        </Text>
        <Divider style={styles.divider} />

        <InfoRow
          label="Route"
          value={dropoffRoute?.name || 'Unknown'}
          colors={colors}
        />
        <InfoRow
          label="Stop"
          value={dropoffStop?.name || 'Unknown'}
          colors={colors}
        />
      </Card>

      {/* Recipient Details */}
      <Card style={styles.card}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          👤 Recipient
        </Text>
        <Divider style={styles.divider} />

        <InfoRow
          label="Name"
          value={order.recipient.name}
          colors={colors}
        />
        <InfoRow
          label="Phone"
          value={formatPhoneNumber(order.recipient.phone)}
          colors={colors}
        />
        {order.recipient.notes && (
          <InfoRow
            label="Notes"
            value={order.recipient.notes}
            colors={colors}
          />
        )}
      </Card>

      {/* Payment Details */}
      <Card style={styles.card}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          💰 Payment
        </Text>
        <Divider style={styles.divider} />

        <InfoRow
          label="Amount"
          value={formatCurrency(order.price)}
          colors={colors}
          valueStyle={{ color: colors.primary, fontWeight: '700' }}
        />
        <InfoRow
          label="Payment Type"
          value={order.paymentType === 'payNow' ? 'Paid' : 'Pay on Pickup'}
          colors={colors}
        />
      </Card>

      {/* Rating Section */}
      {order.status === 'completed' && !order.rating && !showRating && (
        <Button
          onPress={() => setShowRating(true)}
          icon="star"
          style={styles.rateButton}
        >
          Rate This Delivery
        </Button>
      )}

      {showRating && (
        <Card style={styles.card}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            ⭐ Rate Your Experience
          </Text>
          <Divider style={styles.divider} />

          <View style={styles.ratingStars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Text
                key={star}
                style={styles.star}
                onPress={() => setRating(star)}
              >
                {star <= rating ? '⭐' : '☆'}
              </Text>
            ))}
          </View>

          <TextInput
            label="Comments (Optional)"
            value={ratingComment}
            onChangeText={setRatingComment}
            mode="outlined"
            multiline
            numberOfLines={3}
            placeholder="Tell us about your experience..."
            style={styles.input}
          />

          <View style={styles.ratingActions}>
            <Button
              onPress={handleRate}
              loading={submittingRating}
              disabled={submittingRating}
              style={styles.submitButton}
            >
              Submit Rating
            </Button>
            <Button
              variant="text"
              onPress={() => setShowRating(false)}
              disabled={submittingRating}
            >
              Cancel
            </Button>
          </View>
        </Card>
      )}

      {order.rating && (
        <Card style={styles.card}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            ⭐ Your Rating
          </Text>
          <Divider style={styles.divider} />

          <View style={styles.ratingStars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Text key={star} style={styles.star}>
                {star <= order.rating! ? '⭐' : '☆'}
              </Text>
            ))}
          </View>

          {order.ratingComment && (
            <Text style={[styles.ratingText, { color: colors.text }]}>
              {order.ratingComment}
            </Text>
          )}
        </Card>
      )}

      <Button
        variant="outlined"
        onPress={() => router.back()}
        style={styles.backButton}
      >
        Close
      </Button>
    </ScrollView>
  );
}

const InfoRow: React.FC<{
  label: string;
  value: string;
  colors: any;
  valueStyle?: any;
}> = ({ label, value, colors, valueStyle }) => (
  <View style={styles.infoRow}>
    <Text style={[styles.infoLabel, { color: colors.placeholder }]}>
      {label}
    </Text>
    <Text style={[styles.infoValue, { color: colors.text }, valueStyle]}>
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  card: {
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  divider: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  rateButton: {
    marginBottom: 16,
  },
  ratingStars: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  star: {
    fontSize: 40,
    marginHorizontal: 4,
  },
  input: {
    marginBottom: 16,
  },
  ratingActions: {
    gap: 8,
  },
  submitButton: {
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 14,
    marginTop: 8,
  },
  errorState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 18,
    marginBottom: 16,
  },
  backButton: {
    marginTop: 16,
  },
});