import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING } from './theme';

interface Props {
  isFiltered: boolean;
}

export function EmptyState({ isFiltered }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{isFiltered ? '🔎' : '📋'}</Text>
      <Text style={styles.title}>
        {isFiltered ? 'No tasks found' : 'No tasks yet'}
      </Text>
      <Text style={styles.subtitle}>
        {isFiltered
          ? 'Try a different search or filter.'
          : 'Tap the + button to create your first task.'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xxl,
  },
  emoji: {
    fontSize: 56,
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
