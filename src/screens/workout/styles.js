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
        width: "100%",
        borderBottomWidth: 1,
        borderColor: palette.darkBorder,
        marginTop: 15,
        height: 60,
        paddingBottom: 10,
    },
    title: {
        fontWeight: "600",
        fontSize: 30,
        color: palette.black,
        maxWidth: "90%"
    },
    input: {
        fontWeight: "600",
        height: 50,
        fontSize: 28,
        color: palette.black,
        width: "auto",
        maxWidth: "89%",
    },
    container: {
        width: "100%",
        maxWidth: 600,
    },
    contentContainer: {
        flexGrow: 1,
        width: "100%",
        paddingVertical: 10,
        alignItems: 'center',
        gap: 2
    },
    text: {
        marginTop: 8,
        marginBottom: 2,
        fontSize: 18,
        fontWeight: "500",
        color: palette.black
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        paddingVertical: 16,
        width: "100%",
        alignItems: "center",
        borderTopWidth: 1,
        borderTopColor: palette.dark,
    },
})