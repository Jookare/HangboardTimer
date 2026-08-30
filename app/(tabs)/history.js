import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { SectionList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CustomAlert from '@/components/ui/CustomAlert';
import { useToast } from '@/components/ui/Toast';
import { palette, shadows } from '@/constants/common';
import { useHistory } from '@/hooks/useHistory';
import { formatDuration } from '@/lib/time';

const dayLabel = (iso) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 'Unknown date';
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const timeLabel = (iso) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
};

const metaLabel = (item) => {
  const duration = formatDuration(item.plannedSec || 0);
  if (item.partial) {
    const hangs = item.hangs ?? 0;
    return `${hangs} hang${hangs === 1 ? '' : 's'} · ${duration}`;
  }
  return `${item.sets} × ${item.reps} · ${duration}`;
};

export default function HistoryScreen() {
  const { history, remove } = useHistory();
  const toast = useToast();
  const [pendingDelete, setPendingDelete] = useState(null);

  const sections = useMemo(() => {
    const groups = [];
    let current = null;
    for (const entry of history) {
      const label = dayLabel(entry.completedAt);
      if (!current || current.title !== label) {
        current = { title: label, data: [] };
        groups.push(current);
      }
      current.data.push(entry);
    }
    return groups;
  }, [history]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Text style={styles.title}>Training log</Text>

      {history.length === 0 ? (
        <Text style={styles.empty}>
          No sessions yet. Finish a workout and it shows up here.
        </Text>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          stickySectionHeadersEnabled={false}
          renderSectionHeader={({ section }) => (
            <Text style={styles.sectionHeader}>{section.title}</Text>
          )}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={styles.rowMain}>
                <View style={styles.nameRow}>
                  <Text style={styles.workoutName} numberOfLines={1}>
                    {item.workoutName}
                  </Text>
                  {item.partial && <Text style={styles.partialTag}>PARTIAL</Text>}
                </View>
                <Text style={styles.meta}>{metaLabel(item)}</Text>
              </View>
              <Text style={styles.time}>{timeLabel(item.completedAt)}</Text>
              <TouchableOpacity
                hitSlop={8}
                style={styles.deleteButton}
                onPress={() => setPendingDelete(item)}
              >
                <Ionicons name="trash-outline" size={18} color={palette.inactive} />
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <CustomAlert
        visible={pendingDelete != null}
        setVisible={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) remove(pendingDelete.id);
          toast.show('Entry deleted');
        }}
        title="Delete log entry"
        message={
          pendingDelete
            ? `Remove the ${pendingDelete.workoutName} session from your log?`
            : ''
        }
        confirmLabel="Delete"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: palette.bg,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: palette.dark,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 8,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: palette.subtitle,
    marginTop: 16,
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.white,
    borderRadius: 12,
    padding: 14,
    gap: 10,
    ...shadows.small,
  },
  rowMain: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  workoutName: {
    flexShrink: 1,
    fontSize: 16,
    fontWeight: '600',
    color: palette.dark,
  },
  partialTag: {
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
  deleteButton: {
    padding: 4,
  },
  empty: {
    color: palette.subtitle,
    fontSize: 15,
    textAlign: 'center',
    marginTop: 32,
    paddingHorizontal: 32,
    lineHeight: 21,
  },
});
