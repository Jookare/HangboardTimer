import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { palette, shadows } from '@/constants/common';

const VARIANTS = {
  primary: { bg: palette.dark, fg: palette.white, border: palette.dark },
  outline: { bg: palette.white, fg: palette.dark, border: palette.light },
};

const PrimaryButton = ({
  label,
  icon,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
}) => {
  const v = VARIANTS[variant] ?? VARIANTS.primary;
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        { backgroundColor: v.bg, borderColor: v.border, opacity: disabled ? 0.4 : 1 },
        style,
      ]}
    >
      <Text style={[styles.label, { color: v.fg }]}>{label}</Text>
      {icon ? <Ionicons name={icon} size={20} color={v.fg} /> : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 16,
    ...shadows.small,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PrimaryButton;
