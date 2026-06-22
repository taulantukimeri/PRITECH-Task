import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import { RootStackParamList } from '../types';
import { useTasks } from '../context/TaskContext';
import { COLORS, SPACING, RADIUS, SHADOW } from '../components/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'AddEditTask'>;

const MIN_TITLE_LENGTH = 3;
const MAX_TITLE_LENGTH = 80;
const MAX_DESC_LENGTH = 300;

export function AddEditTaskScreen({ route }: Props) {
  const { taskId } = route.params ?? {};
  const navigation = useNavigation();
  const { getTaskById, addTask, updateTask } = useTasks();

  const existingTask = taskId ? getTaskById(taskId) : undefined;
  const isEditing = !!existingTask;

  const [title, setTitle] = useState(existingTask?.title ?? '');
  const [description, setDescription] = useState(existingTask?.description ?? '');
  const [titleError, setTitleError] = useState('');
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    navigation.setOptions({ title: isEditing ? 'Edit Task' : 'New Task' });
  }, [isEditing, navigation]);

  const validateTitle = (value: string): string => {
    if (value.trim().length === 0) return 'Title is required.';
    if (value.trim().length < MIN_TITLE_LENGTH)
      return `Title must be at least ${MIN_TITLE_LENGTH} characters.`;
    return '';
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (touched) setTitleError(validateTitle(value));
  };

  const handleSave = () => {
    setTouched(true);
    const error = validateTitle(title);
    if (error) {
      setTitleError(error);
      return;
    }

    if (isEditing && existingTask) {
      updateTask({ ...existingTask, title: title.trim(), description: description.trim() });
    } else {
      addTask(title.trim(), description.trim());
    }

    navigation.goBack();
  };

  const handleDiscard = () => {
    const hasChanges =
      title !== (existingTask?.title ?? '') ||
      description !== (existingTask?.description ?? '');

    if (!hasChanges) {
      navigation.goBack();
      return;
    }

    Alert.alert('Discard changes?', 'Your unsaved changes will be lost.', [
      { text: 'Keep editing', style: 'cancel' },
      { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() },
    ]);
  };

  const isValid = validateTitle(title) === '';
  const titleCharsLeft = MAX_TITLE_LENGTH - title.length;
  const descCharsLeft = MAX_DESC_LENGTH - description.length;

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={88}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Title field */}
          <View style={styles.fieldGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>
                Title <Text style={styles.required}>*</Text>
              </Text>
              <Text style={[styles.counter, titleCharsLeft < 10 && styles.counterWarn]}>
                {titleCharsLeft} left
              </Text>
            </View>
            <TextInput
              style={[styles.input, titleError ? styles.inputError : null]}
              value={title}
              onChangeText={handleTitleChange}
              onBlur={() => {
                setTouched(true);
                setTitleError(validateTitle(title));
              }}
              placeholder="What needs to be done?"
              placeholderTextColor={COLORS.text.muted}
              maxLength={MAX_TITLE_LENGTH}
              returnKeyType="next"
              autoFocus={!isEditing}
            />
            {titleError ? (
              <Text style={styles.errorText}>⚠ {titleError}</Text>
            ) : null}
          </View>

          {/* Description field */}
          <View style={styles.fieldGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Description</Text>
              <Text style={[styles.counter, descCharsLeft < 30 && styles.counterWarn]}>
                {descCharsLeft} left
              </Text>
            </View>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={(v) =>
                v.length <= MAX_DESC_LENGTH && setDescription(v)
              }
              placeholder="Add details, notes, or context..."
              placeholderTextColor={COLORS.text.muted}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              maxLength={MAX_DESC_LENGTH}
            />
          </View>

          {/* Buttons */}
          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.saveBtn, !isValid && styles.saveBtnDisabled]}
              onPress={handleSave}
              activeOpacity={0.85}
            >
              <Text style={styles.saveBtnText}>
                {isEditing ? '✓ Save Changes' : '+ Add Task'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={handleDiscard}
              activeOpacity={0.75}
            >
              <Text style={styles.cancelBtnText}>Discard</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  fieldGroup: {
    marginBottom: SPACING.lg,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  required: {
    color: COLORS.danger,
  },
  counter: {
    fontSize: 12,
    color: COLORS.text.muted,
  },
  counterWarn: {
    color: COLORS.warning,
    fontWeight: '600',
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: 15,
    color: COLORS.text.primary,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    ...SHADOW.card,
  },
  inputError: {
    borderColor: COLORS.danger,
    backgroundColor: COLORS.dangerLight,
  },
  textArea: {
    minHeight: 120,
    paddingTop: SPACING.md,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 13,
    marginTop: SPACING.xs + 2,
    fontWeight: '500',
  },
  buttons: {
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md + 2,
    alignItems: 'center',
    ...SHADOW.fab,
  },
  saveBtnDisabled: {
    backgroundColor: COLORS.text.muted,
    shadowOpacity: 0,
    elevation: 0,
  },
  saveBtnText: {
    color: COLORS.text.inverse,
    fontSize: 16,
    fontWeight: '700',
  },
  cancelBtn: {
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: COLORS.text.secondary,
    fontSize: 15,
    fontWeight: '500',
  },
});
