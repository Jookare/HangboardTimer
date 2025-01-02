
import { StyleSheet } from 'react-native';
import { palette } from '../../utils/palette';
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: palette.white,
        gap: 10,
        paddingBottom: 80
    },
    titleContainer: {
        // position: "absolute",
        // top: 55,
        marginBottom: 20,
    },
    titleText: {
        fontSize: 32,
        fontWeight: "800"
    },
    timerContainer: {
        borderRadius: 40,
        padding: 20,
        width: 280,
        backgroundColor: "rgb(255, 255, 255)",
        shadowColor: "#000",
        elevation: 4,
    },
    timerText: {
        textAlign: "center",
        fontSize: 72,
        fontWeight: 'bold',
    },
    phaseContainer: {
        marginVertical: 20,
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
        backgroundColor: "rgb(255, 255, 255)",
        elevation: 2,
    },
    repsetText: {
        fontSize: 24,
        fontWeight: "600"
    }
});
