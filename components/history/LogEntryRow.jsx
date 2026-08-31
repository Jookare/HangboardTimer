import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { palette, shadows } from '@/constants/common';

const ACTION_WIDTH = 96;

/**
 * A training-log row. Tapping it slides a Remove button in from the right (the
 * row itself stays put); tapping again hides it. Only one row is open at a time
 * (`isOpen` is driven by the parent).
 */
const LogEntryRow = ({ entry, meta, timeText, isOpen, onOpenChange, onDelete }) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(isOpen ? 1 : 0, { duration: 180 });
  }, [isOpen, progress]);

  const actionStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: (1 - progress.value) * ACTION_WIDTH }],
  }));
  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${progress.value * 180}deg` }],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.clip}>
        <Pressable
          style={styles.row}
          onPress={() => onOpenChange(entry.id, !isOpen)}
        >
          <View style={styles.main}>
            <View style={styles.nameRow}>
              <Text style={styles.name} numberOfLines={1}>
                {entry.workoutName}
              </Text>
              {entry.partial && <Text style={styles.tag}>PARTIAL</Text>}
            </View>
            <Text style={styles.meta}>{meta}</Text>
          </View>

          <Text style={styles.time}>{timeText}</Text>

          <Animated.View style={chevronStyle}>
            <Ionicons name="chevron-back" size={18} color={palette.inactive} />
          </Animated.View>
        </Pressable>

        <Animated.View
          style={[styles.action, actionStyle]}
          pointerEvents={isOpen ? 'auto' : 'none'}
        >
          <Pressable
            style={styles.removeButton}
            onPress={() => {
              onOpenChange(entry.id, false);
              onDelete();
            }}
          >
            <Ionicons name="trash" size={18} color={palette.white} />
            <Text style={styles.removeText}>Remove</Text>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    ...shadows.small,
  },
  clip: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.white,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 8,
  },
  main: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    flexShrink: 1,
    fontSize: 16,
    fontWeight: '600',
    color: palette.dark,
  },
  tag: {
    fontSize: 10,
    fontWeight: '700',
    color: palette.yellow,
    letterSpacing: 0.5,
  },
  meta: {
    fontSize: 13,
    color: palette.subtitle,
  },
  time: {
    fontSize: 13,
    color: palette.inactive,
  },
  action: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: ACTION_WIDTH,
  },
  removeButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: palette.red,
  },
  removeText: {
    fontSize: 12,
    fontWeight: '700',
    color: palette.white,
  },
});

export default LogEntryRow;
