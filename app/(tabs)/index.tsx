import { StyleSheet, Text, useColorScheme, View } from "react-native";
import { Colors } from "../../src/theme";

export default function VaultScreen() {
  const scheme = useColorScheme();
  const theme = Colors[scheme === "dark" ? "dark" : "light"];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.text, { color: theme.text }]}>
        🔐 Vault Unlocked
      </Text>
      <Text style={{ color: theme.subText, marginTop: 10 }}>
        Your passwords will appear here.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
