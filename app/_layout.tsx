import "react-native-get-random-values";

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import "react-native-reanimated";

// 👇 Import your Colors object so we can grab the exact hex codes
import { VaultProvider } from "../src/context/VaultContext";
import { Colors } from "../src/theme";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // 👇 Get the active theme colors
  const theme = Colors[colorScheme === "dark" ? "dark" : "light"];

  return (
    <VaultProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack
          // 👇 THIS IS THE FIX:
          screenOptions={{
            // 1. Force the hidden background to match your theme
            contentStyle: { backgroundColor: theme.background },
            // 2. Ensure the header (if visible) also matches
            headerStyle: { backgroundColor: theme.background },
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

          <Stack.Screen
            name="add"
            options={{
              presentation: "modal",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="detail"
            options={{
              presentation: "modal",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="edit"
            options={{
              presentation: "modal",
              headerShown: false,
            }}
          />
        </Stack>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      </ThemeProvider>
    </VaultProvider>
  );
}
