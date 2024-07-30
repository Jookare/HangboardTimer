import { StyleSheet } from 'react-native';


export const workoutStyles =  StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        backgroundColor: "#ffffff",
    },
    header: {
        alignItems: "center",
        gap: 20,
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
        flex: 1,
        flexGrow: 1,
        width: "100%",
        paddingVertical: 20,
        alignItems: 'center',
    },
    text: {
        fontSize: 16,
        fontWeight: "500",
        color: "#1c1c1c"
    },
    buttonContainer: {
        flexDirection: "row",
        padding: 20,
        width: "100%",
        alignItems: "center"
    },
    input: {
        color: '#313131',
        fontWeight: "600",
        fontSize: 36,
        maxWidth: "90%"
    },
})