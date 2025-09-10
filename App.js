// Import necessary dependencies
import { Toasts } from '@backpackapp-io/react-native-toast';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useKeepAwake } from 'expo-keep-awake';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Text, TextInput } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { MainHeaderTitle } from './src/navigation/headers';
import MainScreen from './src/screens/index';
import LogScreen from './src/screens/LogScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import TimerScreen from './src/screens/TimerScreen';
import CustomScreen from './src/screens/workout/CustomScreen';
import NewScreen from './src/screens/workout/NewScreen';
import WorkoutScreen from './src/screens/workout/WorkoutScreen';

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
      <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaView style={{ flex: 1 }} edges={['top']}>
            <NavigationContainer >
              <StatusBar style="dark" />
              <Stack.Navigator
                initialRouteName="Main"
                screenOptions={{
                  animationEnabled: false, // Disable transition animation.
                }}
              >
                <Stack.Screen
                  name="Main"
                  component={MainScreen}
                  options={{
                    headerTitle: (props) => <MainHeaderTitle {...props} />,
                    headerTitleAlign: "center",
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
                  headerTitleStyle: {
                    fontSize: 20,
                  },
                }} />
                <Stack.Screen name="Training History" component={LogScreen} options={{
                  headerTitleAlign: "center",
                  headerTitleStyle: {
                    fontSize: 20,
                  },
                }} />

              </Stack.Navigator>
            </NavigationContainer>
          </SafeAreaView>
        <Toasts />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};


export default App;
