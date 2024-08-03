// useWorkoutTimer.js
import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useTimer } from 'react-use-precision-timer';
import { getRemaining } from './useTimer';
import { getItem } from '../../utils/functions';
import { Audio } from 'expo-av';

const PHASE_COUNTDOWN = 'countdown';
const PHASE_HANG = 'hang';
const PHASE_REST_AFTER_HANG = 'restAfterHang';
const PHASE_REST_BETWEEN_SETS = 'restBetweenSets';
const PHASE_COMPLETE = 'complete';

const soundFiles = {
    ready: require('../../../assets/ready-beep.mp3'),
    start: require('../../../assets/start-beep.mp3'),
    end: require('../../../assets/end-beep.mp3'),
};

export const useWorkoutTimer = ({ hangTime, restAfterHang, restAfterSet, sets, reps }) => {
    const [currentPhase, setCurrentPhase] = useState('hang');
    const [setsLeft, setSetsLeft] = useState(sets);
    const [repsLeft, setRepsLeft] = useState(reps);
    const [time, setTime] = useState(hangTime * 10);

    const [preparation, setPreparation] = useState(5);
    const [playSoundEnabled, setPlaySoundEnabled] = useState(false);

    const handleSetTime = (value) => {
        setTime(value * 10);
    };

    const handleTimerCallback = useCallback(() => {
        setTime((prevTime) => prevTime - 1);
    }, []);

    const fetchItems = async () => {
        const prep = await getItem("@preparation");
        const play = await getItem("@audio");

        setPreparation(Number(prep) || 5);
        setPlaySoundEnabled(play)
    }

    useFocusEffect(
        useCallback(() => {
            fetchItems();
        }, [])
    );

    const timer = useTimer({ delay: 100 }, handleTimerCallback);
    const { mins, secs, tenths } = getRemaining(time);

    const transitionToNextPhase = () => {
        switch (currentPhase) {
            case PHASE_COUNTDOWN:
                if (repsLeft === 0 && setsLeft === 0) {
                    setCurrentPhase(PHASE_COMPLETE);
                } else {
                    setCurrentPhase(PHASE_HANG);
                    handleSetTime(hangTime);
                }
                break;
            case PHASE_HANG:
                setRepsLeft(repsLeft - 1);
                if (repsLeft > 1) {
                    setCurrentPhase(PHASE_REST_AFTER_HANG);
                    handleSetTime(restAfterHang);
                } else if (setsLeft > 1) {
                    setCurrentPhase(PHASE_REST_BETWEEN_SETS);
                    setSetsLeft(setsLeft - 1);
                    handleSetTime(restAfterSet);
                    setRepsLeft(reps);
                } else {
                    setCurrentPhase(PHASE_COMPLETE);
                }
                break;
            case PHASE_REST_AFTER_HANG:
                setCurrentPhase(PHASE_HANG);
                handleSetTime(hangTime);
                break;
            case PHASE_REST_BETWEEN_SETS:
                setCurrentPhase(PHASE_COUNTDOWN);
                handleSetTime(preparation);
                break;
            case PHASE_COMPLETE:
                handleSetTime(null);
                timer.stop();
                setSetsLeft(0);
                setRepsLeft(0);
                break;
            default:
                console.error(`Unexpected phase: ${currentPhase}`);
                break;
        }
    };

    const [sounds, setSounds] = useState([]);

    useEffect(() => {
        // Function to load the sounds
        const loadSounds = async () => {
            try {
                console.log("Loading sounds...");

                const soundFiles = [
                    require('../../../assets/ready-beep.mp3'),
                    require('../../../assets/start-beep.mp3'),
                    require('../../../assets/end-beep.mp3'),
                ];

                const soundObjects = await Promise.all(soundFiles.map(async (file) => {
                    const { sound } = await Audio.Sound.createAsync(file);
                    return sound;
                }));

                setSounds(soundObjects);
                console.log("Sounds loaded successfully.");
            } catch (error) {
                console.error("Error loading sounds:", error);
            }
        };

        // Call the function to load the sounds
        loadSounds();
        // Cleanup function to unload the sounds
        return () => {
            sounds.forEach(async (sound) => {
                if (sound) {
                    console.log("Unloading sound...");
                    await sound.unloadAsync();
                }
            });
        };
    }, []);

    // Function to play the sound
    const playSound1 = async (type) => {
        // console.log(sounds[2]);
        // await sounds[2].replayAsync();
        if (type === "ready" && sounds[0]) {
            try {
                console.log("Playing sound 1...");
                await sounds[0].replayAsync();
            } catch (error) {
                console.error("Error playing sound 1:", error);
            }
        } else if (type === "start" && sounds[1]) {
            try {
                console.log("Playing sound 2...");
                await sounds[1].replayAsync();
            } catch (error) {
                console.error("Error playing sound 2:", error);
            }
        } else if (type === "end" && sounds[2]) {
            try {
                await sounds[2].playAsync();
                console.log("Playing sound 3...");
                await sounds[2].replayAsync();
            } catch (error) {
                console.error("Error playing sound 3:", error);
            }
        }
    };


    const handlePhaseTransition = () => {
        if (playSoundEnabled) {
            if (currentPhase === PHASE_COUNTDOWN) {
                if (time === 10 || time === 20 || time === 30) {
                    playSound1("ready");
                } else if (time === 0) {
                    playSound1("start");
                }
            }
            if (currentPhase === PHASE_HANG && time === 0) {
                playSound1("end");
            }
            if (currentPhase === PHASE_REST_AFTER_HANG && time === 0) {
                playSound1("start");
            }
        }

        if (time <= 0) {
            transitionToNextPhase();
        }
    };
    useEffect(() => {
        handlePhaseTransition();
    }, [time]);

    const toggle = () => {
        if (currentPhase !== PHASE_COMPLETE) {
            if (timer.isStopped()) {
                if (currentPhase !== PHASE_REST_BETWEEN_SETS) {
                    handleSetTime(preparation);
                    setCurrentPhase(PHASE_COUNTDOWN);
                }
                timer.start();
            } else if (timer.isPaused()) {
                timer.resume();
            } else {
                timer.pause();
            }
        }
    };

    const previousRep = () => {
        timer.stop();
        if (currentPhase === PHASE_REST_BETWEEN_SETS) {
            setCurrentPhase(PHASE_HANG);
            handleSetTime(hangTime);
            setSetsLeft(setsLeft + 1);
            setRepsLeft(1);
        } else {
            if (currentPhase === PHASE_COMPLETE) {
                setSetsLeft(1);
                setRepsLeft(1);
                setCurrentPhase(PHASE_HANG);
                handleSetTime(hangTime);
            } else if (currentPhase === PHASE_COUNTDOWN && time < 50) {
                handleSetTime(preparation);
            } else if (repsLeft < reps) {
                setRepsLeft(repsLeft + 1);
                setCurrentPhase(PHASE_HANG);
                handleSetTime(hangTime);
            } else if (setsLeft < sets) {
                setCurrentPhase(PHASE_REST_BETWEEN_SETS);
                handleSetTime(restAfterSet);
            } else if (repsLeft === reps) {
                handleSetTime(hangTime);
            }
        }
    };

    const nextRep = () => {
        timer.stop();
        if (currentPhase === PHASE_REST_BETWEEN_SETS) {
            setCurrentPhase(PHASE_HANG);
            handleSetTime(hangTime);
        } else {
            if (repsLeft > 0) {
                setRepsLeft(repsLeft - 1);
                setCurrentPhase(PHASE_HANG);
                handleSetTime(hangTime);
            }
            if ((repsLeft - 1 === 0 || repsLeft === 0) && (setsLeft - 1 === 0 || setsLeft === 0)) {
                setCurrentPhase(PHASE_COMPLETE);
                handleSetTime(null);
                setSetsLeft(0);
                setRepsLeft(0);
            }
            if ((repsLeft - 1 === 0 || repsLeft === 0) && setsLeft > 1) {
                setCurrentPhase(PHASE_REST_BETWEEN_SETS);
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
