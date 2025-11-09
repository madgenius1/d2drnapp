/**
 * Stop Picker component
 * Updated to use stop names (no indices displayed)
 */

import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Menu, Text } from 'react-native-paper';
import { useTheme } from '../hooks/useTheme';
import type { Route } from '../types';

interface StopPickerProps {
  route: Route | null;
  selectedStopName: string | null;
  onSelect: (stopName: string) => void;
  label?: string;
  disabled?: boolean;
  excludeStopName?: string | null;
}

export const StopPicker: React.FC<StopPickerProps> = ({
  route,
  selectedStopName,
  onSelect,
  label = 'Select Stop',
  disabled = false,
  excludeStopName = null,
}) => {
  const [visible, setVisible] = useState(false);
  const { colors } = useTheme();

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleSelect = (stopName: string) => {
    onSelect(stopName);
    closeMenu();
  };

  const availableStops = route?.stops.filter((s) => s !== excludeStopName) || [];

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <Button
            mode="outlined"
            onPress={openMenu}
            disabled={disabled || !route}
            style={[styles.button, { borderColor: colors.border }]}
            contentStyle={styles.buttonContent}
          >
            {selectedStopName || 'Choose a stop'}
          </Button>
        }
      >
        {availableStops.map((stopName) => (
          <Menu.Item
            key={stopName}
            onPress={() => handleSelect(stopName)}
            title={stopName}
          />
        ))}
      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  button: {
    justifyContent: 'flex-start',
  },
  buttonContent: {
    justifyContent: 'flex-start',
  },
});