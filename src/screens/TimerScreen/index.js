import React, { useState } from 'react';
import { View, Text, Button, Pressable } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';
import { useWorkoutTimer } from './hooks/useWorkoutTimer';

import Gradient from './Gradient';
import PhaseText from './PhaseText';
import ControlButtons from './ControlButtons';

const TimerScreen = () => {
    const route = useRoute();
    const { workoutValues } = route.params;

    const hangTime = Number(workoutValues.hangtimeMinutes * 60) + Number(workoutValues.hangtimeSeconds);
    const restAfterHang = Number(workoutValues.restTimeMinutes * 60) + Number(workoutValues.restTimeSeconds);
    const restAfterSet = Number(workoutValues.restTimeSetMinutes * 60) + Number(workoutValues.restTimeSetSeconds);
    const sets = workoutValues.sets;
    const reps = workoutValues.reps;


    const { currentPhase, setsLeft, repsLeft, mins, secs, tenths, toggle, previousRep, nextRep, timer } = useWorkoutTimer({
        hangTime, restAfterHang, restAfterSet, sets, reps,
    });

    const previousFlag = () => timer.isStopped() && repsLeft === reps && setsLeft === sets;
    const nextFlag = () => timer.isStopped() && repsLeft === 0 && setsLeft === 0;

    return (
        <View style={styles.container}>
            <Gradient phase={currentPhase} />
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>{Math.max(0, (setsLeft - 1) * reps + repsLeft)} HANGS TO GO!</Text>
            </View>
            <View style={styles.timerContainer}>
                <Text style={styles.timerText}>{`${mins}:${secs}`}<Text style={{ fontSize: 50, color: "rgba(0, 0, 0, 0.5)" }}>{tenths}</Text></Text>
            </View>
            <View style={styles.phaseContainer}>
                <PhaseText phase={currentPhase} timer={timer} />
            </View>
            <View style={styles.statusContainer}>
                <View style={styles.repsetContainer}>
                    <Text style={{fontSize: 16}}>SETS LEFT</Text>
                    <Text style={styles.repsetText}>{setsLeft}</Text>
                </View>
                <View style={styles.repsetContainer}>
                    <Text style={{fontSize: 16}}>REPS LEFT</Text>
                    <Text style={styles.repsetText}>{repsLeft}</Text>
                </View>
            </View>
            <ControlButtons
                toggle={toggle}
                previousRep={previousRep}
                nextRep={nextRep}
                previousFlag={previousFlag}
                nextFlag={nextFlag}
                timer={timer}
            />
        </View>
    );
};

export default TimerScreen;

