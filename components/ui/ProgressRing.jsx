import { Canvas, Group, Path, Skia } from '@shopify/react-native-skia';
import { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { palette } from '@/constants/common';

/**
 * Circular progress ring drawn with Skia (GPU, render-thread). `progress` is a
 * Reanimated shared value in 0..1 (1 = full ring) bound straight to the stroke's
 * `end`, so the sweep runs off the JS thread and stays smooth under load.
 * Starts at 12 o'clock.
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

  const path = useMemo(() => {
    const p = Skia.Path.Make();
    p.addCircle(size / 2, size / 2, radius);
    return p;
  }, [size, radius]);

  return (
    <View style={{ width: size, height: size }}>
      <Canvas style={{ width: size, height: size }}>
        <Group
          origin={{ x: size / 2, y: size / 2 }}
          transform={[{ rotate: -Math.PI / 2 }]}
        >
          <Path
            path={path}
            style="stroke"
            strokeWidth={strokeWidth}
            color={trackColor}
          />
          <Path
            path={path}
            style="stroke"
            strokeWidth={strokeWidth}
            strokeCap="round"
            color={color}
            start={0}
            end={progress}
          />
        </Group>
      </Canvas>

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
