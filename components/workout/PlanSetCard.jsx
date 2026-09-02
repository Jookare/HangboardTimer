import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import MiniTimeField from '@/components/ui/MiniTimeField';
import { palette, shadows } from '@/constants/common';

const MAX_TIME = 3599;
const clampTime = (n) => Math.min(MAX_TIME, Math.max(0, Math.round(n)));

const PlanSetCard = ({ set, index, isLast, canDelete, onChange, onDuplicate, onDelete }) => {
  const reps = set.reps;

  const setReps = (next) => onChange({ ...set, reps: next });

  const updateRep = (ri, patch) =>
    setReps(reps.map((r, i) => (i === ri ? { ...r, ...patch } : r)));

  const addRep = () => setReps([...reps, { ...reps[reps.length - 1] }]);

  const removeRep = (ri) =>
    reps.length > 1 && setReps(reps.filter((_, i) => i !== ri));

  const applyToAll = (key) =>
    setReps(reps.map((r) => ({ ...r, [key]: reps[0][key] })));

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Set {index + 1}</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity hitSlop={8} onPress={onDuplicate}>
            <Ionicons name="copy-outline" size={18} color={palette.inactive} />
          </TouchableOpacity>
          {canDelete && (
            <TouchableOpacity hitSlop={8} onPress={onDelete}>
              <Ionicons name="trash-outline" size={18} color={palette.red} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.repHeader}>
        <Text style={[styles.colLabel, styles.repCol]} />
        <Text style={[styles.colLabel, styles.timeCol]}>HANG</Text>
        <Text style={[styles.colLabel, styles.timeCol]}>REST</Text>
        <View style={styles.removeCol} />
      </View>

      {reps.map((rep, ri) => (
        <View key={ri} style={styles.repRow}>
          <Text style={[styles.repIndex, styles.repCol]}>{ri + 1}</Text>
          <View style={styles.timeCol}>
            <MiniTimeField
              value={rep.hang}
              title={`Set ${index + 1} · rep ${ri + 1} hang`}
              onChange={(v) => updateRep(ri, { hang: clampTime(v) })}
            />
          </View>
          <View style={styles.timeCol}>
            {ri < reps.length - 1 ? (
              <MiniTimeField
                value={rep.rest}
                tint={palette.subtitle}
                title={`Set ${index + 1} · rest after rep ${ri + 1}`}
                onChange={(v) => updateRep(ri, { rest: clampTime(v) })}
              />
            ) : (
              <Text style={styles.dash}>—</Text>
            )}
          </View>
          <View style={styles.removeCol}>
            {reps.length > 1 && (
              <TouchableOpacity hitSlop={8} onPress={() => removeRep(ri)}>
                <Ionicons name="close" size={18} color={palette.inactive} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      ))}

      <View style={styles.helperRow}>
        <TouchableOpacity style={styles.helper} onPress={() => applyToAll('hang')}>
          <Text style={styles.helperText}>Same hang</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.helper} onPress={() => applyToAll('rest')}>
          <Text style={styles.helperText}>Same rest</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.helper, styles.addRep]} onPress={addRep}>
          <Ionicons name="add" size={16} color={palette.dark} />
          <Text style={styles.helperText}>Rep</Text>
        </TouchableOpacity>
      </View>

      {!isLast && (
        <View style={styles.setRestRow}>
          <Text style={styles.setRestLabel}>Rest after set</Text>
          <MiniTimeField
            value={set.setRest}
            title={`Rest after set ${index + 1}`}
            onChange={(v) => onChange({ ...set, setRest: clampTime(v) })}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.white,
    borderRadius: 14,
    padding: 14,
    gap: 10,
    ...shadows.small,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.dark,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  repHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: palette.inactive,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  repRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  repCol: {
    width: 28,
  },
  timeCol: {
    flex: 1,
    alignItems: 'center',
  },
  removeCol: {
    width: 28,
    alignItems: 'center',
  },
  repIndex: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.subtitle,
    textAlign: 'center',
  },
  dash: {
    color: palette.light,
    fontSize: 15,
  },
  helperRow: {
    flexDirection: 'row',
    gap: 8,
  },
  helper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: palette.bg,
  },
  addRep: {
    marginLeft: 'auto',
  },
  helperText: {
    fontSize: 12,
    fontWeight: '600',
    color: palette.dark,
  },
  setRestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: palette.light,
    paddingTop: 10,
  },
  setRestLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: palette.dark,
  },
});

export default PlanSetCard;
