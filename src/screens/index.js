import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import { palette } from '../utils/palette';
import { handleButtonPress } from '../navigation/navigationHandler';
import { useNavigation } from '@react-navigation/native';
import WorkoutButton from '../components/buttons/workoutButton';

const ButtonData = [
    { text: "Short Max Hangs", color: palette.blue, borderColor: palette.blueBorder, iconBG: palette.blueIconBG, navID: "#workout#@1", iconName: "flame" },
    { text: "Repeaters", color: palette.blue, borderColor: palette.blueBorder, iconBG: palette.blueIconBG, navID: "#workout#@2", iconName: "flame" },
    { text: "4 x 4", color: palette.green, borderColor: palette.greenBorder, iconBG: palette.greenIconBG, navID: "#workout#@3", iconName: "pulse-sharp" },
    { text: "New workout", color: palette.yellow, borderColor: palette.yellowBorder, iconBG: palette.yellowIconBG, navID: "#workout#@new", iconName: "add-circle-outline" }
];

const MainScreen = () => {
    const navigation = useNavigation(); // Get navigation object


    return (
        <View style={styles.background}>
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                <Text style={styles.title}>Choose your workout</Text>
                <Image
                    source={require("../../assets/Group.png")}
                    style={styles.titleImage}
                />

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
            </ScrollView>
        </View>
    )
}


const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        backgroundColor: palette.white,
    },
    container: {
        width: "100%",
        maxWidth: 600
    },
    contentContainer: {
        flex: 1,
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
        backgroundColor: "#123123",
        marginVertical: 10,
    },
});



export default MainScreen;
