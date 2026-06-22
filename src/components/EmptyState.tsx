import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOW } from './theme';
import { fetchTaskSuggestion } from '../services/api';

interface Props {
  isFiltered: boolean;
  onAddSuggestion?: (title: string) => void;
}

export function EmptyState({ isFiltered, onAddSuggestion }: Props) {
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isFiltered) return;
    setLoading(true);
    fetchTaskSuggestion()
      .then((s) => setSuggestion(s.title))
      .catch(() => setSuggestion(null))
      .finally(() => setLoading(false));
  }, [isFiltered]);

  const refresh = () => {
    setLoading(true);
    setSuggestion(null);
    fetchTaskSuggestion()
      .then((s) => setSuggestion(s.title))
      .catch(() => setSuggestion(null))
      .finally(() => setLoading(false));
  };

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

      {/* Task suggestion from public API — only when list is truly empty */}
      {!isFiltered && (
        <View style={styles.suggestionCard}>
          <Text style={styles.suggestionLabel}>💡 Need inspiration?</Text>
          {loading ? (
            <ActivityIndicator color={COLORS.primary} style={{ marginVertical: SPACING.sm }} />
          ) : suggestion ? (
            <>
              <Text style={styles.suggestionText}>{suggestion}</Text>
              <View style={styles.suggestionActions}>
                <TouchableOpacity
                  style={styles.addBtn}
                  onPress={() => onAddSuggestion?.(suggestion)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.addBtnText}>+ Add as Task</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={refresh} style={styles.refreshBtn} activeOpacity={0.7}>
                  <Text style={styles.refreshText}>🔄 Another</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <TouchableOpacity onPress={refresh}>
              <Text style={styles.retryText}>Tap to load a suggestion</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
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
    marginBottom: SPACING.lg,
  },
  suggestionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    width: '100%',
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
    ...SHADOW.card,
  },
  suggestionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: SPACING.sm,
  },
  suggestionText: {
    fontSize: 15,
    color: COLORS.text.primary,
    fontWeight: '500',
    lineHeight: 22,
    marginBottom: SPACING.md,
  },
  suggestionActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  addBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.sm,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
  },
  addBtnText: {
    color: COLORS.text.inverse,
    fontSize: 14,
    fontWeight: '700',
  },
  refreshBtn: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.sm,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshText: {
    fontSize: 13,
    color: COLORS.text.secondary,
  },
  retryText: {
    fontSize: 13,
    color: COLORS.primary,
    textAlign: 'center',
    paddingVertical: SPACING.sm,
  },
});
