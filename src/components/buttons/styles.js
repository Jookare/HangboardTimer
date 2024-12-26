import { StyleSheet } from 'react-native';
import { palette } from '../../utils/palette';

export const mainButtonStyle = StyleSheet.create({
    button: {
        padding: 15,
        borderRadius: 20,
        marginBottom: 15,
        width: "80%",
        alignItems: 'center',
        flexDirection: "row",
        gap: 30,
        borderWidth: 1,
        alignSelf: "center"
    },
    buttonText: {
        color: palette.black,
        fontSize: 16,
        fontWeight: 'bold',
    },
    iconContainer: {
        padding: 8,
        borderRadius: 10,
    },
})

export const startButtonStyle = StyleSheet.create({
    startButton: {
        backgroundColor: palette.dark,
        borderColor: palette.darkBorder,
        borderWidth: 2,
        borderRadius: 20,
        padding: 16,
        flexDirection: "row",
        gap: 6,
    },
    startButtonText: {
        fontSize: 20,
        width: 90,
        color: palette.white
    },
})


export const sideButtonStyle = StyleSheet.create({
    sideButton: {
        width: 70,
        aspectRatio: 1,
        borderRadius: 75,
        alignItems: "center",
        justifyContent: "center",
    },
    saveButton: {
        backgroundColor: palette.greenBG,
        borderWidth: 2,
        borderColor: palette.greenBorder,
    },
    removeButton: {
        backgroundColor: palette.redBG,
        borderWidth: 2,
        borderColor: palette.redBorder,
    }
});