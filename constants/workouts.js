// Built-in workout presets. These are never persisted; selecting one just seeds
// the configure screen. Hitting "Save" there creates an editable custom copy.
//
// Times are in seconds. Schema matches custom workouts in storage:
//   { id, name, icon, colorScheme, sets, reps, hangTime, repRest, setRest }

export const BUILTIN_WORKOUTS = [
  {
    id: 'maxhangs',
    name: 'Max Hangs',
    icon: 'flame',
    colorScheme: 'blue',
    mode: 'basic',
    sets: 5,
    reps: 1,
    hangTime: 10,
    repRest: 0,
    setRest: 180,
  },
  {
    id: 'repeaters',
    name: 'Repeaters',
    icon: 'water',
    colorScheme: 'green',
    mode: 'basic',
    sets: 3,
    reps: 5,
    hangTime: 7,
    repRest: 5,
    setRest: 60,
  },
];

export const getBuiltinWorkout = (id) =>
  BUILTIN_WORKOUTS.find((w) => w.id === id) ?? null;

// The mode-specific fields to persist, from a WorkoutForm `values` object.
// The other mode's fields are set undefined so they drop out on save.
export const workoutFields = (values) =>
  values.mode === 'advanced'
    ? {
        mode: 'advanced',
        plan: values.plan,
        sets: undefined,
        reps: undefined,
        hangTime: undefined,
        repRest: undefined,
        setRest: undefined,
      }
    : {
        mode: 'basic',
        sets: values.sets,
        reps: values.reps,
        hangTime: values.hangTime,
        repRest: values.repRest,
        setRest: values.setRest,
        plan: undefined,
      };

// Blank workout used by the "new custom workout" screen.
export const EMPTY_WORKOUT = {
  id: null,
  name: '',
  icon: 'barbell',
  colorScheme: 'yellow',
  mode: 'basic',
  sets: 3,
  reps: 5,
  hangTime: 10,
  repRest: 5,
  setRest: 60,
};
