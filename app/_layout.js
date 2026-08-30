import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Text, TextInput } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ToastProvider } from '@/components/ui/Toast';
import { palette } from '@/constants/common';
import { runMigrations } from '@/lib/migrate';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

// Preserve the pre-2.0 behaviour of ignoring the OS font-scale setting so the
// timer / selector layouts stay intact. No-ops gracefully if unsupported.
try {
  Text.defaultProps = { ...(Text.defaultProps || {}), allowFontScaling: false };
  TextInput.defaultProps = {
    ...(TextInput.defaultProps || {}),
    allowFontScaling: false,
  };
} catch {
  // ignore
}

SplashScreen.preventAutoHideAsync().catch(() => {});

const headerOptions = {
  headerShown: true,
  headerTitleStyle: { fontSize: 20 },
  headerTintColor: palette.dark,
  headerStyle: { backgroundColor: palette.bg_light },
  headerShadowVisible: false,
  contentStyle: { backgroundColor: palette.bg },
};

export default function RootLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      await runMigrations();
      setReady(true);
      SplashScreen.hideAsync().catch(() => {});
    })();
  }, []);

  if (!ready) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={DefaultTheme}>
        <SafeAreaProvider>
          <ToastProvider>
            <StatusBar style="dark" />
            <Stack screenOptions={headerOptions}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="workout/new" options={{ title: 'New workout' }} />
              <Stack.Screen
                name="workout/[id]/index"
                options={{ title: 'Workout', headerBackTitle: 'Back' }}
              />
              <Stack.Screen
                name="workout/[id]/timer"
                options={{ title: 'Timer', headerBackTitle: 'Back' }}
              />
            </Stack>
          </ToastProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
