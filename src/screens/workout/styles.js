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
        gap: 20,
        width: "90%",
        marginTop: 20
    },
    title: {
        color: '#313131',
        fontWeight: "600",
        fontSize: 36,
        marginBottom: 20
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
        marginBottom: 20,
        width: "100%",
        alignItems: "center",
    },
    input: {
        color: '#313131',
        fontWeight: "600",
        fontSize: 36,
        maxWidth: "90%"
    },
})