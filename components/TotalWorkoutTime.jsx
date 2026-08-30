import { StyleSheet, Text, View } from 'react-native';

import { palette, shadows } from '@/constants/common';
import { formatDuration, plannedWorkoutSeconds } from '@/lib/time';

const TotalWorkoutTime = ({ sets, reps, hangTime, repRest, setRest }) => {
  const total = plannedWorkoutSeconds({ sets, reps, hangTime, repRest, setRest });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Total workout time</Text>
      <View style={styles.pill}>
        <Text style={styles.time}>{formatDuration(total)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: palette.subtitle,
  },
  pill: {
    backgroundColor: palette.white,
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 8,
    ...shadows.small,
  },
  time: {
    fontSize: 20,
    fontWeight: '700',
    color: palette.dark,
  },
});

export default TotalWorkoutTime;
