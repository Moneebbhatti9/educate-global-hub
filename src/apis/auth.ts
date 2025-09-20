import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiHelpers } from "./client";
import { secureStorage } from "../helpers/storage";
import { STORAGE_KEYS } from "../types/auth";
import {
  LoginCredentials,
  SignupCredentials,
  OTPVerificationData,
  PasswordResetData,
  PasswordResetConfirmData,
  ChangePasswordData,
  ProfileCompletionData,
  AuthResponse,
  ApiResponse,
  User,
  OTPResponse,
  UserStatusResponse,
} from "../types/auth";

// API endpoints
const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  SIGNUP: "/auth/signup",
  LOGOUT: "/auth/logout",
  REFRESH: "/auth/refresh",
  VERIFY_EMAIL: "/auth/verify-email",
  SEND_OTP: "/auth/send-otp",
  VERIFY_OTP: "/auth/verify-otp",
  PASSWORD_RESET: "/auth/password-reset",
  PASSWORD_RESET_CONFIRM: "/auth/password-reset-confirm",
  CHANGE_PASSWORD: "/auth/change-password",
  CHECK_STATUS: "/auth/check-status",
  PROFILE: "/users/profile",
  COMPLETE_PROFILE: "/users/complete-profile",
  UPLOAD_AVATAR: "/users/avatar",
} as const;

