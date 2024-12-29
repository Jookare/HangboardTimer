// Import necessary dependencies
import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { selectorStyles, workoutStyles } from './styles';
import { Entypo } from '@expo/vector-icons';
import { palette } from '../../utils/palette';


// Functional component for Time Selector
export const TimeSelector = ({ timeMinutes, setTimeMinutes, timeSeconds, setTimeSeconds, selectorType }) => {
    // Temporary state for inputs to prevent UI jitter

    const [isFocusedMin, setIsFocusedMin] = useState(false);
    const [isFocusedSec, setIsFocusedSec] = useState(false);

    // Format number to always have two digits
    const formattedNumber = (number) => String(number).padStart(2, '0');

    const totalSecondsRef = useRef(Number(timeMinutes) * 60 + Number(timeSeconds)); // Track total seconds directly

    const timer = useRef(null);
    const speedRef = useRef(200); // Start at 200ms delay
    const minSpeed = 25;          // Fastest speed (50ms delay)


    const updateTime = () => {
        const totalSeconds = totalSecondsRef.current;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = totalSeconds % 60;

        if (totalSeconds >= 3540) {
            minutes = 59;
            if (totalSeconds >= 3599) {
                seconds = 59;
            }
        }

        setTimeMinutes(formattedNumber(minutes));
        setTimeSeconds(formattedNumber(seconds));
    };

    // Handle decrementing time
    const handleTimeDecrement = () => {
        if (selectorType === "hang time") {
            if (totalSecondsRef.current > 1) {
                totalSecondsRef.current -= 1;
                updateTime(); // Update display
            }
        } else {
            if (totalSecondsRef.current > 0) {
                totalSecondsRef.current -= 1;
                updateTime(); // Update display
            }
        }
    };

    // Handle incrementing time
    const handleTimeIncrement = () => {
        totalSecondsRef.current += 1;
        updateTime(); // Update display
    };


    const updateWithAcceleration = (increment) => {
        // Increment or decrement based on the flag
        console.log("here");
        if (increment) {
            handleTimeIncrement();
        } else {
            handleTimeDecrement();
        }

        // Gradually reduce the interval (increase speed)
        speedRef.current = Math.max(minSpeed, speedRef.current * 0.85);

        // Set the next timeout
        timer.current = setTimeout(() => updateWithAcceleration(increment), speedRef.current);
    };

    const startTimer = (increment) => {
        if (timer.current) return; // Prevent multiple timers
        speedRef.current = 200; // Reset speed to initial value
        updateWithAcceleration(increment);
    };

    const stopTimer = () => {
        if (timer.current) {
            clearTimeout(timer.current); // Clear the timeout
            timer.current = null; // Reset the timer reference
        }
        speedRef.current = 200; // Reset speed to the initial value
    };


    // Handle editing completion
    const handleSubmitEditing = (setIsFocused) => {
        setIsFocused(false);
        const totalSeconds = Number(timeMinutes) * 60 + Number(timeSeconds);
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
            setTimeMinutes(sanitized);
        } else if (type === 'seconds') {
            setTimeSeconds(sanitized);
        }
    };


    // Accessibility labels based on selectorType
    const SecondsIncrease = `${selectorType} increase`;
    const SecondsDecrease = `${selectorType} decrease`;


    return (
        <View style={selectorStyles.container}>
            <View style={[selectorStyles.row, selectorStyles.div]}>
                <TouchableOpacity
                    onPress={handleTimeDecrement}
                    onLongPress={() => startTimer(false)}
                    onPressOut={stopTimer}
                    accessibilityLabel={SecondsDecrease}
                >
                    <View style={[selectorStyles.icon, selectorStyles.iconMinus]}>
                        <Entypo name="minus" size={24} style={selectorStyles.iconColor} />
                    </View>
                </TouchableOpacity>
                <View style={styles.inputDiv}>
                    <TextInput
                        style={[selectorStyles.text, { textAlign: 'center', height: 60, width: 50, }]}
                        underlineColorAndroid={isFocusedMin ? palette.dark : "transparent"}
                        selectionColor={palette.dark}
                        keyboardType="numeric"
                        maxLength={2}
                        value={timeMinutes}
                        onChangeText={(text) => handleInputChange(text, 'minutes')}
                        onSubmitEditing={() => handleSubmitEditing(setIsFocusedMin)}
                        onBlur={() => handleSubmitEditing(setIsFocusedMin)}
                        onFocus={() => setIsFocusedMin(true)}
                    />
                    <Text style={[selectorStyles.text, {textAlignVertical: 'center', fontSize: 28, marginBottom: 4}]}>:</Text>
                    <TextInput
                        style={[selectorStyles.text, { textAlign: 'center', height: 60, width: 50, }]}
                        underlineColorAndroid={isFocusedSec ? palette.dark : "transparent"}
                        selectionColor={palette.dark}
                        keyboardType="numeric"
                        maxLength={2}
                        value={timeSeconds}
                        onChangeText={(text) => handleInputChange(text, 'seconds')}
                        onSubmitEditing={() => handleSubmitEditing(setIsFocusedSec)}
                        onBlur={() => handleSubmitEditing(setIsFocusedSec)}
                        onFocus={() => setIsFocusedSec(true)}
                    />
                </View>
                <TouchableOpacity
                    onPress={handleTimeIncrement}
                    accessibilityLabel={SecondsIncrease}
                    onLongPress={() => startTimer(true)}
                    onPressOut={stopTimer}

                >
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