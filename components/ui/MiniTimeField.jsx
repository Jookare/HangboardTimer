import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { TimerPickerModal } from 'react-native-timer-picker';

import { palette } from '@/constants/common';
import { formatTime } from '@/lib/time';

const toPicker = (seconds) => ({
  minutes: Math.floor(seconds / 60),
  seconds: seconds % 60,
});

/**
 * Compact tappable M:SS field — opens the same wheel picker as `TimeControl`,
 * sized for the per-rep rows of the advanced editor.
 */
const MiniTimeField = ({ value, onChange, title = 'Time', tint = palette.dark }) => {
  const [open, setOpen] = useState(false);

  const feedback = useCallback(() => {
    Haptics.selectionAsync().catch(() => {});
  }, []);

  return (
    <>
      <TouchableOpacity
        style={styles.field}
        activeOpacity={0.6}
        onPress={() => setOpen(true)}
      >
        <Text style={[styles.value, { color: tint }]}>{formatTime(value)}</Text>
      </TouchableOpacity>

      <TimerPickerModal
        visible={open}
        setIsVisible={setOpen}
        onConfirm={(picked) => {
          onChange((picked.minutes || 0) * 60 + (picked.seconds || 0));
          setOpen(false);
        }}
        onCancel={() => setOpen(false)}
        modalTitle={title}
        closeOnOverlayPress
        LinearGradient={LinearGradient}
        hideHours
        initialValue={toPicker(value)}
        pickerFeedback={feedback}
        minuteLabel=":"
        secondLabel=""
        styles={{ theme: 'light' }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  field: {
    minWidth: 56,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: palette.bg,
    alignItems: 'center',
  },
  value: {
    fontSize: 15,
    fontWeight: '700',
  },
});

export default MiniTimeField;
