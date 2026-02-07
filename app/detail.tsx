import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useVault } from "../src/context/VaultContext"; // 👇 Import Context for Delete
import { Colors } from "../src/theme";

export default function DetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams(); // Get data passed from index
  const scheme = useColorScheme();
  const theme = Colors[scheme === "dark" ? "dark" : "light"];
  const insets = useSafeAreaInsets();

  const { deletePassword } = useVault();

  // State
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Helper: Copy to Clipboard
  const copyToClipboard = async (text: string, label: string) => {
    await Clipboard.setStringAsync(text);
    // On Android, a toast usually appears automatically. On iOS, we might want a subtle alert.
    if (Platform.OS === "ios") {
      Alert.alert("Copied", `${label} copied to clipboard.`);
    }
  };

  // Helper: Delete Action
  const handleDelete = () => {
    Alert.alert("Delete Password", "Are you sure? This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deletePassword(params.id as string); // Delete from Context
          router.back(); // Go back to list
        },
      },
    ]);
  };

  // Helper: Render Icon (Same logic as Index)
  const renderIcon = () => {
    const { icon, color, title } = params;
    const iconName = icon as string;
    const iconColor = color as string;
    const serviceName = title as string;

    if (iconName && iconName.startsWith("logo-")) {
      return (
        <View style={[styles.iconCircle, { backgroundColor: theme.card }]}>
          <Ionicons
            name={iconName as any}
            size={40}
            color={iconColor || theme.text}
          />
        </View>
      );
    }
    if (iconName) {
      return (
        <View
          style={[
            styles.iconCircle,
            { backgroundColor: iconColor || theme.primary },
          ]}
        >
          <Ionicons name={iconName as any} size={32} color="#FFF" />
        </View>
      );
    }
    return (
      <View
        style={[
          styles.iconCircle,
          { backgroundColor: iconColor || theme.primary },
        ]}
      >
        <Text style={{ fontSize: 30, color: "#FFF", fontWeight: "bold" }}>
          {serviceName?.charAt(0).toUpperCase()}
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* 1. HEADER (Custom) */}
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.roundBtn}>
          <Ionicons name="close" size={24} color={theme.text} />
        </TouchableOpacity>

        {/* Edit Button (Placeholder) */}
        <TouchableOpacity
          onPress={() => Alert.alert("Coming Soon", "Edit functionality")}
        >
          <Text
            style={{ color: theme.primary, fontSize: 17, fontWeight: "600" }}
          >
            Edit
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* 2. LARGE ICON & TITLE */}
        <View style={{ alignItems: "center", marginVertical: 20 }}>
          {renderIcon()}
          <Text style={[styles.title, { color: theme.text }]}>
            {params.title}
          </Text>
          <Text style={{ color: theme.subText, fontSize: 16 }}>
            {params.email}
          </Text>
        </View>

        {/* 3. CREDENTIALS GROUP */}
        <View style={styles.sectionTitleContainer}>
          <Text style={[styles.sectionTitle, { color: theme.subText }]}>
            CREDENTIALS
          </Text>
        </View>

        <View style={[styles.groupContainer, { backgroundColor: theme.card }]}>
          {/* Username Row */}
          <View style={[styles.row, { borderBottomColor: theme.border }]}>
            <Text style={[styles.label, { color: theme.text }]}>Username</Text>
            <Text
              style={[styles.value, { color: theme.subText }]}
              numberOfLines={1}
            >
              {params.email}
            </Text>
            <TouchableOpacity
              onPress={() =>
                copyToClipboard(params.email as string, "Username")
              }
            >
              <Ionicons name="copy-outline" size={20} color={theme.primary} />
            </TouchableOpacity>
          </View>

          {/* Password Row */}
          <View style={[styles.row, { borderBottomColor: "transparent" }]}>
            <Text style={[styles.label, { color: theme.text }]}>Password</Text>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text
                style={[
                  styles.value,
                  {
                    color: theme.text,
                    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
                  },
                ]}
              >
                {isPasswordVisible
                  ? (params.password as string)
                  : "••••••••••••••••"}
              </Text>
            </View>
            <View style={{ flexDirection: "row", gap: 15 }}>
              <TouchableOpacity
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                <Ionicons
                  name={isPasswordVisible ? "eye-off" : "eye"}
                  size={22}
                  color={theme.primary}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  copyToClipboard(params.password as string, "Password")
                }
              >
                <Ionicons name="copy-outline" size={20} color={theme.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 4. WEBSITE / NOTES */}
        <View style={styles.sectionTitleContainer}>
          <Text style={[styles.sectionTitle, { color: theme.subText }]}>
            DETAILS
          </Text>
        </View>

        <View style={[styles.groupContainer, { backgroundColor: theme.card }]}>
          {/* URL */}
          <View style={[styles.row, { borderBottomColor: theme.border }]}>
            <Text style={[styles.label, { color: theme.text }]}>Website</Text>
            <Text
              style={[styles.value, { color: theme.subText }]}
              numberOfLines={1}
            >
              {params.url || "None"}
            </Text>
            {params.url ? (
              <TouchableOpacity
                onPress={() =>
                  Alert.alert("Open Link", `Opening ${params.url}`)
                }
              >
                <Ionicons name="open-outline" size={20} color={theme.primary} />
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Notes */}
          <View
            style={[
              styles.row,
              {
                borderBottomColor: "transparent",
                alignItems: "flex-start",
                paddingVertical: 12,
              },
            ]}
          >
            <Text style={[styles.label, { color: theme.text, marginTop: 0 }]}>
              Notes
            </Text>
            <Text
              style={[styles.value, { color: theme.subText, lineHeight: 20 }]}
            >
              {params.notes || "No notes added."}
            </Text>
          </View>
        </View>

        {/* 5. DELETE BUTTON */}
        <TouchableOpacity
          style={[styles.deleteButton, { backgroundColor: theme.card }]}
          onPress={handleDelete}
        >
          <Text
            style={{ color: theme.danger, fontSize: 17, fontWeight: "600" }}
          >
            Delete Password
          </Text>
        </TouchableOpacity>
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
    paddingBottom: 10,
  },
  roundBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(128,128,128, 0.15)",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  sectionTitleContainer: {
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "500",
  },
  groupContainer: {
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 16,
    paddingRight: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  label: {
    width: 90,
    fontSize: 16,
    fontWeight: "500",
  },
  value: {
    flex: 1,
    fontSize: 16,
    marginRight: 10,
  },
  deleteButton: {
    marginTop: 30,
    marginHorizontal: 16,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});
