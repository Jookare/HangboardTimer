import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { palette, shadows } from '@/constants/common';

const ACTION_WIDTH = 84;
const META_WIDTH = 78; // the time + chevron cluster

/**
 * A training-log row. Tapping it slides the time / chevron left and a Remove
 * button in from the right — the row's name/meta stays put. Tapping again (or
 * scrolling) hides it; one row open at a time (`isOpen` driven by the parent).
 */
const LogEntryRow = ({ entry, meta, timeText, isOpen, onOpenChange, onDelete }) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(isOpen ? 1 : 0, { duration: 180 });
  }, [isOpen, progress]);

  const mainStyle = useAnimatedStyle(() => ({
    marginRight: META_WIDTH + progress.value * ACTION_WIDTH,
  }));
  const trayStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -progress.value * ACTION_WIDTH }],
  }));
  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${progress.value * 180}deg` }],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.clip}>
        <TouchableOpacity activeOpacity={0.7} style={styles.row} onPress={() => onOpenChange(entry.id, !isOpen)}>
          <Animated.View style={[styles.main, mainStyle]}>
            <View style={styles.nameRow}>
              <Text style={styles.name} numberOfLines={1}>
                {entry.workoutName}
              </Text>
              {entry.partial && <Text style={styles.tag}>PARTIAL</Text>}
            </View>
            <Text style={styles.meta}>{meta}</Text>
          </Animated.View>

          <Animated.View style={[styles.tray, trayStyle]}>
            <View style={styles.metaCluster}>
              <Text style={styles.time} numberOfLines={1}>
                {timeText}
              </Text>
              <Animated.View style={chevronStyle}>
                <Ionicons name="chevron-back" size={18} color={palette.inactive} />
              </Animated.View>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              style={[
                styles.removeButton,
                { pointerEvents: isOpen ? 'auto' : 'none' },
              ]}
              onPress={() => {
                onOpenChange(entry.id, false);
                onDelete();
              }}
            >
              <Ionicons name="trash" size={18} color={palette.white} />
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
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
    paddingLeft: 14,
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
  tray: {
    position: 'absolute',
    right: -ACTION_WIDTH,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaCluster: {
    width: META_WIDTH,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
    paddingRight: 14,
  },
  time: {
    fontSize: 13,
    color: palette.inactive,
  },
  removeButton: {
    width: ACTION_WIDTH,
    alignSelf: 'stretch',
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
