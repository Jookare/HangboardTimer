import { LinearGradient } from 'expo-linear-gradient';
import { memo } from 'react';
import { StyleSheet } from 'react-native';

import { PHASES } from '@/hooks/useWorkoutTimer';

// rgb triplets, not hex — fading a colour to `transparent` interpolates through
// transparent *black* on iOS, which greys out the middle of the screen. Fading
// alpha on the same hue keeps it clean.
const PHASE_RGB = {
  [PHASES.HANG]: '74, 222, 128',
  [PHASES.COUNTDOWN]: '252, 211, 77',
  [PHASES.COMPLETE]: '56, 189, 248',
  [PHASES.REST_AFTER_HANG]: '248, 113, 113',
  [PHASES.REST_BETWEEN_SETS]: '248, 113, 113',
};

const Gradient = ({ phase }) => {
  const rgb = PHASE_RGB[phase] || PHASE_RGB[PHASES.REST_AFTER_HANG];
  return (
    <LinearGradient
      pointerEvents="none"
      colors={[`rgba(${rgb}, 0.55)`, `rgba(${rgb}, 0)`]}
      style={styles.gradient}
    />
  );
};

const styles = StyleSheet.create({
  gradient: {
    position: 'absolute',
    top: 0,
    height: '60%',
    width: '100%',
  },
});

export default memo(Gradient);
