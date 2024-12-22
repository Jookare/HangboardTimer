
import { StyleSheet } from 'react-native';
import { palette } from '../../utils/palette';
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: palette.white,
        paddingVertical: 120,
        gap: 10,
    },
    titleContainer: {
        position: "absolute",
        top: 60,
    },
    titleText: {
        fontSize: 40,
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
        fontSize: 24,
        fontWeight: "600"
    }
});
