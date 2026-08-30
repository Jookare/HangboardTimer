import { useRouter } from 'expo-router';
import { useState } from 'react';

import WorkoutForm from '@/components/WorkoutForm';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { useToast } from '@/components/ui/Toast';
import { EMPTY_WORKOUT } from '@/constants/workouts';
import { useWorkouts } from '@/hooks/useWorkouts';

export default function NewWorkoutScreen() {
  const router = useRouter();
  const toast = useToast();
  const { add } = useWorkouts();
  const [name, setName] = useState('');

  const save = (values) => {
    add({
      ...EMPTY_WORKOUT,
      name: values.name?.trim() || 'New workout',
      sets: values.sets,
      reps: values.reps,
      hangTime: values.hangTime,
      repRest: values.repRest,
      setRest: values.setRest,
    });
    toast.show('Workout created');
    router.dismissTo('/');
  };

  const startNow = (values) => {
    router.push({
      pathname: '/workout/[id]/timer',
      params: {
        id: 'preview',
        name: values.name?.trim() || 'Workout',
        sets: values.sets,
        reps: values.reps,
        hangTime: values.hangTime,
        repRest: values.repRest,
        setRest: values.setRest,
      },
    });
  };

  return (
    <WorkoutForm
      workout={EMPTY_WORKOUT}
      editableName
      name={name}
      onChangeName={setName}
    >
      {(values) => (
        <>
          <PrimaryButton
            label="Start"
            icon="play"
            variant="outline"
            onPress={() => startNow(values)}
          />
          <PrimaryButton
            label="Save workout"
            icon="save-outline"
            onPress={() => save(values)}
          />
        </>
      )}
    </WorkoutForm>
  );
}
