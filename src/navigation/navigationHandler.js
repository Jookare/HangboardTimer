      
// navigation/navigationHandler.js
import { getItem } from '../utils/functions';
// Import toast if you want to use it here, or pass it as a param
// import { toast } from 'your-toast-library'; // Assuming you have a toast library

// Unified navigation handler
export async function handleAppNavigation(navigation, actionID, params = {}) {
    // actionID can be navID for workouts, or a string like 'log', 'settings'
    // params can be used to pass additional data if needed, but workoutData will be primary for workouts

    let workoutData;
    let screenName;
    let screenParams = params; // Initialize with passed params

    console.log("Handling navigation for:", actionID);

    try {
        switch (actionID) {
            // Predefined Workouts
            case "#workout#@1":
                screenName = 'Workout';
                screenParams = {
                    ...screenParams, // Keep any existing params
                    values: [5, 1, 0, 10, 0, 0, 3, 0],
                    workout: "Short Max Hang"
                };
                break;
            case "#workout#@2":
                screenName = 'Workout';
                screenParams = {
                    ...screenParams,
                    values: [3, 5, 0, 7, 0, 5, 3, 0],
                    workout: "Repeaters"
                };
                break;
            case "#workout#@3": // Assuming you might uncomment this
                screenName = '4x4'; // Or 'Workout' if it's a generic workout screen
                screenParams = { ...screenParams }; // Add specific params if needed
                break;
            case "#workout#@new":
                screenName = 'New Workout';
                screenParams = {
                    ...screenParams,
                    values: [1, 1, 0, 1, 0, 0, 0, 0],
                    workout: "",
                };
                break;

            // App Screens
            case "log":
                screenName = 'Training History';
                // screenParams can remain empty or be set if Log screen needs params
                break;
            case "settings":
                screenName = 'Settings';
                // screenParams can remain empty
                break;

            // Custom Workouts (Default)
            default:
                // Check if it's a custom workout ID (e.g., starts with '#')
                if (actionID && actionID.startsWith('#')) {
                    const value = await getItem(actionID);
                    console.log("Custom workout data:", value);
                    if (value) {
                        screenParams = {
                            ...screenParams,
                            values: value.values,
                            workout: value.name,
                            id: value.id
                        };
                    } else {
                        // Fallback if item not found, though this might indicate an issue
                        screenParams = {
                            ...screenParams,
                            values: [1, 1, 0, 1, 0, 0, 0, 0],
                            workout: 'Unknown Workout',
                            id: null
                        };
                    }
                    screenName = 'Custom Workout';
                } else {
                    console.warn("Unknown actionID:", actionID);
                    // Optionally navigate to a default/error screen or do nothing
                    return;
                }
                break;
        }

        if (screenName) {
            navigation.navigate(screenName, screenParams);
        }

    } catch (error) {
        console.error("Navigation error in handleAppNavigation:", error);
        // Example: Re-implement toast from handleClick
        // toast.error(error.message || "Navigation failed", { /* ... toast styles ... */ });
        // You'll need to import and configure your toast library here or pass toast function as a parameter
    }
}
