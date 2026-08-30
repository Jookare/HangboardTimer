import { StyleSheet, View } from 'react-native';

import { palette } from '@/constants/common';

const clamp01 = (n) => Math.min(1, Math.max(0, n));

/**
 * Dependency-free circular progress ring.
 *
 * Built from two clipped semicircles rotated with plain `transform` — no SVG,
 * Skia, or Reanimated. The timer re-renders ~10x/second, which is smooth enough
 * for the sweep. `progress` is 0..1 (1 = full ring).
 */
const ProgressRing = ({
  size = 240,
  strokeWidth = 16,
  progress = 0,
  color = palette.phaseHang,
  trackColor = palette.light,
  children,
}) => {
  const p = clamp01(progress);
  const half = size / 2;

  // 0 -> 0.5 sweeps the right semicircle, 0.5 -> 1 sweeps the left one.
  const rightRotate = -180 + Math.min(p, 0.5) * 360;
  const leftRotate = -180 + Math.max(p - 0.5, 0) * 360;

  const fillBase = {
    width: half,
    height: size,
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

      {/* right semicircle */}
      <View style={[styles.clip, { width: half, height: size, left: half }]}>
        <View
          style={[
            fillBase,
            {
              left: 0,
              borderTopRightRadius: half,
              borderBottomRightRadius: half,
              borderLeftWidth: 0,
              transform: [{ rotate: `${rightRotate}deg` }],
              transformOrigin: '0% 50%',
            },
          ]}
        />
      </View>

      {/* left semicircle */}
      <View style={[styles.clip, { width: half, height: size, left: 0 }]}>
        <View
          style={[
            fillBase,
            {
              left: 0,
              borderTopLeftRadius: half,
              borderBottomLeftRadius: half,
              borderRightWidth: 0,
              transform: [{ rotate: `${leftRotate}deg` }],
              transformOrigin: '100% 50%',
            },
          ]}
        />
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

export default ProgressRing;
