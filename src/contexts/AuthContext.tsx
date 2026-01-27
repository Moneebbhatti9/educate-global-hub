import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  secureStorage,
  sessionStorage,
  debugStorage,
} from "../helpers/storage";
import { jwtHelpers } from "../helpers/jwt";
import { authAPI } from "../apis/auth";
import { errorHandler } from "../utils/errorHandler";
import {
  AuthState,
  User,
  LoginCredentials,
  SignupCredentials,
  OTPVerificationData,
  PasswordResetData,
  PasswordResetConfirmData,
  ChangePasswordData,
  ProfileCompletionData,
  UserStatusResponse,
  STORAGE_KEYS,
} from "../types/auth";

// Auth action types
type AuthAction =
  | { type: "INITIALIZE"; payload: { user: User | null; token: string | null } }
  | { type: "LOGIN_SUCCESS"; payload: { user: User; token: string } }
  | { type: "LOGOUT" }
  | { type: "UPDATE_USER"; payload: User }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_INITIALIZED"; payload: boolean };

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "INITIALIZE":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: !!action.payload.user && !!action.payload.token,
        isInitialized: true,
      };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload, // Maintain authentication state
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    case "SET_INITIALIZED":
      return {
        ...state,
        isInitialized: action.payload,
      };
    default:
      return state;
  }
};

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
};

