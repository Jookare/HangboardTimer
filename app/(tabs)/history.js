import { useMemo } from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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

export default function HistoryScreen() {
  const { history } = useHistory();

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
                <Text style={styles.workoutName}>{item.workoutName}</Text>
                <Text style={styles.meta}>
                  {item.sets} × {item.reps} · {formatDuration(item.plannedSec || 0)}
                </Text>
              </View>
              <Text style={styles.time}>{timeLabel(item.completedAt)}</Text>
            </View>
          )}
        />
      )}
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
    ...shadows.small,
  },
  rowMain: {
    flex: 1,
    gap: 2,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: '600',
    color: palette.dark,
  },
  meta: {
    fontSize: 13,
    color: palette.subtitle,
  },
  time: {
    fontSize: 13,
    color: palette.inactive,
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
