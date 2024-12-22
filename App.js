// Import necessary dependencies
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useKeepAwake } from 'expo-keep-awake';
import { Text, TextInput, StyleSheet } from 'react-native';
import MainScreen from './src/screens/index';
import { MainHeaderTitle, MainHeaderRight } from './src/navigation/headers';
import WorkoutScreen from './src/screens/workout/WorkoutScreen';
import EnduranceScreen from './src/screens/EnduranceScreen';
import CustomScreen from './src/screens/workout/CustomScreen';
import NewScreen from './src/screens/workout/NewScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import TimerScreen from './src/screens/TimerScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { toast, Toasts } from '@backpackapp-io/react-native-toast';

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
  useKeepAwake();
  useEffect(() => {
    disableFontScaling();
  }, [])

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView>
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
                headerTitle: (props) => <MainHeaderTitle {...props} />,
                headerTitleAlign: "center",
                headerRight: (props) => <MainHeaderRight {...props} />,
              }} />
            <Stack.Screen name="Workout" component={WorkoutScreen}
              options={{
                headerTitleStyle: {
                  fontSize: 20,
                },
              }} />
            {/* <Stack.Screen name="4x4" component={EnduranceScreen} /> */}
            <Stack.Screen name="New Workout" component={NewScreen} options={{
              headerTitleStyle: {
                fontSize: 20,
              },
            }} />
            <Stack.Screen name="Custom Workout" component={CustomScreen} options={{
              headerTitleStyle: {
                fontSize: 20,
              },
            }} />
            <Stack.Screen name="Timer" component={TimerScreen} options={{
              headerTitleStyle: {
                fontSize: 20,
              },
            }} />
            <Stack.Screen name="Settings" component={SettingsScreen} options={{
              headerTitleAlign: "center",
              presentation: "modal",
              headerTitleStyle: {
                fontSize: 20,
              },

            }} />

          </Stack.Navigator>

        </NavigationContainer>
        <Toasts />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};


export default App;