// Authentication API functions
export const authAPI = {
  // Login
  login: async (
    credentials: LoginCredentials
  ): Promise<ApiResponse<AuthResponse>> => {
    return apiHelpers.post<ApiResponse<AuthResponse>>(
      AUTH_ENDPOINTS.LOGIN,
      credentials
    );
  },

  // Signup
  signup: async (
    credentials: SignupCredentials
  ): Promise<ApiResponse<AuthResponse>> => {
    return apiHelpers.post<ApiResponse<AuthResponse>>(
      AUTH_ENDPOINTS.SIGNUP,
      credentials
    );
  },

  // Logout
  logout: async (): Promise<ApiResponse<void>> => {
    return apiHelpers.post<ApiResponse<void>>(AUTH_ENDPOINTS.LOGOUT);
  },

  // Refresh token
  refreshToken: async (
    refreshToken: string
  ): Promise<ApiResponse<AuthResponse>> => {
    return apiHelpers.post<ApiResponse<AuthResponse>>(AUTH_ENDPOINTS.REFRESH, {
      refreshToken,
    });
  },

  // Send OTP
  sendOTP: async (email: string): Promise<ApiResponse<OTPResponse>> => {
    return apiHelpers.post<ApiResponse<OTPResponse>>(AUTH_ENDPOINTS.SEND_OTP, {
      email,
    });
  },

  // Verify OTP
  verifyOTP: async (
    data: OTPVerificationData
  ): Promise<ApiResponse<AuthResponse>> => {
    return apiHelpers.post<ApiResponse<AuthResponse>>(
      AUTH_ENDPOINTS.VERIFY_OTP,
      data
    );
  },

  // Password reset request
  passwordReset: async (
    data: PasswordResetData
  ): Promise<ApiResponse<OTPResponse>> => {
    return apiHelpers.post<ApiResponse<OTPResponse>>(
      AUTH_ENDPOINTS.PASSWORD_RESET,
      data
    );
  },

  // Password reset confirmation
  passwordResetConfirm: async (
    data: PasswordResetConfirmData
  ): Promise<ApiResponse<void>> => {
    return apiHelpers.post<ApiResponse<void>>(
      AUTH_ENDPOINTS.PASSWORD_RESET_CONFIRM,
      data
    );
  },

  // Change password
  changePassword: async (
    data: ChangePasswordData
  ): Promise<ApiResponse<void>> => {
    return apiHelpers.post<ApiResponse<void>>(
      AUTH_ENDPOINTS.CHANGE_PASSWORD,
      data
    );
  },

  // Get user profile
  getProfile: async (): Promise<ApiResponse<User>> => {
    return apiHelpers.get<ApiResponse<User>>(AUTH_ENDPOINTS.PROFILE);
  },

  // Complete profile
  completeProfile: async (
    data: ProfileCompletionData
  ): Promise<ApiResponse<User>> => {
    // Get the current token to ensure it's available
    const token = secureStorage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);

    if (!token) {
      throw new Error("Access token is required for profile completion");
    }

    // Debug: Log token status
    if (import.meta.env.DEV) {
      console.log(
        "🔑 Token for completeProfile API:",
        token ? "available" : "missing"
      );
    }

    return apiHelpers.post<ApiResponse<User>>(
      AUTH_ENDPOINTS.COMPLETE_PROFILE,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  // Upload avatar
  uploadAvatar: async (
    file: File
  ): Promise<ApiResponse<{ avatarUrl: string }>> => {
    const formData = new FormData();
    formData.append("avatar", file);
    return apiHelpers.upload<ApiResponse<{ avatarUrl: string }>>(
      AUTH_ENDPOINTS.UPLOAD_AVATAR,
      formData
    );
  },

  // Check user status
  checkUserStatus: async (): Promise<ApiResponse<UserStatusResponse>> => {
    return apiHelpers.get<ApiResponse<UserStatusResponse>>(
      AUTH_ENDPOINTS.CHECK_STATUS
    );
  },
};

// React Query hooks for authentication
export const useAuthQueries = () => {
  const queryClient = useQueryClient();

  // Get user profile
  const useProfile = () => {
    return useQuery({
      queryKey: ["profile"],
      queryFn: authAPI.getProfile,
      enabled: false, // Will be enabled when user is authenticated
      retry: 1,
      staleTime: 60 * 60 * 1000, // 1 hour
    });
  };

  // Login mutation
  const useLogin = () => {
    return useMutation({
      mutationFn: authAPI.login,
      onSuccess: (response) => {
        if (response.success && response.data) {
          // Invalidate and refetch profile
          queryClient.invalidateQueries({ queryKey: ["profile"] });
        }
      },
      onError: (error) => {
        console.error("Login error:", error);
      },
    });
  };

  // Signup mutation
  const useSignup = () => {
    return useMutation({
      mutationFn: authAPI.signup,
      onSuccess: (response) => {
        if (response.success && response.data) {
          // Invalidate and refetch profile
          queryClient.invalidateQueries({ queryKey: ["profile"] });
        }
      },
      onError: (error) => {
        console.error("Signup error:", error);
      },
    });
  };

  // Logout mutation
  const useLogout = () => {
    return useMutation({
      mutationFn: authAPI.logout,
      onSuccess: () => {
        // Clear all queries and cache
        queryClient.clear();
      },
      onError: (error) => {
        console.error("Logout error:", error);
        // Clear cache even if logout fails
        queryClient.clear();
      },
    });
  };

  // Send OTP mutation
  const useSendOTP = () => {
    return useMutation({
      mutationFn: (email: string) => authAPI.sendOTP(email),
      onError: (error) => {
        console.error("Send OTP error:", error);
      },
    });
  };

  // Verify OTP mutation
  const useVerifyOTP = () => {
    return useMutation({
      mutationFn: authAPI.verifyOTP,
      onSuccess: (response) => {
        if (response.success && response.data) {
          // Invalidate and refetch profile
          queryClient.invalidateQueries({ queryKey: ["profile"] });
        }
      },
      onError: (error) => {
        console.error("Verify OTP error:", error);
      },
    });
  };

  // Password reset mutation
  const usePasswordReset = () => {
    return useMutation({
      mutationFn: authAPI.passwordReset,
      onError: (error) => {
        console.error("Password reset error:", error);
      },
    });
  };

  // Password reset confirmation mutation
  const usePasswordResetConfirm = () => {
    return useMutation({
      mutationFn: authAPI.passwordResetConfirm,
      onError: (error) => {
        console.error("Password reset confirmation error:", error);
      },
    });
  };

  // Change password mutation
  const useChangePassword = () => {
    return useMutation({
      mutationFn: authAPI.changePassword,
      onError: (error) => {
        console.error("Change password error:", error);
      },
    });
  };

  // Complete profile mutation
  const useCompleteProfile = () => {
    return useMutation({
      mutationFn: authAPI.completeProfile,
      onSuccess: (response) => {
        if (response.success && response.data) {
          // Update profile in cache
          queryClient.setQueryData(["profile"], response);
        }
      },
      onError: (error) => {
        console.error("Complete profile error:", error);
      },
    });
  };

  // Upload avatar mutation
  const useUploadAvatar = () => {
    return useMutation({
      mutationFn: authAPI.uploadAvatar,
      onSuccess: (response) => {
        if (response.success && response.data) {
          // Update profile in cache
          queryClient.invalidateQueries({ queryKey: ["profile"] });
        }
      },
      onError: (error) => {
        console.error("Upload avatar error:", error);
      },
    });
  };

  return {
    useProfile,
    useLogin,
    useSignup,
    useLogout,
    useSendOTP,
    useVerifyOTP,
    usePasswordReset,
    usePasswordResetConfirm,
    useChangePassword,
    useCompleteProfile,
    useUploadAvatar,
  };
};
