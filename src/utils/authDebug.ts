import { secureStorage } from "../helpers/storage";
import { STORAGE_KEYS } from "../types/auth";
import { jwtHelpers } from "../helpers/jwt";

export const authDebug = {
  // Check current authentication state
  checkAuthState: () => {
    

    const token = secureStorage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
    const refreshToken = secureStorage.getItem<string>(
      STORAGE_KEYS.REFRESH_TOKEN
    );
    const user = secureStorage.getItem<any>(STORAGE_KEYS.USER_DATA);

    
    
    
    

    if (token) {
      console.log(
        "  Token structure valid:",
        jwtHelpers.isValidTokenStructure(token)
      );
      

      try {
        const decoded = jwtHelpers.parseToken(token);
        
      } catch (error) {
        
      }
    }

    if (user) {
      
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

    
    console.log(
      "  Ready for profile completion:",
      state.hasToken && state.hasUser && !state.tokenExpired
    );

    if (!state.hasToken) {
      
    }
    if (!state.hasUser) {
      
    }
    if (state.tokenExpired) {
      
    }

    return state.hasToken && state.hasUser && !state.tokenExpired;
  },

  // Clear all auth data (for testing)
  clearAuth: () => {
    
    secureStorage.clearAuth();
    
  },

  // Simulate token refresh
  simulateTokenRefresh: async () => {
    
    const refreshToken = secureStorage.getItem<string>(
      STORAGE_KEYS.REFRESH_TOKEN
    );

    if (!refreshToken) {
      
      return false;
    }

    try {
      // This would call your actual refresh API
      
      // const response = await authAPI.refreshToken(refreshToken);
      
      return true;
    } catch (error) {
      
      return false;
    }
  },

  // Test complete profile API call
  testCompleteProfileCall: async () => {
    

    const token = secureStorage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
    const user = secureStorage.getItem<any>(STORAGE_KEYS.USER_DATA);

    
    
    

    if (!token) {
      
      return false;
    }

    if (!user) {
      
      return false;
    }

    
    

    return true;
  },
};

// Add to window for debugging in browser console
if (typeof window !== "undefined" && import.meta.env.DEV) {
  (window as any).authDebug = authDebug;
}
