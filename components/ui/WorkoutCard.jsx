import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { getColorScheme, palette, shadows } from '@/constants/common';

/**
 * Workout card used on the Home screen.
 * - `add`        renders the "Add workout" call-to-action
 * - `layout`     "column" (built-in grid) or "row" (custom list)
 */
const WorkoutCard = ({ workout, add = false, layout = 'column', onPress }) => {
  const isRow = layout === 'row' || add;
  const scheme = getColorScheme(add ? 'dark' : workout?.colorScheme);
  const iconName = add ? 'add' : workout?.icon || 'barbell';

  const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;
  const details = [];
  if (!add) {
    if (workout?.sets) details.push(plural(workout.sets, 'set'));
    if (workout?.reps) details.push(plural(workout.reps, 'rep'));
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.card,
        { borderColor: scheme.border, backgroundColor: scheme.background },
        isRow ? styles.rowCard : styles.columnCard,
      ]}
    >
      <View style={[styles.iconBox, isRow && { marginRight: 16 }]}>
        <Ionicons name={iconName} size={isRow ? 22 : 24} color={palette.black} />
      </View>

      <View style={isRow ? styles.rowInfo : undefined}>
        <Text style={styles.title} numberOfLines={1}>
          {add ? 'Add workout' : workout?.name || 'Untitled workout'}
        </Text>
        {details.length > 0 && (
          <Text style={[styles.details, { color: scheme.subtitleColor }]}>
            {details.join('  ·  ')}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderLeftWidth: 6,
    borderTopEndRadius: 15,
    borderBottomEndRadius: 15,
    padding: 12,
    ...shadows.small,
  },
  columnCard: {
    flex: 1,
    flexDirection: 'column',
    gap: 8,
  },
  rowCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowInfo: {
    flex: 1,
  },
  iconBox: {
    backgroundColor: palette.white,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    ...shadows.small,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: palette.black,
    marginBottom: 2,
  },
  details: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default WorkoutCard;
