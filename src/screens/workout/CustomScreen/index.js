import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, Text, TextInput, ScrollView } from 'react-native';
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
import CustomAlert from '../../../components/modals/customModal';
import TotalWorkoutTime from '../../../components/totalWorkoutTime';


const CustomScreen = () => {
    const route = useRoute();
    const { workout, values, id } = route.params;
    const navigation = useNavigation();
    const { workoutValues, setters } = useWorkoutValues(values);
    const [workoutName, onChangeWorkoutName] = useState(workout);

    // Navigation
    const handleNavigation = () => {
        navigation.navigate('Timer', { workoutValues });
    };

    // Storage
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
        setAlertVisible(false);
        toast.success('Workout saved!', {
            width: 300,
            styles: {
                view: {
                    backgroundColor: palette.gray,
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
        })
    }

    const removeData = async () => {
        await deleteItem(id);
        navigation.navigate('Main');
        setAlertVisible(false);
        toast.success('Workout removed!', {
            width: 300,
            styles: {
                view: {
                    backgroundColor: palette.gray,
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
        })
    }


    // Alert things
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [onConfirmAction, setOnConfirmAction] = useState(null);

    const createSaveButtonAlert = () => {
        setAlertTitle('Save workout');
        setAlertMessage('Are you sure you want to save workout changes?');
        setOnConfirmAction(() => storeData); // Assign the confirm action
        setAlertVisible(true);
    };

    const createRemoveButtonAlert = () => {
        setAlertTitle('Remove workout');
        setAlertMessage('Are you sure you want to remove workout?');
        setOnConfirmAction(() => removeData); // Assign the confirm action
        setAlertVisible(true);
    };

    return (
        <View style={workoutStyles.background}>
            <View style={workoutStyles.header}>
                <TextInput
                    style={workoutStyles.input}
                    onChangeText={onChangeWorkoutName}
                    placeholder='Add name'
                    value={workoutName}
                    placeholderTextColor={palette.grayText}
                    editable={true}
                />
                <Ionicons name="pencil" size={26} color={palette.dark} style={{}} />
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
            <View style={[workoutStyles.buttonContainer]}>
                <RemoveButton onPress={createRemoveButtonAlert} />
                <StartButton onPress={handleNavigation} />
                <SaveButton onPress={createSaveButtonAlert} />
            </View>
            <CustomAlert
                visible={alertVisible}
                setVisible={setAlertVisible}
                onConfirm={onConfirmAction} // Action passed dynamically
                initialTitle={alertTitle}
                initialMessage={alertMessage}
            />
        </View>
    )
}

export default CustomScreen;