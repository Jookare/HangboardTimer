import { StyleSheet } from 'react-native';
import { palette } from '../../utils/palette';

export const workoutStyles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        backgroundColor: palette.white,
    },
    header: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "90%",
        marginTop: 20
    },
    title: {
        color: '#313131',
        fontWeight: "600",
        fontSize: 32,
        marginBottom: 10
    },
    container: {
        width: "100%",
        maxWidth: 600
    },
    contentContainer: {
        flexGrow: 1,
        width: "100%",
        paddingVertical: 20,
        alignItems: 'center',
        gap: 2
    },
    text: {
        marginTop: 8,
        marginBottom: 2,
        fontSize: 18,
        fontWeight: "500",
        color: "#1c1c1c"
    },
    buttonContainer: {
        flexDirection: "row",
        paddingHorizontal: 20,
        paddingVertical: 8,
        width: "100%",
        alignItems: "center",
        borderTopWidth: 1,
        borderTopColor: "#e7e7e7",
    },
    input: {
        color: '#313131',
        fontWeight: "600",
        fontSize: 36,
        maxWidth: "90%"
    },
})