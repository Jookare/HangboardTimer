import { useCallback, useMemo } from 'react';

import { createPersistentStore } from '@/lib/createPersistentStore';
import { KEYS } from '@/lib/storage';

const store = createPersistentStore(KEYS.workouts, []);

const makeId = () =>
  `w-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export const useWorkouts = () => {
  const [workouts, set, isHydrated] = store.useStore();
  const list = useMemo(
    () => (Array.isArray(workouts) ? workouts : []),
    [workouts],
  );

  const get = useCallback((id) => list.find((w) => w.id === id) ?? null, [list]);

  const add = useCallback(
    (workout) => {
      const created = { ...workout, id: makeId() };
      set((prev) => [...(prev || []), created]);
      return created;
    },
    [set],
  );

  const update = useCallback(
    (id, patch) =>
      set((prev) =>
        (prev || []).map((w) => (w.id === id ? { ...w, ...patch, id } : w)),
      ),
    [set],
  );

  const remove = useCallback(
    (id) => set((prev) => (prev || []).filter((w) => w.id !== id)),
    [set],
  );

  const clearAll = useCallback(() => set([]), [set]);

  return { workouts: list, isHydrated, get, add, update, remove, clearAll };
};
