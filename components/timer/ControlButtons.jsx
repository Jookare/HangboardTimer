import { Ionicons } from '@expo/vector-icons';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { palette, shadows } from '@/constants/common';

const SideButton = ({ icon, label, disabled, onPress }) => (
  <Pressable
    disabled={disabled}
    onPress={onPress}
    style={({ pressed }) => [
      styles.sideButton,
      { opacity: disabled ? 0.35 : pressed ? 0.5 : 1 },
    ]}
  >
    <Ionicons name={icon} size={20} color={palette.dark} />
    <Text style={styles.sideLabel}>{label}</Text>
  </Pressable>
);

const ControlButtons = ({
  running,
  toggle,
  previousRep,
  nextRep,
  previousDisabled,
  nextDisabled,
}) => (
  <View style={styles.container}>
    <SideButton
      icon="play-back"
      label="REP"
      disabled={previousDisabled}
      onPress={previousRep}
    />

    <Pressable
      onPress={toggle}
      style={({ pressed }) => [styles.playButton, { opacity: pressed ? 0.5 : 1 }]}
    >
      <Ionicons name={running ? 'pause' : 'play'} size={38} color={palette.dark} />
    </Pressable>

    <SideButton
      icon="play-forward"
      label="REP"
      disabled={nextDisabled}
      onPress={nextRep}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    height: 120,
    width: '100%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: palette.bg_light,
    borderTopColor: palette.light,
    borderTopWidth: 1,
  },
  sideButton: {
    borderRadius: 20,
    width: 78,
    height: 78,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    borderWidth: 1,
    borderColor: palette.light,
    backgroundColor: palette.white,
    ...shadows.small,
  },
  sideLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.dark,
  },
  playButton: {
    borderRadius: 100,
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: palette.light,
    backgroundColor: palette.white,
    ...shadows.medium,
  },
});

export default memo(ControlButtons);
