import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, Pressable, useWindowDimensions } from 'react-native';
import { palette } from '../utils/palette';
import { handleButtonPress } from '../navigation/navigationHandler';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import WorkoutButton from '../components/buttons/workoutButton';
import { Ionicons } from '@expo/vector-icons';
import { getItem, getAllItems } from "../utils/functions"

const ButtonData = [
    { text: "Short Max Hangs", color: palette.blue, borderColor: palette.blueBorder, iconBG: palette.blueIconBG, navID: "#workout#@1", iconName: "flame" },
    { text: "Repeaters", color: palette.blue, borderColor: palette.blueBorder, iconBG: palette.blueIconBG, navID: "#workout#@2", iconName: "flame" },
    // { text: "4 x 4", color: palette.green, borderColor: palette.greenBorder, iconBG: palette.greenIconBG, navID: "#workout#@3", iconName: "pulse-sharp" },
    { text: "New workout", color: palette.yellow, borderColor: palette.yellowBorder, iconBG: palette.yellowIconBG, navID: "#workout#@new", iconName: "add-circle-outline" },
];

const MainScreen = () => {
    const navigation = useNavigation(); // Get navigation object
    const [workouts, setWorkouts] = useState([]);

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


    const fetchWorkouts = async () => {
        const keys = await getAllItems();

        let workouts = [];
        let value;
        for (let i = 0; i < keys.length; i++) {
            if (keys[i].startsWith('#')) {
                value = await getItem(keys[i]);
                console.log(value)
                workouts.push(value);
            }
        }
        setWorkouts(workouts);
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
                {settingsButton(handleClick)}
                {ButtonData.slice(0, 4).map((button, index) => (
                    <WorkoutButton
                        key={index}
                        color={button.color}
                        borderColor={button.borderColor}
                        iconBG={button.iconBG}
                        onPress={(ID) => handleButtonPress(navigation, ID)}
                        navID={button.navID}
                        text={button.text}
                        iconName={button.iconName}
                    />
                ))}
                <View style={styles.divider}></View>
                {workouts.map((item, index) => (
                    <WorkoutButton
                        key={item.id}
                        color={palette.red}
                        borderColor={palette.redBorder}
                        iconBG={palette.redIconBG}
                        onPress={(ID) => handleButtonPress(navigation, ID)}
                        navID={item.id}
                        text={item.name}
                        iconName={"barbell"}
                    />
                )
                )}
            </ScrollView>
        </View>
    )
}


const settingsButton = (handleClick) => {

    const { width, height } = useWindowDimensions(); // Get screen dimensions

    // Adjust styles dynamically based on screen width
    const isSmallScreen = width < 360; // Example breakpoint for smaller screens
    const buttonSize = isSmallScreen ? 40 : 60; // Smaller button for smaller screens
    const iconSize = isSmallScreen ? 20 : 28; // Adjust icon size accordingly
    const y = isSmallScreen ? 16 : 5;

    return (
        <Pressable
            onPress={handleClick}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            style={({ pressed }) => [
                {
                  position: "absolute",
                  right: 4, // Adjust margin for smaller screens
                  top: y,
                  width: buttonSize,
                  height: buttonSize,
                  borderRadius: 8, // Optional: make it circular for smaller screens
                  backgroundColor: pressed ? '#f0f0f0' : 'transparent',
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
            accessible={true}
            accessibilityLabel="Settings"
            accessibilityRole="button"
        >
            <Ionicons name="settings-outline" size={iconSize} color="black" />
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

