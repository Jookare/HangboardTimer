import { useKeepAwake } from 'expo-keep-awake';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PrimaryButton from '@/components/ui/PrimaryButton';
import ProgressRing from '@/components/ui/ProgressRing';
import ControlButtons from '@/components/timer/ControlButtons';
import Gradient from '@/components/timer/Gradient';
import PhaseText from '@/components/timer/PhaseText';
import { palette } from '@/constants/common';
import { useHistory } from '@/hooks/useHistory';
import { useSettings } from '@/hooks/useSettings';
import { PHASES, useWorkoutTimer } from '@/hooks/useWorkoutTimer';
import { plannedWorkoutSeconds } from '@/lib/time';

const PHASE_RING_COLOR = {
  [PHASES.HANG]: palette.phaseHang,
  [PHASES.COUNTDOWN]: palette.phasePrep,
  [PHASES.REST_AFTER_HANG]: palette.phaseRepRest,
  [PHASES.REST_BETWEEN_SETS]: palette.phaseSetRest,
  [PHASES.COMPLETE]: palette.phaseComplete,
};

export default function TimerScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  useKeepAwake();

  const { audioEnabled, prep } = useSettings();
  const history = useHistory();

  const config = useMemo(
    () => ({
      name: String(params.name ?? 'Workout'),
      sets: Number(params.sets) || 1,
      reps: Number(params.reps) || 1,
      hangTime: Number(params.hangTime) || 1,
      repRest: Number(params.repRest) || 0,
      setRest: Number(params.setRest) || 0,
    }),
    // params object identity is stable for a given navigation
    [params.name, params.sets, params.reps, params.hangTime, params.repRest, params.setRest],
  );

  const {
    currentPhase,
    setsLeft,
    repsLeft,
    mins,
    secs,
    tenths,
    time,
    toggle,
    previousRep,
    nextRep,
    timer,
  } = useWorkoutTimer({ ...config, prep, audioEnabled });

  const savedRef = useRef(false);
  const addHistory = history.add;
  useEffect(() => {
    if (currentPhase === PHASES.COMPLETE && !savedRef.current) {
      savedRef.current = true;
      addHistory({
        workoutName: config.name,
        sets: config.sets,
        reps: config.reps,
        plannedSec: plannedWorkoutSeconds(config),
      });
    }
  }, [currentPhase, config, addHistory]);

  const phaseDuration =
    {
      [PHASES.HANG]: config.hangTime,
      [PHASES.COUNTDOWN]: prep,
      [PHASES.REST_AFTER_HANG]: config.repRest,
      [PHASES.REST_BETWEEN_SETS]: config.setRest,
    }[currentPhase] ?? config.hangTime;

  const fraction = phaseDuration > 0 ? Math.min(1, time / (phaseDuration * 10)) : 0;
  const isComplete = currentPhase === PHASES.COMPLETE;
  const running = timer.isRunning();
  const hangsToGo = Math.max(0, (setsLeft - 1) * config.reps + repsLeft);

  const previousDisabled =
    timer.isStopped() && repsLeft === config.reps && setsLeft === config.sets;
  const nextDisabled = timer.isStopped() && repsLeft === 0 && setsLeft === 0;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen options={{ title: config.name }} />
      <Gradient phase={currentPhase} />

      <Text style={styles.hangsToGo}>
        {isComplete ? 'NICE WORK!' : `${hangsToGo} HANGS TO GO!`}
      </Text>

      {isComplete ? (
        <View style={styles.doneBox}>
          <Text style={styles.doneText}>Workout complete</Text>
          <PrimaryButton
            label="Back to workouts"
            icon="home"
            onPress={() => router.dismissTo('/')}
            style={{ flex: 0, paddingHorizontal: 24 }}
          />
        </View>
      ) : (
        <>
          <ProgressRing
            size={260}
            strokeWidth={16}
            progress={fraction}
            color={PHASE_RING_COLOR[currentPhase] ?? palette.phaseHang}
          >
            <Text style={styles.timerText}>
              {`${mins}:${secs}`}
              <Text style={styles.tenths}>{tenths}</Text>
            </Text>
          </ProgressRing>

          <PhaseText phase={currentPhase} paused={timer.isPaused()} />

          <View style={styles.statusRow}>
            <View style={styles.statusPill}>
              <Text style={styles.statusLabel}>SETS LEFT</Text>
              <Text style={styles.statusValue}>{setsLeft}</Text>
            </View>
            <View style={styles.statusPill}>
              <Text style={styles.statusLabel}>REPS LEFT</Text>
              <Text style={styles.statusValue}>{repsLeft}</Text>
            </View>
          </View>
        </>
      )}

      {!isComplete && (
        <ControlButtons
          running={running}
          toggle={toggle}
          previousRep={previousRep}
          nextRep={nextRep}
          previousDisabled={previousDisabled}
          nextDisabled={nextDisabled}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.bg_light,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    paddingBottom: 140,
  },
  hangsToGo: {
    fontSize: 28,
    fontWeight: '800',
    color: palette.dark,
    textAlign: 'center',
  },
  timerText: {
    fontSize: 56,
    fontWeight: 'bold',
    color: palette.dark,
  },
  tenths: {
    fontSize: 34,
    color: 'rgba(0,0,0,0.4)',
  },
  statusRow: {
    flexDirection: 'row',
    gap: 16,
  },
  statusPill: {
    width: 120,
    height: 84,
    borderRadius: 16,
    backgroundColor: palette.white,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 2,
  },
  statusLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: palette.inactive,
  },
  statusValue: {
    fontSize: 24,
    fontWeight: '700',
    color: palette.dark,
  },
  doneBox: {
    alignItems: 'center',
    gap: 20,
  },
  doneText: {
    fontSize: 20,
    color: palette.subtitle,
  },
});
