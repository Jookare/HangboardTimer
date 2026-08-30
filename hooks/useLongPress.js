import { useCallback, useEffect, useRef } from 'react';

// Repeats `action` while pressed, accelerating over time. Use with
// onPressIn={() => startLongPress(action)} / onPressOut={stopLongPress}.
const useLongPress = () => {
  const timeoutRef = useRef(null);
  const pressingRef = useRef(false);

  const runAction = useCallback((action, delay) => {
    if (!pressingRef.current) return;
    action();
    const nextDelay = Math.max(25, delay * 0.85);
    timeoutRef.current = setTimeout(() => runAction(action, nextDelay), nextDelay);
  }, []);

  const stopLongPress = useCallback(() => {
    pressingRef.current = false;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const startLongPress = useCallback(
    (action) => {
      stopLongPress();
      pressingRef.current = true;
      timeoutRef.current = setTimeout(() => runAction(action, 250), 300);
    },
    [runAction, stopLongPress],
  );

  useEffect(() => stopLongPress, [stopLongPress]);

  return { startLongPress, stopLongPress };
};

export default useLongPress;
