
import { StyleSheet } from 'react-native';
import { palette } from '../../utils/palette';
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: palette.white,
        paddingVertical: 120,
        gap: 10,
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
        width: 110,
        height: 90,
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
    pauseButtonContainer:{
    },
    pauseButton: {
        borderRadius: 100,
        width: 100,
        height: 100,
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        borderWidth: 2,
        borderColor: "#e7e7e7",
    }
});
