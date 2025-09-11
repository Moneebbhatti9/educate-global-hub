import secureLocalStorage from "react-secure-storage";
import { STORAGE_KEYS } from "../types/auth";

// Debug utility to check storage state
export const debugStorage = () => {
  Object.values(STORAGE_KEYS).forEach((key) => {
    try {
      const secureValue = secureLocalStorage.getItem(key);
      const localValue = localStorage.getItem(key);

      console.log(
        `  Local Storage (parsed):`,
        localValue ? JSON.parse(localValue) : null
      );
    } catch (error) {}
  });
};

// Clear any corrupted data from old storage format
const clearCorruptedData = () => {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      const oldValue = localStorage.getItem(key);
      if (oldValue) {
        try {
          // Try to parse the old value
          JSON.parse(oldValue);
        } catch {
          // If parsing fails, remove the corrupted data

          localStorage.removeItem(key);
        }
      }
    });
  } catch (error) {}
};

// Test secure storage functionality
const testSecureStorage = () => {
  try {
    const testKey = "test_secure_storage";
    const testValue = { test: "data", timestamp: Date.now() };

    // Test setting and getting data
    secureLocalStorage.setItem(testKey, testValue);
    const retrievedValue = secureLocalStorage.getItem(testKey);

    if (JSON.stringify(retrievedValue) === JSON.stringify(testValue)) {
    } else {
      console.warn(
        "⚠️ Secure storage test failed, falling back to localStorage"
      );
    }

    // Clean up test data
    secureLocalStorage.removeItem(testKey);
  } catch (error) {}
};

// Clear corrupted data on module load
clearCorruptedData();

// Test secure storage on module load
testSecureStorage();

export const secureStorage = {
  // Set item with encryption
  setItem: (key: string, value: unknown): void => {
    try {
      // react-secure-storage expects string, number, boolean, or object
      if (value === null || value === undefined) {
        secureLocalStorage.removeItem(key);
      } else if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean" ||
        typeof value === "object"
      ) {
        secureLocalStorage.setItem(key, value);
      } else {
        // Convert to string for other types
        secureLocalStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      // Fallback to regular localStorage if secure storage fails
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (fallbackError) {}
    }
  },

  // Get item with decryption
  getItem: <T = unknown>(key: string): T | null => {
    try {
      const value = secureLocalStorage.getItem(key);
      return value as T;
    } catch (error) {
      // Fallback to regular localStorage
      try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
      } catch (fallbackError) {
        return null;
      }
    }
  },

  // Remove item
  removeItem: (key: string): void => {
    try {
      secureLocalStorage.removeItem(key);
    } catch (error) {
      // Fallback to regular localStorage
      try {
        localStorage.removeItem(key);
      } catch (fallbackError) {}
    }
  },

  // Clear all auth-related items
  clearAuth: (): void => {
    Object.values(STORAGE_KEYS).forEach((key) => {
      secureStorage.removeItem(key);
    });
  },

  // Check if remember me is enabled
  isRememberMeEnabled: (): boolean => {
    return secureStorage.getItem<boolean>(STORAGE_KEYS.REMEMBER_ME) || false;
  },

  // Set remember me preference
  setRememberMe: (enabled: boolean): void => {
    secureStorage.setItem(STORAGE_KEYS.REMEMBER_ME, enabled);
  },
};

// Session storage for temporary data (cleared when browser closes)
export const sessionStorage = {
  setItem: (key: string, value: unknown): void => {
    try {
      const stringValue =
        typeof value === "string" ? value : JSON.stringify(value);
      window.sessionStorage.setItem(key, stringValue);
    } catch (error) {}
  },

  getItem: <T = unknown>(key: string): T | null => {
    try {
      const value = window.sessionStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      return null;
    }
  },

  removeItem: (key: string): void => {
    try {
      window.sessionStorage.removeItem(key);
    } catch (error) {}
  },

  clear: (): void => {
    try {
      window.sessionStorage.clear();
    } catch (error) {}
  },
};
