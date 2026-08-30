import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text } from 'react-native';

import { palette } from '@/constants/common';

const TabBarButton = ({ onPress, onLongPress, isFocused, label, iconName }) => {
  const color = isFocused ? palette.active : palette.inactive;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.container}
    >
      <Ionicons
        name={isFocused ? iconName : `${iconName}-outline`}
        size={24}
        color={color}
      />
      <Text style={[styles.label, { color }]}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
  },
});

export default TabBarButton;
