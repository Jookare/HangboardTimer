import AsyncStorage from '@react-native-async-storage/async-storage';

import { KEYS, getJSON, setJSON } from './storage';

const SCHEMA_VERSION = 1;

const ICONS = ['barbell', 'flame', 'water', 'fitness', 'pulse'];
const SCHEMES = ['yellow', 'blue', 'green', 'red', 'purple'];

// Old workout payload: { id: "#workoutN", name, values: [
//   sets, reps, hangMin, hangSec, repRestMin, repRestSec, setRestMin, setRestSec ] }
const fromLegacyWorkout = (legacy, index) => {
  const v = Array.isArray(legacy?.values) ? legacy.values : [];
  const num = (i) => Number(v[i]) || 0;
  return {
    id: legacy?.id || `migrated-${Date.now()}-${index}`,
    name: legacy?.name || `Workout ${index + 1}`,
    icon: ICONS[index % ICONS.length],
    colorScheme: SCHEMES[index % SCHEMES.length],
    sets: num(0) || 1,
    reps: num(1) || 1,
    hangTime: num(2) * 60 + num(3),
    repRest: num(4) * 60 + num(5),
    setRest: num(6) * 60 + num(7),
  };
};

/**
 * One-time migration of the pre-2.0 AsyncStorage layout:
 *   #workoutN  -> hbt.workouts[]
 *   @audio     -> hbt.settings.audioEnabled
 *   @preparation -> hbt.settings.prep
 * Old keys are left untouched (harmless) in case of rollback.
 */
export const runMigrations = async () => {
  const current = await getJSON(KEYS.schemaVersion, 0);
  if (current >= SCHEMA_VERSION) return;

  try {
    const keys = await AsyncStorage.getAllKeys();
    const legacyKeys = keys.filter((k) => k.startsWith('#'));

    if (legacyKeys.length > 0 && (await getJSON(KEYS.workouts)) == null) {
      const migrated = [];
      for (let i = 0; i < legacyKeys.length; i++) {
        try {
          const raw = await AsyncStorage.getItem(legacyKeys[i]);
          const parsed = raw != null ? JSON.parse(raw) : null;
          if (parsed) migrated.push(fromLegacyWorkout(parsed, i));
        } catch {
          // skip an unreadable legacy entry
        }
      }
      if (migrated.length > 0) await setJSON(KEYS.workouts, migrated);
    }

    if ((await getJSON(KEYS.settings)) == null) {
      const legacyAudio = keys.includes('@audio')
        ? await AsyncStorage.getItem('@audio')
        : null;
      const legacyPrep = keys.includes('@preparation')
        ? await AsyncStorage.getItem('@preparation')
        : null;
      const parse = (s, fallback) => {
        try {
          return s != null ? JSON.parse(s) : fallback;
        } catch {
          return fallback;
        }
      };
      await setJSON(KEYS.settings, {
        audioEnabled: !!parse(legacyAudio, false),
        prep: Number(parse(legacyPrep, 5)) || 5,
      });
    }
  } catch (e) {
    console.warn('migration failed', e);
  } finally {
    await setJSON(KEYS.schemaVersion, SCHEMA_VERSION);
  }
};
