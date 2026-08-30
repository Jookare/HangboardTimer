import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedProps } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { palette } from '@/constants/common';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/**
 * Circular progress ring. A single SVG stroke whose `strokeDashoffset` is driven
 * on the UI thread from a Reanimated shared value (`progress`, 0..1, 1 = full
 * ring) — the caller animates that value once per phase, so nothing re-renders
 * per frame. Starts at 12 o'clock and empties clockwise.
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
  const radius = half - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  const animatedProps = useAnimatedProps(() => {
    'worklet';
    const p = Math.min(1, Math.max(0, progress.value));
    return { strokeDashoffset: circumference * (1 - p) };
  });

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle
          cx={half}
          cy={half}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <AnimatedCircle
          cx={half}
          cy={half}
          r={radius}
          originX={half}
          originY={half}
          rotation={-90}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
        />
      </Svg>

      <View style={styles.center} pointerEvents="box-none">
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default memo(ProgressRing);
