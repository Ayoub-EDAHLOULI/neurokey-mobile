import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "../src/theme";

export default function AboutScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const theme = Colors[scheme === "dark" ? "dark" : "light"];
  const insets = useSafeAreaInsets();

  // Manage image loading state
  const [imageError, setImageError] = useState(false);

  const handleLink = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open URL:", err),
    );
  };

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
          About Me
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Image Section */}
        <View style={styles.profileContainer}>
          <View
            style={[styles.avatarContainer, { shadowColor: theme.primary }]}
          >
            {!imageError ? (
              <Image
                // 👇 Pulling directly from your GitHub
                source={{ uri: "https://github.com/Ayoub-EDAHLOULI.png" }}
                style={styles.avatarImage}
                onError={() => setImageError(true)}
              />
            ) : (
              // Fallback to Initials if image fails
              <View
                style={[
                  styles.avatarFallback,
                  { backgroundColor: theme.primary },
                ]}
              >
                <Text style={styles.avatarText}>AE</Text>
              </View>
            )}
          </View>

          <Text style={[styles.name, { color: theme.text }]}>
            Ayoub Edahlouli
          </Text>
          <Text style={[styles.role, { color: theme.primary }]}>
            Full Stack Developer & AI Engineer
          </Text>
        </View>

        {/* Bio Section */}
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.bioText, { color: theme.text }]}>
            I built{" "}
            <Text style={{ fontWeight: "bold", color: theme.primary }}>
              NeuroKey
            </Text>{" "}
            because I needed a secure place for my own digital life—and I knew
            others did too.
          </Text>
          <Text style={[styles.bioText, { color: theme.text, marginTop: 15 }]}>
            Managing passwords shouldn&apos;t be a headache. It should be
            beautiful, fast, and private. This app is my solution to a problem
            we all face.
          </Text>
        </View>

        {/* Contact Links */}
        <Text style={[styles.sectionTitle, { color: theme.subText }]}>
          CONNECT WITH ME
        </Text>

        <View
          style={[
            styles.card,
            { backgroundColor: theme.card, paddingVertical: 0 },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.linkRow,
              {
                borderBottomColor: theme.border,
                borderBottomWidth: StyleSheet.hairlineWidth,
              },
            ]}
            onPress={() => handleLink("https://ayoubedahlouli.com")}
          >
            <View style={[styles.iconBox, { backgroundColor: "#007AFF" }]}>
              <Ionicons name="globe-outline" size={20} color="#FFF" />
            </View>
            <Text style={[styles.linkText, { color: theme.text }]}>
              Portfolio Website
            </Text>
            <Ionicons name="chevron-forward" size={20} color={theme.subText} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.linkRow,
              {
                borderBottomColor: theme.border,
                borderBottomWidth: StyleSheet.hairlineWidth,
              },
            ]}
            onPress={() => handleLink("mailto:ayoub.edahlouli@gmail.com")}
          >
            <View style={[styles.iconBox, { backgroundColor: "#AF52DE" }]}>
              <Ionicons name="mail-outline" size={20} color="#FFF" />
            </View>
            <Text style={[styles.linkText, { color: theme.text }]}>
              Email Me
            </Text>
            <Ionicons name="chevron-forward" size={20} color={theme.subText} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkRow}
            onPress={() => handleLink("https://github.com/Ayoub-EDAHLOULI")}
          >
            <View style={[styles.iconBox, { backgroundColor: "#333" }]}>
              <Ionicons name="logo-github" size={20} color="#FFF" />
            </View>
            <Text style={[styles.linkText, { color: theme.text }]}>GitHub</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.subText} />
          </TouchableOpacity>
        </View>

        <Text
          style={{
            textAlign: "center",
            color: theme.subText,
            marginTop: 40,
            marginBottom: 20,
          }}
        >
          Made with ❤️ in Morocco
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
  headerTitle: { fontSize: 18, fontWeight: "700" },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },

  profileContainer: { alignItems: "center", marginBottom: 30, marginTop: 10 },

  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8, // Android shadow
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  avatarFallback: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  avatarText: { fontSize: 36, fontWeight: "bold", color: "#FFF" },

  name: { fontSize: 24, fontWeight: "bold", marginBottom: 4 },
  role: { fontSize: 16, fontWeight: "600" },

  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  bioText: { fontSize: 16, lineHeight: 24 },

  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 10,
    marginLeft: 10,
    letterSpacing: 0.5,
  },

  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  linkText: { flex: 1, fontSize: 16, fontWeight: "500" },
});
