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
            <ScrollView style={workoutStyles.container} contentContainerStyle={workoutStyles.contentContainer}>
                <Text style={workoutStyles.text}>Sets</Text>
                <NumberSelector value={workoutValues.sets} setValue={setters.setSets} />
                <Text style={workoutStyles.text}>Reps</Text>
                <NumberSelector value={workoutValues.reps} setValue={setters.setReps} />
                <Text style={workoutStyles.text}>Hang time</Text>
                <TimeSelector
                    timeMinutes={workoutValues.hangtimeMinutes} setTimeMinutes={setters.setHangtimeMinutes}
                    timeSeconds={workoutValues.hangtimeSeconds} setTimeSeconds={setters.setHangtimeSeconds} />

                <Text style={workoutStyles.text}>Rest time after hang</Text>
                <TimeSelector
                    timeMinutes={workoutValues.restTimeMinutes} setTimeMinutes={setters.setRestTimeMinutes}
                    timeSeconds={workoutValues.restTimeSeconds} setTimeSeconds={setters.setRestTimeSeconds} />

                <Text style={workoutStyles.text}>Rest time between sets</Text>
                <TimeSelector
                    timeMinutes={workoutValues.restTimeSetMinutes} setTimeMinutes={setters.setRestTimeMinutes}
                    timeSeconds={workoutValues.restTimeSetSeconds} setTimeSeconds={setters.setRestTimeSetSeconds} />
            </ScrollView>
            <View style={[workoutStyles.buttonContainer, { justifyContent: "center" }]}>
                <StartButton onPress={() => handleNavigation()} />
            </View>
        </View>
    )
};

export default WorkoutScreen;