import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';

import { PHASES } from '@/hooks/useWorkoutTimer';

const PHASE_COLORS = {
  [PHASES.HANG]: '#4ade80',
  [PHASES.COUNTDOWN]: '#fcd34d',
  [PHASES.COMPLETE]: '#38bdf8',
  [PHASES.REST_AFTER_HANG]: '#f87171',
  [PHASES.REST_BETWEEN_SETS]: '#f87171',
};

const Gradient = ({ phase }) => {
  const top = PHASE_COLORS[phase] || '#f87171';
  return <LinearGradient colors={[top, 'transparent']} style={styles.gradient} />;
};

const styles = StyleSheet.create({
  gradient: {
    position: 'absolute',
    top: 0,
    height: '70%',
    width: '100%',
  },
});

export default Gradient;
