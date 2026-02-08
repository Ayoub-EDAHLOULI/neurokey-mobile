import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { Colors } from "../src/theme";
// 👇 Import the Hook
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useVault } from "../src/context/VaultContext";
// 👇 Import Component
import CustomAlert from "../src/components/CustomAlert";

// --- CONFIG: AVAILABLE ICONS ---
const BRAND_ICONS = [
  { id: "amazon", name: "Amazon", icon: "logo-amazon", color: "#FF9900" },
  { id: "google", name: "Google", icon: "logo-google", color: "#4285F4" },
  { id: "apple", name: "Apple", icon: "logo-apple", color: "#000000" },
  { id: "facebook", name: "Facebook", icon: "logo-facebook", color: "#1877F2" },
  {
    id: "instagram",
    name: "Instagram",
    icon: "logo-instagram",
    color: "#E1306C",
  },
  {
    id: "twitter",
    name: "X / Twitter",
    icon: "logo-twitter",
    color: "#1DA1F2",
  },
  { id: "linkedin", name: "LinkedIn", icon: "logo-linkedin", color: "#0077B5" },
  { id: "bank", name: "Bank", icon: "card", color: "#34C759" },
  { id: "crypto", name: "Crypto", icon: "wallet", color: "#F7931A" },
  { id: "mail", name: "Email", icon: "mail", color: "#5856D6" },
  { id: "other", name: "Other", icon: "key", color: "#8E8E93" },
];

