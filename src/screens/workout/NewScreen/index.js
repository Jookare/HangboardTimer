import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

import { View, Text, Alert, TextInput, Image, ScrollView } from 'react-native';
import { NumberSelector } from '../../../components/selectors/numberSelector';
import { TimeSelector } from '../../../components/selectors/timeSelector';
import { useWorkoutValues } from '../../../utils/functions';
import { workoutStyles } from '../styles';
import { getAllItems, saveItem, deleteItem } from '../../../utils/functions';
import { Ionicons } from '@expo/vector-icons';
import { SaveWorkoutButton } from '../../../components/buttons/startButton';

const NewScreen = () => {
    const route = useRoute();
    const { workout, values, id } = route.params;
    const navigation = useNavigation();
    const { workoutValues, setters } = useWorkoutValues(values);
    const [workoutName, onChangeWorkoutName] = useState('');

    const handleSave = async () => {
        const allWorkouts = await getAllItems();
        let stored = JSON.stringify({
            id: `#workout${(allWorkouts.length + 1)}`,
            values: [workoutValues.sets, workoutValues.reps, Number(workoutValues.hangtimeMinutes),
            Number(workoutValues.hangtimeSeconds), Number(workoutValues.restTimeMinutes),
            Number(workoutValues.restTimeSeconds), Number(workoutValues.restTimeSetMinutes),
            Number(workoutValues.restTimeSetSeconds)],
            name: workoutName
        })
        await saveItem(`#workout${(allWorkouts.length + 1)}`, stored);

        navigation.navigate('Main');
    }

    return (
        <View style={workoutStyles.background}>
            <View style={workoutStyles.header}>
                <TextInput
                    style={workoutStyles.input}
                    onChangeText={onChangeWorkoutName}
                    placeholder='Workout name'
                    value={workoutName}
                    placeholderTextColor="#8d8d8d"
                    editable={true}
                />
                <Ionicons name="pencil" size={40} color="#555555" />
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
                    timeMinutes={workoutValues.restTimeSeconds} setTimeMinutes={setters.setRestTimeSeconds}
                    timeSeconds={workoutValues.restTimeMinutes} setTimeSeconds={setters.setRestTimeMinutes} />

                <Text style={workoutStyles.text}>Rest time between sets</Text>
                <TimeSelector
                    timeMinutes={workoutValues.restTimeSetSeconds} setTimeMinutes={setters.setRestTimeSetSeconds}
                    timeSeconds={workoutValues.restTimeMinutes} setTimeSeconds={setters.setRestTimeMinutes} />
            </ScrollView>
            <View style={[workoutStyles.buttonContainer, { justifyContent: "center", width: "auto" }]}>
                <SaveWorkoutButton onPress={handleSave} text={"Save as workout"} />
            </View>
        </View>
    )
}

export default NewScreen;