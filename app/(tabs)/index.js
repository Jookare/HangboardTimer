import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import WorkoutCard from '@/components/ui/WorkoutCard';
import { palette } from '@/constants/common';
import { BUILTIN_WORKOUTS } from '@/constants/workouts';
import { useWorkouts } from '@/hooks/useWorkouts';

export default function HomeScreen() {
  const router = useRouter();
  const { workouts } = useWorkouts();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>
        <Text style={styles.title}>Hangboard Timer</Text>

        <View style={styles.builtInRow}>
          {BUILTIN_WORKOUTS.map((w) => (
            <WorkoutCard
              key={w.id}
              workout={w}
              layout="column"
              onPress={() => router.push(`/workout/${w.id}`)}
            />
          ))}
        </View>

        <WorkoutCard add onPress={() => router.push('/workout/new')} />

        <View style={styles.divider} />

        <ScrollView
          style={styles.customList}
          contentContainerStyle={styles.customContent}
          showsVerticalScrollIndicator={false}
        >
          {workouts.length === 0 ? (
            <Text style={styles.empty}>
              No custom workouts yet. Tap “Add workout” to create one.
            </Text>
          ) : (
            workouts.map((w) => (
              <WorkoutCard
                key={w.id}
                workout={w}
                layout="row"
                onPress={() => router.push(`/workout/${w.id}`)}
              />
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: palette.bg,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: palette.dark,
    marginBottom: 20,
  },
  builtInRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  divider: {
    height: 2,
    backgroundColor: palette.light,
    marginVertical: 16,
  },
  customList: {
    flex: 1,
  },
  customContent: {
    gap: 8,
    paddingBottom: 16,
  },
  empty: {
    color: palette.subtitle,
    fontSize: 15,
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 21,
  },
});
