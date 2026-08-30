import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { palette, shadows } from '@/constants/common';
import useLongPress from '@/hooks/useLongPress';

const CounterControl = ({ label, value, onIncrease, onDecrease }) => {
  const { startLongPress, stopLongPress } = useLongPress();

  return (
    <View style={styles.section}>
      <View style={styles.valueDisplay}>
        <Text style={styles.valueText}>{value}</Text>
        <Text style={styles.labelText}>{label}</Text>
      </View>

      <View style={styles.buttonRow}>
        <Pressable
          style={styles.iconButton}
          onPress={onDecrease}
          onPressIn={() => startLongPress(onDecrease)}
          onPressOut={stopLongPress}
        >
          <Ionicons name="remove" size={24} color={palette.dark} />
        </Pressable>
        <View style={styles.separator} />
        <Pressable
          style={styles.iconButton}
          onPress={onIncrease}
          onPressIn={() => startLongPress(onIncrease)}
          onPressOut={stopLongPress}
        >
          <Ionicons name="add" size={24} color={palette.dark} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    alignItems: 'center',
    gap: 12,
  },
  valueDisplay: {
    height: 90,
    width: 90,
    backgroundColor: palette.white,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.medium,
  },
  valueText: {
    fontSize: 36,
    fontWeight: '600',
    color: palette.dark,
  },
  labelText: {
    fontSize: 14,
    fontWeight: '500',
    color: palette.inactive,
    letterSpacing: 0.5,
  },
  buttonRow: {
    backgroundColor: palette.white,
    flexDirection: 'row',
    borderRadius: 12,
    ...shadows.small,
  },
  iconButton: {
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  separator: {
    width: 1,
    backgroundColor: palette.light,
  },
});

export default CounterControl;
