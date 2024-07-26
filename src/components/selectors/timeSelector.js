// Import necessary dependencies
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { selectorStyles, workoutStyles } from './styles';
import { Entypo } from '@expo/vector-icons';

// Functional component for Time Selector

// Functional component for Time Selector
export const TimeSelector = ({ timeMinutes, setTimeMinutes, timeSeconds, setTimeSeconds }) => {
    // Temporary state for inputs to prevent UI jitter
    const [tempMinutes, setTempMinutes] = useState(timeMinutes);
    const [tempSeconds, setTempSeconds] = useState(timeSeconds);

    // Format number to always have two digits
    const formattedNumber = (number) => String(number).padStart(2, '0');

    // Update time values based on total seconds
    const updateTime = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        setTimeMinutes(formattedNumber(minutes));
        setTimeSeconds(formattedNumber(seconds));
        setTempMinutes(formattedNumber(minutes));
        setTempSeconds(formattedNumber(seconds));
    };

    // Handle decrementing time
    const handleTimeDecrement = () => {
        const totalSeconds = Number(timeMinutes) * 60 + Number(timeSeconds);
        if (totalSeconds > 0) {
            updateTime(totalSeconds - 1);
        }
    };

    // Handle incrementing time
    const handleTimeIncrement = () => {
        const totalSeconds = Number(timeMinutes) * 60 + Number(timeSeconds);
        updateTime(totalSeconds + 1);
    };

    // Handle editing completion
    const handleSubmitEditing = () => {
        const totalSeconds = Number(tempMinutes) * 60 + Number(tempSeconds);
        updateTime(totalSeconds);
    };

    // Handle direct input change (temporarily)
    const handleInputChange = (text, type) => {
        const sanitized = text.replace(/[^0-9]/g, '');
        if (type === 'minutes') {
            setTempMinutes(sanitized);
        } else if (type === 'seconds') {
            setTempSeconds(sanitized);
        }
    };

    return (
        <View style={selectorStyles.container}>
            <View style={[selectorStyles.row, selectorStyles.div]}>
                <TouchableOpacity onPress={handleTimeDecrement}>
                    <View style={[selectorStyles.icon, selectorStyles.iconMinus]}>
                        <Entypo name="minus" size={24} style={selectorStyles.iconColor} />
                    </View>
                </TouchableOpacity>
                <View style={styles.inputDiv}>
                    <TextInput
                        style={[selectorStyles.text, { textAlign: 'right', width: 40  }]}
                        keyboardType="numeric"
                        maxLength={2}
                        value={tempMinutes}
                        onChangeText={(text) => handleInputChange(text, 'minutes')}
                        onSubmitEditing={handleSubmitEditing}
                        onBlur={handleSubmitEditing} // Ensure changes are saved
                    />
                    <Text style={selectorStyles.text}>:</Text>
                    <TextInput
                        style={[selectorStyles.text, { textAlign: 'left', width: 40 }]}
                        keyboardType="numeric"
                        maxLength={2}
                        value={tempSeconds}
                        onChangeText={(text) => handleInputChange(text, 'seconds')}
                        onSubmitEditing={handleSubmitEditing}
                        onBlur={handleSubmitEditing} // Ensure changes are saved
                    />
                </View>
                <TouchableOpacity onPress={handleTimeIncrement}>
                    <View style={[selectorStyles.icon, selectorStyles.iconPlus]}>
                        <Entypo name="plus" size={24} style={selectorStyles.iconColor} />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

// Styles
const styles = StyleSheet.create({
    inputDiv: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeInput: {
        textAlign: 'left',
    },
});

export default TimeSelector;