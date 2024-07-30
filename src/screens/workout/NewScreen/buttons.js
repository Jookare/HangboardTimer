import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const SaveButton = ({ onPress }) => {

    return (

        <Pressable
            style={({ pressed }) => [
                { opacity: pressed ? 0.5 : 1.0 }, [styles.sideButton, styles.saveButton]
            ]}
            onPress={onPress}>

            <Ionicons name="save-outline" size={24} color="black" />
        </Pressable>
    )
}

export const RemoveButton = ({ onPress }) => {

    return (

        <Pressable
            style={({ pressed }) => [
                { opacity: pressed ? 0.5 : 1.0 }, [styles.sideButton, styles.removeButton]
            ]}
            onPress={onPress}>
            <Ionicons name="trash-outline" size={24} color="black" />
        </Pressable>
    )
}

const styles = StyleSheet.create({
    sideButton: {
        width: 80,
        aspectRatio: 1,
        borderRadius: 75,
        alignItems: "center",
        justifyContent: "center",
    },
    saveButton: {
        backgroundColor: "#f0fdf4",
        borderWidth: 2,
        borderColor: "#dcfce7",
    },
    removeButton: {
        backgroundColor: "#fef2f2",
        borderWidth: 2,
        borderColor: "#fee2e2",
    }
});