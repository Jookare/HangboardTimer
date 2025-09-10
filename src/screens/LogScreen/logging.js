import {
	getAllItems,
	getItem,
	saveItem,
	deleteItem,
} from "../../utils/functions";

const STORAGE_KEY = "@WorkoutHistory";

export const fetchLogs = async () => {
    try {
        const fetchedLogs = (await getItem(STORAGE_KEY)) || [];
        return fetchedLogs;
    } catch (error) {
        console.error("Error fetching logs:", error);
        return [];
    }
};


export const logWorkout = async (updatedLogs) => {
    try {
        await saveItem(STORAGE_KEY, JSON.stringify(updatedLogs));
        console.log("Workout logged successfully.");
    } catch (error) {
        console.error("Failed to log workout:", error);
    }
};


export const clearWorkoutHistory = async () => {
    try {
        await deleteItem(STORAGE_KEY); // Clear workout history
        console.log("Workout history cleared.");
    } catch (error) {
        console.error("Failed to clear workout history:", error);
    }
};



// export const saveEditedWorkout = async () => {
//     try {
//         if (!selectedWorkout) return;

//         // Find index of the selected workout
//         const workoutIndex = logs.findIndex(
//             (log) => log.id === selectedWorkout.id
//         );
//         if (workoutIndex === -1) {
//             console.error("Workout not found");
//             return;
//         }

//         // Create updated workout
//         const updatedWorkout = {
//             ...selectedWorkout,
//             name: editedWorkout.name,
//             duration: editedWorkout.duration,
//             kcal: parseInt(editedWorkout.kcal) || 0,
//         };

//         // Update logs array
//         const updatedLogs = [...logs];
//         updatedLogs[workoutIndex] = updatedWorkout;

//         // Save to storage
//         await saveItem(STORAGE_KEY, JSON.stringify(updatedLogs));

//         // Update state
//         return updatedLogs;
//     } catch (error) {
//         console.error("Failed to update workout:", error);
//     }
// };


// export const deleteWorkout = async () => {
//     try {
//         if (!selectedWorkout) return;

//         // Filter out the selected workout
//         const updatedLogs = logs.filter((log) => log.id !== selectedWorkout.id);

//         // Save to storage
//         await saveItem(STORAGE_KEY, JSON.stringify(updatedLogs));

//         // Update state
//         setLogs(updatedLogs);
//         console.log("Workout deleted successfully");

//         // Close modal
//         closeModal();
//     } catch (error) {
//         console.error("Failed to delete workout:", error);
//     }
// };
