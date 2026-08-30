import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import CounterControl from '@/components/ui/CounterControl';
import TimeControl from '@/components/ui/TimeControl';
import TotalWorkoutTime from '@/components/TotalWorkoutTime';
import { palette, shadows } from '@/constants/common';
import { useEditableValue } from '@/hooks/useEditableValue';

const MAX_TIME = 3599;

/**
 * Shared sets / reps / times editor used by the configure and "new workout"
 * screens. `children` is a render-prop receiving the live values so the parent
 * can wire up its own Start / Save / Remove actions.
 */
const WorkoutForm = ({ workout, editableName = false, name, onChangeName, children }) => {
  const sets = useEditableValue(workout.sets, 1, 99);
  const reps = useEditableValue(workout.reps, 1, 99);
  const hangTime = useEditableValue(workout.hangTime, 1, MAX_TIME);
  const repRest = useEditableValue(workout.repRest, 0, MAX_TIME);
  const setRest = useEditableValue(workout.setRest, 0, MAX_TIME);

  const values = {
    name,
    sets: sets.value,
    reps: reps.value,
    hangTime: hangTime.value,
    repRest: repRest.value,
    setRest: setRest.value,
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {editableName ? (
          <View style={styles.nameRow}>
            <TextInput
              style={styles.nameInput}
              value={name}
              onChangeText={onChangeName}
              placeholder="Workout name"
              placeholderTextColor={palette.inactive}
            />
            <Ionicons name="pencil" size={20} color={palette.inactive} />
          </View>
        ) : (
          <Text style={styles.nameStatic}>{name}</Text>
        )}

        <View style={styles.setsRepsRow}>
          <CounterControl
            label="SETS"
            value={sets.value}
            onIncrease={() => sets.increment(1)}
            onDecrease={() => sets.decrement(1)}
          />
          <Ionicons name="close" size={22} color={palette.inactive} />
          <CounterControl
            label="REPS"
            value={reps.value}
            onIncrease={() => reps.increment(1)}
            onDecrease={() => reps.decrement(1)}
          />
        </View>

        <TimeControl
          label="Hang time"
          value={hangTime.value}
          onIncrease={() => hangTime.increment(1)}
          onDecrease={() => hangTime.decrement(1)}
          onSubmit={hangTime.handleSubmit}
        />
        <TimeControl
          label="Rest between reps"
          value={repRest.value}
          onIncrease={() => repRest.increment(1)}
          onDecrease={() => repRest.decrement(1)}
          onSubmit={repRest.handleSubmit}
        />
        <TimeControl
          label="Rest between sets"
          value={setRest.value}
          onIncrease={() => setRest.increment(1)}
          onDecrease={() => setRest.decrement(1)}
          onSubmit={setRest.handleSubmit}
        />

        <TotalWorkoutTime {...values} />
      </ScrollView>

      <View style={styles.footer}>{children(values)}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: palette.bg,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 16,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: palette.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    ...shadows.small,
  },
  nameInput: {
    flex: 1,
    height: 50,
    fontSize: 18,
    color: palette.dark,
  },
  nameStatic: {
    fontSize: 24,
    fontWeight: '700',
    color: palette.dark,
    textAlign: 'center',
  },
  setsRepsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: palette.light,
    backgroundColor: palette.bg_light,
    alignItems: 'center',
  },
});

export default WorkoutForm;
