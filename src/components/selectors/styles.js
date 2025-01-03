
import { StyleSheet } from 'react-native';
import { palette } from '../../utils/palette';

export const selectorStyles = StyleSheet.create({
    icon: {
        width: 50,
        height: 50,
        fontSize: 30,
        color: palette.black,
        alignItems: "center",
        justifyContent: "center",
    },
    iconColor: {
        color: palette.black,
    },
    iconPlus: {
        borderRadius: 100,
        backgroundColor: palette.greenIconBG,
    },
    iconMinus: {
        borderRadius: 100,
        backgroundColor: palette.redIconBG,
    },
    text: {
        fontSize: 22,
        fontWeight: "500"
    },
    div: {
        borderStyle: "solid",
        borderColor: palette.darkBorder,
        borderWidth: 2,
        borderRadius: 50,
        height: 65,
        padding: 6,
        backgroundColor: palette.white,
        shadowColor: palette.darkBorder,
        elevation: 1
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


