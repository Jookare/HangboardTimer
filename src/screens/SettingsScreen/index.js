// Import necessary dependencies
import React, { useEffect, useState, Component } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { palette } from '../../utils/palette';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, Pressable, StyleSheet, Switch } from 'react-native';
import { Slider } from '@miblanchard/react-native-slider';
import { deleteItem, getItem, getAllItems, saveItem } from '../../utils/functions';

import CustomAlert from '../../components/modals/customModal';
import { toast } from '@backpackapp-io/react-native-toast';


class SettingsScreen extends Component {
	state = {
		audio: false,
		prep: 5,
		debouncedPrep: 5,
		timerId: null,
		alertVisible: false,
		updateKey: 0,
	};

	componentDidMount() {
		console.log("Component Mounted");
		this.fetchItems().then(() => console.log("Items fetched:", this.state));
	}

	fetchItems = async () => {
		let audio2 = await getItem("@audio");
		let prep2 = await getItem("@preparation");
		this.setState({
			audio: audio2 !== null ? JSON.parse(audio2) : false,
			prep: prep2 !== null ? JSON.parse(prep2) : 5,
		});
	};

	handleWorkoutRemove = async () => {
		const keys = await getAllItems();
		for (let i = 0; i < keys.length; i++) {
			if (keys[i].startsWith('#')) {
				value = await deleteItem(keys[i]);
			}
		}
		this.setAlertVisible(false);
		this.openToast();
	}

	handleAudio = async () => {
		const currAudio = !this.state.audio;
		this.setState({ audio: currAudio });
		await saveItem("@audio", JSON.stringify(currAudio));
	};

	handlePrepChange = (value) => {
		// Clear the previous timer if it exists
		if (this.state.timerId) {
			clearTimeout(this.state.timerId);
		}

		// Update the prep value in the state
		this.setState({ prep: value });

		// Set a new timer for debounce
		const newTimerId = setTimeout(() => {
			// Save the new prep value after debounce delay
			if (this.state.prep !== this.state.debouncedPrep) {
				this.setState({ debouncedPrep: this.state.prep }); // Update debounced prep
				saveItem("@preparation", JSON.stringify(this.state.prep)); // Save to storage
			}
		}, 50); // Adjust debounce delay as needed

		// Store the timer ID
		this.setState({ timerId: newTimerId });
	};

	componentWillUnmount() {
		// Clear any pending timers when the component unmounts
		if (this.state.timerId) {
			clearTimeout(this.state.timerId);
		}
	}

	setAlertVisible = (visible) => {
		this.setState({ alertVisible: visible });
	};

	createRemoveAllAlert = () => {
		console.log("Opening Modal");
		this.setAlertVisible(true);
	};

	openToast = () => {
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

	render() {
		const { audio, prep, alertVisible } = this.state; // Destructuring the state
		return (
			<View style={styles.background} >
				<View style={styles.container}>
					<Text style={styles.heading}>Audio</Text>
					<View style={[styles.itemContainer, styles.center]}>
						<Text>Sound</Text>
						<View style={styles.switchContainer}>
							<Text style={{ fontWeight: "500" }}>{audio ? "on" : "off"}</Text>
							<Switch
								trackColor={{ false: palette.redSwitch, true: palette.greenSwitch }}
								thumbColor={palette.gray}
								onValueChange={this.handleAudio}
								value={audio}
								style={styles.switch}
							/>
						</View>
					</View>

					<View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
						<Text style={styles.heading}>Preparation time</Text>
						<Text style={{ width: 50 }}>{prep} sec</Text>

					</View>
					<View style={styles.itemContainer}>
						<Slider
							value={prep}
							onValueChange={(val) => this.handlePrepChange(val)}
							step={1}
							minimumValue={0}
							maximumValue={10}
							trackClickable={true} />
					</View>
					<Text style={styles.heading}>Custom workouts</Text>
					<View style={styles.itemContainer}>
						<Pressable
							onPress={this.createRemoveAllAlert}
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

					</View>
				</View>
				<Text style={styles.heading}>App version V.1.2.0</Text>
				<CustomAlert
					visible={alertVisible}
					setVisible={this.setAlertVisible}
					onConfirm={this.handleWorkoutRemove}
					initialTitle={'Remove ALL custom workouts'}
					initialMessage={'Are you sure you want to remove all custom workouts?'}
				/>
			</View>
		)
	}
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
		height: 50,
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