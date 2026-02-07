import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

// 👇 UPGRADE: Support multiple types
export type VaultItemType = "password" | "card" | "note";

export interface VaultItem {
  id: string;
  type: VaultItemType; // 👈 New field
  // Common fields
  name: string; // Renamed from serviceName to be generic
  // Password fields
  email?: string;
  password?: string;
  url?: string;
  // Card fields (New)
  cardNumber?: string;
  cardHolder?: string;
  expiry?: string;
  cvv?: string;
  cardType?: "visa" | "mastercard" | "amex";
  // Common
  notes?: string;
  icon?: string;
  color?: string;
  created_at: number;
}

interface VaultContextType {
  items: VaultItem[]; // Renamed from passwords
  isLoading: boolean;
  addVaultItem: (item: Omit<VaultItem, "id" | "created_at">) => void;
  deleteVaultItem: (id: string) => void;
  updateVaultItem: (id: string, updates: Partial<VaultItem>) => void;
}

const VaultContext = createContext<VaultContextType>({} as VaultContextType);
const STORAGE_KEY = "@neurokey_vault_v2"; // Changed key to v2 to avoid conflicts

export const VaultProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<VaultItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        if (jsonValue != null) setItems(JSON.parse(jsonValue));
      } catch (e) {
        console.error("Failed to load", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const saveVault = async (newData: VaultItem[]) => {
    setItems(newData);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  };

  const addVaultItem = (newItem: Omit<VaultItem, "id" | "created_at">) => {
    const entry = { id: uuidv4(), created_at: Date.now(), ...newItem };
    saveVault([entry as VaultItem, ...items]);
  };

  const deleteVaultItem = (id: string) => {
    saveVault(items.filter((i) => i.id !== id));
  };

  const updateVaultItem = (id: string, updates: Partial<VaultItem>) => {
    saveVault(items.map((i) => (i.id === id ? { ...i, ...updates } : i)));
  };

  return (
    <VaultContext.Provider
      value={{
        items,
        isLoading,
        addVaultItem,
        deleteVaultItem,
        updateVaultItem,
      }}
    >
      {children}
    </VaultContext.Provider>
  );
};

export const useVault = () => useContext(VaultContext);
