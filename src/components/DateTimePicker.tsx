/**
 * Date and Time Picker component
 * Updated with calendar picker and time dropdown
 */

import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import React, { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Button, Menu, Text } from 'react-native-paper';
import { useTheme } from '../hooks/useTheme';

interface DateTimePickerProps {
  date: string;
  time: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
}

const AVAILABLE_TIMES = [
  '08:30',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '16:30',
];

const TIME_LABELS: Record<string, string> = {
  '08:30': '8:30 AM',
  '09:00': '9:00 AM',
  '10:00': '10:00 AM',
  '11:00': '11:00 AM',
  '12:00': '12:00 PM',
  '13:00': '1:00 PM',
  '14:00': '2:00 PM',
  '15:00': '3:00 PM',
  '16:00': '4:00 PM',
  '16:30': '4:30 PM',
};

export const DateTimePickerComponent: React.FC<DateTimePickerProps> = ({
  date,
  time,
  onDateChange,
  onTimeChange,
}) => {
  const { colors } = useTheme();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimeMenu, setShowTimeMenu] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(
    date ? new Date(date) : new Date()
  );

  const handleDateChange = (event: any, selected?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selected) {
      setSelectedDate(selected);
      const formattedDate = format(selected, 'yyyy-MM-dd');
      onDateChange(formattedDate);
    }
  };

  const handleTimeSelect = (selectedTime: string) => {
    onTimeChange(selectedTime);
    setShowTimeMenu(false);
  };

  const getDisplayDate = () => {
    if (!date) return 'Select date';
    try {
      return format(new Date(date), 'MMM dd, yyyy');
    } catch {
      return 'Select date';
    }
  };

  const getDisplayTime = () => {
    if (!time) return 'Select time';
    return TIME_LABELS[time] || time;
  };

  return (
    <View style={styles.container}>
      {/* Date Picker */}
      <View style={styles.field}>
        <Text style={[styles.label, { color: colors.text }]}>Pickup Date</Text>
        <Button
          mode="outlined"
          onPress={() => setShowDatePicker(true)}
          style={[styles.button, { borderColor: colors.border }]}
          contentStyle={styles.buttonContent}
          icon="calendar"
        >
          {getDisplayDate()}
        </Button>
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}
      </View>

      {/* Time Picker */}
      <View style={styles.field}>
        <Text style={[styles.label, { color: colors.text }]}>Pickup Time</Text>
        <Menu
          visible={showTimeMenu}
          onDismiss={() => setShowTimeMenu(false)}
          contentStyle={styles.menuContent}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setShowTimeMenu(true)}
              style={[styles.button, { borderColor: colors.border }]}
              contentStyle={styles.buttonContent}
              icon="clock-outline"
            >
              {getDisplayTime()}
            </Button>
          }
        >
          {AVAILABLE_TIMES.map((availableTime) => (
            <Menu.Item
              key={availableTime}
              onPress={() => handleTimeSelect(availableTime)}
              title={TIME_LABELS[availableTime]}
            />
          ))}
        </Menu>
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
  button: {
    width: '100%',
    justifyContent: 'flex-start',
  },
  buttonContent: {
    width: '100%',
    justifyContent: 'flex-start',
  },
  menuContent: {
    width: '90%',
    maxWidth: 400,
  },
});