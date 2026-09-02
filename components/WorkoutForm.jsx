import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import TotalWorkoutTime from '@/components/TotalWorkoutTime';
import CounterControl from '@/components/ui/CounterControl';
import CustomAlert from '@/components/ui/CustomAlert';
import ModeToggle from '@/components/ui/ModeToggle';
import TimeControl from '@/components/ui/TimeControl';
import AdvancedPlanEditor from '@/components/workout/AdvancedPlanEditor';
import { palette, shadows } from '@/constants/common';
import { useEditableValue } from '@/hooks/useEditableValue';
import { flattenToBasic, planIsUniform, toAdvancedPlan } from '@/lib/stages';

const MAX_TIME = 3599;

/**
 * Sets / reps / times editor for the configure and "new workout" screens.
 * Owns the Basic ↔ Advanced choice. `children` is a render-prop given the live
 * values: `{ name, mode, sets, reps, hangTime, repRest, setRest, plan }`.
 */
const WorkoutForm = ({ workout, editableName = false, name, onChangeName, children }) => {
  const insets = useSafeAreaInsets();

  const [mode, setMode] = useState(workout.mode === 'advanced' ? 'advanced' : 'basic');
  const [plan, setPlan] = useState(() =>
    workout.mode === 'advanced' && Array.isArray(workout.plan)
      ? workout.plan
      : toAdvancedPlan(workout),
  );
  const [flattenConfirm, setFlattenConfirm] = useState(false);

  const sets = useEditableValue(workout.sets ?? 3, 1, 99);
  const reps = useEditableValue(workout.reps ?? 5, 1, 99);
  const hangTime = useEditableValue(workout.hangTime ?? 10, 1, MAX_TIME);
  const repRest = useEditableValue(workout.repRest ?? 5, 0, MAX_TIME);
  const setRest = useEditableValue(workout.setRest ?? 60, 0, MAX_TIME);

  const basicFields = {
    sets: sets.value,
    reps: reps.value,
    hangTime: hangTime.value,
    repRest: repRest.value,
    setRest: setRest.value,
  };

  const values =
    mode === 'advanced'
      ? { name, mode, plan }
      : { name, mode, ...basicFields };

  const resolvedWorkout =
    mode === 'advanced' ? { mode: 'advanced', plan } : { mode: 'basic', ...basicFields };

  const goAdvanced = () => {
    setPlan(toAdvancedPlan(basicFields));
    setMode('advanced');
  };

  const goBasic = () => {
    const flat = flattenToBasic(plan);
    sets.reset(flat.sets);
    reps.reset(flat.reps);
    hangTime.reset(flat.hangTime);
    repRest.reset(flat.repRest);
    setRest.reset(flat.setRest);
    setMode('basic');
  };

  const onModeChange = (next) => {
    if (next === mode) return;
    if (next === 'advanced') goAdvanced();
    else if (planIsUniform(plan)) goBasic();
    else setFlattenConfirm(true);
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

        <ModeToggle value={mode} onChange={onModeChange} />

        {mode === 'basic' ? (
          <>
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
          </>
        ) : (
          <AdvancedPlanEditor plan={plan} onChange={setPlan} />
        )}

        <TotalWorkoutTime workout={resolvedWorkout} />
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        {children(values)}
      </View>

      <CustomAlert
        visible={flattenConfirm}
        setVisible={setFlattenConfirm}
        onConfirm={goBasic}
        title="Switch to Basic?"
        message="Your per-rep hang and rest values will be flattened to a single value."
        confirmLabel="Switch"
      />
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
    borderTopWidth: 1,
    borderTopColor: palette.light,
    backgroundColor: palette.bg_light,
    alignItems: 'center',
  },
});

export default WorkoutForm;
