import { usePreventRemove } from '@react-navigation/native';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { Stack, useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import {
  cancelAnimation,
  Easing,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ControlButtons from '@/components/timer/ControlButtons';
import Gradient from '@/components/timer/Gradient';
import PhaseText from '@/components/timer/PhaseText';
import TimerClock from '@/components/timer/TimerClock';
import CustomAlert from '@/components/ui/CustomAlert';
import PrimaryButton from '@/components/ui/PrimaryButton';
import ProgressRing from '@/components/ui/ProgressRing';
import { palette } from '@/constants/common';
import { useHistory } from '@/hooks/useHistory';
import { useSettings } from '@/hooks/useSettings';
import { PHASES, useWorkoutTimer } from '@/hooks/useWorkoutTimer';

const RING_SIZE = 260;

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
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  // Keep the screen on during a workout (native only — the web Wake Lock API
  // needs a visible tab and otherwise throws).
  useEffect(() => {
    if (Platform.OS === 'web') return;
    activateKeepAwakeAsync('timer').catch(() => {});
    return () => deactivateKeepAwake('timer').catch(() => {});
  }, []);

  const { audioEnabled, prep } = useSettings();
  const history = useHistory();

  const workout = useMemo(() => {
    try {
      return JSON.parse(String(params.w));
    } catch {
      return { mode: 'basic', name: 'Workout', sets: 1, reps: 1, hangTime: 10, repRest: 0, setRest: 0 };
    }
  }, [params.w]);
  const workoutName = workout.name || 'Workout';

  const {
    currentPhase,
    currentStage,
    setsLeft,
    repsLeft,
    hangsToGo,
    hangsDone,
    totalHangs,
    totalSets,
    setsDone,
    mins,
    secs,
    tenths,
    time,
    workSec,
    elapsedPlannedSec,
    canNext,
    canPrevious,
    toggle,
    previousRep,
    nextRep,
    timer,
  } = useWorkoutTimer({ workout, prep, audioEnabled });

  const isComplete = currentPhase === PHASES.COMPLETE;
  const running = timer.isRunning();

  const addHistory = history.add;
  const savedRef = useRef(false);
  const elapsedRef = useRef(0);
  elapsedRef.current = elapsedPlannedSec;

  const logSession = useCallback(
    (partial) => {
      if (savedRef.current) return;
      savedRef.current = true;
      const hangs = partial ? hangsDone : totalHangs;
      if (hangs <= 0) return;
      const isBasic = workout.mode !== 'advanced';
      addHistory({
        workoutName,
        mode: isBasic ? 'basic' : 'advanced',
        reps: isBasic ? workout.reps : undefined,
        sets: partial ? Math.max(1, setsDone) : totalSets,
        hangs,
        plannedSec: partial ? elapsedRef.current : workSec,
        partial: !!partial,
      });
    },
    [addHistory, hangsDone, totalHangs, totalSets, setsDone, workout, workoutName, workSec],
  );

  useEffect(() => {
    if (isComplete) logSession(false);
  }, [isComplete, logSession]);

  // Guard leaving mid-workout: hold the pending navigation and confirm first.
  const [pendingLeave, setPendingLeave] = useState(null);
  usePreventRemove(
    hangsDone > 0 && !isComplete && !savedRef.current,
    ({ data }) => setPendingLeave(data.action),
  );

  const leaveActions = [
    {
      label: 'Close',
      style: 'secondary',
      onPress: () => navigation.dispatch(pendingLeave),
    },
    {
      label: 'Log & Close',
      style: 'primary',
      onPress: () => {
        logSession(true);
        navigation.dispatch(pendingLeave);
      },
    },
  ];

  const phaseMs = (currentStage?.duration ?? 1) * 1000;

  // Drive the ring with one Reanimated shared value. The JS timer only touches
  // it at phase boundaries / pause / resume; the sweep runs on the UI thread, so
  // the ring stays smooth with no React re-render per frame. The digits update
  // separately at their own ~10Hz.
  const ringProgress = useSharedValue(1);
  const timeRef = useRef(time);
  timeRef.current = time;

  useEffect(() => {
    cancelAnimation(ringProgress);

    if (isComplete || phaseMs === 0) {
      ringProgress.value = 0;
      return;
    }

    const startFrac = Math.min(1, Math.max(0, (timeRef.current * 100) / phaseMs));
    ringProgress.value = startFrac;

    if (running && startFrac > 0) {
      ringProgress.value = withTiming(0, {
        duration: startFrac * phaseMs,
        easing: Easing.linear,
      });
    }

    return () => cancelAnimation(ringProgress);
    // currentStage identity changes on every stage advance (even hang -> hang),
    // which is what should reset the ring.
  }, [currentStage, running, isComplete, phaseMs, ringProgress]);

  // Stable handler identities so <ControlButtons> can bail out of the 10Hz
  // re-render and only update when the running / disabled flags change.
  const handlerRef = useRef({ toggle, previousRep, nextRep });
  handlerRef.current = { toggle, previousRep, nextRep };
  const onToggle = useCallback(() => handlerRef.current.toggle(), []);
  const onPrevious = useCallback(() => handlerRef.current.previousRep(), []);
  const onNext = useCallback(() => handlerRef.current.nextRep(), []);

  const ringColor = PHASE_RING_COLOR[currentPhase] ?? palette.phaseHang;

  const previousDisabled = !canPrevious;
  const nextDisabled = !canNext;

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: (isComplete ? 24 : 140) + insets.bottom },
      ]}
    >
      <Stack.Screen options={{ title: workoutName }} />
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
          <View style={styles.ringWrap}>
            <ProgressRing
              size={RING_SIZE}
              strokeWidth={16}
              progress={ringProgress}
              color={ringColor}
            />
            <View style={styles.ringCenter} pointerEvents="none">
              <TimerClock mins={mins} secs={secs} tenths={tenths} />
            </View>
          </View>

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
          toggle={onToggle}
          previousRep={onPrevious}
          nextRep={onNext}
          previousDisabled={previousDisabled}
          nextDisabled={nextDisabled}
        />
      )}

      <CustomAlert
        inline
        visible={pendingLeave != null}
        setVisible={() => setPendingLeave(null)}
        title="Close timer?"
        actions={leaveActions}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.bg_light,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  hangsToGo: {
    fontSize: 28,
    fontWeight: '800',
    color: palette.dark,
    textAlign: 'center',
  },
  ringWrap: {
    width: RING_SIZE,
    height: RING_SIZE,
  },
  ringCenter: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
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
