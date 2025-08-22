import { useState, useCallback } from "react";
import { adminApi } from "../apis/admin";
import {
  AdminCreateUserRequest,
  AdminUpdateUserRequest,
  AdminUpdateProfileRequest,
} from "../types/admin";
import { customToast } from "@/components/ui/sonner";

// Define a proper error type for API errors
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export const useAdmin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to extract error message
  const getErrorMessage = (err: unknown): string => {
    const apiError = err as ApiError;
    return (
      apiError?.response?.data?.message ||
      apiError?.message ||
      "An unexpected error occurred"
    );
  };

  // Get all users
  const getAllUsers = useCallback(
    async (params: {
      page?: number;
      limit?: number;
      search?: string;
      role?: string;
      status?: string;
    }) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await adminApi.getAllUsers(params);
        customToast.success("Success", "Users fetched successfully");
        return response;
      } catch (err: unknown) {
        const errorMessage = getErrorMessage(err);
        setError(errorMessage);
        customToast.error("Error", errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Get user by ID
  const getUserById = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await adminApi.getUserById(id);
      customToast.success("Success", "User fetched successfully");
      return response;
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      customToast.error("Error", errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create user
  const createUser = useCallback(async (userData: AdminCreateUserRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await adminApi.createUser(userData);
      customToast.success("Success", "User created successfully");
      return response;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to create user";
      setError(errorMessage);
      customToast.error("Error", errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update user
  const updateUser = useCallback(
    async (id: string, userData: AdminUpdateUserRequest) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await adminApi.updateUser(id, userData);
        customToast.success("Success", "User updated successfully");
        return response;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || err.message || "Failed to update user";
        setError(errorMessage);
        customToast.error("Error", errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Delete user
  const deleteUser = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await adminApi.deleteUser(id);
      customToast.success("Success", "User deleted successfully");
      return response;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to delete user";
      setError(errorMessage);
      customToast.error("Error", errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Change user status
  const changeUserStatus = useCallback(async (id: string, status: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await adminApi.changeUserStatus(id, status);
      customToast.success("Success", "User status updated successfully");
      return response;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to update user status";
      setError(errorMessage);
      customToast.error("Error", errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get user profile
  const getUserProfile = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await adminApi.getUserProfile(id);
      customToast.success("Success", "User profile fetched successfully");
      return response;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch user profile";
      setError(errorMessage);
      customToast.error("Error", errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update user profile
  const updateUserProfile = useCallback(
    async (id: string, profileData: AdminUpdateProfileRequest) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await adminApi.updateUserProfile(id, profileData);
        customToast.success("Success", "User profile updated successfully");
        return response;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to update user profile";
        setError(errorMessage);
        customToast.error("Error", errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Export users
  const exportUsers = useCallback(
    async (params: {
      format?: "csv" | "excel";
      role?: string;
      status?: string;
    }) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await adminApi.exportUsers(params);
        customToast.success("Success", "Users exported successfully");
        return response;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to export users";
        setError(errorMessage);
        customToast.error("Error", errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    isLoading,
    error,
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    changeUserStatus,
    getUserProfile,
    updateUserProfile,
    exportUsers,
  };
};
