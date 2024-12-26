import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, Text, Alert, TextInput, ScrollView } from 'react-native';
import { NumberSelector } from '../../../components/selectors/numberSelector';
import { TimeSelector } from '../../../components/selectors/timeSelector';
import { useWorkoutValues } from '../../../utils/functions';
import { workoutStyles } from '../styles';
import { StartButton } from '../../../components/buttons/startButton';
import { RemoveButton, SaveButton } from '../../../components/buttons/sideButton'
import { saveItem, deleteItem } from '../../../utils/functions';
import { Ionicons } from '@expo/vector-icons';
import { toast } from '@backpackapp-io/react-native-toast';
import { palette } from '../../../utils/palette';

const CustomScreen = () => {
    const route = useRoute();
    const { workout, values, id } = route.params;
    const navigation = useNavigation();
    const { workoutValues, setters } = useWorkoutValues(values);
    const [workoutName, onChangeWorkoutName] = useState(workout);

    const storeData = async () => {
        let stored = JSON.stringify({
            id: id,
            values: [workoutValues.sets, workoutValues.reps, Number(workoutValues.hangtimeMinutes),
            Number(workoutValues.hangtimeSeconds), Number(workoutValues.restTimeMinutes),
            Number(workoutValues.restTimeSeconds), Number(workoutValues.restTimeSetMinutes),
            Number(workoutValues.restTimeSetSeconds)],
            name: workoutName
        })
        await saveItem(id, stored);
        toast.success('Workout saved!', {
            width: 300,
            styles: {
                view: {
                    backgroundColor: '#f7f7f7',
                    borderRadius: 8,
                    padding: 16,
                },
                text: {
                    color: 'black',
                },
                indicator: {
                    marginRight: 16,
                },
            },
        });
    }

    const removeData = async () => {
        await deleteItem(id);
        navigation.navigate('Main');
        toast.success('Workout removed!', {
            width: 300,
            styles: {
                view: {
                    backgroundColor: '#f7f7f7',
                    borderRadius: 8,
                    padding: 16,
                },
                text: {
                    color: 'black',
                },
                indicator: {
                    marginRight: 16,
                },
            },
        });
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

    const handleNavigation = () => {
        navigation.navigate('Timer', { workoutValues });
    };

    return (
        <View style={workoutStyles.background}>
            <View style={workoutStyles.header}>
                <TextInput
                    style={workoutStyles.input}
                    onChangeText={onChangeWorkoutName}
                    placeholder='Workout name'
                    value={workoutName}
                    placeholderTextColor={palette.grayBorder}
                    editable={true}
                />
                <Ionicons name="pencil" size={32} color={palette.dark} />
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
            <View style={[workoutStyles.buttonContainer]}>
                <SaveButton onPress={createSaveButtonAlert} />
                <StartButton onPress={handleNavigation} />
                <RemoveButton onPress={createRemoveButtonAlert} />
            </View>
        </View>
    )
}

export default CustomScreen;