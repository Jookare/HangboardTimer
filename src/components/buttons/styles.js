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
        color: '#313131',
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
        margin: 20,
        gap: 10,
    },
    startButtonText: {
        fontSize: 20,
        color: palette.white
    },
})


export const sideButtonStyle = StyleSheet.create({
    sideButton: {
        width: 80,
        aspectRatio: 1,
        borderRadius: 75,
        alignItems: "center",
        justifyContent: "center",
    },
    saveButton: {
        backgroundColor: "#f0fdf4",
        borderWidth: 2,
        borderColor: "#dcfce7",
    },
    removeButton: {
        backgroundColor: "#fef2f2",
        borderWidth: 2,
        borderColor: "#fee2e2",
    }
});