import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';

const Gradient = ({ phase }) => {
    const phaseColors = {
        hang: ['#4ade80', 'transparent'],
        countdown: ['#fcd34d', 'transparent'],
        complete: ['#38bdf8', 'transparent'],
        restAfterHang: ['#f87171', 'transparent'],
        restBetweenSets: ['#f87171', 'transparent'],
        default: ['#f87171', 'transparent'],
    };

    const colors = phaseColors[phase] || phaseColors.default;

    return <LinearGradient colors={colors} style={styles.gradient} />;
};

const styles = StyleSheet.create({
    gradient: {
        position: 'absolute',
        top: 0,
        height: '70%',
        width: '100%',
    },
});

export default Gradient;