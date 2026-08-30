import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import { palette } from '@/constants/common';

/**
 * Dependency-free circular progress ring (no SVG / Skia).
 *
 * Two half-width wrappers each clip a full-size ring; rotating those rings sweeps
 * the arc. `progress` is a Reanimated shared value in 0..1 (1 = full ring),
 * animated once per phase by the caller — the sweep then runs on the UI thread
 * with no React re-render per frame. Rotation is about each ring's own centre
 * (= the container centre), so no `transformOrigin` is required.
 */
const ProgressRing = ({
  size = 240,
  strokeWidth = 16,
  progress,
  color = palette.phaseHang,
  trackColor = palette.light,
  children,
}) => {
  const half = size / 2;

  // right wrapper reveals 0 -> 0.5, left wrapper reveals 0.5 -> 1
  const rightStyle = useAnimatedStyle(() => {
    const p = Math.min(1, Math.max(0, progress.value));
    return { transform: [{ rotate: `${180 + Math.min(p, 0.5) * 360}deg` }] };
  });
  const leftStyle = useAnimatedStyle(() => {
    const p = Math.min(1, Math.max(0, progress.value));
    return { transform: [{ rotate: `${180 + Math.max(p - 0.5, 0) * 360}deg` }] };
  });

  const ring = {
    position: 'absolute',
    top: 0,
    width: size,
    height: size,
    borderRadius: half,
    borderWidth: strokeWidth,
    borderColor: color,
  };

  return (
    <View style={{ width: size, height: size }}>
      <View
        style={[
          styles.track,
          { borderRadius: half, borderWidth: strokeWidth, borderColor: trackColor },
        ]}
      />

      <View style={[styles.clip, { width: half, height: size, left: half }]}>
        <Animated.View style={[ring, { left: -half }, rightStyle]} />
      </View>

      <View style={[styles.clip, { width: half, height: size, left: 0 }]}>
        <Animated.View style={[ring, { left: 0 }, leftStyle]} />
      </View>

      <View style={styles.center} pointerEvents="box-none">
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    ...StyleSheet.absoluteFillObject,
  },
  clip: {
    position: 'absolute',
    top: 0,
    overflow: 'hidden',
  },
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default memo(ProgressRing);
