import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

import { View, Text, Alert, TextInput, Image, ScrollView } from 'react-native';
import { NumberSelector } from '../../../components/selectors/numberSelector';
import { TimeSelector } from '../../../components/selectors/timeSelector';
import { useWorkoutValues } from '../../../utils/functions';
import { workoutStyles } from '../styles';
import StartButton from '../../../components/buttons/startButton';
import { RemoveButton, SaveButton } from './buttons';
import { getAllWorkouts, saveWorkout, deleteWorkout } from '../../../utils/functions';

const NewScreen = () => {
    const route = useRoute();
    const { workout, values, id } = route.params;
    const navigation = useNavigation();
    const workoutValues = useWorkoutValues(values);
    const [workoutName, onChangeWorkoutName] = useState('New workout');

    const handleSave = async () => {
        const allWorkouts = await getAllWorkouts();
        // await AsyncStorage.clear()
        let stored = JSON.stringify({
            id: `workout${(allWorkouts.length + 1)}`,
            values: [workoutValues.sets, workoutValues.reps, Number(workoutValues.hangtimeMinutes),
                Number(workoutValues.hangtimeSeconds), Number(workoutValues.restTimeMinutes),
                Number(workoutValues.restTimeSeconds), Number(workoutValues.restTimeSetMinutes),
                Number(workoutValues.restTimeSetSeconds)],
            name: workoutName
        })
        await saveWorkout(`workout${(allWorkouts.length + 1)}`, stored);
        navigation.navigate('Main');
    }

    return (
        <View style={workoutStyles.background}>
            <View style={workoutStyles.header}>
                <TextInput
                    style={workoutStyles.input}
                    onChangeText={onChangeWorkoutName}
                    placeholder='New name'
                    value={workoutName}
                    placeholderTextColor="#d8d5e8"
                    editable={true}
                />
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
            <View style={[workoutStyles.buttonContainer, { justifyContent: "space-between" }]}>
                <SaveButton onPress={handleSave} />
                <StartButton />
                <RemoveButton onPress={handleSave} />
            </View>
        </View>
    )
}

export default NewScreen;