import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedProps } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { palette } from '@/constants/common';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/**
 * Web fallback for the Skia `ProgressRing` (Skia needs a WASM load on web that
 * this app doesn't ship — web isn't a shipping target). Same prop contract:
 * `progress` is a Reanimated shared value, 0..1.
 */
const ProgressRing = ({
  size = 240,
  strokeWidth = 16,
  progress,
  color = palette.phaseHang,
  trackColor = palette.light,
  children,
}) => {
  const radius = size / 2 - strokeWidth / 2;
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
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          originX={size / 2}
          originY={size / 2}
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
