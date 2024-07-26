// Import necessary dependencies
import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

import { View, Text, Alert, TextInput, Image, ScrollView } from 'react-native';
import { NumberSelector } from '../../components/selectors/numberSelector';
import { TimeSelector } from '../../components/selectors/timeSelector';
import { useWorkoutValues } from '../../utils/functions';
import { workoutStyles } from './styles';
import StartButton from '../../components/buttons/startButton';

const WorkoutScreen = () => {
    const route = useRoute();
    const { workout, values, id } = route.params;
    console.log(workout)
    const navigation = useNavigation();

    const workoutValues = useWorkoutValues(values);

    return (
        <View style={workoutStyles.background}>
            <View style={workoutStyles.header}>
                <Text style={workoutStyles.title}>{workout}</Text>
       
            </View>
            <ScrollView style={workoutStyles.container} contentContainerStyle={workoutStyles.contentContainer}>
                <Text style={workoutStyles.text}>Sets</Text>
                <NumberSelector value={workoutValues.sets} setValue={workoutValues.setSets} />
                <Text style={workoutStyles.text}>Reps</Text>
                <NumberSelector value={workoutValues.reps} setValue={workoutValues.setReps} />
                <Text style={workoutStyles.text}>Hang time</Text>
                <TimeSelector
                    timeMinutes={workoutValues.hangtimeMinutes} setTimeMinutes={workoutValues.setHangtimeMinutes}
                    timeSeconds={workoutValues.hangtimeSeconds} setTimeSeconds={workoutValues.setHangtimeSeconds} />

                <Text style={workoutStyles.text}>Rest time after hang</Text>
                <TimeSelector
                    timeMinutes={workoutValues.restTimeSeconds} setTimeMinutes={workoutValues.setRestTimeSeconds}
                    timeSeconds={workoutValues.restTimeMinutes} setTimeSeconds={workoutValues.setRestTimeMinutes} />

                <Text style={workoutStyles.text}>Rest time between sets</Text>
                <TimeSelector
                    timeMinutes={workoutValues.restTimeSetSeconds} setTimeMinutes={workoutValues.setRestTimeSetSeconds}
                    timeSeconds={workoutValues.restTimeMinutes} setTimeSeconds={workoutValues.setRestTimeMinutes} />
            </ScrollView>
            <StartButton />
        </View>
    )
};

export default WorkoutScreen;