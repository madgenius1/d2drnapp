/**
 * Home tab screen
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../hooks/useOrders';
import { useTheme } from '../../hooks/useTheme';

export default function HomeScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();
  const { orders, loading } = useOrders({ userId: user?.uid || null });

  const stats = useMemo(() => {
    const scheduled = orders.filter((o) => o.status === 'scheduled').length;
    const pending = orders.filter((o) => 
      ['picked', 'onTheWay', 'dropped'].includes(o.status)
    ).length;
    const completed = orders.filter((o) => o.status === 'completed').length;

    return { scheduled, pending, completed, total: orders.length };
  }, [orders]);

  if (loading) {
    return <LoadingSpinner message="Loading..." />;
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: colors.text }]}>
          Hello! 👋
        </Text>
        <Text style={[styles.subtitle, { color: colors.placeholder }]}>
          Track and manage your deliveries
        </Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Card>
            <View style={styles.statContent}>
              <MaterialCommunityIcons
                name="calendar-clock"
                size={32}
                color={colors.primary}
              />
              <Text style={[styles.statNumber, { color: colors.text }]}>
                {stats.scheduled}
              </Text>
              <Text style={[styles.statLabel, { color: colors.placeholder }]}>
                Scheduled
              </Text>
            </View>
          </Card>
        </View>

        <View style={styles.statCard}>
          <Card>
            <View style={styles.statContent}>
              <MaterialCommunityIcons
                name="truck-delivery"
                size={32}
                color={colors.warning}
              />
              <Text style={[styles.statNumber, { color: colors.text }]}>
                {stats.pending}
              </Text>
              <Text style={[styles.statLabel, { color: colors.placeholder }]}>
                In Progress
              </Text>
            </View>
          </Card>
        </View>

        <View style={styles.statCard}>
          <Card>
            <View style={styles.statContent}>
              <MaterialCommunityIcons
                name="check-circle"
                size={32}
                color={colors.success}
              />
              <Text style={[styles.statNumber, { color: colors.text }]}>
                {stats.completed}
              </Text>
              <Text style={[styles.statLabel, { color: colors.placeholder }]}>
                Completed
              </Text>
            </View>
          </Card>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actions}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Quick Actions
        </Text>

        <Button
          onPress={() => router.push('/create-order')}
          icon="plus-circle"
          style={styles.actionButton}
        >
          Create New Order
        </Button>

        <Button
          onPress={() => router.push('/track-order')}
          icon="magnify"
          variant="outlined"
          style={styles.actionButton}
        >
          Track Order
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
    marginBottom: 24,
  },
  statCard: {
    width: '33.333%',
    paddingHorizontal: 8,
  },
  statContent: {
    alignItems: 'center',
    padding: 16,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  actions: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  actionButton: {
    marginBottom: 12,
  },
});