
import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#e8e8e8",
        gap: 20,
    },
    titleContainer: {
        position: "absolute",
        top: 60,
        marginBottom: 20
    },
    titleText: {
        fontSize: 32,
        fontWeight: "800"
    },
    timerContainer: {
        borderRadius: 40,
        padding: 20,
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        borderWidth: 2,
        borderColor: "#e7e7e7",
    },
    timerText: {
        fontSize: 80,
        fontWeight: 'bold',
    },
    phaseContainer: {
        marginVertical: 20
    },
    phaseText: {
        fontSize: 40,
        fontWeight: "600"
    },
    statusContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-evenly"
    },
    repsetContainer: {

        borderRadius: 20,
        width: 120,
        height: 100,
        textAlign: "center",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        borderColor: "#e7e7e7",


    },
    repsetText: {
        fontSize: 20,
        fontWeight: "600"
    },
    pauseButtonContainer: {
        position: "absolute",
        bottom: 130,
    },
    pauseButton: {
        borderRadius: 100,
        width: 120,
        height: 120,
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        borderWidth: 2,
        borderColor: "#e7e7e7",
    },
    buttonContainer: {
        position: "absolute",
        flexDirection: "row",
        bottom: 0,
        height: 100,
        width: "100%",
        justifyContent: "space-evenly",
        alignItems: "center",
        backgroundColor: "#fff",
        borderTopColor: "#e7e7e7",
        borderTopWidth: 2
    },
    button: {
        borderRadius: 100,
        width: 80,
        height: 80,
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        borderWidth: 2,
        borderColor: "#e7e7e7",
    },
    buttonText: {
        color: "black",
    }
});
