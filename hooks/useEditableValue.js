import { useCallback, useState } from 'react';

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

// Manages a single numeric value with clamped increment / decrement / direct set.
export const useEditableValue = (initialValue, minValue = 0, maxValue = 999) => {
  const [value, setValue] = useState(clamp(initialValue, minValue, maxValue));

  const update = useCallback(
    (updater) => {
      setValue((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater;
        return clamp(next, minValue, maxValue);
      });
    },
    [minValue, maxValue],
  );

  const increment = useCallback((amount = 1) => update((p) => p + amount), [update]);
  const decrement = useCallback((amount = 1) => update((p) => p - amount), [update]);
  const handleSubmit = useCallback((next) => update(next), [update]);
  const reset = useCallback((next) => update(next), [update]);

  return { value, increment, decrement, handleSubmit, reset };
};
