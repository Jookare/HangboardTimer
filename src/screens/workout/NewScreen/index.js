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
import { palette } from '../../../utils/palette';

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
                    placeholderTextColor={palette.grayIconBG}
                    editable={true}
                />
                <Ionicons name="pencil" size={32}  color={palette.grayIconBG} />
            </View>
            <ScrollView style={workoutStyles.container} contentContainerStyle={workoutStyles.contentContainer}>
                <Text style={workoutStyles.text}>Sets</Text>
                <NumberSelector
                    value={workoutValues.sets}
                    setValue={setters.setSets}
                    selectorType={"sets"}
                />

                <Text style={workoutStyles.text}>Reps</Text>
                <NumberSelector
                    value={workoutValues.reps}
                    setValue={setters.setReps}
                    selectorType={"reps"}
                />

                <Text style={workoutStyles.text}>Hang time</Text>
                <TimeSelector
                    timeSeconds={workoutValues.hangtimeSeconds}
                    setTimeSeconds={setters.setHangtimeSeconds}
                    timeMinutes={workoutValues.hangtimeMinutes}
                    setTimeMinutes={setters.setHangtimeMinutes}
                    selectorType={"hang time"}
                />

                <Text style={workoutStyles.text}>Rest time between reps</Text>
                <TimeSelector
                    timeSeconds={workoutValues.restTimeSeconds}
                    setTimeSeconds={setters.setRestTimeSeconds}
                    timeMinutes={workoutValues.restTimeMinutes}
                    setTimeMinutes={setters.setRestTimeMinutes}
                    selectorType={"rest between reps"}
                />

                <Text style={workoutStyles.text}>Rest time between sets</Text>
                <TimeSelector
                    timeSeconds={workoutValues.restTimeSetSeconds}
                    setTimeSeconds={setters.setRestTimeSetSeconds}
                    timeMinutes={workoutValues.restTimeSetMinutes}
                    setTimeMinutes={setters.setRestTimeSetMinutes}
                    selectorType={"rest between sets"}
                />
            </ScrollView>
            <View style={[workoutStyles.buttonContainer, { justifyContent: "center" }]}>
                <SaveWorkoutButton onPress={handleSave} text={"Save as workout"} />
            </View>
        </View>
    )
}

export default NewScreen;