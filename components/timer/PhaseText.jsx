import { memo } from 'react';
import { StyleSheet, Text } from 'react-native';

import { palette } from '@/constants/common';
import { PHASES } from '@/hooks/useWorkoutTimer';

const PHASE_TEXT = {
  [PHASES.HANG]: 'GO!',
  [PHASES.COUNTDOWN]: 'GET READY!',
  [PHASES.COMPLETE]: 'WORKOUT DONE!',
  [PHASES.REST_AFTER_HANG]: 'REST',
  [PHASES.REST_BETWEEN_SETS]: 'REST',
};

const PhaseText = ({ phase, paused }) => (
  <Text style={styles.text}>
    {paused ? 'PAUSED' : PHASE_TEXT[phase] || 'WORKOUT'}
  </Text>
);

const styles = StyleSheet.create({
  text: {
    fontSize: 34,
    fontWeight: '700',
    color: palette.dark,
    textAlign: 'center',
  },
});

export default memo(PhaseText);
