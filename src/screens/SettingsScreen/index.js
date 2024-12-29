// Import necessary dependencies
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { palette } from '../../utils/palette';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, Alert, Pressable, StyleSheet, Button, Switch } from 'react-native';
import { Slider } from '@miblanchard/react-native-slider';
import { deleteItem, getItem, getAllItems, saveItem } from '../../utils/functions';

import CustomAlert from '../../components/modals/customModal';
import { toast, Toasts } from '@backpackapp-io/react-native-toast';

const SettingsScreen = () => {
	const [prep, setPrep] = useState(5);
	const [audio, setAudio] = useState(true);
	const [debouncedPrep, setDebouncedPrep] = useState(prep);

	const [alertVisible, setAlertVisible] = useState(false);


	const fetchItems = async () => {
		let audio2 = await getItem("@audio");
		let prep2 = await getItem("@preparation");
		// Fallback to default if prep2 is null or invalid
		prep2 = prep2 !== null ? JSON.parse(prep2) : 5;
		audio2 = audio2 !== null ? audio2 : true;

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
		}, 10);

		return () => clearTimeout(delayDebounceFn);
	}, [prep]);


	const handleWorkoutRemove = async () => {
		const keys = await getAllItems();
		for (let i = 0; i < keys.length; i++) {
			if (keys[i].startsWith('#')) {
				value = await deleteItem(keys[i]);
			}
		}
		setAlertVisible(false);
		openToast();
	}

	const createRemoveAllAlert = () => {
		console.log("Opening Modal");
		setAlertVisible(true);
	};

	const openToast = () => {
		return (
			toast.success('All workouts removed!', {
				width: 300,
				styles: {
					view: {
						backgroundColor: palette.gray,
						borderRadius: 8,
						padding: 16,
					},
					text: {
						color: 'black',
					},
					indicator: {
						marginRight: 16,
					},
				},
			})
		)
	}

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
							style={styles.switch}
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
							height: 50,
							padding: 5
						}, styles.center
						]}>
						<View style={[{ flexDirection: "row" }, styles.center]}>
							<Ionicons name="trash" size={24} color="black" />
							<Text style={{ marginHorizontal: 6 }}>Remove all</Text>

						</View>
						<Ionicons name="chevron-forward" size={24} color="black" />
					</Pressable>
					<CustomAlert
						visible={alertVisible}
						setVisible={setAlertVisible}
						onConfirm={handleWorkoutRemove}
						initialTitle={'Remove ALL custom workouts'}
						initialMessage={'Are you sure you want to remove all custom workouts?'}
					/>
				</View>

			</View>
			<Text style={styles.heading}>App version V.1.2.0</Text>
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
		color: palette.black
	},
	switchContainer: {
		position: "relative",
		flexDirection: "row",
		alignItems: "center",
		padding: 2,
	},
	switch: {
		width: 50,
	},
	itemContainer: {
		width: "100%",
		borderWidth: 1,
		borderColor: palette.grayBorder,
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