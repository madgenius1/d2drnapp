/**
 * Route Selector Component
 * Combined route and stop selection with validation
 */

import { MapPin } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRoutes } from '../../hooks/useRoutes';
import { useTheme } from '../../theme';
import type { Route, RouteStop } from '../../types';
import Dropdown from '../common/Dropdown';

interface RouteSelectorProps {
  label: string;
  routeValue: string;
  stopValue: string;
  onRouteChange: (routeId: string) => void;
  onStopChange: (stopId: string) => void;
  routeError?: string;
  stopError?: string;
  disabled?: boolean;
  style?: object;
}

export default function RouteSelector({
  label,
  routeValue,
  stopValue,
  onRouteChange,
  onStopChange,
  routeError,
  stopError,
  disabled = false,
  style,
}: RouteSelectorProps) {
  const theme = useTheme();
  const { routes, getStopsForRoute } = useRoutes();

  const stopOptions = routeValue ? getStopsForRoute(routeValue) : [];

  return (
    <View style={style}>
      {/* Section Header */}
      <View style={styles.header}>
        <MapPin size={20} color={theme.colors.primary} strokeWidth={1.5} />
        <Text
          style={[
            styles.headerText,
            {
              color: theme.colors.text.primary,
              fontFamily: 'Quicksand-SemiBold',
            },
          ]}
        >
          {label}
        </Text>
      </View>

      {/* Route Dropdown */}
      <Dropdown
        label="Route"
        placeholder="Select route"
        value={routeValue}
        onSelect={onRouteChange}
        options={routes}
        error={routeError}
        disabled={disabled}
        keyExtractor={(item: Route) => item.id}
        renderItem={(item: Route) => item.name}
        style={styles.dropdown}
      />

      {/* Stop Dropdown */}
      <Dropdown
        label="Stop"
        placeholder="Select stop"
        value={stopValue}
        onSelect={onStopChange}
        options={stopOptions}
        error={stopError}
        disabled={disabled || !routeValue}
        keyExtractor={(item: RouteStop) => item.id}
        renderItem={(item: RouteStop) => item.name}
        style={styles.dropdown}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  dropdown: {
    marginBottom: 16,
  },
});