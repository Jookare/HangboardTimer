import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, Pressable, Alert, Modal, StyleSheet } from 'react-native';

import { useNavigation } from '@react-navigation/native';


export const MainHeaderTitle = () => {
    return (
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Hangboard timer</Text>
    );
}

export const MainHeaderRight = () => {
    const navigation = useNavigation();

    function handleClick() {
        try {
            navigation.navigate("Settings");
            console.log("Opening Settings")
        } catch (error) {
            console.error("Navigation to Settings failed:", error);
        }
    };

    return (
        <Pressable
            onPress={handleClick}
            hitSlop={20} // Adds 10 pixels of touchable padding around the component
            style={({ pressed }) => [{
                opacity: pressed ? 0.5 : 1.0,
                padding: 11,
            }
            ]}>
            <Ionicons name="settings-outline" size={32} color="black" />
        </Pressable>
    )
}
