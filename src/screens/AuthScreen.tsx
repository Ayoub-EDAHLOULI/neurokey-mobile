import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import {
  decryptData,
  deriveKey,
  encryptData,
  generateSalt,
  getSecureItem,
  saveSecureItem,
} from "../core/security/encryption";
import { Colors } from "../theme";

export default function AuthScreen() {
  // 1. Theme Hook: Automatically detects if phone is Dark or Light
  const scheme = useColorScheme();
  const theme = Colors[scheme === "dark" ? "dark" : "light"];

  // 2. State
  const [isRegistering, setIsRegistering] = useState(false); // Are we creating a new vault?
  const [isLoading, setIsLoading] = useState(true);
  const [password, setPassword] = useState("");

  // 3. Check if user already exists on app load
  useEffect(() => {
    checkVaultStatus();
  }, []);

  const checkVaultStatus = async () => {
    const salt = await getSecureItem("vault_salt");
    if (!salt) {
      setIsRegistering(true); // No salt found? User is new.
    }
    setIsLoading(false);
  };

  // 4. Handle "Create Vault" (Register)
  const handleRegister = async () => {
    if (password.length < 8) {
      Alert.alert("Security Alert", "Password must be at least 8 characters.");
      return;
    }

    setIsLoading(true);
    // A. Generate a new random Salt
    const salt = generateSalt();
    // B. Create the Key from Password + Salt
    const key = deriveKey(password, salt);
    // C. Create a "Canary" (Test) value to verify login later
    const testValue = encryptData("VALID_PASSWORD", key);

    if (testValue) {
      // D. Save sensitive data to SecureStore
      await saveSecureItem("vault_salt", salt);
      await saveSecureItem("vault_check", testValue);
      Alert.alert("Success", "Your secure vault is ready!");
      setIsRegistering(false); // Now switch to Login mode
    }
    setIsLoading(false);
  };

  // 5. Handle "Unlock Vault" (Login)
  const handleLogin = async () => {
    setIsLoading(true);
    const salt = await getSecureItem("vault_salt");
    const checkValue = await getSecureItem("vault_check");

    if (!salt || !checkValue) {
      Alert.alert("Error", "Vault corrupted. Please reinstall.");
      setIsLoading(false);
      return;
    }

    // A. Re-derive key from input
    const key = deriveKey(password, salt);
    // B. Try to decrypt the test value
    const decrypted = decryptData(checkValue, key);

    if (decrypted === "VALID_PASSWORD") {
      Alert.alert("Access Granted", "Welcome back!");
      // TODO: Navigate to Main App
    } else {
      Alert.alert("Access Denied", "Wrong password.");
    }
    setIsLoading(false);
  };

  // 6. Dynamic Styles
  const styles = getStyles(theme);

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.contentContainer}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>
            {isRegistering ? "Create Vault" : "Welcome Back"}
          </Text>
          <Text style={styles.subtitle}>
            {isRegistering
              ? "Set a Master Password. Do not forget it; we cannot recover it."
              : "Enter your Master Password to unlock your vault."}
          </Text>
        </View>

        {/* Input Section */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Master Password"
            placeholderTextColor={theme.subText}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
          />
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={isRegistering ? handleRegister : handleLogin}
        >
          <Text style={styles.buttonText}>
            {isRegistering ? "Create Secure Vault" : "Unlock"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// Styles Definition
const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    contentContainer: {
      flex: 1,
      justifyContent: "center",
      paddingHorizontal: 24,
    },
    header: {
      marginBottom: 40,
    },
    title: {
      fontSize: 34,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 12,
    },
    subtitle: {
      fontSize: 17,
      color: theme.subText,
      lineHeight: 22,
    },
    inputContainer: {
      marginBottom: 24,
    },
    input: {
      height: 56,
      backgroundColor: theme.inputBg,
      borderRadius: 12,
      paddingHorizontal: 16,
      fontSize: 17,
      color: theme.text,
    },
    button: {
      height: 56,
      backgroundColor: theme.primary,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    buttonText: {
      fontSize: 17,
      fontWeight: "600",
      color: "#FFFFFF",
    },
  });
