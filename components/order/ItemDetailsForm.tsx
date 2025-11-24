/**
 * ItemDetailsForm Component
 * Form section for item description and fragile toggle
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Package } from 'lucide-react-native';
import { useTheme } from '../../theme';
import Input from '../common/Input';
import FragileToggle from './FragileToggle';

interface ItemDetailsFormProps {
  itemDescription: string;
  isFragile: boolean;
  onItemDescriptionChange: (value: string) => void;
  onFragileToggle: (value: boolean) => void;
  errors?: {
    itemDescription?: string;
  };
  style?: any;
}

export default function ItemDetailsForm({
  itemDescription,
  isFragile,
  onItemDescriptionChange,
  onFragileToggle,
  errors = {},
  style,
}: ItemDetailsFormProps) {
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
        Item Information
      </Text>

      <Input
        label="Item Description*"
        placeholder="e.g., Documents in sealed envelope, Electronics (Laptop), Groceries..."
        value={itemDescription}
        onChangeText={onItemDescriptionChange}
        error={errors.itemDescription}
        leftIcon={Package}
        multiline
        numberOfLines={4}
        style={styles.input}
      />

      <FragileToggle
        isFragile={isFragile}
        onToggle={onFragileToggle}
        style={[
          styles.fragileToggle,
          {
            backgroundColor: theme.colors.elevated,
            borderColor: theme.colors.border,
          },
        ]}
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
    marginBottom: 16,
    fontWeight: '600',
  },
  input: {
    marginBottom: 16,
  },
  fragileToggle: {
    borderWidth: 1,
  },
});