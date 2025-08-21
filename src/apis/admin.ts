import { apiHelpers } from "./client";
import apiClient from "./client";
import {
  AdminCreateUserRequest,
  AdminUpdateUserRequest,
  AdminUpdateProfileRequest,
  AdminUserResponse,
  AdminUsersResponse,
  AdminUserProfileResponse,
} from "../types/admin";

// Admin API endpoints
export const adminApi = {
  // Get all users with pagination, search, and filters
  getAllUsers: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
  }): Promise<AdminUsersResponse> => {
    return apiHelpers.get<AdminUsersResponse>("/admin/allUsers", { params });
  },

  // Get user by ID
  getUserById: async (id: string): Promise<AdminUserResponse> => {
    return apiHelpers.get<AdminUserResponse>(`/admin/users/${id}`);
  },

  // Create new user
  createUser: async (
    userData: AdminCreateUserRequest
  ): Promise<AdminUserResponse> => {
    return apiHelpers.post<AdminUserResponse>("/admin/add-users", userData);
  },

  // Update user
  updateUser: async (
    id: string,
    userData: AdminUpdateUserRequest
  ): Promise<AdminUserResponse> => {
    return apiHelpers.put<AdminUserResponse>(
      `/admin/update-users/${id}`,
      userData
    );
  },

  // Delete user
  deleteUser: async (id: string): Promise<AdminUserResponse> => {
    return apiHelpers.delete<AdminUserResponse>(`/admin/delete-users/${id}`);
  },

  // Change user status
  changeUserStatus: async (
    id: string,
    status: string
  ): Promise<AdminUserResponse> => {
    return apiHelpers.patch<AdminUserResponse>(`/admin/users/${id}/status`, {
      status,
    });
  },

  // Get user profile details
  getUserProfile: async (id: string): Promise<AdminUserProfileResponse> => {
    return apiHelpers.get<AdminUserProfileResponse>(
      `/admin/users/${id}/profile`
    );
  },

  // Update user profile
  updateUserProfile: async (
    id: string,
    profileData: AdminUpdateProfileRequest
  ): Promise<AdminUserResponse> => {
    return apiHelpers.put<AdminUserResponse>(
      `/admin/users/${id}/profile`,
      profileData
    );
  },

  // Export users to CSV/Excel
  exportUsers: async (params: {
    format?: "csv" | "excel";
    role?: string;
    status?: string;
  }): Promise<Blob> => {
    const response = await apiClient.get("/admin/users/export", {
      params,
      responseType: "blob",
    });
    return response.data;
  },
};
