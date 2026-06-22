import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import { RootStackParamList, Quote } from '../types';
import { useTasks } from '../context/TaskContext';
import { fetchRandomQuote } from '../services/api';
import { COLORS, SPACING, RADIUS, SHADOW } from '../components/theme';
import { formatDate } from '../utils/helpers';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskDetail'>;
type Nav = NativeStackNavigationProp<RootStackParamList>;

export function TaskDetailScreen({ route }: Props) {
  const { taskId } = route.params;
  const navigation = useNavigation<Nav>();
  const { getTaskById, toggleTask, deleteTask } = useTasks();

  const task = getTaskById(taskId);

  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(true);

  // Fetch motivational quote from public API
  useEffect(() => {
    fetchRandomQuote()
      .then(setQuote)
      .catch(() => setQuote(null))
      .finally(() => setQuoteLoading(false));
  }, []);

  const handleDelete = useCallback(() => {
    Alert.alert(
      'Delete Task',
      `Are you sure you want to delete "${task?.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteTask(taskId);
            navigation.goBack();
          },
        },
      ],
    );
  }, [task, taskId, deleteTask, navigation]);

  if (!task) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text style={styles.notFound}>Task not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isCompleted = task.status === 'completed';

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Status badge */}
        <View style={styles.statusRow}>
          <View style={[styles.statusBadge, isCompleted ? styles.statusDone : styles.statusPending]}>
            <View style={[styles.statusDot, isCompleted ? styles.dotDone : styles.dotPending]} />
            <Text style={[styles.statusText, isCompleted ? styles.statusTextDone : styles.statusTextPending]}>
              {isCompleted ? 'Completed' : 'Pending'}
            </Text>
          </View>
          <Text style={styles.dateText}>Created {formatDate(task.createdAt)}</Text>
        </View>

        {/* Title */}
        <Text style={[styles.title, isCompleted && styles.titleDone]}>
          {task.title}
        </Text>

        {/* Description card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Description</Text>
          <Text style={styles.description}>
            {task.description.length > 0 ? task.description : 'No description provided.'}
          </Text>
        </View>

        {/* Motivational quote (from public API) */}
        <View style={styles.quoteCard}>
          <Text style={styles.quoteLabel}>✨ Daily Inspiration</Text>
          {quoteLoading ? (
            <ActivityIndicator color={COLORS.primary} style={{ marginTop: SPACING.sm }} />
          ) : quote ? (
            <>
              <Text style={styles.quoteContent}>"{quote.content}"</Text>
              <Text style={styles.quoteAuthor}>— {quote.author}</Text>
            </>
          ) : (
            <Text style={styles.quoteContent}>Keep going — one task at a time!</Text>
          )}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionBtn, isCompleted ? styles.btnUndone : styles.btnDone]}
            onPress={() => toggleTask(taskId)}
            activeOpacity={0.85}
          >
            <Text style={styles.actionBtnText}>
              {isCompleted ? '↩ Mark as Pending' : '✓ Mark as Complete'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => navigation.navigate('AddEditTask', { taskId })}
            activeOpacity={0.85}
          >
            <Text style={styles.editBtnText}>✏️ Edit Task</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={handleDelete}
            activeOpacity={0.85}
          >
            <Text style={styles.deleteBtnText}>🗑 Delete Task</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFound: {
    color: COLORS.text.secondary,
    fontSize: 16,
  },
  scroll: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
  },
  statusPending: {
    backgroundColor: COLORS.warningLight,
  },
  statusDone: {
    backgroundColor: COLORS.successLight,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotPending: {
    backgroundColor: COLORS.warning,
  },
  dotDone: {
    backgroundColor: COLORS.success,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  statusTextPending: {
    color: COLORS.warning,
  },
  statusTextDone: {
    color: COLORS.success,
  },
  dateText: {
    fontSize: 12,
    color: COLORS.text.muted,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.text.primary,
    lineHeight: 34,
    marginBottom: SPACING.lg,
    letterSpacing: -0.5,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: COLORS.text.muted,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOW.card,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: SPACING.sm,
  },
  description: {
    fontSize: 15,
    color: COLORS.text.secondary,
    lineHeight: 24,
  },
  quoteCard: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  quoteLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: SPACING.sm,
  },
  quoteContent: {
    fontSize: 14,
    color: COLORS.primaryDark,
    lineHeight: 22,
    fontStyle: 'italic',
    marginBottom: SPACING.xs,
  },
  quoteAuthor: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
    textAlign: 'right',
  },
  actions: {
    gap: SPACING.sm,
  },
  actionBtn: {
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  btnDone: {
    backgroundColor: COLORS.success,
  },
  btnUndone: {
    backgroundColor: COLORS.warning,
  },
  actionBtnText: {
    color: COLORS.text.inverse,
    fontSize: 16,
    fontWeight: '700',
  },
  editBtn: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    ...SHADOW.card,
  },
  editBtnText: {
    color: COLORS.text.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  deleteBtn: {
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    backgroundColor: COLORS.dangerLight,
  },
  deleteBtnText: {
    color: COLORS.danger,
    fontSize: 15,
    fontWeight: '600',
  },
});
