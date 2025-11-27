/**
 * Recipient Form Component
 * Form for entering recipient details
 */

import { Phone, User } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme';
import Input from '../common/Input';

interface RecipientFormProps {
  recipientName: string;
  recipientPhone: string;
  onNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  nameError?: string;
  phoneError?: string;
  disabled?: boolean;
  style?: object;
}

export default function RecipientForm({
  recipientName,
  recipientPhone,
  onNameChange,
  onPhoneChange,
  nameError,
  phoneError,
  disabled = false,
  style,
}: RecipientFormProps) {
  const theme = useTheme();

  return (
    <View style={style}>
      {/* Section Header */}
      <Text
        style={[
          styles.header,
          {
            color: theme.colors.text.primary,
            fontFamily: 'Quicksand-SemiBold',
          },
        ]}
      >
        Recipient Details
      </Text>

      {/* Recipient Name */}
      <Input
        label="Recipient Name"
        placeholder="Enter recipient's full name"
        value={recipientName}
        onChangeText={onNameChange}
        error={nameError}
        leftIcon={User}
        autoCapitalize="words"
        disabled={disabled}
        style={styles.input}
      />

      {/* Recipient Phone */}
      <Input
        label="Recipient Phone"
        placeholder="0712345678"
        value={recipientPhone}
        onChangeText={onPhoneChange}
        error={phoneError}
        leftIcon={Phone}
        keyboardType="phone-pad"
        disabled={disabled}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
});