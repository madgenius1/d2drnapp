/**
 * DeliveryInstructionsForm Component
 * Form section for special instructions and delivery notes
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FileText, MapPin } from 'lucide-react-native';
import { useTheme } from '../../theme';
import Input from '../common/Input';

interface DeliveryInstructionsFormProps {
  specialInstructions: string;
  deliveryNotes: string;
  onSpecialInstructionsChange: (value: string) => void;
  onDeliveryNotesChange: (value: string) => void;
  errors?: {
    specialInstructions?: string;
    deliveryNotes?: string;
  };
  style?: any;
}

export default function DeliveryInstructionsForm({
  specialInstructions,
  deliveryNotes,
  onSpecialInstructionsChange,
  onDeliveryNotesChange,
  errors = {},
  style,
}: DeliveryInstructionsFormProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      <Text
        style={[
          styles.sectionTitle,
          {
            fontFamily: theme.fonts.semibold,
            color: theme.colors.text.primary,
          },
        ]}
      >
        Delivery Instructions
      </Text>

      <Text
        style={[
          styles.subtitle,
          {
            fontFamily: theme.fonts.regular,
            color: theme.colors.text.secondary,
          },
        ]}
      >
        Optional: Provide any special instructions for delivery
      </Text>

      <Input
        label="Special Instructions"
        placeholder="e.g., Call before delivery, Leave at gate, etc."
        value={specialInstructions}
        onChangeText={onSpecialInstructionsChange}
        error={errors.specialInstructions}
        leftIcon={FileText}
        multiline
        numberOfLines={3}
        style={styles.input}
      />

      <Input
        label="Delivery Notes"
        placeholder="e.g., Apartment number, Building name, Landmark..."
        value={deliveryNotes}
        onChangeText={onDeliveryNotesChange}
        error={errors.deliveryNotes}
        leftIcon={MapPin}
        multiline
        numberOfLines={3}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 8,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  input: {
    marginBottom: 16,
  },
});