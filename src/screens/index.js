import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, Pressable, useWindowDimensions } from 'react-native';
import { palette } from '../utils/palette';

import { handleAppNavigation } from '../navigation/navigationHandler';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import WorkoutButton from '../components/buttons/workoutButton';
import { Ionicons } from '@expo/vector-icons';
import { getItem, getAllItems } from "../utils/functions"

const ButtonData = [
    { text: "Short Max Hangs", color: palette.blue, borderColor: palette.blueBorder, iconBG: palette.blueIconBG, navID: "#workout#@1", iconName: "flame" },
    { text: "Repeaters", color: palette.blue, borderColor: palette.blueBorder, iconBG: palette.blueIconBG, navID: "#workout#@2", iconName: "flame" },
    { text: "New workout", color: palette.yellow, borderColor: palette.yellowBorder, iconBG: palette.yellowIconBG, navID: "#workout#@new", iconName: "add-circle-outline" },
];

const MainScreen = () => {
    // Get navigation object
    const navigation = useNavigation();
    const [workouts, setWorkouts] = useState([]);

    const fetchWorkouts = async () => {
        const keys = await getAllItems();
        const workoutPromises = [];
        for (let i = 0; i < keys.length; i++) {
            if (keys[i].startsWith('#')) {
                workoutPromises.push(getItem(keys[i])); // Start all getItem calls
            }
        }
        const results = await Promise.all(workoutPromises); // Wait for all to complete
        setWorkouts(results.filter(Boolean)); // Filter out any null/undefined results
    };
    useFocusEffect(
        React.useCallback(() => {
            fetchWorkouts();
        }, [])
    );

    return (
        <View style={styles.background}>
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                <Text style={styles.title}>Choose your workout</Text>
                <Image
                    source={require("../../assets/Group.png")}
                    style={styles.titleImage}
                />
                <LogButton />
                <SettingsButton />
                {ButtonData.map((button, index) => ( // Removed slice(0,4) as it might be unintentional
                    <WorkoutButton
                        key={index} // Consider using a more stable key if ButtonData can change order
                        color={button.color}
                        borderColor={button.borderColor}
                        iconBG={button.iconBG}
                        // Use the unified handler
                        onPress={(ID) => handleAppNavigation(navigation, ID)}
                        navID={button.navID}
                        text={button.text}
                        iconName={button.iconName}
                    />
                ))}
                <View style={styles.divider}></View>
                {workouts.map((item) => ( // item.id should be unique
                    <WorkoutButton
                        key={item.id}
                        color={palette.red}
                        borderColor={palette.redBorder}
                        iconBG={palette.redIconBG}
                        // Use the unified handler
                        onPress={(ID) => handleAppNavigation(navigation, ID)}
                        navID={item.id} // This ID will be caught by the default case in handleAppNavigation
                        text={item.name}
                        iconName={"barbell"}
                    />
                )
                )}
            </ScrollView>
        </View>
    )
}


// Make SettingsButton and LogButton self-contained components
const SettingsButton = () => {
    const navigation = useNavigation();
    const { width } = useWindowDimensions();
    const isSmallScreen = width < 360;
    const buttonSize = isSmallScreen ? 40 : 60;
    const iconSize = isSmallScreen ? 20 : 28;
    const y = isSmallScreen ? 16 : 5;

    return (
        <Pressable
            onPress={() => handleAppNavigation(navigation, "settings")} // Directly call the handler
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            style={({ pressed }) => [
                {
                    position: "absolute",
                    right: 4,
                    top: y,
                    width: buttonSize,
                    height: buttonSize,
                    borderRadius: 8,
                    backgroundColor: pressed ? palette.grayIconBG : 'transparent',
                    justifyContent: "center",
                    alignItems: "center",
                },
            ]}
            accessible={true}
            accessibilityLabel="Settings"
            accessibilityRole="button"
        >
            <Ionicons name="settings-outline" size={iconSize} color={palette.dark} />
        </Pressable>
    )
}

const LogButton = () => {
    const navigation = useNavigation();
    const { width } = useWindowDimensions();
    const isSmallScreen = width < 360;
    const buttonSize = isSmallScreen ? 40 : 60;
    const iconSize = isSmallScreen ? 20 : 28;
    const y = isSmallScreen ? 16 : 5;

    return (
        <Pressable
            onPress={() => handleAppNavigation(navigation, "log")} // Directly call the handler
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            style={({ pressed }) => [
                {
                    position: "absolute",
                    left: 4,
                    top: y,
                    width: buttonSize,
                    height: buttonSize,
                    borderRadius: 8,
                    backgroundColor: pressed ? palette.grayIconBG : 'transparent',
                    justifyContent: "center",
                    alignItems: "center",
                },
            ]}
            accessible={true}
            accessibilityLabel="Log" // Changed from "Stats" to "Log" to match actionID
            accessibilityRole="button"
        >
            <Ionicons name="calendar-outline" size={iconSize} color={palette.dark} />
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        fontSize: "17px",
        fontWeight: "bold",
        borderRadius: "0.75em",
        backgroundColor: "#e8e8e8",
    },
    background: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        backgroundColor: palette.white,
    },
    container: {
        width: "100%",
        maxWidth: 600,
    },
    contentContainer: {
        flexGrow: 1,
        width: "100%",
        paddingVertical: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: "center",
        marginBottom: 20
    },
    titleImage: {
        alignSelf: "center",
        resizeMode: 'contain',
        width: 250,
        height: 150,
        marginBottom: 20
    },
    divider: {
        width: "80%",
        height: 1,
        backgroundColor: palette.darkBorder,
        marginVertical: 10,
    },
});



export default MainScreen;

