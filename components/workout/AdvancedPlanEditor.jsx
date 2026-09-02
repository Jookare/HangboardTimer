import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import PlanSetCard from '@/components/workout/PlanSetCard';
import { palette } from '@/constants/common';

const cloneSet = (set) => ({
  reps: set.reps.map((r) => ({ ...r })),
  setRest: set.setRest,
});

/**
 * Editor for an advanced `plan`: an ordered list of sets, each with per-rep
 * hang + rest. `plan` is `{ reps:[{hang,rest}], setRest }[]`.
 */
const AdvancedPlanEditor = ({ plan, onChange }) => {
  const replaceSet = (si, next) =>
    onChange(plan.map((s, i) => (i === si ? next : s)));

  const duplicateSet = (si) => {
    const copy = cloneSet(plan[si]);
    onChange([...plan.slice(0, si + 1),  ...plan.slice(si + 1), copy]);
  };

  const deleteSet = (si) =>
    plan.length > 1 && onChange(plan.filter((_, i) => i !== si));

  const addSet = () => onChange([...plan, cloneSet(plan[plan.length - 1])]);

  return (
    <View style={styles.wrap}>
      {plan.map((set, si) => (
        <PlanSetCard
          key={si}
          set={set}
          index={si}
          isLast={si === plan.length - 1}
          canDelete={plan.length > 1}
          onChange={(next) => replaceSet(si, next)}
          onDuplicate={() => duplicateSet(si)}
          onDelete={() => deleteSet(si)}
        />
      ))}

      <TouchableOpacity style={styles.addSet} onPress={addSet}>
        <Ionicons name="add" size={18} color={palette.dark} />
        <Text style={styles.addSetText}>Add set</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    gap: 12,
  },
  addSet: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.light,
    borderStyle: 'dashed',
  },
  addSetText: {
    fontSize: 15,
    fontWeight: '600',
    color: palette.dark,
  },
});

export default AdvancedPlanEditor;
