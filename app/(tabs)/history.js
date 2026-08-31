import { useMemo, useState } from 'react';
import { SectionList, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import EditLogModal from '@/components/history/EditLogModal';
import SwipeableLogRow from '@/components/history/SwipeableLogRow';
import CustomAlert from '@/components/ui/CustomAlert';
import { useToast } from '@/components/ui/Toast';
import { palette } from '@/constants/common';
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
  const { history, update, remove } = useHistory();
  const toast = useToast();

  const [openId, setOpenId] = useState(null);
  const [editEntry, setEditEntry] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  const onOpenChange = (id, open) => {
    setOpenId((cur) => (open ? id : cur === id ? null : cur));
  };

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
          onScrollBeginDrag={() => setOpenId(null)}
          renderSectionHeader={({ section }) => (
            <Text style={styles.sectionHeader}>{section.title}</Text>
          )}
          renderItem={({ item }) => (
            <SwipeableLogRow
              entry={item}
              meta={metaLabel(item)}
              timeText={timeLabel(item.completedAt)}
              isOpen={openId === item.id}
              onOpenChange={onOpenChange}
              onEdit={() => setEditEntry(item)}
              onDelete={() => setPendingDelete(item)}
            />
          )}
        />
      )}

      <EditLogModal
        entry={editEntry}
        onClose={() => setEditEntry(null)}
        onSave={(patch) => {
          if (editEntry) update(editEntry.id, patch);
          toast.show('Entry updated');
        }}
      />

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
  empty: {
    color: palette.subtitle,
    fontSize: 15,
    textAlign: 'center',
    marginTop: 32,
    paddingHorizontal: 32,
    lineHeight: 21,
  },
});
