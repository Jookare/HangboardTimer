import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { palette, shadows } from '@/constants/common';

const OPTIONS = [
  { value: 'basic', label: 'Basic' },
  { value: 'advanced', label: 'Advanced' },
];

const ModeToggle = ({ value, onChange }) => (
  <View style={styles.track}>
    {OPTIONS.map((opt) => {
      const active = opt.value === value;
      return (
        <TouchableOpacity
          key={opt.value}
          activeOpacity={0.8}
          style={[styles.segment, active && styles.segmentActive]}
          onPress={() => !active && onChange(opt.value)}
        >
          <Text style={[styles.label, active && styles.labelActive]}>
            {opt.label}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    backgroundColor: palette.bg,
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  segment: {
    flex: 1,
    height: 40,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentActive: {
    backgroundColor: palette.white,
    ...shadows.small,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: palette.inactive,
  },
  labelActive: {
    color: palette.dark,
  },
});

export default ModeToggle;
