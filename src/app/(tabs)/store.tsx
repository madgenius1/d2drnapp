/**
 * Store tab screen - Shopping list feature
 */

import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    StyleSheet,
    View,
} from 'react-native';
import { Checkbox, IconButton, Text, TextInput } from 'react-native-paper';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useTheme } from '../../hooks/useTheme';

interface ShoppingItem {
  id: string;
  name: string;
  checked: boolean;
}

export default function StoreScreen() {
  const { colors } = useTheme();
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [newItem, setNewItem] = useState('');

  const handleAddItem = () => {
    if (!newItem.trim()) return;

    const item: ShoppingItem = {
      id: Date.now().toString(),
      name: newItem.trim(),
      checked: false,
    };

    setItems([...items, item]);
    setNewItem('');
  };

  const handleToggleItem = (id: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleClearCompleted = () => {
    const completed = items.filter((item) => item.checked).length;
    if (completed === 0) {
      Alert.alert('No Items', 'No completed items to clear.');
      return;
    }

    Alert.alert(
      'Clear Completed',
      `Remove ${completed} completed item${completed > 1 ? 's' : ''}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => setItems(items.filter((item) => !item.checked)),
        },
      ]
    );
  };

  const completedCount = items.filter((item) => item.checked).length;
  const totalCount = items.length;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Shopping List
        </Text>
        <Text style={[styles.subtitle, { color: colors.placeholder }]}>
          Create your shopping list for delivery
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          mode="outlined"
          value={newItem}
          onChangeText={setNewItem}
          placeholder="Add item..."
          style={styles.input}
          right={
            <TextInput.Icon
              icon="plus"
              onPress={handleAddItem}
              disabled={!newItem.trim()}
            />
          }
          onSubmitEditing={handleAddItem}
        />
      </View>

      {totalCount > 0 && (
        <View style={styles.stats}>
          <Text style={[styles.statsText, { color: colors.placeholder }]}>
            {completedCount} of {totalCount} completed
          </Text>
          {completedCount > 0 && (
            <Button
              variant="text"
              onPress={handleClearCompleted}
              compact
            >
              Clear Completed
            </Button>
          )}
        </View>
      )}

      {items.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyIcon, { color: colors.placeholder }]}>
            🛒
          </Text>
          <Text style={[styles.emptyText, { color: colors.placeholder }]}>
            Your shopping list is empty
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.placeholder }]}>
            Add items you'd like to purchase and have delivered
          </Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card style={styles.itemCard}>
              <View style={styles.itemContent}>
                <Checkbox
                  status={item.checked ? 'checked' : 'unchecked'}
                  onPress={() => handleToggleItem(item.id)}
                />
                <Text
                  style={[
                    styles.itemText,
                    { color: colors.text },
                    item.checked && styles.itemTextChecked,
                  ]}
                >
                  {item.name}
                </Text>
                <IconButton
                  icon="delete"
                  size={20}
                  onPress={() => handleDeleteItem(item.id)}
                />
              </View>
            </Card>
          )}
          contentContainerStyle={styles.list}
        />
      )}

      {items.length > 0 && (
        <View style={styles.actions}>
          <Card style={styles.discountCard}>
            <Text style={[styles.discountText, { color: colors.text }]}>
              💰 Bulk orders may qualify for discounts!
            </Text>
            <Text style={[styles.discountSubtext, { color: colors.placeholder }]}>
              Contact support for wholesale pricing
            </Text>
          </Card>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  inputContainer: {
    padding: 16,
    paddingTop: 8,
  },
  input: {
    flex: 1,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  statsText: {
    fontSize: 14,
  },
  list: {
    padding: 16,
    paddingTop: 8,
  },
  itemCard: {
    marginBottom: 8,
    padding: 8,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
  },
  itemTextChecked: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  actions: {
    padding: 16,
  },
  discountCard: {
    padding: 16,
    backgroundColor: 'rgba(9, 157, 21, 0.1)',
  },
  discountText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  discountSubtext: {
    fontSize: 12,
  },
});