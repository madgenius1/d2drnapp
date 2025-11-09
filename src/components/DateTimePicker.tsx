/**
 * Date and Time Picker component
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { useTheme } from '../hooks/useTheme';

interface DateTimePickerProps {
  date: string;
  time: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  date,
  time,
  onDateChange,
  onTimeChange,
}) => {
  const { colors } = useTheme();

  // Simple text input implementation
  // In production, use @react-native-community/datetimepicker
  return (
    <View style={styles.container}>
      <View style={styles.field}>
        <Text style={[styles.label, { color: colors.text }]}>Pickup Date</Text>
        <TextInput
          mode="outlined"
          value={date}
          onChangeText={onDateChange}
          placeholder="YYYY-MM-DD"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.field}>
        <Text style={[styles.label, { color: colors.text }]}>Pickup Time</Text>
        <TextInput
          mode="outlined"
          value={time}
          onChangeText={onTimeChange}
          placeholder="HH:MM"
          keyboardType="numeric"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
});