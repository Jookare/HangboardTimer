import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

export const getAllWorkouts = async () => {
    try {
        const keys = await AsyncStorage.getAllKeys();
        return keys;
    } catch (e) {
        // Handle error reading keys
        console.error("Error reading keys:", e);
        return [];
    }
};

export const getWorkout = async (id) => {
    try {
        const jsonValue = await AsyncStorage.getItem(id);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        // error reading value
    }
};

export const saveWorkout = async (id, value) => {
    try {
        await AsyncStorage.setItem(id, value);
    } catch (e) {
        // error reading value
    }
    console.log('Workout saved.');
};

export const deleteWorkout = async (id) => {
    try {
        await AsyncStorage.removeItem(id);
    } catch (e) {
        // error reading value
    }
    console.log('Workout removed.');
};

export const clearAll = async () => {
    try {
        await AsyncStorage.clear();
    } catch (e) {
        // error reading value
    }
    console.log('All workouts removed.');
};



export const useWorkoutValues = (initialValues) => {
    const [sets, setSets] = useState(initialValues[0]);
    const [reps, setReps] = useState(initialValues[1]);
    const [hangtimeMinutes, setHangtimeMinutes] = useState(String(initialValues[2]).padStart(2, '0'));
    const [hangtimeSeconds, setHangtimeSeconds] = useState(String(initialValues[3]).padStart(2, '0'));
    const [restTimeMinutes, setRestTimeMinutes] = useState(String(initialValues[4]).padStart(2, '0'));
    const [restTimeSeconds, setRestTimeSeconds] = useState(String(initialValues[5]).padStart(2, '0'));
    const [restTimeSetMinutes, setRestTimeSetMinutes] = useState(String(initialValues[6]).padStart(2, '0'));
    const [restTimeSetSeconds, setRestTimeSetSeconds] = useState(String(initialValues[7]).padStart(2, '0'));

    return {
        sets, setSets,
        reps, setReps,
        hangtimeMinutes, setHangtimeMinutes,
        hangtimeSeconds, setHangtimeSeconds,
        restTimeMinutes, setRestTimeMinutes,
        restTimeSeconds, setRestTimeSeconds,
        restTimeSetMinutes, setRestTimeSetMinutes,
        restTimeSetSeconds, setRestTimeSetSeconds,
    };
};