export default function AddPasswordScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const theme = Colors[scheme === "dark" ? "dark" : "light"];
  const insets = useSafeAreaInsets();

  const { addVaultItem } = useVault();

  // --- STATE ---
  const [serviceName, setServiceName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");

  const [selectedIcon, setSelectedIcon] = useState(BRAND_ICONS[0]);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // 👇 NEW: Alert State
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    title: string;
    message: string;
    type: "success" | "error" | "warning" | "info";
  }>({
    visible: false,
    title: "",
    message: "",
    type: "info",
  });

  const showAlert = (title: string, message: string, type: any = "info") => {
    setAlertConfig({ visible: true, title, message, type });
  };

  const closeAlert = () => {
    setAlertConfig((prev) => ({ ...prev, visible: false }));
  };

  // --- HELPERS ---

  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    let autoPass = "";
    for (let i = 0; i < 16; i++) {
      autoPass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(autoPass);
  };

  useEffect(() => {
    let score = 0;
    if (password.length > 8) score++;
    if (password.length > 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;
    setPasswordStrength(score);
  }, [password]);

  const getStrengthColor = () => {
    if (password.length === 0) return theme.border;
    if (passwordStrength <= 1) return theme.strengthWeak;
    if (passwordStrength === 2) return theme.strengthMedium;
    return theme.strengthStrong;
  };

  const handleSave = () => {
    if (!serviceName || !password) {
      // 👇 Use State
      showAlert("Missing Info", "Please add a name and password.", "error");
      return;
    }

    addVaultItem({
      type: "password",
      name: serviceName,
      email,
      password,
      url,
      notes,
      icon: selectedIcon.icon,
      color: selectedIcon.color,
    });

    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {/* HEADER */}
      <View style={[styles.header, { paddingTop: insets.top + 30 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: theme.primary, fontSize: 17 }}>Cancel</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Add Password
        </Text>
        <TouchableOpacity onPress={handleSave}>
          <Text
            style={{ color: theme.primary, fontSize: 17, fontWeight: "bold" }}
          >
            Save
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* 1. ICON PICKER */}
        <View style={{ marginTop: 20, marginBottom: 20 }}>
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.subText, marginLeft: 20 },
            ]}
          >
            CHOOSE ICON
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 20, paddingRight: 20 }}
          >
            {BRAND_ICONS.map((brand) => (
              <TouchableOpacity
                key={brand.id}
                onPress={() => setSelectedIcon(brand)}
                style={{ alignItems: "center", marginRight: 20 }}
              >
                <View
                  style={[
                    styles.iconCircle,
                    {
                      backgroundColor:
                        selectedIcon.id === brand.id ? brand.color : theme.card,
                      borderWidth: 2,
                      borderColor:
                        selectedIcon.id === brand.id
                          ? "transparent"
                          : theme.border,
                    },
                  ]}
                >
                  <Ionicons
                    name={brand.icon as any}
                    size={28}
                    color={
                      selectedIcon.id === brand.id ? "#FFF" : theme.subText
                    }
                  />
                </View>
                <Text
                  style={{
                    marginTop: 8,
                    fontSize: 12,
                    color:
                      selectedIcon.id === brand.id ? theme.text : theme.subText,
                    fontWeight: selectedIcon.id === brand.id ? "600" : "400",
                  }}
                >
                  {brand.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 2. CREDENTIALS FORM */}
        <View style={styles.formGroup}>
          <View
            style={[
              styles.inputRow,
              { backgroundColor: theme.card, borderBottomColor: theme.border },
            ]}
          >
            <Text style={[styles.label, { color: theme.text }]}>Name</Text>
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="e.g. Netflix"
              placeholderTextColor={theme.subText}
              value={serviceName}
              onChangeText={setServiceName}
            />
          </View>

          <View
            style={[
              styles.inputRow,
              { backgroundColor: theme.card, borderBottomColor: "transparent" },
            ]}
          >
            <Text style={[styles.label, { color: theme.text }]}>Email</Text>
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="username@email.com"
              placeholderTextColor={theme.subText}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* 3. PASSWORD SECTION */}
        <Text
          style={[
            styles.sectionTitle,
            { color: theme.subText, marginLeft: 20, marginTop: 24 },
          ]}
        >
          PASSWORD
        </Text>
        <View style={[styles.formGroup, { backgroundColor: theme.card }]}>
          <View
            style={[
              styles.inputRow,
              { borderBottomColor: theme.border, paddingRight: 10 },
            ]}
          >
            <TextInput
              style={[styles.input, { color: theme.text, flex: 1 }]}
              placeholder="Required"
              placeholderTextColor={theme.subText}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={{ padding: 8 }}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={22}
                color={theme.subText}
              />
            </TouchableOpacity>
          </View>

          {/* Strength Bar */}
          <View style={{ flexDirection: "row", height: 4, width: "100%" }}>
            <View
              style={{
                flex: 1,
                backgroundColor:
                  password.length > 0 ? getStrengthColor() : "transparent",
                opacity: 0.3,
              }}
            />
            <View
              style={{
                flex: 1,
                backgroundColor:
                  passwordStrength >= 2 ? getStrengthColor() : "transparent",
                opacity: 0.5,
              }}
            />
            <View
              style={{
                flex: 1,
                backgroundColor:
                  passwordStrength >= 3 ? getStrengthColor() : "transparent",
                opacity: 0.8,
              }}
            />
            <View
              style={{
                flex: 1,
                backgroundColor:
                  passwordStrength >= 4 ? getStrengthColor() : "transparent",
                opacity: 1.0,
              }}
            />
          </View>

          {/* Generator Button */}
          <TouchableOpacity style={styles.actionRow} onPress={generatePassword}>
            <Ionicons name="sparkles" size={20} color={theme.primary} />
            <Text style={[styles.actionText, { color: theme.primary }]}>
              Generate Strong Password
            </Text>
          </TouchableOpacity>
        </View>

        {/* 4. EXTRA INFO */}
        <View style={[styles.formGroup, { marginTop: 24 }]}>
          <View
            style={[
              styles.inputRow,
              { backgroundColor: theme.card, borderBottomColor: theme.border },
            ]}
          >
            <Text style={[styles.label, { color: theme.text }]}>URL</Text>
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="https://example.com"
              placeholderTextColor={theme.subText}
              value={url}
              onChangeText={setUrl}
              autoCapitalize="none"
            />
          </View>

          <View
            style={[
              styles.inputRow,
              {
                backgroundColor: theme.card,
                borderBottomColor: "transparent",
                height: 100,
                alignItems: "flex-start",
                paddingTop: 12,
              },
            ]}
          >
            <Text style={[styles.label, { color: theme.text, marginTop: 0 }]}>
              Notes
            </Text>
            <TextInput
              style={[styles.input, { color: theme.text, height: 80 }]}
              placeholder="Security questions, PINs, etc."
              placeholderTextColor={theme.subText}
              value={notes}
              onChangeText={setNotes}
              multiline
            />
          </View>
        </View>
      </ScrollView>

      {/* 👇 RENDER CUSTOM ALERT */}
      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={closeAlert}
        theme={theme}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerTitle: { fontSize: 17, fontWeight: "600" },
  sectionTitle: { fontSize: 13, marginBottom: 8, fontWeight: "500" },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  formGroup: {
    borderRadius: 12,
    overflow: "hidden",
    marginHorizontal: 16,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 50,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  label: { width: 80, fontSize: 16, fontWeight: "500" },
  input: { flex: 1, fontSize: 16 },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    gap: 8,
  },
  actionText: { fontSize: 16, fontWeight: "600" },
});
