import React from 'react';
import { View, Pressable, Text, StyleSheet, Platform } from 'react-native';
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
                    { opacity: pressed ? 0.7 : 1.0 },
                    styles.button,
                ]}
                disabled={previousFlag()}
                onPress={previousRep}
            >
                <Ionicons
                    name="play-back"
                    size={20}
                    style={{ color: previousFlag() ? palette.grayIconBG : palette.black }}
                />
                <Text style={{ fontSize: 16, color: previousFlag() ? palette.grayIconBG : palette.black }}>
                    REP
                </Text>
            </Pressable>
            <Pressable
                onPress={toggle}
                style={({ pressed }) => [
                    { opacity: pressed ? 0.7 : 1.0 },
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
                    { opacity: pressed ? 0.7 : 1.0 },
                    styles.button,
                ]}
                disabled={nextFlag()}
                onPress={nextRep}
            >
                <Ionicons
                    name="play-forward"
                    size={20}
                    style={{ color: nextFlag() ? palette.grayIconBG : palette.black  }}
                />
                <Text style={{ fontSize: 16, color: nextFlag() ? palette.grayIconBG : palette.black  }}>
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
        borderRadius: 100,
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
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        borderWidth: 2,
        borderColor: palette.grayBorder,
    }
});

export default ControlButtons;