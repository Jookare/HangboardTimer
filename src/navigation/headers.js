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
