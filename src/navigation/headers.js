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

    const handleClick = () => {
        navigation.navigate("Settings");
    }
    return (
        <View style={{ zIndex: 10 }}>
            <Pressable
                onPress={handleClick}
                hitSlop={10} // Adds 10 pixels of touchable padding around the component
                style={({ pressed }) => [{
                    opacity: pressed ? 0.5 : 1.0,
                    padding: 11,
                }
                ]}>
                <Ionicons name="settings-outline" size={32} color="black" />
            </Pressable>
        </View>
    )
}
