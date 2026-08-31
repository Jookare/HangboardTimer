import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

import { palette, shadows } from '@/constants/common';

const ACTION_WIDTH = 76;

/**
 * A training-log row that reveals Edit / Remove actions — either by swiping it
 * left or by tapping the chevron on its left edge. Only one row is open at a
 * time (`isOpen` is driven by the parent).
 */
const SwipeableLogRow = ({
  entry,
  meta,
  timeText,
  isOpen,
  onOpenChange,
  onEdit,
  onDelete,
}) => {
  const swipeRef = useRef(null);

  useEffect(() => {
    if (!isOpen) swipeRef.current?.close();
  }, [isOpen]);

  const renderRightActions = () => (
    <View style={styles.actions}>
      <TouchableOpacity
        style={[styles.action, styles.editAction]}
        onPress={() => {
          swipeRef.current?.close();
          onEdit();
        }}
      >
        <Ionicons name="pencil" size={17} color={palette.white} />
        <Text style={styles.actionText}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.action, styles.deleteAction]}
        onPress={() => {
          swipeRef.current?.close();
          onDelete();
        }}
      >
        <Ionicons name="trash" size={17} color={palette.white} />
        <Text style={styles.actionText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ReanimatedSwipeable
      ref={swipeRef}
      friction={2}
      rightThreshold={ACTION_WIDTH / 2}
      overshootRight={false}
      renderRightActions={renderRightActions}
      onSwipeableWillOpen={() => onOpenChange(entry.id, true)}
      onSwipeableClose={() => onOpenChange(entry.id, false)}
      containerStyle={styles.container}
    >
      <View style={styles.row}>
        <TouchableOpacity
          hitSlop={10}
          style={styles.chevron}
          onPress={() =>
            isOpen ? swipeRef.current?.close() : swipeRef.current?.openRight()
          }
        >
          <Ionicons
            name="chevron-back"
            size={18}
            color={palette.inactive}
            style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }}
          />
        </TouchableOpacity>

        <View style={styles.main}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {entry.workoutName}
            </Text>
            {entry.partial && <Text style={styles.tag}>PARTIAL</Text>}
          </View>
          <Text style={styles.meta}>{meta}</Text>
        </View>

        <Text style={styles.time}>{timeText}</Text>
      </View>
    </ReanimatedSwipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    ...shadows.small,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.white,
    borderRadius: 12,
    paddingVertical: 12,
    paddingRight: 14,
    paddingLeft: 4,
    gap: 6,
  },
  chevron: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  main: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    flexShrink: 1,
    fontSize: 16,
    fontWeight: '600',
    color: palette.dark,
  },
  tag: {
    fontSize: 10,
    fontWeight: '700',
    color: palette.yellow,
    letterSpacing: 0.5,
  },
  meta: {
    fontSize: 13,
    color: palette.subtitle,
  },
  time: {
    fontSize: 13,
    color: palette.inactive,
  },
  actions: {
    flexDirection: 'row',
    height: '100%',
  },
  action: {
    width: ACTION_WIDTH,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  editAction: {
    backgroundColor: palette.blue,
  },
  deleteAction: {
    backgroundColor: palette.red,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '700',
    color: palette.white,
  },
});

export default SwipeableLogRow;
