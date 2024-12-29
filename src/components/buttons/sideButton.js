import React from 'react';
import { sideButtonStyleheet, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { sideButtonStyle } from './styles'
import { palette } from '../../utils/palette';

export const SaveButton = ({ onPress, text }) => {

    return (
        <Pressable
            style={({ pressed }) => [
                {
                    backgroundColor: pressed ? palette.gray : 'transparent',
                }, [sideButtonStyle.sideButton, sideButtonStyle.saveButton]
            ]}
            onPress={onPress}>

            <Ionicons name="save-outline" size={24} color="black" />
            <Text>Save</Text>
        </Pressable>
    )
}

export const RemoveButton = ({ onPress }) => {

    return (
        <Pressable
            style={({ pressed }) => [
                {
                    backgroundColor: pressed ? palette.gray : 'transparent',
                }, [sideButtonStyle.sideButton, sideButtonStyle.removeButton]
            ]}
            onPress={onPress}>
            <Ionicons name="trash-outline" size={24} color="black" />
            <Text>Remove</Text>
        </Pressable>
    )
}


