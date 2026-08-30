import { useCallback, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { useTimer } from 'react-use-precision-timer';

import { getRemaining } from '@/lib/time';

import { useSounds } from './useSounds';

export const PHASES = {
  COUNTDOWN: 'countdown',
  HANG: 'hang',
  REST_AFTER_HANG: 'restAfterHang',
  REST_BETWEEN_SETS: 'restBetweenSets',
  COMPLETE: 'complete',
};

/**
 * Ported (near-verbatim) from the pre-2.0 TimerScreen hook. The phase state
 * machine and prev/next-rep logic are unchanged; only the inputs differ:
 * `prep` and `audioEnabled` are passed in instead of read from AsyncStorage.
 *
 * All durations are in whole seconds. Internally `time` is tenths of a second.
 */
export const useWorkoutTimer = ({
  hangTime,
  repRest,
  setRest,
  sets,
  reps,
  prep = 5,
  audioEnabled = false,
}) => {
  const restAfterHang = repRest;
  const restAfterSet = setRest;
  const preparation = prep;
  const playSoundEnabled = audioEnabled;

  const [currentPhase, setCurrentPhase] = useState(PHASES.HANG);
  const [setsLeft, setSetsLeft] = useState(sets);
  const [repsLeft, setRepsLeft] = useState(reps);

  const [time, setTime] = useState(hangTime * 10); // tenths of a second
  const [appState, setAppState] = useState(AppState.currentState);
  const [timerOn, setTimerOn] = useState(false);

  const { mins, secs, tenths } = getRemaining(time);
  const { playSound } = useSounds();

  const handleSetTime = (value) => {
    setTime(value * 10);
  };

  const handleTimerCallback = useCallback(() => {
    setTime((prev) => Math.max(prev - 1, 0));
  }, []);

  const timer = useTimer({ delay: 100 }, handleTimerCallback);

  useEffect(() => {
    handlePhaseTransition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time]);

  const handlePhaseTransition = () => {
    if (playSoundEnabled) {
      if (currentPhase === PHASES.COUNTDOWN) {
        if (time === 30 || time === 20 || time === 10) {
          playSound('ready');
        }
      }
      if (
        currentPhase === PHASES.REST_BETWEEN_SETS &&
        time === 0 &&
        preparation > 3
      ) {
        playSound('ready');
      }
    }

    if (time <= 0) {
      if (playSoundEnabled) {
        if (
          currentPhase === PHASES.COUNTDOWN ||
          currentPhase === PHASES.REST_AFTER_HANG
        ) {
          playSound('start');
        } else if (currentPhase === PHASES.HANG) {
          playSound('end');
        }
      }
      transitionToNextPhase();
    }
  };

  const transitionToNextPhase = () => {
    const transitionToPhase = (phase, nextTime = null) => {
      setCurrentPhase(phase);
      handleSetTime(nextTime);
    };

    const completeWorkout = () => {
      setSetsLeft(0);
      setRepsLeft(0);
      timer.stop();
      setCurrentPhase(PHASES.COMPLETE);
    };

    const handleCountdownPhase = () => {
      if (repsLeft === 0 && setsLeft === 0) {
        completeWorkout();
      } else {
        transitionToPhase(PHASES.HANG, hangTime);
      }
    };

    const handleHangPhase = () => {
      setRepsLeft(repsLeft - 1);
      if (repsLeft > 1) {
        transitionToPhase(
          restAfterHang === 0 ? PHASES.HANG : PHASES.REST_AFTER_HANG,
          restAfterHang || hangTime,
        );
      } else if (setsLeft > 1) {
        setSetsLeft(setsLeft - 1);
        setRepsLeft(reps);

        if (restAfterSet === 0) {
          transitionToPhase(
            preparation > 0 ? PHASES.COUNTDOWN : PHASES.HANG,
            preparation || hangTime,
          );
        } else {
          transitionToPhase(PHASES.REST_BETWEEN_SETS, restAfterSet);
        }
      } else {
        completeWorkout();
      }
    };

    const handleRestAfterHangPhase = () => {
      transitionToPhase(PHASES.HANG, hangTime);
    };

    const handleRestBetweenSetsPhase = () => {
      transitionToPhase(
        PHASES.COUNTDOWN,
        preparation > 0 ? preparation : hangTime,
      );
    };

    switch (currentPhase) {
      case PHASES.COUNTDOWN:
        handleCountdownPhase();
        break;
      case PHASES.HANG:
        handleHangPhase();
        break;
      case PHASES.REST_AFTER_HANG:
        handleRestAfterHangPhase();
        break;
      case PHASES.REST_BETWEEN_SETS:
        handleRestBetweenSetsPhase();
        break;
      case PHASES.COMPLETE:
        handleSetTime(null);
        break;
      default:
        console.error(`Unexpected phase: ${currentPhase}`);
        break;
    }
  };

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
        if (
          appState === 'active' &&
          nextAppState.match(/inactive|background/)
        ) {
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
    if (currentPhase !== PHASES.COMPLETE) {
      if (timer.isStopped()) {
        if (currentPhase !== PHASES.REST_BETWEEN_SETS) {
          if (preparation !== 0) {
            handleSetTime(preparation);
            setCurrentPhase(PHASES.COUNTDOWN);
          }
        }
        setTimerOn(true);
        timer.start();
      } else if (timer.isPaused()) {
        setTimerOn(true);
        timer.resume();
      } else {
        setTimerOn(false);
        timer.pause();
      }
    }
  };

  const previousRep = () => {
    timer.stop();
    if (currentPhase === PHASES.REST_BETWEEN_SETS) {
      setCurrentPhase(PHASES.HANG);
      handleSetTime(hangTime);
      setSetsLeft(setsLeft + 1);
      setRepsLeft(1);
    } else if (currentPhase === PHASES.COMPLETE) {
      setSetsLeft(1);
      setRepsLeft(1);
      setCurrentPhase(PHASES.HANG);
      handleSetTime(hangTime);
    } else if (currentPhase === PHASES.COUNTDOWN && time < 50) {
      handleSetTime(preparation);
    } else if (repsLeft < reps) {
      setRepsLeft(repsLeft + 1);
      setCurrentPhase(PHASES.HANG);
      handleSetTime(hangTime);
    } else if (setsLeft < sets) {
      setCurrentPhase(PHASES.REST_BETWEEN_SETS);
      handleSetTime(restAfterSet);
    } else if (repsLeft === reps) {
      handleSetTime(hangTime);
    }
  };

  const nextRep = () => {
    timer.stop();
    if (currentPhase === PHASES.REST_BETWEEN_SETS) {
      setCurrentPhase(PHASES.HANG);
      handleSetTime(hangTime);
    } else {
      if (repsLeft > 0) {
        setRepsLeft(repsLeft - 1);
        setCurrentPhase(PHASES.HANG);
        handleSetTime(hangTime);
      }
      if ((repsLeft - 1 === 0 || repsLeft === 0) && setsLeft - 1 === 0) {
        setCurrentPhase(PHASES.COMPLETE);
        handleSetTime(null);
        setSetsLeft(0);
        setRepsLeft(0);
      }
      if ((repsLeft - 1 === 0 || repsLeft === 0) && setsLeft > 1) {
        setCurrentPhase(PHASES.REST_BETWEEN_SETS);
        handleSetTime(restAfterSet);
        setRepsLeft(reps);
        setSetsLeft(setsLeft - 1);
      }
    }
  };

  return {
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
  };
};
