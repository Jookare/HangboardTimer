import React from 'react';
import { sideButtonStyleheet, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { sideButtonStyle } from './styles'

export const SaveButton = ({ onPress, text }) => {

    return (
        <Pressable
            style={({ pressed }) => [
                { opacity: pressed ? 0.5 : 1.0 }, [sideButtonStyle.sideButton, sideButtonStyle.saveButton]
            ]}
            onPress={onPress}>

            <Ionicons name="save-outline" size={24} color="black" />
            {text ?
                <Text>{text}</Text>
                :
                ""
            }
        </Pressable>
    )
}

export const RemoveButton = ({ onPress }) => {

    return (
        <Pressable
            style={({ pressed }) => [
                { opacity: pressed ? 0.5 : 1.0 }, [sideButtonStyle.sideButton, sideButtonStyle.removeButton]
            ]}
            onPress={onPress}>
            <Ionicons name="trash-outline" size={24} color="black" />
        </Pressable>
    )
}