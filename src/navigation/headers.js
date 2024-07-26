import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, Pressable, Alert, Modal, StyleSheet } from 'react-native';

import { useNavigation } from '@react-navigation/native';

export const MainHeaderTitle = () => {
    return (
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Hangboard timer</Text>

    );
}

export const MainHeaderRight = () => {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);

    const createRemoveAllAlert = () =>
        Alert.alert('Remove ALL custom workouts', 'Are you sure you want to remove all custom workouts?', [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            {
                text: 'OK', onPress: () => {
                    // clearAll();
                    navigation.replace("Main")
                }
            },
        ]);

    return (
        <View>
            <Modal
                animationType="none"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                }}
                style={{ backgroundColor: "red" }}>

                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={styles.contentView}>

                            <Text style={styles.modalText}>Hello World!</Text>
                            <Text style={styles.modalText}>Hello World!</Text>
                            <Text style={styles.modalText}>Hello World!</Text>
                            <Text style={styles.modalText}>Hello World!</Text>
                            <Text style={styles.modalText}>Hello World!</Text>
                            <Text style={styles.modalText}>Hello World!</Text>
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => setModalVisible(!modalVisible)}>
                                <Text style={styles.textStyle}>Close</Text>
                            </Pressable>

                        </View>
                    </View>
                </View>
            </Modal>
            <Pressable
                onPress={() => setModalVisible(true)}
                hitSlop={{ top: 25, bottom: 25, left: 25, right: 25 }}
                style={({ pressed }) => [{
                    opacity: pressed ? 0.5 : 1.0,
                    padding: 10
                }
                ]}>
                <Ionicons name="settings-outline" size={32} color="black" />
            </Pressable>
        </View>
    )
}


const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        alignSelf: "center",
        marginTop: 10,
        maxWidth: 640,
        width: "100%",
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 35,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    contentView: {
        alignItems: 'center',
        justifyContent: "space-between"
    },
    button: {
        borderRadius: 10,
        padding: 8,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: "#3f3f46",
        borderWidth: 2,
        borderColor: "#18181b",
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    textStyle: {
        color: 'f7f7f9',
    },
});