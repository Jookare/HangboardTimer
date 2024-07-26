import { getWorkout } from '../utils/functions'
// Handle button presses
export async function handleButtonPress(navigation, navID) {
    let values, workout, id, workoutData;
    console.log(navID);

    switch (navID) {
        case "#workout#@1":
            workoutData = {
                values: [5, 1, 0, 10, 0, 0, 3, 0],
                workout: "Short Max Hang"
            }
            handleNavigation(navigation, 'Workout', workoutData);
            break;
        case "#workout#@2":
            workoutData = {
                values: [3, 5, 0, 7, 0, 5, 3, 0],
                workout: "Repeaters"
            }
            handleNavigation(navigation, 'Workout', workoutData);
            break;
        case "#workout#@3":
            workoutData = {}
            handleNavigation(navigation, '4x4', workoutData);
            break;
        case "#workout#@new":
            workoutData = {
                values: [1, 1, 0, 0, 0, 0, 0, 0],
                workout: ""
            }
            handleNavigation(navigation, 'CustomWorkout', workoutData);
            break;
        default:
            const value = await getWorkout(navID);
            if (value) {
                workout = value.name;
                values = value.values;
                id = value.id;
            } else {
                values = [1, 1, 0, 0, 0, 0, 0, 0];
                workout = '';
                id = null;
            }
            workoutData = {
                values: values,
                workout: workout,
                id: id
            };
            handleNavigation(navigation, 'Workout', workoutData);
            break;
    }
};


const handleNavigation = (navigation, screen, params) => {
    navigation.navigate(screen, params);
};