// Auth context interface
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: (skipNavigation?: boolean) => Promise<void>;
  verifyOTP: (data: OTPVerificationData) => Promise<void>;
  sendOTP: (
    email: string,
    type?: "verification" | "reset"
  ) => Promise<void>;
  passwordReset: (data: PasswordResetData) => Promise<void>;
  passwordResetConfirm: (data: PasswordResetConfirmData) => Promise<void>;
  changePassword: (data: ChangePasswordData) => Promise<void>;
  completeProfile: (data: ProfileCompletionData) => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
  refreshToken: () => Promise<void>;
  updateUser: (user: User) => void;
  checkUserStatus: () => Promise<{
    redirectTo: string;
    requiresStatusApproval?: boolean;
  }>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const navigate = useNavigate();

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Debug storage state on initialization
        debugStorage();

        const token = secureStorage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
        const user = secureStorage.getItem<User>(STORAGE_KEYS.USER_DATA);

        if (
          token &&
          user &&
          jwtHelpers.isValidTokenStructure(token) &&
          !jwtHelpers.isTokenExpired(token)
        ) {
          dispatch({
            type: "INITIALIZE",
            payload: { user, token },
          });
          if (import.meta.env.DEV) {
            console.log("🔐 Auth initialized with existing user:", {
              email: user.email,
              role: user.role,
              isProfileComplete: user.isProfileComplete,
              status: user.status,
            });
          }
        } else {
          // Clear any corrupted or invalid data
          secureStorage.clearAuth();
          dispatch({
            type: "INITIALIZE",
            payload: { user: null, token: null },
          });
          if (import.meta.env.DEV) {
            console.log(
              "🔐 Auth initialized with no user (cleared invalid data)"
            );
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        // Clear all auth data on error
        secureStorage.clearAuth();
        dispatch({
          type: "INITIALIZE",
          payload: { user: null, token: null },
        });
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });

        const response = await authAPI.login(credentials);
        if (response.success && response.data) {
          const { user, accessToken, refreshToken } = response.data;

          secureStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, accessToken);
          secureStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
          secureStorage.setItem(STORAGE_KEYS.USER_DATA, user);

          if (credentials.rememberMe) {
            secureStorage.setRememberMe(true);
          }

          dispatch({
            type: "LOGIN_SUCCESS",
            payload: { user, token: accessToken },
          });

          if (!user.isEmailVerified) {
            navigate("/otp-verification", {
              state: {
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
              },
            });
          } else if (!user.isProfileComplete) {
            navigate("/profile-completion", {
              state: {
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
              },
            });
          } else {
            // Profile is complete, navigate to dashboard
            navigate(`/dashboard/${user.role}`);
          }
        } else {
          throw new Error(response.message || "Login failed");
        }
      } catch (error) {
        errorHandler.logError(error, "Login Error");
        throw error;
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [navigate]
  );

  // Logout function
  const logout = useCallback(
    async (skipNavigation: boolean = false) => {
      try {
        await authAPI.logout();
      } catch (error) {
        console.error("Logout API error:", error);
      } finally {
        secureStorage.clearAuth();
        dispatch({ type: "LOGOUT" });
        if (!skipNavigation) {
          navigate("/login");
        }
      }
    },
    [navigate]
  );

  // Signup function
  const signup = useCallback(async (credentials: SignupCredentials) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const response = await authAPI.signup(credentials);
      if (response.success) {
        // Signup successful - no tokens generated yet
        // User will be redirected to OTP verification
        if (import.meta.env.DEV) {
          
        }
      } else {
        throw new Error(response.message || "Signup failed");
      }
    } catch (error) {
      errorHandler.logError(error, "Signup Error");
      throw error;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  // Verify OTP function
  const verifyOTP = useCallback(async (data: OTPVerificationData) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const response = await authAPI.verifyOTP(data);

      // Debug: Log the full response
      if (import.meta.env.DEV) {
        
      }

      if (response.success) {
        // If response.data exists, use it (tokens generated after email verification)
        if (response.data) {
          const { user, accessToken, refreshToken } = response.data;

          // Debug: Log the tokens received from OTP verification
          if (import.meta.env.DEV) {
            
            console.log(
              "  Access Token:",
              accessToken ? "received" : "missing"
            );
            console.log(
              "  Refresh Token:",
              refreshToken ? "received" : "missing"
            );
            
            

          }
          
          secureStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, accessToken);
          secureStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
          secureStorage.setItem(STORAGE_KEYS.USER_DATA, user);

          // Debug: Verify tokens were stored correctly
          if (import.meta.env.DEV) {
            const storedToken = secureStorage.getItem<string>(
              STORAGE_KEYS.AUTH_TOKEN
            );
            const storedRefreshToken = secureStorage.getItem<string>(
              STORAGE_KEYS.REFRESH_TOKEN
            );
            
            
            console.log(
              "  Refresh Token stored:",
              storedRefreshToken ? "yes" : "no"
            );
          }

          dispatch({
            type: "LOGIN_SUCCESS",
            payload: { user, token: accessToken },
          });

          // Debug: Log the dispatch action
          if (import.meta.env.DEV) {
            console.log("🚀 OTP Verification - Dispatch LOGIN_SUCCESS:", {
              user: {
                email: user.email,
                role: user.role,
                isProfileComplete: user.isProfileComplete,
                status: user.status,
              },
              hasToken: !!accessToken,
            });
          }
        } else {
          // If no data in response, just return success (user will complete profile first)
          // This is the case where OTP is verified but user needs to complete profile
          if (import.meta.env.DEV) {
            console.log(
              "✅ OTP verified successfully, proceeding to profile completion"
            );
          }
        }
      } else {
        throw new Error(response.message || "OTP verification failed");
      }
    } catch (error) {
      errorHandler.logError(error, "OTP Verification Error");
      throw error;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  // Send OTP function
  const sendOTP = useCallback(
    async (email: string, type: "verification" | "reset" = "verification") => {
      try {
        const response = await authAPI.sendOTP(email, type);
        if (!response.success) {
          throw new Error(response.message || "Failed to send OTP");
        }
      } catch (error) {
        errorHandler.logError(error, "Send OTP Error");
        throw error;
      }
    },
    []
  );

  // Password reset function
  const passwordReset = useCallback(async (data: PasswordResetData) => {
    try {
      const response = await authAPI.passwordReset(data);
      if (!response.success) {
        throw new Error(
          response.message || "Failed to send password reset email"
        );
      }
    } catch (error) {
      errorHandler.logError(error, "Password Reset Error");
      throw error;
    }
  }, []);

  // Password reset confirmation function
  const passwordResetConfirm = useCallback(
    async (data: PasswordResetConfirmData) => {
      try {
        const response = await authAPI.passwordResetConfirm(data);
        if (!response.success) {
          throw new Error(response.message || "Failed to reset password");
        }
      } catch (error) {
        errorHandler.logError(error, "Password Reset Confirmation Error");
        throw error;
      }
    },
    []
  );

  // Change password function
  const changePassword = useCallback(async (data: ChangePasswordData) => {
    try {
      const response = await authAPI.changePassword(data);
      if (!response.success) {
        throw new Error(response.message || "Failed to change password");
      }
    } catch (error) {
      errorHandler.logError(error, "Change Password Error");
      throw error;
    }
  }, []);

  // Complete profile function
  const completeProfile = useCallback(
    async (data: ProfileCompletionData) => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });

        // Check if we have a valid token before making the API call
        const token = secureStorage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
        const user = secureStorage.getItem<User>(STORAGE_KEYS.USER_DATA);

        if (!token || !user) {
          throw new Error("Authentication required. Please sign in again.");
        }

        // Check if token is valid and not expired
        if (
          !jwtHelpers.isValidTokenStructure(token) ||
          jwtHelpers.isTokenExpired(token)
        ) {
          // Try to refresh the token manually
          try {
            const refreshTokenValue = secureStorage.getItem<string>(
              STORAGE_KEYS.REFRESH_TOKEN
            );
            if (!refreshTokenValue) {
              throw new Error("No refresh token available");
            }

            const refreshResponse = await authAPI.refreshToken(
              refreshTokenValue
            );
            if (refreshResponse.success && refreshResponse.data) {
              const { accessToken, refreshToken: newRefreshToken } =
                refreshResponse.data;
              secureStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, accessToken);
              secureStorage.setItem(
                STORAGE_KEYS.REFRESH_TOKEN,
                newRefreshToken
              );

              // Update the auth state with new token
              dispatch({
                type: "LOGIN_SUCCESS",
                payload: { user, token: accessToken },
              });
            } else {
              throw new Error("Token refresh failed");
            }
          } catch (refreshError) {
            // If refresh fails, redirect to login
            secureStorage.clearAuth();
            dispatch({ type: "LOGOUT" });
            navigate("/login");
            throw new Error("Session expired. Please sign in again.");
          }
        }

        // Debug: Log the current token before making the API call
        if (import.meta.env.DEV) {
          const currentToken = secureStorage.getItem<string>(
            STORAGE_KEYS.AUTH_TOKEN
          );
          console.log(
            "🔑 Current token before completeProfile API call:",
            currentToken ? "exists" : "missing"
          );
          if (currentToken) {
            console.log(
              "  Token valid:",
              jwtHelpers.isValidTokenStructure(currentToken)
            );
            console.log(
              "  Token expired:",
              jwtHelpers.isTokenExpired(currentToken)
            );
          }
        }

        const response = await authAPI.completeProfile(data);
        if (response.success && response.data) {
          const updatedUser = response.data;

          if (import.meta.env.DEV) {
            console.log("🔍 completeProfile API response:", {
              response,
              updatedUser,
              isProfileComplete: updatedUser.isProfileComplete,
              role: updatedUser.role,
              status: updatedUser.status,
            });
          }

          secureStorage.setItem(STORAGE_KEYS.USER_DATA, updatedUser);
          dispatch({
            type: "UPDATE_USER",
            payload: updatedUser,
          });

          if (import.meta.env.DEV) {
            console.log("✅ User state updated in AuthContext:", {
              storageUser: secureStorage.getItem(STORAGE_KEYS.USER_DATA),
              contextState: state,
            });
          }

          // Profile completion successful - user will be redirected based on role
          // School users go to school approval page, others go to signin
          // No automatic navigation here, handled by ProfileCompletionPage
        } else {
          throw new Error(response.message || "Failed to complete profile");
        }
      } catch (error) {
        errorHandler.logError(error, "Complete Profile Error");
        throw error;
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [navigate]
  );

  // Upload avatar function
  const uploadAvatar = useCallback(
    async (file: File) => {
      try {
        const response = await authAPI.uploadAvatar(file);
        if (response.success && response.data && state.user) {
          const updatedUser = {
            ...state.user,
            avatar: response.data.avatarUrl,
          };
          secureStorage.setItem(STORAGE_KEYS.USER_DATA, updatedUser);
          dispatch({
            type: "UPDATE_USER",
            payload: updatedUser,
          });
        } else {
          throw new Error(response.message || "Failed to upload avatar");
        }
      } catch (error) {
        errorHandler.logError(error, "Upload Avatar Error");
        throw error;
      }
    },
    [state.user]
  );

  // Refresh token function
  const refreshToken = useCallback(async () => {
    try {
      const refreshTokenValue = secureStorage.getItem<string>(
        STORAGE_KEYS.REFRESH_TOKEN
      );
      if (!refreshTokenValue) {
        throw new Error("No refresh token available");
      }

      const response = await authAPI.refreshToken(refreshTokenValue);
      if (response.success && response.data) {
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        secureStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, accessToken);
        secureStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
      } else {
        throw new Error(response.message || "Token refresh failed");
      }
    } catch (error) {
      errorHandler.logError(error, "Token Refresh Error");
      secureStorage.clearAuth();
      dispatch({ type: "LOGOUT" });
      navigate("/login");
    }
  }, [navigate]);

  const updateUser = useCallback((user: User) => {
    secureStorage.setItem(STORAGE_KEYS.USER_DATA, user);
    dispatch({
      type: "UPDATE_USER",
      payload: user,
    });
  }, []);

  // Check user status function
  const checkUserStatus = useCallback(async () => {
    try {
      const response = await authAPI.checkUserStatus();
      if (response.success && response.data) {
        return {
          redirectTo: response.data.redirectTo,
          requiresStatusApproval: response.data.requiresStatusApproval,
        };
      } else {
        throw new Error(response.message || "Failed to check user status");
      }
    } catch (error) {
      errorHandler.logError(error, "User Status Check Error");
      throw error;
    }
  }, []);

  const contextValue: AuthContextType = {
    ...state,
    login,
    signup,
    logout,
    verifyOTP,
    sendOTP,
    passwordReset,
    passwordResetConfirm,
    changePassword,
    completeProfile,
    uploadAvatar,
    refreshToken,
    updateUser,
    checkUserStatus,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
