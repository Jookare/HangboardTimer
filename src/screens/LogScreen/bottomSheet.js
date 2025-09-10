import React, { useCallback, forwardRef, useEffect, useState } from "react";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { palette } from "../../utils/palette";
import DateTimePicker from '@react-native-community/datetimepicker';
import { SaveButton, RemoveButton } from "../../components/buttons/sideButton";

export const EditWorkoutSheet = forwardRef(
    ({ selectedLog, setSelectedLog, onSave }, ref) => {
        console.log(selectedLog);
        const [durationMinutes, setDurationMinutes] = useState(null);
        const [durationSeconds, setDurationSeconds] = useState(null);
        const [show, setShow] = useState(false);
        const [date, setDate] = useState(null);

        const renderBackdrop = useCallback(
            (props) => (
                <BottomSheetBackdrop
                    {...props}
                    disappearsOnIndex={-1}
                    appearsOnIndex={0}
                    opacity={0.6}
                />
            ),
            []
        );

        useEffect(() => {
            if (selectedLog?.duration != null) {
                const minutes = Math.floor(selectedLog.duration / 60);
                const seconds = selectedLog.duration % 60;
                setDurationMinutes(String(minutes));
                setDurationSeconds(String(seconds).padStart(2, "0"));
            }
            if (selectedLog?.timestamp != null) {
                setDate(new Date(selectedLog.timestamp));
            }
        }, [selectedLog]);

        const onChange = (event, selectedDate) => {
            setShow(false);
            if (selectedDate) {
                setDate(selectedDate);
                setSelectedLog((prev) => ({
                    ...prev,
                    timestamp: selectedDate.getTime(),
                }));
            }
        };


        const formatDate = (timestamp) => {
            if (!timestamp) return "No date";
            const day = String(timestamp.getDate()).padStart(2, "0");
            const month = String(timestamp.getMonth()).padStart(2, "0");
            const year = String(timestamp.getFullYear());
            return `${day}.${month}.${year}`;
        };

        return (
            <BottomSheetModal
                ref={ref}
                snapPoints={["40%", "60%"]}
                // enableDynamicSizing={false}
                backdropComponent={renderBackdrop}
            >
                <BottomSheetView style={styles.container}>
                    <Text style={styles.title}>Edit Workout</Text>
                    <View style={{ flexDirection: "row", width: "100%" }}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Name</Text>
                            <TextInput
                                value={selectedLog?.name}
                                onChangeText={(text) =>
                                    setSelectedLog((prev) => ({ ...prev, name: text }))
                                }
                                style={styles.input}
                                placeholder="Workout name"
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Duration</Text>
                            
                            <TextInput
                                value={`${durationMinutes}m ${durationSeconds}s`}
                                editable={false}
                                style={[styles.input, {backgroundColor: palette.grayIconBG}]}
                                pointerEvents="none"
                            />
                        </View>
                    </View>

                    <View style={{ flexDirection: "row", width: "100%" }}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Date</Text>
                            <Pressable onPress={() => setShow(true)}>
                                <TextInput
                                    value={formatDate(date)}
                                    editable={false}
                                    style={styles.input}
                                    pointerEvents="none"
                                />
                            </Pressable>
                            {show && (
                                <DateTimePicker
                                    value={date}
                                    mode="date"
                                    display={"default"}
                                    onChange={onChange}
                                />
                            )}
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Extra weight</Text>
                            <StepperInput
                                value={String(selectedLog?.kg ?? 0)}
                                onChange={(text) =>
                                    setSelectedLog((prev) => ({ ...prev, kg: text }))
                                }
                                step={1} // typical gym increment
                                unit="kg"
                            />
                        </View>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20, margin: 8 }}>
                        <RemoveButton />
                        <SaveButton onPress={() => onSave(selectedLog,  durationMinutes, durationSeconds)}/>
                    </View>
                </BottomSheetView>
            </BottomSheetModal>
        );
    }
);

const StepperInput = ({ value, onChange, min = 0, max = 999, step = 1, unit }) => {
    const [tempValue, setTempValue] = useState(String(value || ""));

    useEffect(() => {
        setTempValue(String(value || ""));
    }, [value]);

    const numericValue = parseInt(value) || 0;

    const increment = () => {
        const next = Math.min(numericValue + step, max);
        onChange(String(next));
    };

    const decrement = () => {
        const next = Math.max(numericValue - step, min);
        onChange(String(next));
    };

    const handleEndEditing = () => {
        const parsed = parseInt(tempValue);
        if (!isNaN(parsed)) {
            const clamped = Math.min(Math.max(parsed, min), max);
            onChange(String(clamped));
        } else {
            // Optional: reset if invalid input
            setTempValue(String(value));
        }
    };

    return (
        <View style={styles.stepperContainer}>
            <Pressable style={({ pressed }) => [{opacity: pressed ? 0.5 : 1.0 ,}, [styles.stepperButton]]} onPress={decrement}>
                <Text style={styles.stepperButtonText}>-</Text>
            </Pressable>

            <View style={styles.inputWithUnit}>
                <TextInput
                    value={tempValue}
                    onChangeText={setTempValue}
                    onEndEditing={handleEndEditing}
                    keyboardType="number-pad"
                    style={styles.stepperInput}
                />
                {unit && (
                    <Text
                        style={styles.unitLabel}
                        pointerEvents="none"
                    >
                        {unit}
                    </Text>
                )}
            </View>

            <Pressable style={({ pressed }) => [{opacity: pressed ? 0.5 : 1.0 ,}, [styles.stepperButton]]} onPress={increment}>
                <Text style={styles.stepperButtonText}>+</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 10,
        paddingHorizontal: 20,
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: "600",
        marginBottom: 16,
        color: palette.black,
        textAlign: "center",
    },
    inputGroup: {
        marginBottom: 12,
        height: 75,
        width: "50%",
        padding: 8
    },
    label: {
        fontSize: 14,
        fontWeight: "500",
        marginHorizontal: 4,
        color: palette.black,
    },
    input: {
        borderWidth: 1,
        borderColor: palette.grayBorder,
        borderRadius: 20,
        height: 60,
        padding: 10,
        fontSize: 16,
        backgroundColor: palette.lightGray,
        color: palette.black,
    },
    inputWithUnit: {
        flex: 1,
        justifyContent: "center",
        textAlign: "center",
        alignItems: "center",
        position: "relative",
    },
    unitLabel: {
        position: "absolute",
        right: 5,
        color: palette.grayText,
        fontSize: 14,
        zIndex: -1,
        pointerEvents: "none"
    },
    stepperContainer: {
        flexDirection: "row",
        borderWidth: 1,
        borderColor: palette.grayBorder,
        borderRadius: 20,
        overflow: "hidden",
        height: 60,
    },
    stepperInput: {
        textAlign: "center",
        fontSize: 16,
        color: palette.black,
        width: "100%",
    },
    stepperButton: {
        paddingHorizontal: 12,
        justifyContent: "center",
        alignItems: "center",
        width: 50,
        backgroundColor: palette.dark,
    },
    stepperButtonText: {
        fontSize: 20,
        color: palette.white,
        fontWeight: "bold",
    },
});