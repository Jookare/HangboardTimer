import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getAllItems = async () => {
    try {
        keys = await AsyncStorage.getAllKeys()
        return keys
    } catch (e) {
        // Handle error reading keys
        console.error("Error reading keys:", e);
        return [];
    }
};

export const getItem = async (id) => {
    try {
        const jsonValue = await AsyncStorage.getItem(id);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        // error reading value
    }
};

export const saveItem = async (id, value) => {
    try {
        console.log(value);
        await AsyncStorage.setItem(id, value);
    } catch (e) {
        // error reading value
    }
    console.log('Workout saved.');
};

export const deleteItem = async (id) => {
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

    const workoutValues = {
        sets,
        reps,
        hangtimeMinutes,
        hangtimeSeconds,
        restTimeMinutes,
        restTimeSeconds,
        restTimeSetMinutes,
        restTimeSetSeconds,
    };

    const setters = {
        setSets,
        setReps,
        setHangtimeMinutes,
        setHangtimeSeconds,
        setRestTimeMinutes,
        setRestTimeSeconds,
        setRestTimeSetMinutes,
        setRestTimeSetSeconds,
    };

    return { workoutValues, setters };
};
