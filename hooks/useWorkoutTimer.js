import { useCallback, useEffect, useMemo, useState } from 'react';
import { AppState } from 'react-native';
import { useTimer } from 'react-use-precision-timer';

import {
  buildStages,
  elapsedSec,
  hangIndices,
  hangsBefore,
  STAGE,
  totalHangs as countHangs,
} from '@/lib/stages';
import { getRemaining } from '@/lib/time';

import { useSounds } from './useSounds';

// Kept for the screen / PhaseText / Gradient, which key on these member names.
export const PHASES = {
  COUNTDOWN: 'countdown',
  HANG: 'hang',
  REST_AFTER_HANG: 'restAfterHang',
  REST_BETWEEN_SETS: 'restBetweenSets',
  COMPLETE: 'complete',
};

const KIND_TO_PHASE = {
  [STAGE.PREP]: PHASES.COUNTDOWN,
  [STAGE.HANG]: PHASES.HANG,
  [STAGE.REP_REST]: PHASES.REST_AFTER_HANG,
  [STAGE.SET_REST]: PHASES.REST_BETWEEN_SETS,
};

const endCueFor = (kind) => (kind === STAGE.HANG ? 'end' : 'start');

/**
 * Walks a compiled stage list ({@link buildStages}). Every workout — basic or
 * advanced — runs through here. Keeps the pre-2.0 sound cues, background
 * pause/resume and prev/next-rep behaviour; the phase state machine it replaced
 * is gone.
 *
 * `time` is tenths of a second remaining in the current stage.
 */
