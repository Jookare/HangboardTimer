import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { palette } from '../utils/palette';

const TotalWorkoutTime = ({ workoutValues }) => {
	const [displayTime, setDisplayTime] = useState("");

	useEffect(() => {
		let hangTime = workoutValues.reps * workoutValues.sets * (Number(workoutValues.hangtimeSeconds) + 60 * Number(workoutValues.hangtimeMinutes));
		let restTimeReps = workoutValues.sets * (workoutValues.reps - 1) * (Number(workoutValues.restTimeSeconds) + 60 * Number(workoutValues.restTimeMinutes));
		let restTimeSets = (workoutValues.sets - 1) * (Number(workoutValues.restTimeSetSeconds) + 60 * Number(workoutValues.restTimeSetMinutes));

		let totalSeconds = hangTime + restTimeReps + restTimeSets;

		const secondsInHour = 3600;
		const secondsInMinute = 60;

		let hours = Math.floor(totalSeconds / secondsInHour);
		totalSeconds %= secondsInHour;

		let minutes = Math.floor(totalSeconds / secondsInMinute);
		let seconds = totalSeconds % secondsInMinute;

		if (hours >= 24) {
			setDisplayTime("> 1 day");
		} else {
			const formattedMinutes = String(minutes).padStart(2, '0');
			const formattedSeconds = String(seconds).padStart(2, '0');
			setDisplayTime(`${hours} h ${formattedMinutes} m ${formattedSeconds} s`);
		}
	}, [workoutValues]);

	return (
		<View style={styles.container}>
			<Text style={styles.label}>Workout Total Time:</Text>
			<View style={styles.timeContainer}>
				<Text style={styles.timeText}>{displayTime}</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		marginTop: 8,
	},
	label: {
		fontSize: 18,
		fontWeight: "500",
		color: palette.black,
		marginBottom: 4,
	},
	timeContainer: {
		backgroundColor: "white",
		borderRadius: 15,
	},
	timeText: {
		fontSize: 22,
		fontWeight: "bold",
		color: palette.primary, // Use a color from your palette
	},
});

export default TotalWorkoutTime;
