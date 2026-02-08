import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "../src/theme";

// Tip Data
const TIPS = [
  {
    icon: "key-outline",
    color: "#FF9500",
    title: "The Strength of Length",
    content:
      "Complexity is good, but length is better. A password like 'CorrectHorseBatteryStaple' is harder to crack than 'Tr0ub4dor&3'. Aim for phrases over 12 characters.",
  },
  {
    icon: "shuffle-outline",
    color: "#34C759",
    title: "Don't Reuse Passwords",
    content:
      "If one site gets hacked, hackers will try that email and password combination everywhere. Use a unique password for every single account. That's why you have NeuroKey!",
  },
  {
    icon: "shield-checkmark-outline",
    color: "#007AFF",
    title: "Enable 2FA Everywhere",
    content:
      "Two-Factor Authentication (2FA) is your best defense. Even if someone steals your password, they can't get in without the second code. Use an authenticator app instead of SMS whenever possible.",
  },
  {
    icon: "wifi-outline",
    color: "#AF52DE",
    title: "Public Wi-Fi Danger",
    content:
      "Avoid logging into banking or sensitive sites on public Coffee Shop Wi-Fi. If you must, use a VPN or switch to your mobile data connection.",
  },
  {
    icon: "mail-open-outline",
    color: "#FF3B30",
    title: "Spotting Phishing",
    content:
      "Banks will never email you asking for your password. Check the sender's email address carefully. If it looks fishy (e.g., support@amaz0n-security.com), delete it.",
  },
];

export default function SecurityTipsScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const theme = Colors[scheme === "dark" ? "dark" : "light"];
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.closeBtn, { backgroundColor: theme.inputBg }]}
        >
          <Ionicons name="close" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Security Guide
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.intro, { color: theme.subText }]}>
          Protecting your digital life goes beyond just storing passwords. Here
          are essential habits to keep you safe online.
        </Text>

        {TIPS.map((tip, index) => (
          <Animated.View
            key={index}
            entering={FadeInDown.delay(index * 100).duration(600)}
            style={[styles.card, { backgroundColor: theme.card }]}
          >
            <View style={styles.cardHeader}>
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: tip.color + "20" }, // 20% opacity background
                ]}
              >
                <Ionicons name={tip.icon as any} size={24} color={tip.color} />
              </View>
              <Text style={[styles.cardTitle, { color: theme.text }]}>
                {tip.title}
              </Text>
            </View>
            <Text style={[styles.cardContent, { color: theme.subText }]}>
              {tip.content}
            </Text>
          </Animated.View>
        ))}

        <Text
          style={{
            textAlign: "center",
            color: theme.subText,
            marginTop: 20,
            marginBottom: 40,
            opacity: 0.5,
          }}
        >
          Stay Safe. Stay Secure.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { fontSize: 20, fontWeight: "700" },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  intro: { fontSize: 16, lineHeight: 24, marginBottom: 30 },
  card: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  cardTitle: { fontSize: 18, fontWeight: "600" },
  cardContent: { fontSize: 15, lineHeight: 22 },
});
