// Import necessary dependencies
import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { palette } from '../../utils/palette';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, Alert, Pressable, StyleSheet, Button, Switch } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Slider } from '@miblanchard/react-native-slider';
import { Audio } from 'expo-av';


const SettingsScreen = () => {
	const [value, setValue] = useState(5)
	const [isEnabled, toggleSwitch] = useState(false)


	const createRemoveAllAlert = () =>
		Alert.alert('Remove ALL custom workouts', 'Are you sure you want to remove all custom workouts?', [
			{
				text: 'Cancel',
				onPress: () => console.log('Cancel Pressed'),
				style: 'cancel',
			},
			{
				text: 'OK', onPress: () => {
					clearAll();
				}
			},
		]);
	return (
		<View style={styles.background}>
			<View style={styles.container}>
				<Text style={styles.heading}>General settings</Text>
				<View style={[styles.itemContainer, styles.center]}>
					<Text>Sound	</Text>
					<Switch
						trackColor={{ false: palette.redSwitch, true: palette.greenSwitch }}
						thumbColor={palette.gray}
						onValueChange={toggleSwitch}
						value={isEnabled}
					/>
				</View>

				<View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
					<Text style={styles.heading}>Preparation time</Text>
					<Text>{value} sec</Text>

				</View>
				<View style={styles.itemContainer}>
					<Slider
						value={value}
						onValueChange={setValue}
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
			<Text style={styles.heading}>App version v.1.0.0</Text>
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
	removeButton: {
		borderColor: palette.grayIconBG,
		borderWidth: 2,
		borderRadius: 8,
		padding: 16,
		flexDirection: "row",
		alignItems: "center",
	},
	heading: {
		marginTop: 10,
		fontSize: 14,
		fontWeight: "500",
		marginHorizontal: 4,
		color: palette.graySwitch
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
	center: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	}

})

export default SettingsScreen;