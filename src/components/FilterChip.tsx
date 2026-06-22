import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { FilterStatus } from '../types';
import { COLORS, SPACING, RADIUS } from './theme';

interface FilterOption {
  label: string;
  value: FilterStatus;
  count: number;
}

interface Props {
  active: FilterStatus;
  counts: { all: number; pending: number; completed: number };
  onChange: (filter: FilterStatus) => void;
}

const OPTIONS: Omit<FilterOption, 'count'>[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Done', value: 'completed' },
];

export function FilterChips({ active, counts, onChange }: Props) {
  return (
    <View style={styles.row}>
      {OPTIONS.map((opt) => {
        const isActive = active === opt.value;
        const count = counts[opt.value];
        return (
          <TouchableOpacity
            key={opt.value}
            style={[styles.chip, isActive && styles.chipActive]}
            onPress={() => onChange(opt.value)}
            activeOpacity={0.75}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {opt.label}
            </Text>
            <View style={[styles.badge, isActive && styles.badgeActive]}>
              <Text style={[styles.badgeText, isActive && styles.badgeTextActive]}>
                {count}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.xs + 2,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text.secondary,
  },
  labelActive: {
    color: COLORS.text.inverse,
  },
  badge: {
    backgroundColor: COLORS.border,
    borderRadius: RADIUS.full,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  badgeActive: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.text.secondary,
  },
  badgeTextActive: {
    color: COLORS.text.inverse,
  },
});
