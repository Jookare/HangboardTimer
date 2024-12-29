import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { palette } from '../../utils/palette';

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
                    { opacity: pressed ? 0.5 : 1.0 },
                    styles.button,
                ]}
                disabled={previousFlag()}
                onPress={previousRep}
            >
                <Ionicons name="play-back" size={20}
                    style={{ opacity: previousFlag() ? 0.4 : 1 }}
                />
                <Text style={{ fontSize: 16, opacity: previousFlag() ? 0.4 : 1 }}>
                    REP
                </Text>
            </Pressable>
            <Pressable
                onPress={toggle}
                style={({ pressed }) => [
                    { opacity: pressed ? 0.5 : 1.0 },
                    styles.pauseButton,
                ]}
            >
                {timer.isPaused() || timer.isStopped() ? (
                    <Ionicons name="play" size={40} color="black" />
                ) : (
                    <Ionicons name="pause" size={40} color="black" />
                )}
            </Pressable>

            <Pressable
                style={({ pressed }) => [
                    { opacity: pressed ? 0.5 : 1.0 },
                    styles.button,
                ]}
                disabled={nextFlag()}
                onPress={nextRep}
            >
                <Ionicons name="play-forward" size={20}
                    style={{ opacity: nextFlag() ? 0.4 : 1 }}
                />
                <Text style={{ fontSize: 16, opacity: nextFlag() ? 0.4 : 1 }}>
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
        height: 120,
        width: '100%',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: palette.white,
        borderTopColor: palette.darkBorder,
        borderTopWidth: 1,
    },
    button: {
        borderRadius: 20,
        width: 80,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        borderWidth: 1,
        borderColor: palette.grayBorder,
    },
    pauseButton: {
        borderRadius: 100,
        width: 100,
        height: 100,
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        borderWidth: 1,
        borderColor: palette.grayBorder,
    }
});

export default ControlButtons;