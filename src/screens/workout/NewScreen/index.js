import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

import { View, Text, TextInput, ScrollView } from 'react-native';
import { NumberSelector } from '../../../components/selectors/numberSelector';
import { TimeSelector } from '../../../components/selectors/timeSelector';
import { useWorkoutValues } from '../../../utils/functions';
import { workoutStyles } from '../styles';
import { getAllItems, saveItem } from '../../../utils/functions';
import { Ionicons } from '@expo/vector-icons';
import { SaveWorkoutButton } from '../../../components/buttons/startButton';
import { palette } from '../../../utils/palette';
import TotalWorkoutTime from '../../../components/totalWorkoutTime';

const NewScreen = () => {
    const route = useRoute();
    const { workout, values, id } = route.params;
    const navigation = useNavigation();
    console.log(values);
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
                    placeholder='Add name'
                    value={workoutName}
                    editable={true}
                    placeholderTextColor={palette.grayText}
                />
                <Ionicons name="pencil" size={26} color={palette.grayText} />
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
                <TotalWorkoutTime workoutValues={workoutValues} />
            </ScrollView>
            <View style={[workoutStyles.buttonContainer, { justifyContent: "center" }]}>
                <SaveWorkoutButton onPress={handleSave} text={"Save as workout"} />
            </View>
        </View>
    )
}

export default NewScreen;