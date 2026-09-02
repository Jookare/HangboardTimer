import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import WorkoutForm from '@/components/WorkoutForm';
import CustomAlert from '@/components/ui/CustomAlert';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { useToast } from '@/components/ui/Toast';
import { palette } from '@/constants/common';
import { getBuiltinWorkout, workoutFields } from '@/constants/workouts';
import { useWorkouts } from '@/hooks/useWorkouts';

export default function ConfigureWorkoutScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const toast = useToast();
  const { get, update, remove, isHydrated } = useWorkouts();

  const builtin = getBuiltinWorkout(id);
  const custom = builtin ? null : get(id);
  const workout = builtin ?? custom;
  const isCustom = !!custom;

  const [name, setName] = useState('');
  const [removeVisible, setRemoveVisible] = useState(false);

  useEffect(() => {
    if (custom) setName(custom.name ?? '');
  }, [custom]);

  if (!workout) {
    return (
      <View style={styles.centered}>
        <Text style={styles.muted}>
          {isHydrated ? 'Workout not found.' : 'Loading…'}
        </Text>
      </View>
    );
  }

  const resolve = (values) => ({
    ...workout,
    id: String(id),
    name: values.name?.trim() || workout.name || 'Workout',
    ...workoutFields(values),
  });

  const startTimer = (values) => {
    router.push({
      pathname: '/workout/[id]/timer',
      params: { id: String(id), w: JSON.stringify(resolve(values)) },
    });
  };

  const save = (values) => {
    update(id, {
      name: values.name?.trim() || workout.name,
      ...workoutFields(values),
    });
    toast.show('Workout saved');
  };

  const confirmRemove = () => {
    remove(id);
    toast.show('Workout removed');
    router.dismissTo('/');
  };

  return (
    <>
      <Stack.Screen options={{ title: workout.name || 'Workout' }} />
      <WorkoutForm
        workout={workout}
        editableName={isCustom}
        name={isCustom ? name : workout.name}
        onChangeName={setName}
      >
        {(values) =>
          isCustom ? (
            <>
              <PrimaryButton
                label="Remove"
                icon="trash-outline"
                variant="outline"
                onPress={() => setRemoveVisible(true)}
              />
              <PrimaryButton label="Start" icon="play" onPress={() => startTimer(values)} />
              <PrimaryButton
                label="Save"
                icon="save-outline"
                variant="outline"
                onPress={() => save(values)}
              />
            </>
          ) : (
            <PrimaryButton label="Start Now" icon="play" onPress={() => startTimer(values)} />
          )
        }
      </WorkoutForm>

      <CustomAlert
        visible={removeVisible}
        setVisible={setRemoveVisible}
        onConfirm={confirmRemove}
        title="Remove workout"
        message={`Remove “${workout.name}” from your custom workouts?`}
        confirmLabel="Remove"
      />
    </>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    backgroundColor: palette.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  muted: {
    color: palette.subtitle,
  },
});
