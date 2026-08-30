import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CustomAlert from '@/components/ui/CustomAlert';
import { useToast } from '@/components/ui/Toast';
import { palette, shadows } from '@/constants/common';
import { useHistory } from '@/hooks/useHistory';
import { useSettings } from '@/hooks/useSettings';
import { useWorkouts } from '@/hooks/useWorkouts';
import { formatTime } from '@/lib/time';

const PREP_MIN = 0;
const PREP_MAX = 15;

export default function SettingsScreen() {
  const toast = useToast();
  const { audioEnabled, prep, setAudioEnabled, setPrep } = useSettings();
  const { clearAll: clearWorkouts } = useWorkouts();
  const { clearAll: clearHistory } = useHistory();

  const [confirm, setConfirm] = useState(null); // 'workouts' | 'history' | null

  const version = Constants.expoConfig?.version ?? '2.0.0';

  const bumpPrep = (delta) =>
    setPrep(Math.min(PREP_MAX, Math.max(PREP_MIN, prep + delta)));

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Settings</Text>

        <Text style={styles.sectionTitle}>Audio</Text>
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.label}>Sound cues</Text>
            <Switch
              value={audioEnabled}
              onValueChange={setAudioEnabled}
              trackColor={{ false: palette.switchOff, true: palette.switchOn }}
              thumbColor={palette.white}
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Preparation time</Text>
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.label}>Countdown before the first hang</Text>
          </View>
          <View style={styles.stepper}>
            <TouchableOpacity style={styles.stepButton} onPress={() => bumpPrep(-1)}>
              <Ionicons name="remove" size={22} color={palette.dark} />
            </TouchableOpacity>
            <Text style={styles.stepValue}>{formatTime(prep)}</Text>
            <TouchableOpacity style={styles.stepButton} onPress={() => bumpPrep(1)}>
              <Ionicons name="add" size={22} color={palette.dark} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Data</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => setConfirm('workouts')}
          >
            <Ionicons name="trash-outline" size={20} color={palette.dark} />
            <Text style={styles.actionLabel}>Remove all custom workouts</Text>
            <Ionicons name="chevron-forward" size={20} color={palette.inactive} />
          </TouchableOpacity>
          <View style={styles.hairline} />
          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => setConfirm('history')}
          >
            <Ionicons name="trash-outline" size={20} color={palette.dark} />
            <Text style={styles.actionLabel}>Clear training log</Text>
            <Ionicons name="chevron-forward" size={20} color={palette.inactive} />
          </TouchableOpacity>
        </View>

        <Text style={styles.version}>Hangboard Timer v{version}</Text>
      </ScrollView>

      <CustomAlert
        visible={confirm === 'workouts'}
        setVisible={() => setConfirm(null)}
        onConfirm={() => {
          clearWorkouts();
          toast.show('All custom workouts removed');
        }}
        title="Remove all custom workouts"
        message="This cannot be undone."
        confirmLabel="Remove all"
      />
      <CustomAlert
        visible={confirm === 'history'}
        setVisible={() => setConfirm(null)}
        onConfirm={() => {
          clearHistory();
          toast.show('Training log cleared');
        }}
        title="Clear training log"
        message="This cannot be undone."
        confirmLabel="Clear"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: palette.bg,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: palette.dark,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: palette.subtitle,
    marginTop: 20,
    marginBottom: 8,
  },
  card: {
    backgroundColor: palette.white,
    borderRadius: 14,
    padding: 16,
    gap: 12,
    ...shadows.small,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 15,
    color: palette.dark,
    flexShrink: 1,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: palette.bg,
    borderRadius: 10,
  },
  stepButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  stepValue: {
    fontSize: 20,
    fontWeight: '700',
    color: palette.dark,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  actionLabel: {
    flex: 1,
    fontSize: 15,
    color: palette.dark,
  },
  hairline: {
    height: 1,
    backgroundColor: palette.light,
  },
  version: {
    textAlign: 'center',
    color: palette.inactive,
    fontSize: 13,
    marginTop: 28,
  },
});
