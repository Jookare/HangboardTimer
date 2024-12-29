import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { selectorStyles } from './styles';
import { Entypo } from '@expo/vector-icons';

export const NumberSelector = ({ value, setValue, selectorType }) => {
    const timer = useRef(null);
    const speedRef = useRef(200); // Start at 200ms delay
    const minSpeed = 50;          // Fastest speed (50ms delay)

    const updateWithAcceleration = (increment) => {
        // Increase speed by reducing delay
        speedRef.current = Math.max(minSpeed, speedRef.current * 0.85);
        
        // Update value
        setValue(prev => {
            if (increment) {
                return prev < 99 ? prev + 1 : prev;
            }
            return prev > 1 ? prev - 1 : prev;
        });

        // Set next timeout with new speed
        timer.current = setTimeout(() => updateWithAcceleration(increment), speedRef.current);
    };

    const startTimer = (increment) => {
        speedRef.current = 200; // Reset speed to initial value
        updateWithAcceleration(increment);
    };

    const stopTimer = () => {
        clearTimeout(timer.current);
        speedRef.current = 200; // Reset speed
    };

    const increase = `${selectorType} increase`;
    const decrease = `${selectorType} decrease`;

    return (
        <View style={selectorStyles.container}>
            <View style={[selectorStyles.row, selectorStyles.div]}>
                <TouchableOpacity 
                    onPress={() => setValue(prev => (prev > 1 ? prev - 1 : prev))}
                    onLongPress={() => startTimer(false)}
                    onPressOut={stopTimer}
                    accessibilityLabel={decrease}
                >
                    <View style={[selectorStyles.icon, selectorStyles.iconMinus]}>
                        <Entypo name="minus" size={24} style={selectorStyles.iconColor} />
                    </View>
                </TouchableOpacity>
                <Text style={selectorStyles.text}>{value}</Text>
                <TouchableOpacity 
                    onPress={() => setValue(prev => (prev < 99 ? prev + 1 : prev))}
                    onLongPress={() => startTimer(true)}
                    onPressOut={stopTimer}
                    accessibilityLabel={increase}
                >
                    <View style={[selectorStyles.icon, selectorStyles.iconPlus]}>
                        <Entypo name="plus" size={24} style={selectorStyles.iconColor} />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};