import { secureStorage } from "../helpers/storage";
import { STORAGE_KEYS } from "../types/auth";
import { jwtHelpers } from "../helpers/jwt";

export const authDebug = {
  // Check current authentication state
  checkAuthState: () => {
    console.log("🔍 Checking Authentication State...");

    const token = secureStorage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
    const refreshToken = secureStorage.getItem<string>(
      STORAGE_KEYS.REFRESH_TOKEN
    );
    const user = secureStorage.getItem<any>(STORAGE_KEYS.USER_DATA);

    console.log("📋 Current Auth State:");
    console.log("  Token exists:", !!token);
    console.log("  Refresh token exists:", !!refreshToken);
    console.log("  User exists:", !!user);

    if (token) {
      console.log(
        "  Token structure valid:",
        jwtHelpers.isValidTokenStructure(token)
      );
      console.log("  Token expired:", jwtHelpers.isTokenExpired(token));

      try {
        const decoded = jwtHelpers.parseToken(token);
        console.log("  Token payload:", decoded);
      } catch (error) {
        console.log("  Token decode error:", error);
      }
    }

    if (user) {
      console.log("  User data:", user);
    }

    return {
      hasToken: !!token,
      hasRefreshToken: !!refreshToken,
      hasUser: !!user,
      tokenValid: token ? jwtHelpers.isValidTokenStructure(token) : false,
      tokenExpired: token ? jwtHelpers.isTokenExpired(token) : false,
    };
  },

  // Check if user is ready for profile completion
  checkProfileCompletionReadiness: () => {
    const state = authDebug.checkAuthState();

    console.log("🎯 Profile Completion Readiness:");
    console.log(
      "  Ready for profile completion:",
      state.hasToken && state.hasUser && !state.tokenExpired
    );

    if (!state.hasToken) {
      console.log("  ❌ Missing access token");
    }
    if (!state.hasUser) {
      console.log("  ❌ Missing user data");
    }
    if (state.tokenExpired) {
      console.log("  ❌ Token is expired");
    }

    return state.hasToken && state.hasUser && !state.tokenExpired;
  },

  // Clear all auth data (for testing)
  clearAuth: () => {
    console.log("🧹 Clearing all authentication data...");
    secureStorage.clearAuth();
    console.log("  ✅ Auth data cleared");
  },

  // Simulate token refresh
  simulateTokenRefresh: async () => {
    console.log("🔄 Simulating token refresh...");
    const refreshToken = secureStorage.getItem<string>(
      STORAGE_KEYS.REFRESH_TOKEN
    );

    if (!refreshToken) {
      console.log("  ❌ No refresh token available");
      return false;
    }

    try {
      // This would call your actual refresh API
      console.log("  📡 Calling refresh token API...");
      // const response = await authAPI.refreshToken(refreshToken);
      console.log("  ⚠️  This is a simulation - implement actual API call");
      return true;
    } catch (error) {
      console.log("  ❌ Token refresh failed:", error);
      return false;
    }
  },

  // Test complete profile API call
  testCompleteProfileCall: async () => {
    console.log("🧪 Testing complete profile API call...");

    const token = secureStorage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
    const user = secureStorage.getItem<any>(STORAGE_KEYS.USER_DATA);

    console.log("📋 Test Data:");
    console.log("  Token available:", !!token);
    console.log("  User available:", !!user);

    if (!token) {
      console.log("  ❌ No access token available for test");
      return false;
    }

    if (!user) {
      console.log("  ❌ No user data available for test");
      return false;
    }

    console.log("  ✅ Ready to test complete profile API call");
    console.log("  📡 This would make a real API call with the token");

    return true;
  },
};

// Add to window for debugging in browser console
if (typeof window !== "undefined" && import.meta.env.DEV) {
  (window as any).authDebug = authDebug;
}
