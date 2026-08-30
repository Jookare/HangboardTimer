import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import { palette } from '@/constants/common';

/**
 * Circular progress ring, no SVG / Skia.
 *
 * Each half of the ring is a semicircle View that lives inside a full-size
 * "rotator" (so rotation is about the rotator's own centre = the container
 * centre, no transformOrigin needed) inside a half-width clip. Only a
 * `transform: rotate` changes per frame — a GPU compositor op with no re-raster
 * or re-layout, which stays smooth on Android. Driven by a Reanimated shared
 * value (`progress`, 0..1, 1 = full) on the UI thread. Fills clockwise from 12.
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

  // right half fills while progress 0 -> 0.5, left half while 0.5 -> 1.
  const rightRotator = useAnimatedStyle(() => {
    const p = Math.min(0.5, Math.max(0, progress.value));
    return { transform: [{ rotate: `${(p - 0.5) * 360}deg` }] };
  });
  const leftRotator = useAnimatedStyle(() => {
    const p = Math.min(1, Math.max(0.5, progress.value));
    return { transform: [{ rotate: `${(p - 1) * 360}deg` }] };
  });

  const rotator = { position: 'absolute', top: 0, width: size, height: size };
  const arc = {
    position: 'absolute',
    top: 0,
    width: half,
    height: size,
    borderColor: color,
    borderWidth: strokeWidth,
  };

  return (
    <View style={{ width: size, height: size }}>
      <View
        style={[
          styles.track,
          { borderRadius: half, borderWidth: strokeWidth, borderColor: trackColor },
        ]}
      />

      {/* right half */}
      <View style={[styles.clip, { width: half, height: size, left: half }]}>
        <Animated.View style={[rotator, { left: -half }, rightRotator]}>
          <View
            style={[
              arc,
              {
                left: half,
                borderLeftWidth: 0,
                borderTopRightRadius: half,
                borderBottomRightRadius: half,
              },
            ]}
          />
        </Animated.View>
      </View>

      {/* left half */}
      <View style={[styles.clip, { width: half, height: size, left: 0 }]}>
        <Animated.View style={[rotator, { left: 0 }, leftRotator]}>
          <View
            style={[
              arc,
              {
                left: 0,
                borderRightWidth: 0,
                borderTopLeftRadius: half,
                borderBottomLeftRadius: half,
              },
            ]}
          />
        </Animated.View>
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
