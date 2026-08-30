import { Tabs } from 'expo-router';

import TabBar from '@/components/ui/TabBar';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        animation: 'none',
      }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tabs.Screen name="index" options={{ tabBarLabel: 'Home' }} />
      <Tabs.Screen name="history" options={{ tabBarLabel: 'Training log' }} />
      <Tabs.Screen name="settings" options={{ tabBarLabel: 'Settings' }} />
    </Tabs>
  );
}
