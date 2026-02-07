import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface CreditCardProps {
  holder: string;
  number: string;
  expiry: string;
  type: "visa" | "mastercard" | "amex";
}

export default function CreditCard({
  holder,
  number,
  expiry,
  type,
}: CreditCardProps) {
  // Format: 1234 5678 **** 9012
  const formatNumber = (num: string) => {
    return num.replace(/(\d{4})/g, "$1 ").trim();
  };

  // Determine Gradient Colors
  const getColors = (): readonly [string, string] => {
    switch (type) {
      case "visa":
        return ["#1A2980", "#26D0CE"]; // Blue Cyan
      case "mastercard":
        return ["#FF512F", "#DD2476"]; // Orange Red
      case "amex":
        return ["#232526", "#414345"]; // Black Grey
      default:
        return ["#4DA0B0", "#D39D38"]; // Teal Gold
    }
  };

  return (
    <LinearGradient
      colors={getColors()}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <View style={styles.topRow}>
        <Ionicons name="wifi" size={24} color="rgba(255,255,255,0.6)" />
        <Text style={styles.cardType}>{type.toUpperCase()}</Text>
      </View>

      <Text style={styles.number}>{formatNumber(number)}</Text>

      <View style={styles.bottomRow}>
        <View>
          <Text style={styles.label}>CARD HOLDER</Text>
          <Text style={styles.value}>{holder.toUpperCase()}</Text>
        </View>
        <View>
          <Text style={styles.label}>EXPIRES</Text>
          <Text style={styles.value}>{expiry}</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 200,
    borderRadius: 20,
    padding: 24,
    justifyContent: "space-between",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardType: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 18,
    fontStyle: "italic",
  },
  number: {
    color: "#FFF",
    fontSize: 22,
    letterSpacing: 2,
    fontWeight: "600",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowRadius: 5,
  },
  bottomRow: { flexDirection: "row", justifyContent: "space-between" },
  label: { color: "rgba(255,255,255,0.7)", fontSize: 10, marginBottom: 4 },
  value: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
});
