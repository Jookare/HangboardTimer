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

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={startButtonStyle.startButtonText}>Start Now</Text>
                <Ionicons name="caret-forward" size={26} color="#fff" />
            </View>
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

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 20, color: palette.white, marginRight: 8 }}>
                Save as workout
                </Text>
                <Ionicons name="save-outline" size={26} color="white" />
            </View>
        </Pressable>
    )
}

