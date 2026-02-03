import { StatusBar } from "expo-status-bar";
import React from "react";
import { useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AuthScreen from "../src/screens/AuthScreen";

export default function App() {
  const scheme = useColorScheme(); // 'dark' or 'light'

  return (
    <SafeAreaProvider>
      {/* Updates the top status bar (battery, time) color automatically */}
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />
      <AuthScreen />
    </SafeAreaProvider>
  );
}
