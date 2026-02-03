import { Tabs } from "expo-router";
import React from "react";

import { useColorScheme } from "react-native";
import { Colors } from "../../src/theme"; // <--- POINTING TO YOUR NEW THEME

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme === "dark" ? "dark" : "light"];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
        },
        headerShown: false,
      }}
    >
      {/* Tab 1: The Password Vault */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Passwords",
        }}
      />

      {/* You can add 'generator.tsx' or 'settings.tsx' here later */}
    </Tabs>
  );
}
