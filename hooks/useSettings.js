import { useCallback } from 'react';

import { createPersistentStore } from '@/lib/createPersistentStore';
import { KEYS } from '@/lib/storage';

const DEFAULTS = { audioEnabled: false, prep: 5 };

const store = createPersistentStore(KEYS.settings, DEFAULTS);

export const useSettings = () => {
  const [value, set, isHydrated] = store.useStore();
  const settings = { ...DEFAULTS, ...(value || {}) };

  const setAudioEnabled = useCallback(
    (audioEnabled) => set((s) => ({ ...DEFAULTS, ...s, audioEnabled })),
    [set],
  );

  const setPrep = useCallback(
    (prep) => set((s) => ({ ...DEFAULTS, ...s, prep })),
    [set],
  );

  return { ...settings, isHydrated, setAudioEnabled, setPrep };
};
