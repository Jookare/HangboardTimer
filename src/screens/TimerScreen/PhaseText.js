import React from 'react';
import { Text, StyleSheet } from 'react-native';

const PhaseText = ({ phase, timer }) => {
    const phaseTexts = {
        hang: 'GO!',
        countdown: 'GET READY!',
        complete: 'WORKOUT DONE!',
        restAfterHang: 'REST',
        restBetweenSets: 'REST BETWEEN SETS',
        default: 'WORKOUT',
    };

    const text = phaseTexts[phase] || phaseTexts.default;

    return (
        <>
            {timer.isPaused() ? (
                <Text style={styles.phaseText}>PAUSED</Text>
            ) : (
                <Text style={styles.phaseText}>{text}</Text>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    phaseText: {
        fontSize: 32,
        fontWeight: '600',
    },
});

export default PhaseText;