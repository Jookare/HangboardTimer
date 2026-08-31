import { useCallback } from 'react';

import { createPersistentStore } from '@/lib/createPersistentStore';
import { KEYS } from '@/lib/storage';

const store = createPersistentStore(KEYS.history, []);

const makeId = () =>
  `h-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export const useHistory = () => {
  const [history, set, isHydrated] = store.useStore();
  const list = Array.isArray(history) ? history : [];

  // entry: { workoutName, sets, reps, plannedSec }
  const add = useCallback(
    (entry) => {
      const created = {
        ...entry,
        id: makeId(),
        completedAt: new Date().toISOString(),
      };
      set((prev) => [created, ...(prev || [])]);
      return created;
    },
    [set],
  );

  const remove = useCallback(
    (id) => set((prev) => (prev || []).filter((e) => e.id !== id)),
    [set],
  );

  const clearAll = useCallback(() => set([]), [set]);

  return { history: list, isHydrated, add, remove, clearAll };
};
