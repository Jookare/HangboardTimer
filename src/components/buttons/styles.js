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
        margin: 20
    },
    startButtonText: {
        fontSize: 20,
        color: "#f7f7f9"
    },
})
