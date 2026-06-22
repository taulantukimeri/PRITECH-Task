import React, { useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import { RootStackParamList } from '../types';
import { useTasks } from '../context/TaskContext';
import { TaskCard } from '../components/TaskCard';
import { EmptyState } from '../components/EmptyState';
import { SearchBar } from '../components/SearchBar';
import { FilterChips } from '../components/FilterChip';
import { COLORS, SPACING, RADIUS } from '../components/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'TaskList'>;

export function TaskListScreen() {
  const navigation = useNavigation<Nav>();
  const {
    tasks,
    filteredTasks,
    filter,
    search,
    loading,
    addTask,
    toggleTask,
    deleteTask,
    setFilter,
    setSearch,
  } = useTasks();

  const counts = useMemo(
    () => ({
      all: tasks.length,
      pending: tasks.filter((t) => t.status === 'pending').length,
      completed: tasks.filter((t) => t.status === 'completed').length,
    }),
    [tasks],
  );

  const isFiltered = search.length > 0 || filter !== 'all';

  const handleAddSuggestion = (title: string) => {
    addTask(title, '');
  };

  const renderTask = ({ item }: { item: Task }) => (
    <TaskCard
      task={item}
      onPress={() => navigation.navigate('TaskDetail', { taskId: item.id })}
      onToggle={() => toggleTask(item.id)}
      onDelete={() => deleteTask(item.id)}
    />
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>TaskFlow</Text>
          <Text style={styles.headerSub}>
            {counts.completed} of {counts.all} tasks complete
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('AddEditTask', {})}
          activeOpacity={0.85}
        >
          <Text style={styles.addBtnIcon}>+</Text>
          <Text style={styles.addBtnLabel}>New Task</Text>
        </TouchableOpacity>
      </View>

      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressBar,
            {
              width: counts.all > 0
                ? `${(counts.completed / counts.all) * 100}%`
                : '0%',
            },
          ]}
        />
      </View>

      {/* Search + Filters */}
      <View style={styles.controls}>
        <SearchBar value={search} onChangeText={setSearch} />
        <View style={styles.filtersRow}>
          <FilterChips active={filter} counts={counts} onChange={setFilter} />
        </View>
      </View>

      {/* Task list */}
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTask}
        contentContainerStyle={[
          styles.list,
          filteredTasks.length === 0 && styles.listEmpty,
        ]}
        ListEmptyComponent={
          <EmptyState
            isFiltered={isFiltered}
            onAddSuggestion={handleAddSuggestion}
          />
        }
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.text.inverse,
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  addBtnIcon: {
    fontSize: 22,
    color: COLORS.text.inverse,
    fontWeight: '400',
    lineHeight: 24,
    textAlign: 'center',
  },
  addBtnLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text.inverse,
  },
  progressContainer: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: SPACING.lg,
    borderRadius: RADIUS.full,
    marginBottom: SPACING.md,
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: RADIUS.full,
  },
  controls: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    paddingTop: SPACING.lg,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
    gap: SPACING.md,
  },
  filtersRow: {
    flexDirection: 'row',
  },
  list: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xxl,
    backgroundColor: COLORS.background,
    flexGrow: 1,
  },
  listEmpty: {
    flex: 1,
  },
});
