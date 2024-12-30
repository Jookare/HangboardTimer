import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, Pressable, StatusBar } from 'react-native';
import { palette } from '../../utils/palette';

const CustomAlert = ({
	visible,
	setVisible,
	onConfirm,
	initialTitle = 'Remove ALL custom workouts',
	initialMessage = 'Are you sure you want to remove all custom workouts?'
}) => {
	// State to manage the editable title and message text

	return (
		<Modal
			visible={visible}
			animationType="none"
			backdropColor='transparent'
			transparent={true}
			statusBarTranslucent
			onRequestClose={() => setVisible(false)}
		>
			<Pressable style={styles.overlay} onPress={() => setVisible(false)}>

				<View style={styles.alertContainer}>
					<Text style={styles.title}>{initialTitle}</Text>
					<View style={styles.divider}></View>
					<Text style={styles.message}>{initialMessage}</Text>
					<View style={styles.buttonRow}>
						<Pressable
							onPress={() => setVisible(false)}
							style={({ pressed }) => [
								styles.button, styles.CancelButton,
								{ opacity: pressed ? 0.5 : 1.0 }
							]}
						>
							<Text style={[styles.text, { color: palette.black }]}>Cancel</Text>
						</Pressable>
						<Pressable
							onPress={onConfirm}
							style={({ pressed }) => [
								styles.button, styles.OKButton,
								{ opacity: pressed ? 0.5 : 1.0, }
							]}
						>
							<Text style={[styles.text, { color: palette.white }]}>Yes</Text>
						</Pressable>
					</View>
				</View>
			</Pressable>
		</Modal>
	);
};

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.6)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	alertContainer: {
		backgroundColor: 'white',
		padding: 20,
		borderRadius: 20,
		width: '80%',
		maxWidth: 600,
	},
	title: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 10,
	},
	message: {
		fontSize: 16,
		marginBottom: 15,
	},
	buttonRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	button: {
		alignItems: "center",
		justifyContent: "center",
		height: 50,
		borderRadius: 10,
	},
	OKButton: {
		backgroundColor: palette.dark,
		borderWidth: 1,
		borderColor: palette.dark,
	},
	CancelButton: {
		
		borderWidth: 1,
		borderColor: palette.darkBorder,
	},
	text: {
		fontSize: 16,
		width: 80,
		textAlign: "center"
	},
	divider: {
		width: "100%",
		height: 1,
		backgroundColor: palette.darkBorder,
		marginVertical: 4,
	},
});

export default CustomAlert;
