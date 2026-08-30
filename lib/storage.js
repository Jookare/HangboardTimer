import AsyncStorage from '@react-native-async-storage/async-storage';

// All app data lives under a single namespace so migration / debugging is simple.
export const KEYS = {
  workouts: 'hbt.workouts',
  history: 'hbt.history',
  settings: 'hbt.settings',
  schemaVersion: 'hbt.schemaVersion',
};

export const getJSON = async (key, fallback = null) => {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw != null ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.warn(`storage: failed to read ${key}`, e);
    return fallback;
  }
};

export const setJSON = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`storage: failed to write ${key}`, e);
  }
};

export const removeKey = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.warn(`storage: failed to remove ${key}`, e);
  }
};
