import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useTimer } from 'react-use-precision-timer';
import { useSounds } from './useSounds';
import { getRemaining } from './useTimerUtils';
import { getItem } from '../../../utils/functions';
import { AppState } from 'react-native'
const PHASES = {
    COUNTDOWN: 'countdown',
    HANG: 'hang',
    REST_AFTER_HANG: 'restAfterHang',
    REST_BETWEEN_SETS: 'restBetweenSets',
    COMPLETE: 'complete',
};



export const useWorkoutTimer = ({ hangTime, restAfterHang, restAfterSet, sets, reps }) => {
    const [currentPhase, setCurrentPhase] = useState(PHASES.HANG);
    const [setsLeft, setSetsLeft] = useState(sets);
    const [repsLeft, setRepsLeft] = useState(reps);

    const [time, setTime] = useState(hangTime * 10); // Timer in tenths of a second
    const [preparation, setPreparation] = useState(5);
    const [playSoundEnabled, setPlaySoundEnabled] = useState(false);
    const [appState, setAppState] = useState(AppState.currentState);


    const [timerOn, setTimerOn] = useState(false)

    const { mins, secs, tenths } = getRemaining(time);
    const { playSound } = useSounds();

    const handleSetTime = (value) => {
        setTime(value * 10);
    };

    const handleTimerCallback = useCallback(() => {
        setTime((prev) => Math.max(prev - 1, 0));
    }, []);

    const timer = useTimer({ delay: 100 }, handleTimerCallback);

    const fetchSettings = async () => {
        let prep = await getItem('@preparation');
        let play = await getItem('@audio');

        prep = prep !== null ? JSON.parse(prep) : 5;
        setPreparation(prep);
        setPlaySoundEnabled(play);
    };

    useFocusEffect(
        useCallback(() => {
            fetchSettings();
        }, [])
    );

    useEffect(() => {
        handlePhaseTransition();
    }, [time]);

    const handlePhaseTransition = () => {
        if (playSoundEnabled) {
            // Extra countdown sounds
            if (currentPhase === PHASES.COUNTDOWN) {
                if (time === 30) { // 3 seconds left
                    playSound('ready');
                } else if (time === 20) { // 2 seconds left
                    playSound('ready');
                } else if (time === 10) { // 1 second left
                    playSound('ready');
                }
            }
    
            // Play sound at the end of REST_BETWEEN_SETS
            if (currentPhase === PHASES.REST_BETWEEN_SETS && time === 0 && preparation > 3) {
                playSound('ready'); // Signals that the next phase (COUNTDOWN) is starting
            }
        }
    
        if (time <= 0) {
            if (playSoundEnabled) {
                if (currentPhase === PHASES.COUNTDOWN || currentPhase === PHASES.REST_AFTER_HANG) {
                    playSound('start');
                } else if (currentPhase === PHASES.HANG) {
                    playSound('end');
                }
            }
            
            transitionToNextPhase();
        }
    };

    const transitionToNextPhase = () => {

        const transitionToPhase = (phase, time = null) => {
            setCurrentPhase(phase);
            handleSetTime(time);
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
                // Transition based on restAfterHang
                transitionToPhase(restAfterHang === 0 ? PHASES.HANG : PHASES.REST_AFTER_HANG, restAfterHang || hangTime);
            } else if (setsLeft > 1) {
                setSetsLeft(setsLeft - 1);
                setRepsLeft(reps);

                // Handle the case where restAfterSet === 0
                if (restAfterSet === 0) {
                    transitionToPhase(preparation > 0 ? PHASES.COUNTDOWN : PHASES.HANG, preparation || hangTime);
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
            transitionToPhase(PHASES.COUNTDOWN, preparation > 0 ? preparation : hangTime);
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


    const [timetFinishTime, setTimerFinishTime] = useState(0)

    useEffect(() => {
        const newFinishTime = Date.now() + time * 100;
        setTimerFinishTime(newFinishTime); // Ensure this updates first
    }, [time]);

    const restartTimer = useCallback(() => {
        const time2 = Math.round((timetFinishTime - Date.now()) / 100) / 10;
        handleSetTime(time2 > 0 ? time2 : 0);
        timer.resume();
    }, [timer, timetFinishTime]); // Add `timetFinishTime` here

    const onAppStateChange = useCallback(
        (nextAppState) => {
            if (timerOn) {
                if (appState === 'active' && nextAppState.match(/inactive|background/)) {
                    timer.pause()
                } else if (
                    appState.match(/inactive|background/) &&
                    nextAppState === 'active'
                ) {
                    restartTimer()
                }

                setAppState(nextAppState)
            }
        },
        [appState, restartTimer],
    )

    useEffect(() => {
        const appStateChangeListener = AppState.addEventListener(
            'change',
            onAppStateChange,
        )
        return appStateChangeListener.remove
    }, [onAppStateChange])



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
        } else {
            if (currentPhase === PHASES.COMPLETE) {
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
            if ((repsLeft - 1 === 0 || repsLeft === 0) && (setsLeft - 1 === 0)) {
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
        currentPhase, setsLeft, repsLeft, mins, secs, tenths, toggle, previousRep, nextRep, timer,
    };
};
