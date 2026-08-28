// app/_layout.js
// The root layout for the entire app.
// This file sets up the bottom tab navigation.
// Expo Router automatically uses this file as the root layout.

import { Tabs } from 'expo-router';
import { StyleSheet, Text } from 'react-native';
import Colors from '../constants/colors';

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        // Tab bar styling
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textLight,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,

        // Header styling
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        headerTintColor: Colors.primary,
      }}
    >
      {/* Home Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <TabIcon emoji="🏠" color={color} />
          ),
          headerTitle: 'CampusConnect',
          headerTitleStyle: styles.appHeaderTitle,
        }}
      />

      {/* My Events Tab */}
      <Tabs.Screen
        name="my-events"
        options={{
          title: 'My Events',
          tabBarLabel: 'My Events',
          tabBarIcon: ({ color }) => <TabIcon emoji="🎟️" color={color} />,
          headerTitle: 'My Events',
        }}
      />

      {/* Create Event Tab */}
      <Tabs.Screen
        name="create-event"
        options={{
          title: 'Create Event',
          tabBarLabel: 'Create',
          tabBarIcon: ({ color }) => <TabIcon emoji="➕" color={color} />,
          headerTitle: 'Create Event',
        }}
      />

      {/* Event Details — hidden from tab bar, opened from Home */}
      <Tabs.Screen
        name="events/[id]"
        options={{
          href: null, // This hides it from the tab bar
          headerTitle: 'Event Details',
          headerShown: true,
        }}
      />
    </Tabs>
  );
}

// Simple emoji icon for tabs — using Text since we don't need an icon library
function TabIcon({ emoji }) {
  return <Text style={{ fontSize: 20 }}>{emoji}</Text>;
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.tabBar,
    borderTopColor: Colors.tabBarBorder,
    borderTopWidth: 1,
    height: 60,
    paddingBottom: 8,
    paddingTop: 4,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  header: {
    backgroundColor: Colors.white,
    borderBottomColor: Colors.border,
    borderBottomWidth: 1,
    elevation: 0,
    shadowOpacity: 0,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  appHeaderTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primary,
  },
});
