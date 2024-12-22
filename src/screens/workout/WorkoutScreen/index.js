// Import necessary dependencies
import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

import { View, Text, Alert, TextInput, Image, ScrollView } from 'react-native';
import { NumberSelector } from '../../../components/selectors/numberSelector';
import { TimeSelector } from '../../../components/selectors/timeSelector';
import { useWorkoutValues, getWorkoutParams } from '../../../utils/functions';
import { workoutStyles } from '../styles';
import { StartButton } from '../../../components/buttons/startButton';

const WorkoutScreen = () => {
    const route = useRoute();
    const navigation = useNavigation(); // Get navigation object

    const { workout, values } = route.params;
    const { workoutValues, setters } = useWorkoutValues(values);

    const handleNavigation = () => {
        navigation.navigate('Timer', { workoutValues });
    };

    return (
        <View style={workoutStyles.background}>
            <View style={workoutStyles.header}>
                <Text style={workoutStyles.title}>{workout}</Text>

            </View>
            <ScrollView style={workoutStyles.container} contentContainerStyle={workoutStyles.contentContainer}
                accessibilityLabel="Workout settings scrollable list">
                <Text
                    style={workoutStyles.text}
                    accessibilityLabel="Label for sets selector"
                >
                    Sets
                </Text>
                <NumberSelector
                    value={workoutValues.sets}
                    setValue={setters.setSets}
                    accessibilityLabel={`Number selector for sets, current value is ${workoutValues.sets}`}
                />

                <Text
                    style={workoutStyles.text}
                    accessibilityLabel="Label for reps selector"
                >
                    Reps
                </Text>
                <NumberSelector
                    value={workoutValues.reps}
                    setValue={setters.setReps}
                    accessibilityLabel={`Number selector for reps, current value is ${workoutValues.reps}`}
                />
                <Text
                    style={workoutStyles.text}
                    accessibilityLabel="Label for hang time selector"
                >
                    Hang time
                </Text>
                <TimeSelector
                    timeSeconds={workoutValues.hangtimeSeconds}
                    setTimeSeconds={setters.setHangtimeSeconds}
                    timeMinutes={workoutValues.hangtimeMinutes}
                    setTimeMinutes={setters.setHangtimeMinutes}
                    accessibilityLabel={`Time selector for hang time. Minutes: ${workoutValues.hangtimeMinutes}, Seconds: ${workoutValues.hangtimeSeconds}`}
                />

                <Text
                    style={workoutStyles.text}
                    accessibilityLabel="Label for rest time after hang selector"
                >
                    Rest time between reps
                </Text>
                <TimeSelector
                    timeSeconds={workoutValues.restTimeSeconds}
                    setTimeSeconds={setters.setRestTimeSeconds}
                    timeMinutes={workoutValues.restTimeMinutes}
                    setTimeMinutes={setters.setRestTimeMinutes}
                    accessibilityLabel={`Time selector for rest time after hang. Minutes: ${workoutValues.restTimeSeconds}, Seconds: ${workoutValues.restTimeMinutes}`}
                />
                <Text
                    style={workoutStyles.text}
                    accessibilityLabel="Label for rest time between sets selector">
                    Rest time between sets
                </Text>
                <TimeSelector
                    timeSeconds={workoutValues.restTimeSetSeconds}
                    setTimeSeconds={setters.setRestTimeSetSeconds}
                    timeMinutes={workoutValues.restTimeSetMinutes}
                    setTimeMinutes={setters.setRestTimeSetMinutes}
                    accessibilityLabel={`Time selector for rest time between sets. Minutes: ${workoutValues.restTimeSetSeconds}, Seconds: ${workoutValues.restTimeSetMinutes}`}
                />
            </ScrollView>
            <View style={[workoutStyles.buttonContainer, { justifyContent: "center" }]}>
                <StartButton onPress={() => handleNavigation()} />
            </View>
        </View>
    )
};

export default WorkoutScreen;