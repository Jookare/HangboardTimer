import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { startButtonStyle } from './styles'

const StartButton = ({ onPress }) => {
    
    return (
        <Pressable
            style={({ pressed }) => [
                { opacity: pressed ? 0.5 : 1.0 }, startButtonStyle.startButton
            ]}
            onPress={() => console.log("starting")}>

            <Text style={startButtonStyle.startButtonText}>Start Now</Text>
            <Ionicons name="caret-forward" size={26} color="#fff" />
        </Pressable>
    )
}

export default StartButton;