export const useWorkoutTimer = ({ workout, prep = 0, audioEnabled = false }) => {
  const playSoundEnabled = audioEnabled;

  const { stages, workSec } = useMemo(
    () => buildStages(workout, prep),
    [workout, prep],
  );
  const hangIdx = useMemo(() => hangIndices(stages), [stages]);
  const totalHangs = useMemo(() => countHangs(stages), [stages]);

  const [index, setIndex] = useState(0);
  const [time, setTime] = useState(() => (stages[0]?.duration ?? 0) * 10);
  const [appState, setAppState] = useState(AppState.currentState);
  const [timerOn, setTimerOn] = useState(false);

  const isComplete = index >= stages.length;
  const currentStage = isComplete ? null : stages[index];
  const currentPhase = isComplete
    ? PHASES.COMPLETE
    : KIND_TO_PHASE[currentStage.kind];

  const { mins, secs, tenths } = getRemaining(time);
  const { playSound, prewarm } = useSounds();

  const handleSetTime = (value) => setTime(Math.max(0, value) * 10);

  const handleTimerCallback = useCallback(() => {
    setTime((prev) => Math.max(prev - 1, 0));
  }, []);

  const timer = useTimer({ delay: 100 }, handleTimerCallback);

  // Pre-warm the cue this stage will fire.
  useEffect(() => {
    if (!playSoundEnabled || isComplete) return;
    prewarm(endCueFor(currentStage.kind));
  }, [index, playSoundEnabled, timerOn, isComplete, currentStage, prewarm]);

  const advance = () => {
    const next = index + 1;
    if (next >= stages.length) {
      timer.stop();
      setIndex(stages.length);
      setTime(0);
    } else {
      setIndex(next);
      handleSetTime(stages[next].duration);
    }
  };

  useEffect(() => {
    if (isComplete || !currentStage) return;

    if (playSoundEnabled) {
      const countdownKind =
        currentStage.kind === STAGE.PREP || currentStage.kind === STAGE.SET_REST;
      if (countdownKind && (time === 30 || time === 20 || time === 10)) {
        playSound('ready');
      }
      if (time === 30) prewarm(endCueFor(currentStage.kind));
    }

    if (time <= 0) {
      if (playSoundEnabled) {
        playSound(currentStage.kind === STAGE.HANG ? 'end' : 'start');
      }
      advance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time]);

  // Background pause / resume — carried over verbatim.
  const [timerFinishTime, setTimerFinishTime] = useState(0);

  useEffect(() => {
    setTimerFinishTime(Date.now() + time * 100);
  }, [time]);

  const restartTimer = useCallback(() => {
    const remaining = Math.round((timerFinishTime - Date.now()) / 100) / 10;
    handleSetTime(remaining > 0 ? remaining : 0);
    timer.resume();
  }, [timer, timerFinishTime]);

  const onAppStateChange = useCallback(
    (nextAppState) => {
      if (timerOn) {
        if (appState === 'active' && nextAppState.match(/inactive|background/)) {
          timer.pause();
        } else if (
          appState.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          restartTimer();
        }
        setAppState(nextAppState);
      }
    },
    [appState, restartTimer, timer, timerOn],
  );

  useEffect(() => {
    const listener = AppState.addEventListener('change', onAppStateChange);
    return listener.remove;
  }, [onAppStateChange]);

  const toggle = () => {
    if (isComplete) return;
    if (timer.isStopped()) {
      setTimerOn(true);
      timer.start();
    } else if (timer.isPaused()) {
      setTimerOn(true);
      timer.resume();
    } else {
      setTimerOn(false);
      timer.pause();
    }
  };

  const nextRep = () => {
    timer.stop();
    setTimerOn(false);
    const next = hangIdx.find((i) => i > index);
    if (next == null) {
      setIndex(stages.length);
      setTime(0);
    } else {
      setIndex(next);
      handleSetTime(stages[next].duration);
    }
  };

  const previousRep = () => {
    timer.stop();
    setTimerOn(false);

    if (currentStage?.kind === STAGE.PREP) {
      handleSetTime(currentStage.duration);
      return;
    }

    const atOrBefore = [...hangIdx].reverse().find((i) => i <= index);
    let target;
    if (atOrBefore == null) {
      target = hangIdx[0] ?? 0;
    } else if (
      atOrBefore === index &&
      currentStage?.kind === STAGE.HANG &&
      time > currentStage.duration * 10 - 30
    ) {
      target = [...hangIdx].reverse().find((i) => i < index) ?? atOrBefore;
    } else {
      target = atOrBefore;
    }
    setIndex(target);
    handleSetTime(stages[target].duration);
  };

  // Derived progress.
  const nextHangIdx = isComplete ? null : hangIdx.find((i) => i >= index);
  const targetSet = nextHangIdx != null ? stages[nextHangIdx].set : 0;
  const setsLeft = isComplete
    ? 0
    : Math.max(0, stages.reduce((m, s) => Math.max(m, s.set), 0) - targetSet + 1);
  const repsLeft = isComplete
    ? 0
    : stages.filter(
        (s, i) => i >= (nextHangIdx ?? Infinity) && s.kind === STAGE.HANG && s.set === targetSet,
      ).length;

  const hangsDone = hangsBefore(stages, index);
  const hangsToGo = Math.max(0, totalHangs - hangsDone);

  const totalSets = useMemo(
    () => stages.reduce((m, s) => Math.max(m, s.set), 0),
    [stages],
  );
  const setsDone = useMemo(() => {
    const bySet = new Map();
    hangIdx.forEach((i) => {
      const s = stages[i].set;
      if (!bySet.has(s)) bySet.set(s, []);
      bySet.get(s).push(i);
    });
    let done = 0;
    bySet.forEach((idxs) => {
      if (idxs.every((i) => i < index)) done += 1;
    });
    return done;
  }, [stages, hangIdx, index]);

  const elapsedPlannedSec = Math.round(
    elapsedSec(stages, index) +
      (currentStage ? currentStage.duration - time / 10 : 0),
  );

  const canNext = !isComplete;
  const canPrevious =
    isComplete ||
    index > 0 ||
    time < (stages[0]?.duration ?? 0) * 10;

  return {
    currentPhase,
    currentStage,
    index,
    stages,
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
  };
};
