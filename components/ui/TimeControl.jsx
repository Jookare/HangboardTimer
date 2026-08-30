import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TimerPickerModal } from 'react-native-timer-picker';

import { palette, shadows } from '@/constants/common';
import useLongPress from '@/hooks/useLongPress';
import { formatTime } from '@/lib/time';

const toPickerValue = (seconds) => ({
  minutes: Math.floor(seconds / 60),
  seconds: seconds % 60,
});

const TimeControl = ({ label, value, onIncrease, onDecrease, onSubmit }) => {
  const { startLongPress, stopLongPress } = useLongPress();
  const [showPicker, setShowPicker] = useState(false);

  const handleConfirm = (picked) => {
    const total = (picked.minutes || 0) * 60 + (picked.seconds || 0);
    onSubmit(total);
    setShowPicker(false);
  };

  const pickerFeedback = useCallback(() => {
    Haptics.selectionAsync().catch(() => {});
  }, []);

  return (
    <View style={styles.section}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.button}
          onPress={onDecrease}
          onPressIn={() => startLongPress(onDecrease)}
          onPressOut={stopLongPress}
        >
          <Ionicons name="remove" size={20} color={palette.dark} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.display}
          onPress={() => setShowPicker(true)}
          activeOpacity={0.5}
        >
          <Text style={styles.value}>{formatTime(value)}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={onIncrease}
          onPressIn={() => startLongPress(onIncrease)}
          onPressOut={stopLongPress}
        >
          <Ionicons name="add" size={20} color={palette.dark} />
        </TouchableOpacity>
      </View>

      <TimerPickerModal
        visible={showPicker}
        setIsVisible={setShowPicker}
        onConfirm={handleConfirm}
        onCancel={() => setShowPicker(false)}
        modalTitle={label}
        closeOnOverlayPress
        LinearGradient={LinearGradient}
        hideHours
        initialValue={toPickerValue(value)}
        pickerFeedback={pickerFeedback}
        minuteLabel=":"
        secondLabel=""
        styles={{ theme: 'light' }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  section: {},
  label: {
    fontSize: 18,
    fontWeight: '500',
    color: palette.dark,
    textAlign: 'center',
    marginBottom: 4,
  },
  row: {
    backgroundColor: palette.white,
    flexDirection: 'row',
    borderRadius: 12,
    alignItems: 'center',
    ...shadows.small,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  display: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: palette.light,
  },
  value: {
    fontSize: 26,
    fontWeight: '600',
    color: palette.dark,
  },
});

export default TimeControl;
