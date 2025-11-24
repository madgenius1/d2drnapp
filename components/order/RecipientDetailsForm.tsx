/**
 * RecipientDetailsForm Component
 * Form section for recipient name and phone
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { User } from 'lucide-react-native';
import { useTheme } from '../../theme';
import Input from '../common/Input';
import PhoneInput from '../forms/PhoneInput';

interface RecipientDetailsFormProps {
  recipientName: string;
  recipientPhone: string;
  onRecipientNameChange: (value: string) => void;
  onRecipientPhoneChange: (value: string) => void;
  errors?: {
    recipientName?: string;
    recipientPhone?: string;
  };
  style?: any;
}

export default function RecipientDetailsForm({
  recipientName,
  recipientPhone,
  onRecipientNameChange,
  onRecipientPhoneChange,
  errors = {},
  style,
}: RecipientDetailsFormProps) {
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
        Recipient Details
      </Text>

      <Input
        label="Recipient Name*"
        placeholder="Enter recipient's full name"
        value={recipientName}
        onChangeText={onRecipientNameChange}
        error={errors.recipientName}
        leftIcon={User}
        autoCapitalize="words"
        style={styles.input}
      />

      <PhoneInput
        label="Recipient Phone*"
        value={recipientPhone}
        onChangeText={onRecipientPhoneChange}
        error={errors.recipientPhone}
        placeholder="07XX XXX XXX"
        autoFormat={true}
        style={styles.input}
      />

      <Text
        style={[
          styles.hint,
          {
            fontFamily: theme.fonts.regular,
            color: theme.colors.text.secondary,
          },
        ]}
      >
        We'll contact the recipient for delivery confirmation
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
    fontWeight: '600',
  },
  input: {
    marginBottom: 16,
  },
  hint: {
    fontSize: 14,
    marginTop: 4,
    lineHeight: 20,
  },
});