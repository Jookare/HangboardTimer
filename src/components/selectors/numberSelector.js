// Import necessary dependencies
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { selectorStyles } from './styles'
import { Entypo } from '@expo/vector-icons';
// Functional component for Max Hangs
export const NumberSelector = ({ value, setValue }) => { 

    // const [sets, setSets] = useState(3);

    const handleDecrement = (valueSetter) => {
        valueSetter((prevValue) => (prevValue > 1 ? prevValue - 1 : prevValue));
    };

    const handleIncrement = (valueSetter) => {
        valueSetter((prevValue) => prevValue + 1);
    };

    return (
        <View style={selectorStyles.container}>
            {/* Sets Selector */}
            <View style={[selectorStyles.row, selectorStyles.div]}  >
                <TouchableOpacity onPress={() => handleDecrement(setValue)}>
                    <View style={[selectorStyles.icon, selectorStyles.iconMinus]}>
                        <Entypo name="minus" size={24} style={selectorStyles.iconColor} />
                    </View>
                </TouchableOpacity>
                <Text style={selectorStyles.text}>{value}</Text>
                <TouchableOpacity onPress={() => handleIncrement(setValue)}>
                    <View style={[selectorStyles.icon, selectorStyles.iconPlus]}>
                        <Entypo name="plus" size={24} style={selectorStyles.iconColor} />
                    </View>
                </TouchableOpacity>

            </View>
        </View>
    );
};
