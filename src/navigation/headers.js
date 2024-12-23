import React, { useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, Pressable, Alert, Modal, StyleSheet } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { toast, Toasts } from '@backpackapp-io/react-native-toast';


export const MainHeaderTitle = () => {
    return (
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Hangboard timer</Text>
    );
}

export function MainHeaderRight() {
    const navigation = useNavigation();

    const handleClick = useCallback(() => {
        try {
            navigation.navigate("Settings");

        } catch (error) {
            console.error("Navigation error:", error);
            toast.error(error, {
                width: 300,
                styles: {
                    view: {
                        backgroundColor: '#f7f7f7',
                        borderRadius: 8,
                        padding: 16,
                    },
                    text: {
                        color: 'black',
                    },
                    indicator: {
                        marginRight: 16,
                    },
                },
            });
        }
    }, [navigation]);

    return (
        <Pressable
            onPress={handleClick}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            style={({ pressed }) => [
                {
                    width: 60,
                    height: 60,
                    // padding: 12,
                    marginRight: 8, // Add some margin from the screen edge
                    borderRadius: 8, // Optional: makes the pressed state more visible
                    backgroundColor: pressed ? '#f0f0f0' : 'transparent',
                    justifyContent: "center",
                    alignItems: "center"

                },
            ]}
            accessible={true}
            accessibilityLabel="Settings"
            accessibilityRole="button"
        >
            <Ionicons name="settings-outline" size={28} color="black" />
        </Pressable>
    );
};
