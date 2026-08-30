import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { palette, shadows } from '@/constants/common';

const ToastContext = createContext({ show: () => {} });

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [message, setMessage] = useState(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef(null);
  const insets = useSafeAreaInsets();

  const show = useCallback(
    (text) => {
      setMessage(text);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      Animated.timing(opacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }).start();
      timeoutRef.current = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }).start(() => setMessage(null));
      }, 2200);
    },
    [opacity],
  );

  useEffect(() => () => timeoutRef.current && clearTimeout(timeoutRef.current), []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {message != null && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.toast,
            { opacity, bottom: insets.bottom + 90 },
          ]}
        >
          <Text style={styles.text}>{message}</Text>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    alignSelf: 'center',
    maxWidth: '85%',
    backgroundColor: palette.dark,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    ...shadows.large,
  },
  text: {
    color: palette.white,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});
