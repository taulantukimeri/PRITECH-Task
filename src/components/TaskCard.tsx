import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Task } from '../types';
import { COLORS, SPACING, RADIUS, SHADOW } from './theme';
import { formatDate } from '../utils/helpers';

interface Props {
  task: Task;
  onPress: () => void;
  onToggle: () => void;
  onDelete: () => void;
}

export function TaskCard({ task, onPress, onToggle, onDelete }: Props) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  const isCompleted = task.status === 'completed';

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        {/* Left accent bar */}
        <View style={[styles.accent, isCompleted && styles.accentDone]} />

        {/* Checkbox */}
        <TouchableOpacity
          style={[styles.checkbox, isCompleted && styles.checkboxDone]}
          onPress={onToggle}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          {isCompleted && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>

        {/* Content */}
        <View style={styles.content}>
          <Text
            style={[styles.title, isCompleted && styles.titleDone]}
            numberOfLines={1}
          >
            {task.title}
          </Text>
          {task.description.length > 0 && (
            <Text style={styles.description} numberOfLines={2}>
              {task.description}
            </Text>
          )}
          <View style={styles.footer}>
            <View style={[styles.badge, isCompleted ? styles.badgeDone : styles.badgePending]}>
              <Text style={[styles.badgeText, isCompleted ? styles.badgeTextDone : styles.badgeTextPending]}>
                {isCompleted ? 'Completed' : 'Pending'}
              </Text>
            </View>
            <Text style={styles.date}>{formatDate(task.createdAt)}</Text>
          </View>
        </View>

        {/* Delete button */}
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={onDelete}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.deleteIcon}>🗑</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: SPACING.sm + 2,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    ...SHADOW.card,
  },
  accent: {
    width: 4,
    alignSelf: 'stretch',
    backgroundColor: COLORS.primary,
  },
  accentDone: {
    backgroundColor: COLORS.success,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: RADIUS.full,
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginHorizontal: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  checkmark: {
    color: COLORS.text.inverse,
    fontSize: 13,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    paddingVertical: SPACING.md,
    paddingRight: SPACING.sm,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 3,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: COLORS.text.muted,
  },
  description: {
    fontSize: 13,
    color: COLORS.text.secondary,
    lineHeight: 18,
    marginBottom: SPACING.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  badgePending: {
    backgroundColor: COLORS.warningLight,
  },
  badgeDone: {
    backgroundColor: COLORS.successLight,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  badgeTextPending: {
    color: COLORS.warning,
  },
  badgeTextDone: {
    color: COLORS.success,
  },
  date: {
    fontSize: 11,
    color: COLORS.text.muted,
  },
  deleteBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  deleteIcon: {
    fontSize: 16,
  },
});
