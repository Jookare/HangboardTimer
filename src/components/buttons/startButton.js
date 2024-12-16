import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { startButtonStyle } from './styles'

export const StartButton = ({ onPress }) => {

    return (
        <Pressable
            style={({ pressed }) => [
                { opacity: pressed ? 0.5 : 1.0 }, startButtonStyle.startButton
            ]}
            onPress={onPress}>

            <Text style={startButtonStyle.startButtonText}>Start Now</Text>
            <Ionicons name="caret-forward" size={26} color="#fff" />
        </Pressable>
    )
}

export const SaveWorkoutButton = ({ onPress }) => {
    return (
        <Pressable
            style={({ pressed }) => [
                { opacity: pressed ? 0.5 : 1.0 }, [startButtonStyle.startButton,]
            ]}
            onPress={onPress}>

            <Ionicons name="save-outline" size={20} color="white" />
            <Text style={startButtonStyle.startButtonText}>Save as workout</Text>
        </Pressable>
    )
}

