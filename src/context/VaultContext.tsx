import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export type VaultItemType = "password" | "card" | "note";

export interface VaultItem {
  id: string;
  type: VaultItemType;
  name: string;
  email?: string;
  password?: string;
  url?: string;
  cardNumber?: string;
  cardHolder?: string;
  expiry?: string;
  cvv?: string;
  cardType?: "visa" | "mastercard" | "amex";
  notes?: string;
  icon?: string;
  color?: string;
  created_at: number;
  updated_at: number;
  isDeleted?: boolean;
}

interface VaultContextType {
  items: VaultItem[];
  isLoading: boolean;
  addVaultItem: (
    item: Omit<VaultItem, "id" | "created_at" | "updated_at">,
  ) => void;
  deleteVaultItem: (id: string) => void;
  updateVaultItem: (id: string, updates: Partial<VaultItem>) => void;
  setItems: (items: VaultItem[]) => Promise<void>;
}

const VaultContext = createContext<VaultContextType>({} as VaultContextType);
const STORAGE_KEY = "@neurokey_vault_v2";

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

  const addVaultItem = (
    newItem: Omit<VaultItem, "id" | "created_at" | "updated_at">,
  ) => {
    const now = Date.now();
    const entry = {
      id: uuidv4(),
      created_at: now,
      updated_at: now,
      ...newItem,
    };
    saveVault([entry as VaultItem, ...items]);
  };

  const deleteVaultItem = (id: string) => {
    // Instead of filtering it out, we turn it into a Tombstone!
    saveVault(
      items.map((i) =>
        i.id === id ? { ...i, isDeleted: true, updated_at: Date.now() } : i,
      ),
    );
  };

  const updateVaultItem = (id: string, updates: Partial<VaultItem>) => {
    // Inject the new updated_at timestamp on every edit
    saveVault(
      items.map((i) =>
        i.id === id ? { ...i, ...updates, updated_at: Date.now() } : i,
      ),
    );
  };

  return (
    <VaultContext.Provider
      value={{
        items,
        isLoading,
        addVaultItem,
        deleteVaultItem,
        updateVaultItem,
        setItems: saveVault,
      }}
    >
      {children}
    </VaultContext.Provider>
  );
};

export const useVault = () => useContext(VaultContext);
