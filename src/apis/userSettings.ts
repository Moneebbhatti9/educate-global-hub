import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiHelpers } from "./client";
import { ApiResponse, User } from "../types/auth";

// API endpoints
const USER_SETTINGS_ENDPOINTS = {
  GET_PROFILE: "/auth/me",
  UPDATE_PROFILE: "/users/profile",
  CHANGE_PASSWORD: "/auth/change-password",
  UPDATE_AVATAR: "/users/avatar",
  DELETE_ACCOUNT: "/users/account",
  UPLOAD_AVATAR: "/upload/avatar",
} as const;

// Types for user settings
export interface UpdateProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateAvatarData {
  avatarUrl: string;
}

export interface AvatarResponse {
  avatarUrl: string;
}

// User Settings API functions
export const userSettingsAPI = {
  // Get current user profile
  getProfile: async (): Promise<ApiResponse<any>> => {
    return apiHelpers.get<ApiResponse<any>>(
      USER_SETTINGS_ENDPOINTS.GET_PROFILE
    );
  },

  // Update user profile
  updateProfile: async (
    data: UpdateProfileData
  ): Promise<ApiResponse<User>> => {
    return apiHelpers.put<ApiResponse<User>>(
      USER_SETTINGS_ENDPOINTS.UPDATE_PROFILE,
      data
    );
  },

  // Change user password
  changePassword: async (
    data: ChangePasswordData
  ): Promise<ApiResponse<{ message: string }>> => {
    return apiHelpers.post<ApiResponse<{ message: string }>>(
      USER_SETTINGS_ENDPOINTS.CHANGE_PASSWORD,
      data
    );
  },

  // Update user avatar
  updateAvatar: async (
    data: UpdateAvatarData
  ): Promise<ApiResponse<AvatarResponse>> => {
    return apiHelpers.put<ApiResponse<AvatarResponse>>(
      USER_SETTINGS_ENDPOINTS.UPDATE_AVATAR,
      data
    );
  },

  // Upload avatar file
  uploadAvatar: async (
    file: File
  ): Promise<ApiResponse<{ publicId: string; url: string }>> => {
    const formData = new FormData();
    formData.append("avatar", file);

    return apiHelpers.post<ApiResponse<{ publicId: string; url: string }>>(
      USER_SETTINGS_ENDPOINTS.UPLOAD_AVATAR,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },

  // Delete user account
  deleteAccount: async (): Promise<ApiResponse<{ message: string }>> => {
    return apiHelpers.delete<ApiResponse<{ message: string }>>(
      USER_SETTINGS_ENDPOINTS.DELETE_ACCOUNT
    );
  },
};

// React Query hooks for user settings
export const useUserSettings = () => {
  const queryClient = useQueryClient();

  // Get current user profile
  const getProfile = useQuery({
    queryKey: ["user-profile"],
    queryFn: userSettingsAPI.getProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Update user profile
  const updateProfile = useMutation({
    mutationFn: userSettingsAPI.updateProfile,
    onSuccess: (data) => {
      // Update the user profile in the cache
      queryClient.setQueryData(["user-profile"], data);
      // Also update the auth context user
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });

  // Change password
  const changePassword = useMutation({
    mutationFn: userSettingsAPI.changePassword,
  });

  // Update avatar
  const updateAvatar = useMutation({
    mutationFn: userSettingsAPI.updateAvatar,
    onSuccess: (data) => {
      // Update the user profile in the cache
      queryClient.setQueryData(["user-profile"], (old: any) => ({
        ...old,
        data: { ...old.data, avatarUrl: data.data?.avatarUrl },
      }));
      // Also update the auth context user
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });

  // Upload avatar
  const uploadAvatar = useMutation({
    mutationFn: userSettingsAPI.uploadAvatar,
  });

  // Delete account
  const deleteAccount = useMutation({
    mutationFn: userSettingsAPI.deleteAccount,
    onSuccess: () => {
      // Clear all queries and redirect to login
      queryClient.clear();
      window.location.href = "/login";
    },
  });

  return {
    getProfile,
    updateProfile,
    changePassword,
    updateAvatar,
    uploadAvatar,
    deleteAccount,
  };
};
