// Import necessary dependencies
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Text, TextInput } from 'react-native';
import MainScreen from './src/screens/index';
import { MainHeaderTitle, MainHeaderRight } from './src/navigation/headers';
import WorkoutScreen from './src/screens/WorkoutScreen';
import EnduranceScreen from './src/screens/4x4Screen';
import CustomScreen from './src/screens/CustomScreen';
const Stack = createNativeStackNavigator();


const disableFontScaling = () => {
  Text.defaultProps = {
    allowFontScaling: false,
  };
  TextInput.defaultProps = {
    allowFontScaling: false,
  };
}

// App component
const App = () => {
  useEffect(() => {
    disableFontScaling();
  }, [])

  return (
    <NavigationContainer >
      <Stack.Navigator
        initialRouteName="Main"
        screenOptions={{
          animationEnabled: false, // Disable transition animation.
        }}>
        <Stack.Screen
          name="Main"
          component={MainScreen}
          options={{
            headerTitle: (props) => <MainHeaderTitle {...props} />, headerTitleAlign: "center",
            headerRight: (props) => <MainHeaderRight {...props} />
          }} />
        <Stack.Screen name="Workout" component={WorkoutScreen} />
        <Stack.Screen name="4x4" component={EnduranceScreen} />
        <Stack.Screen name="CustomWorkout" component={CustomScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
