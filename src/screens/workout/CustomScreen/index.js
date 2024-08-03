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
            width: 300
        });
    }

    const removeData = async () => {
        await deleteItem(id);
        navigation.navigate('Main');
        toast.success('Workout removed!', {
            width: 300
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
                    placeholder='New name'
                    value={workoutName}
                    placeholderTextColor="#d8d5e8"
                    editable={true}
                />
                <Ionicons name="pencil" size={40} color="#313131" />
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
            <View style={[workoutStyles.buttonContainer, { justifyContent: "space-between" }]}>
                <SaveButton onPress={createSaveButtonAlert} />
                <StartButton onPress={handleNavigation} />
                <RemoveButton onPress={createRemoveButtonAlert} />
            </View>
        </View>
    )
}

export default CustomScreen;