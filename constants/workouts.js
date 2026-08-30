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
    sets: 3,
    reps: 5,
    hangTime: 7,
    repRest: 5,
    setRest: 60,
  },
];

export const getBuiltinWorkout = (id) =>
  BUILTIN_WORKOUTS.find((w) => w.id === id) ?? null;

// Blank workout used by the "new custom workout" screen.
export const EMPTY_WORKOUT = {
  id: null,
  name: '',
  icon: 'barbell',
  colorScheme: 'yellow',
  sets: 3,
  reps: 5,
  hangTime: 10,
  repRest: 5,
  setRest: 60,
};
