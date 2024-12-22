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
                <Ionicons name="pencil" size={32} color="#555555" />
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
                <SaveWorkoutButton onPress={handleSave} text={"Save as workout"} />
            </View>
        </View>
    )
}

export default NewScreen;