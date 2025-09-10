import React, { useEffect, useState, useRef, useCallback } from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	Pressable,
} from "react-native";
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { fetchLogs, logWorkout, clearWorkoutHistory } from "./logging";
import { EditWorkoutSheet, CustomBackdrop } from "./bottomSheet";
import { palette } from "../../utils/palette";
import { Ionicons } from "@expo/vector-icons";

const LogsScreen = () => {
	const [logs, setLogs] = useState([]);
	const [selectedLog, setSelectedLog] = useState(null);
	const bottomSheetModalRef = useRef(null);

	const handleLogPress = (log) => {
		setSelectedLog(log);
		console.log("selected log", log);
		bottomSheetModalRef.current?.present();
	};

	useEffect(() => {
		const loadLogs = async () => {
			const fetchedLogs = await fetchLogs();
			fetchedLogs.sort((a, b) => b.timestamp - a.timestamp);
			setLogs(fetchedLogs);
		};
		loadLogs();
	}, []);

	const groupLogsByMonth = (logs) => {
		const grouped = {};
		logs.forEach((log) => {
			const date = new Date(log.timestamp);
			const month = date.toLocaleString("default", {
				month: "long",
				year: "numeric",
			});
			if (!grouped[month]) grouped[month] = [];
			grouped[month].push(log);
		});
		return grouped;
	};

	const formatDate = (timestamp) => {
		if (!timestamp) return "No date";
		const date =
			typeof timestamp === "string"
				? new Date(timestamp)
				: new Date(parseInt(timestamp));
		const day = String(date.getDate()).padStart(2, "0");
		const month = date.toLocaleString("en-GB", { month: "short" });
		const year = String(date.getFullYear()).slice(-2);
		return `${day} ${month} '${year}`;
	};

	const formatDuration = (seconds) => {
		if (!seconds || isNaN(seconds)) return "0:00";
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}m ${String(secs).padStart(2, "0")}s`;
	};

	const handle_workout_logging = async () => {
		const uniqueId = "workout-" + Date.now();
		const workoutData = {
			id: uniqueId,
			name: "Max Hang Session",
			timestamp: Date.now(),
			duration: 800,
			kg: 6,
		};
		const updatedLogs = [...logs, workoutData];
		await logWorkout(updatedLogs);
		setLogs(updatedLogs);
	};

	const seedTestLogs = async () => {
		const now = Date.now();
		const oneMonth = 1000 * 60 * 60 * 24 * 30;
		const logsPerMonth = 3;
		const totalMonths = 6;
		const newLogs = [];
		for (let monthOffset = 0; monthOffset < totalMonths; monthOffset++) {
			for (let i = 0; i < logsPerMonth; i++) {
				newLogs.push({
					id: `test-${monthOffset}-${i}-${Date.now()}-${Math.random()}`,
					name: `Workout M${monthOffset + 1} #${i + 1}`,
					timestamp: now - monthOffset * oneMonth - i * 86400000,
					duration: Math.floor(Math.random() * 1000),
					kg: 5 + monthOffset,
				});
			}
		}
		const updatedLogs = [...logs, ...newLogs];
		await logWorkout(updatedLogs);
		setLogs(updatedLogs);
	};

	const handleClearHistory = async () => {
		await clearWorkoutHistory();
		setLogs([]);
	};

	const handleSave = async (editedLog, durationMinutes, durationSeconds) => {
		const mins = parseInt(durationMinutes) || 0;
		const secs = parseInt(durationSeconds) || 0;

		const updatedDuration = mins * 60 + secs;

		const updatedLog = {
			...editedLog,
			duration: updatedDuration,
			kg: parseInt(editedLog.kg) || 0, // sanitize kg here
		};

		const updatedLogs = logs.map((log) =>
			log.id === updatedLog.id ? updatedLog : log
		);
		await logWorkout(updatedLogs);
		setLogs(updatedLogs);
		bottomSheetModalRef.current?.close();
	};
	
	return (
		<BottomSheetModalProvider>
			<View style={styles.background}>
				<View style={{ marginBottom: 20, flexDirection: "row", justifyContent: "space-between" }}>
					<Pressable
						style={({ pressed }) => [
							styles.actionButton,
							{ backgroundColor: pressed ? "gray" : palette.gray },
						]}
						onPress={handle_workout_logging}
					>
						<Text style={styles.buttonText}>Add Workout</Text>
					</Pressable>
					<Pressable
						style={({ pressed }) => [
							styles.actionButton,
							{ backgroundColor: pressed ? "gray" : palette.gray },
						]}
						onPress={handleClearHistory}
					>
						<Text style={styles.buttonText}>Clear Workout History</Text>
					</Pressable>
					<Pressable
						style={({ pressed }) => [
							styles.actionButton,
							{ backgroundColor: pressed ? "gray" : palette.gray },
						]}
						onPress={seedTestLogs}
					>
						<Text style={styles.buttonText}>Seed Test Logs</Text>
					</Pressable>
				</View>
				<ScrollView style={styles.scroll}>
					{Object.entries(groupLogsByMonth(logs)).map(([month, monthLogs]) => (
						<View key={month}>
							<Text style={styles.monthHeader}>{month}</Text>
							{monthLogs.map((log) => (
								<Pressable key={log.id} onPress={() => handleLogPress(log)} style={styles.logItem}>
									<View style={styles.iconContainer}>
										<Ionicons
											name={"checkmark-done-outline"}
											size={40}
											color={palette.black}
										/>
									</View>
									<View style={styles.textContainer}>
										<View>
											<Text style={styles.name}>{log.name || "Unnamed workout"}</Text>
											<Text style={styles.info}>{formatDuration(log.duration)}</Text>
										</View>
										<View style={{ alignItems: "flex-end" }}>
											<Text style={styles.info}>{formatDate(log.timestamp)}</Text>
											<Text style={styles.info}>{log.kg || "0"} kg</Text>
										</View>
									</View>
								</Pressable>
							))}
						</View>
					))}
				</ScrollView>
				<EditWorkoutSheet
					ref={bottomSheetModalRef}
					selectedLog={selectedLog}
					setSelectedLog={setSelectedLog}
					onSave={handleSave}
				/>
			</View>
		</BottomSheetModalProvider>
	);
};

const styles = StyleSheet.create({
	background: {
		flex: 1,
		backgroundColor: palette.white,
		padding: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: "600",
		marginBottom: 16,
		color: palette.black,
	},
	scroll: {
		width: "100%",
	},
	logItem: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: palette.white,
		padding: 12,
		paddingHorizontal: 24,
		borderRadius: 12,
		marginBottom: 8,
		width: "100%",
		borderWidth: 1,
		borderColor: palette.grayBorder,
		elevation: 1
	},
	iconContainer: {
		width: 60,
		height: 60,
		borderRadius: 12,
		backgroundColor: palette.lightGray,
		justifyContent: "center",
	},
	textContainer: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",
	},
	name: {
		fontSize: 16,
		fontWeight: "600",
		color: palette.black,
	},
	info: {
		fontSize: 14,
		color: palette.grayText,
	},
	monthHeader: {
		fontSize: 20,
		fontWeight: "bold",
		color: palette.black,
		marginTop: 16,
		marginBottom: 8,
	},
	actionButton: {
		width: "30%",
		padding: 10,
		borderRadius: 8,
		alignItems: "center",
	},
	buttonText: {
		fontSize: 14,
		fontWeight: "600",
		color: palette.black,
	},
});

export default LogsScreen;