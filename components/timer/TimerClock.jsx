import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { palette } from '@/constants/common';

/**
 * Timer readout. Kept as plain text (updates ~10x/second, its natural rate) but
 * isolated in its own memoised component and using tabular figures so the digits
 * never shift width as the numbers change. The smooth 60fps element is the ring.
 */
const TimerClock = ({ mins, secs, tenths }) => (
  <View style={styles.row}>
    <Text style={styles.main}>
      {mins}:{secs}
    </Text>
    <Text style={styles.tenths}>.{tenths}</Text>
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  main: {
    fontSize: 56,
    fontWeight: 'bold',
    color: palette.dark,
    fontVariant: ['tabular-nums'],
  },
  tenths: {
    fontSize: 34,
    fontWeight: 'bold',
    color: 'rgba(0,0,0,0.4)',
    fontVariant: ['tabular-nums'],
    marginBottom: 6,
    width: 30,
  },
});

export default memo(TimerClock);
