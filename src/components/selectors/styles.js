
import { StyleSheet } from 'react-native';

export const selectorStyles = StyleSheet.create({
    icon: {
        width: 50,
        height: 50,
        fontSize: 30,
        color: "#020202",
        alignItems: "center",
        justifyContent: "center",
    },
    iconColor: {
        color: "#000000",
    },
    iconPlus: {
        borderRadius: 100,
        backgroundColor: "#86efac",
    },
    iconMinus: {
        borderRadius: 100,
        backgroundColor: "#fca5a5",
    },
    text: {
        fontSize: 20,
        fontWeight: "500"
    },
    div: {
        borderStyle: "solid",
        borderColor: "#565364",
        borderWidth: 2,
        borderRadius: 50,
        padding: 10,
        backgroundColor: "#fff",
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        width: "60%",
        minWidth: 300
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        width: "100%",
        justifyContent: "space-between",
    },
})


