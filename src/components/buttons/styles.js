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
        borderRadius: 20,
        padding: 20,
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
        width: 60,
        aspectRatio: 1,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
    },
    saveButton: {
        // color: palette.green,
    },
    removeButton: {
        // color: palette.red,
    }
});

