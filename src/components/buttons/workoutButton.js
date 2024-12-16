import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { mainButtonStyle } from './styles'

const WorkoutButton = ({ color, borderColor, iconBG, navID, onPress, text, iconName }) => {
    return (
        <Pressable
            style={({ pressed }) => [mainButtonStyle.button,
            {
                opacity: pressed ? 0.5 : 1.0,
                backgroundColor: color,
                borderColor: borderColor
            }]}
            onPress={() => onPress(navID)}>
            <View style={[mainButtonStyle.iconContainer, { backgroundColor: iconBG }]}>
                <Ionicons name={iconName} size={20} color="black" />
            </View>
            <Text style={mainButtonStyle.buttonText}>{text}</Text>
        </Pressable>
    )
}

export default WorkoutButton;