import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { palette, shadows } from '@/constants/common';

const CustomAlert = ({
  visible,
  setVisible,
  onConfirm,
  title = 'Are you sure?',
  message = '',
  confirmLabel = 'Yes',
}) => {
  const close = () => setVisible(false);
  const confirm = () => {
    onConfirm?.();
    close();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      statusBarTranslucent
      onRequestClose={close}
    >
      <Pressable style={styles.overlay} onPress={close}>
        <Pressable style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.divider} />
          {!!message && <Text style={styles.message}>{message}</Text>}
          <View style={styles.buttonRow}>
            <Pressable
              onPress={close}
              style={({ pressed }) => [
                styles.button,
                styles.cancelButton,
                { opacity: pressed ? 0.5 : 1 },
              ]}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={confirm}
              style={({ pressed }) => [
                styles.button,
                styles.confirmButton,
                { opacity: pressed ? 0.5 : 1 },
              ]}
            >
              <Text style={styles.confirmText}>{confirmLabel}</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    backgroundColor: palette.white,
    padding: 20,
    borderRadius: 20,
    width: '100%',
    maxWidth: 420,
    ...shadows.large,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.dark,
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: palette.light,
    marginBottom: 12,
  },
  message: {
    fontSize: 15,
    color: palette.subtitle,
    marginBottom: 18,
    lineHeight: 21,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: palette.light,
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: palette.dark,
  },
  confirmButton: {
    backgroundColor: palette.dark,
  },
  confirmText: {
    fontSize: 15,
    fontWeight: '600',
    color: palette.white,
  },
});

export default CustomAlert;
