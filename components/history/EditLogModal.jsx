import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { palette, shadows } from '@/constants/common';
import { formatDuration, hangsPlannedSeconds, plannedWorkoutSeconds } from '@/lib/time';

// Rebuild the derived fields of a log entry from an edited name + hang count.
const recompute = (entry, name, hangs) => {
  const reps = entry.reps || 1;
  const sets = Math.max(0, Math.floor(hangs / reps));
  const plannedTotal =
    entry.plannedSets != null ? entry.plannedSets * reps : entry.hangs ?? hangs;
  const partial = hangs < plannedTotal;

  let plannedSec;
  if (entry.hangTime != null) {
    plannedSec = partial
      ? hangsPlannedSeconds(entry, hangs)
      : plannedWorkoutSeconds({
          sets: entry.plannedSets ?? sets,
          reps,
          hangTime: entry.hangTime,
          repRest: entry.repRest ?? 0,
          setRest: entry.setRest ?? 0,
        });
  } else if (entry.hangs > 0) {
    plannedSec = Math.round(((entry.plannedSec || 0) * hangs) / entry.hangs);
  } else {
    plannedSec = entry.plannedSec || 0;
  }

  return { workoutName: name.trim() || entry.workoutName, hangs, sets, partial, plannedSec };
};

const EditLogModal = ({ entry, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [hangs, setHangs] = useState(1);

  useEffect(() => {
    if (entry) {
      setName(entry.workoutName || '');
      setHangs(Math.max(1, entry.hangs || (entry.sets || 1) * (entry.reps || 1)));
    }
  }, [entry]);

  if (!entry) return null;

  const patch = recompute(entry, name, hangs);
  const reps = entry.reps || 1;
  const preview = patch.partial
    ? `${hangs} hang${hangs === 1 ? '' : 's'} · ${formatDuration(patch.plannedSec)}`
    : `${patch.sets} × ${reps} · ${formatDuration(patch.plannedSec)}`;

  return (
    <Modal
      visible
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.card}>
          <Text style={styles.title}>Edit log entry</Text>

          <Text style={styles.label}>Workout</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Workout name"
            placeholderTextColor={palette.inactive}
          />

          <Text style={styles.label}>Hangs completed</Text>
          <View style={styles.stepper}>
            <Pressable
              style={styles.stepButton}
              onPress={() => setHangs((h) => Math.max(1, h - 1))}
            >
              <Ionicons name="remove" size={20} color={palette.dark} />
            </Pressable>
            <Text style={styles.stepValue}>{hangs}</Text>
            <Pressable style={styles.stepButton} onPress={() => setHangs((h) => h + 1)}>
              <Ionicons name="add" size={20} color={palette.dark} />
            </Pressable>
          </View>

          <Text style={styles.preview}>Shows as “{preview}”</Text>

          <View style={styles.buttonRow}>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.button,
                styles.cancel,
                { opacity: pressed ? 0.5 : 1 },
              ]}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                onSave(patch);
                onClose();
              }}
              style={({ pressed }) => [
                styles.button,
                styles.save,
                { opacity: pressed ? 0.5 : 1 },
              ]}
            >
              <Text style={styles.saveText}>Save</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: palette.white,
    padding: 20,
    borderRadius: 20,
    width: '100%',
    maxWidth: 420,
    ...shadows.large,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.dark,
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: palette.subtitle,
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    backgroundColor: palette.bg,
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 46,
    fontSize: 16,
    color: palette.dark,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: palette.bg,
    borderRadius: 10,
  },
  stepButton: {
    paddingVertical: 10,
    paddingHorizontal: 28,
  },
  stepValue: {
    fontSize: 20,
    fontWeight: '700',
    color: palette.dark,
  },
  preview: {
    fontSize: 13,
    color: palette.inactive,
    marginTop: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancel: {
    borderWidth: 1,
    borderColor: palette.light,
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: palette.dark,
  },
  save: {
    backgroundColor: palette.dark,
  },
  saveText: {
    fontSize: 15,
    fontWeight: '600',
    color: palette.white,
  },
});

export default EditLogModal;
