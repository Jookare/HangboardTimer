import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { startButtonStyle } from './styles'
import { palette } from '../../utils/palette';

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

            <Text style={{fontSize: 20, width: 150, color: palette.white}}>Save as workout</Text>
            <Ionicons name="save-outline" size={26} color="white" />
        </Pressable>
    )
}

