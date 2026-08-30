import { useCallback, useSyncExternalStore } from 'react';

import { getJSON, setJSON } from './storage';

/**
 * Minimal external store backed by AsyncStorage.
 * One instance per key, shared by every component that uses its hook, so all
 * screens stay in sync without a React context provider.
 */
export const createPersistentStore = (key, defaultValue) => {
  let state = defaultValue;
  let hydrated = false;
  const listeners = new Set();

  const emit = () => listeners.forEach((l) => l());

  const hydrate = async () => {
    state = await getJSON(key, defaultValue);
    hydrated = true;
    emit();
  };
  hydrate();

  const get = () => state;

  const set = (next) => {
    state = typeof next === 'function' ? next(state) : next;
    emit();
    setJSON(key, state);
  };

  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const useStore = () => {
    const value = useSyncExternalStore(subscribe, get, get);
    const isHydrated = useSyncExternalStore(subscribe, () => hydrated, () => hydrated);
    return [value, useCallback(set, []), isHydrated];
  };

  return { get, set, subscribe, useStore, hydrate };
};
