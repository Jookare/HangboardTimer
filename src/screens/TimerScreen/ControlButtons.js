import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ControlButtons = ({
    toggle,
    previousRep,
    nextRep,
    previousFlag,
    nextFlag,
    timer,
}) => {
    return (
        <View style={styles.buttonContainer}>
            <Pressable
                style={({ pressed }) => [
                    { opacity: pressed ? 0.7 : 1.0 },
                    styles.button,
                ]}
                disabled={previousFlag()}
                onPress={previousRep}
            >
                <Ionicons
                    name="play-back"
                    size={24}
                    style={{ color: previousFlag() ? '#949396' : '#000000' }}
                />
                <Text style={{ color: previousFlag() ? '#949396' : '#000000' }}>
                    REP
                </Text>
            </Pressable>

            <Pressable
                style={({ pressed }) => [
                    { opacity: pressed ? 0.9 : 1.0 },
                    styles.button,
                ]}
                disabled={nextFlag()}
                onPress={nextRep}
            >
                <Ionicons
                    name="play-forward"
                    size={24}
                    style={{ color: nextFlag() ? '#949396' : '#000000' }}
                />
                <Text style={{ color: nextFlag() ? '#949396' : '#000000' }}>
                    REP
                </Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        position: 'absolute',
        flexDirection: 'row',
        bottom: 0,
        height: 100,
        width: '100%',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderTopColor: '#e7e7e7',
        borderTopWidth: 2,
    },
    button: {
        borderRadius: 100,
        width: 80,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        borderWidth: 2,
        borderColor: '#e7e7e7',
    },
});

export default ControlButtons;