// Import necessary dependencies
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { palette } from '../../utils/palette';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, Alert, Pressable, StyleSheet, Button, Switch } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Slider } from '@miblanchard/react-native-slider';
import { Audio } from 'expo-av';
import { deleteItem, getItem, getAllItems, saveItem } from '../../utils/functions';

import { toast, Toasts } from '@backpackapp-io/react-native-toast';

const SettingsScreen = () => {
	const [prep, setPrep] = useState(5);
	const [debouncedPrep, setDebouncedPrep] = useState(prep);
	const [audio, setAudio] = useState(false);

	const fetchItems = async () => {
		const audio2 = await getItem("@audio");
		const prep2 = await getItem("@preparation");
		console.log(prep2);
		setAudio(audio2);
		setPrep(prep2);
	}

	useFocusEffect(
		React.useCallback(() => {
			fetchItems();
		}, [])
	);

	const handleAudio = async () => {
		const currAudio = !audio
		await saveItem("@audio", JSON.stringify(currAudio));
		setAudio(currAudio);
	}

	const handlePrepChange = (value) => {
		setPrep(value);
	};

	useEffect(() => {
		// Set up debounce delay
		const delayDebounceFn = setTimeout(() => {
			if (prep !== debouncedPrep) {
				setDebouncedPrep(prep);
				saveItem("@preparation", JSON.stringify(prep));
			}
		}, 100);

		return () => clearTimeout(delayDebounceFn);
	}, [prep]);


	const handleWorkoutRemove = async () => {
		const keys = await getAllItems();
		for (let i = 0; i < keys.length; i++) {
			if (keys[i].startsWith('#')) {
				value = await deleteItem(keys[i]);
			}
		}
	}

	const createRemoveAllAlert = () =>
		Alert.alert('Remove ALL custom workouts', 'Are you sure you want to remove all custom workouts?', [
			{
				text: 'Cancel',
				onPress: () => console.log('Cancel Pressed'),
				style: 'cancel',
			},
			{
				text: 'OK', onPress: async () => {
					handleWorkoutRemove();
					toast.success('All workouts removed!', {
						width: 300
					});
				}
			},
		]);

	return (
		<View style={styles.background}>
			<View style={styles.container}>
				<Text style={styles.heading}>Audio</Text>
				<View style={[styles.itemContainer, styles.center]}>
					<Text>Sound</Text>
					<View style={styles.switchContainer}>
						<Text style={{ fontWeight: "500" }}>{audio ? "on" : "off"}</Text>
						<Switch
							trackColor={{ false: palette.redSwitch, true: palette.greenSwitch }}
							thumbColor={palette.gray}
							onValueChange={handleAudio}
							value={audio}
						/>
					</View>
				</View>

				<View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
					<Text style={styles.heading}>Preparation time</Text>
					<Text>{prep} sec</Text>

				</View>
				<View style={styles.itemContainer}>
					<Slider
						value={prep}
						onValueChange={(val) => handlePrepChange(val)}
						step={1}
						minimumValue={0}
						maximumValue={10}
						trackClickable={true} />
				</View>
				<Text style={styles.heading}>Custom workouts</Text>
				<View style={styles.itemContainer}>
					<Pressable
						onPress={createRemoveAllAlert}
						style={({ pressed }) => [{
							opacity: pressed ? 0.5 : 1.0,
						}, styles.center
						]}>
						<View style={[{ flexDirection: "row" }, styles.center]}>
							<Ionicons name="trash" size={24} color="black" />
							<Text style={{ marginHorizontal: 6 }}>Remove all</Text>


						</View>
						<Ionicons name="chevron-forward" size={24} color="black" />
					</Pressable>
				</View>

			</View>
			<Text style={styles.heading}>App version V.1.1.1</Text>
		</View>
	)
}


const styles = StyleSheet.create({
	background: {
		flex: 1,
		alignItems: "center",
		width: "100%",
		backgroundColor: palette.white,
	},
	container: {
		width: "90%",
		maxWidth: 600,
		marginTop: 10,
	},
	heading: {
		marginTop: 10,
		fontSize: 14,
		fontWeight: "500",
		marginHorizontal: 4,
		color: palette.graySwitch
	},
	switchContainer: {
		position: "relative",
		flexDirection: "row",
		alignItems: "center",
	},
	itemContainer: {
		width: "100%",
		backgroundColor: "white",
		marginVertical: 4,
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 20,
		height: 60,
		justifyContent: "center"
	},
	removeButton: {
		borderColor: palette.grayIconBG,
		borderWidth: 2,
		borderRadius: 8,
		padding: 16,
		flexDirection: "row",
		alignItems: "center",
	},
	center: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	}

})

export default SettingsScreen;