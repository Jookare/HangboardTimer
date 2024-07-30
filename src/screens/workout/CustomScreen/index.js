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

const CustomScreen = () => {
    const route = useRoute();
    const { workout, values, id } = route.params;
    const navigation = useNavigation();
    const workoutValues = useWorkoutValues(values);
    const [workoutName, onChangeWorkoutName] = useState('Custom workout');

    console.log(id)
    const storeData = async () => {
        // await AsyncStorage.clear()
        let stored = JSON.stringify({
            id: id,
            values: [workoutValues.sets, workoutValues.reps, Number(workoutValues.hangtimeMinutes),
            Number(workoutValues.hangtimeSeconds), Number(workoutValues.restTimeMinutes),
            Number(workoutValues.restTimeSeconds), Number(workoutValues.restTimeSetMinutes),
            Number(workoutValues.restTimeSetSeconds)],
            name: workoutName
        })
        await saveWorkout(id, stored);
    }

    const removeData = async () => {
        await deleteWorkout(id);
        navigation.navigate('Main');
    }

    const createSaveButtonAlert = () =>
        Alert.alert('Save workout', 'Are you sure you want to save workout changes?', [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            { text: 'OK', onPress: () => storeData() },
        ]);

    const createRemoveButtonAlert = () =>
        Alert.alert('Remove workout', 'Are you sure you want to remove workout?', [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            { text: 'OK', onPress: () => removeData() },
        ]);
    return (
        <View style={workoutStyles.background}>
            <View style={workoutStyles.header}>
                <Text>Custom</Text>
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
                <SaveButton onPress={createSaveButtonAlert} />
                <StartButton />
                <RemoveButton onPress={createRemoveButtonAlert} />
            </View>
        </View>
    )
}

export default CustomScreen;