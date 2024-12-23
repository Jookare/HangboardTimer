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
        marginTop: 20,
        height: 70,
        paddingBottom: 10
    },
    title: {
        fontWeight: "600",
        fontSize: 36,
        color: palette.black,
        maxWidth: "90%"
    },
    input: {
        fontWeight: "600",
        fontSize: 36,
        color: palette.black,
        maxWidth: "90%"
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
        color: palette.black
    },
    buttonContainer: {
        flexDirection: "row",
        paddingHorizontal: 20,
        gap:10,
        paddingVertical: 8,
        width: "100%",
        alignItems: "center",
        borderTopWidth: 1,
        borderTopColor: palette.dark,
    },
})