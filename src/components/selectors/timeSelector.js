// Import necessary dependencies
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { selectorStyles, workoutStyles } from './styles';
import { Entypo } from '@expo/vector-icons';


// Functional component for Time Selector
export const TimeSelector = ({ timeMinutes, setTimeMinutes, timeSeconds, setTimeSeconds, selectorType }) => {
    // Temporary state for inputs to prevent UI jitter

    const [tempMinutes, setTempMinutes] = useState(timeMinutes);
    const [tempSeconds, setTempSeconds] = useState(timeSeconds);

    // Format number to always have two digits
    const formattedNumber = (number) => String(number).padStart(2, '0');

    // Update time values based on total seconds
    const updateTime = (totalSeconds) => {
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = totalSeconds % 60;
        if (totalSeconds >= 5940) {
            minutes = 99;
            if (totalSeconds >= 5999) {
                seconds = 59;
            }
        }
        setTimeMinutes(formattedNumber(minutes));
        setTimeSeconds(formattedNumber(seconds));
        setTempMinutes(formattedNumber(minutes));
        setTempSeconds(formattedNumber(seconds));
    };

    // Handle decrementing time
    const handleTimeDecrement = () => {
        const totalSeconds = Number(timeMinutes) * 60 + Number(timeSeconds);
        if (selectorType === "hang time") {
            updateTime(totalSeconds > 1 ? totalSeconds - 1 : totalSeconds)
        } else {
            updateTime(totalSeconds > 0 ? totalSeconds - 1 : totalSeconds)
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
        if (selectorType === "hang time") {
            updateTime(totalSeconds > 1 ? totalSeconds : 1)
        } else {
            updateTime(totalSeconds);

        }
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


    // Accessibility labels based on selectorType
    const SecondsIncrease = `${selectorType} increase`;
    const SecondsDecrease = `${selectorType} decrease`;


    return (
        <View style={selectorStyles.container}>
            <View style={[selectorStyles.row, selectorStyles.div]}>
                <TouchableOpacity onPress={handleTimeDecrement} accessibilityLabel={SecondsDecrease}>
                    <View style={[selectorStyles.icon, selectorStyles.iconMinus]}>
                        <Entypo name="minus" size={20} style={selectorStyles.iconColor} />
                    </View>
                </TouchableOpacity>
                <View style={styles.inputDiv}>
                    <TextInput
                        style={[selectorStyles.text, { textAlign: 'right', height: 50, width: 50 }]}
                        keyboardType="numeric"
                        maxLength={2}
                        value={tempMinutes}
                        onChangeText={(text) => handleInputChange(text, 'minutes')}
                        onSubmitEditing={handleSubmitEditing}
                        onBlur={handleSubmitEditing} // Ensure changes are saved
                    />
                    <Text style={selectorStyles.text}>:</Text>
                    <TextInput
                        style={[selectorStyles.text, { textAlign: 'left', height: 50, width: 50 }]}
                        keyboardType="numeric"
                        maxLength={2}
                        value={tempSeconds}
                        onChangeText={(text) => handleInputChange(text, 'seconds')}
                        onSubmitEditing={handleSubmitEditing}
                        onBlur={handleSubmitEditing} // Ensure changes are saved
                    />
                </View>
                <TouchableOpacity onPress={handleTimeIncrement} accessibilityLabel={SecondsIncrease}>
                    <View style={[selectorStyles.icon, selectorStyles.iconPlus]}>
                        <Entypo name="plus" size={20} style={selectorStyles.iconColor} />
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