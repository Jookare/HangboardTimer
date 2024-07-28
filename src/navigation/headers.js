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
        <View>
            <Pressable
                onPress={handleClick}
                hitSlop={{ top: 25, bottom: 25, left: 25, right: 25 }}
                style={({ pressed }) => [{
                    opacity: pressed ? 0.5 : 1.0,
                    padding: 10
                }
                ]}>
                <Ionicons name="settings-outline" size={32} color="black" />
            </Pressable>
        </View>
    )
}
