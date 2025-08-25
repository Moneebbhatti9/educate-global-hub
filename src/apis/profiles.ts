import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiHelpers } from "./client";
import { secureStorage } from "../helpers/storage";
import { STORAGE_KEYS } from "../types/auth";
import {
  TeacherProfile,
  SchoolProfile,
  TeacherProfileRequest,
  SchoolProfileRequest,
  TeacherSearchParams,
  SchoolSearchParams,
  ApiResponse,
  SearchApiResponse,
} from "../types/profiles";

// API endpoints
const PROFILE_ENDPOINTS = {
  TEACHER_PROFILES: "/teacher-profiles/create",
  SCHOOL_PROFILES: "/school-profiles",
  TEACHER_PROFILE_ME: "/teacher-profiles/me",
  SCHOOL_PROFILE_ME: "/school-profiles/me",
  TEACHER_PROFILE_SEARCH: "/teacher-profiles/search",
  SCHOOL_PROFILE_SEARCH: "/school-profiles/search",
} as const;

// Teacher Profile API functions
export const teacherProfileAPI = {
  // Create/Update Teacher Profile
  createOrUpdate: async (
    data: TeacherProfileRequest
  ): Promise<ApiResponse<TeacherProfile>> => {
    const token = secureStorage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
    return apiHelpers.post<ApiResponse<TeacherProfile>>(
      PROFILE_ENDPOINTS.TEACHER_PROFILES,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  // Get Current Teacher Profile
  getCurrent: async (): Promise<ApiResponse<TeacherProfile>> => {
    const token = secureStorage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
    return apiHelpers.get<ApiResponse<TeacherProfile>>(
      PROFILE_ENDPOINTS.TEACHER_PROFILE_ME,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  // Get Teacher Profile by ID (Public)
  getById: async (teacherId: string): Promise<ApiResponse<TeacherProfile>> => {
    return apiHelpers.get<ApiResponse<TeacherProfile>>(
      `${PROFILE_ENDPOINTS.TEACHER_PROFILES}/${teacherId}`
    );
  },

  // Search Teachers
  search: async (
    params: TeacherSearchParams
  ): Promise<SearchApiResponse<TeacherProfile>> => {
    return apiHelpers.get<SearchApiResponse<TeacherProfile>>(
      PROFILE_ENDPOINTS.TEACHER_PROFILE_SEARCH,
      { params }
    );
  },
};

// School Profile API functions
export const schoolProfileAPI = {
  // Create/Update School Profile
  createOrUpdate: async (
    data: SchoolProfileRequest
  ): Promise<ApiResponse<SchoolProfile>> => {
    const token = secureStorage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
    return apiHelpers.post<ApiResponse<SchoolProfile>>(
      PROFILE_ENDPOINTS.SCHOOL_PROFILES,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  // Get Current School Profile
  getCurrent: async (): Promise<ApiResponse<SchoolProfile>> => {
    const token = secureStorage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
    return apiHelpers.get<ApiResponse<SchoolProfile>>(
      PROFILE_ENDPOINTS.SCHOOL_PROFILE_ME,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  // Get School Profile by ID (Public)
  getById: async (schoolId: string): Promise<ApiResponse<SchoolProfile>> => {
    return apiHelpers.get<ApiResponse<SchoolProfile>>(
      `${PROFILE_ENDPOINTS.SCHOOL_PROFILES}/${schoolId}`
    );
  },

  // Search Schools
  search: async (
    params: SchoolSearchParams
  ): Promise<SearchApiResponse<SchoolProfile>> => {
    return apiHelpers.get<SearchApiResponse<SchoolProfile>>(
      PROFILE_ENDPOINTS.SCHOOL_PROFILE_SEARCH,
      { params }
    );
  },
};

// React Query hooks for teacher profiles
export const useTeacherProfileQueries = () => {
  const queryClient = useQueryClient();

  // Get current teacher profile
  const useCurrentTeacherProfile = () => {
    return useQuery({
      queryKey: ["teacher-profile", "current"],
      queryFn: teacherProfileAPI.getCurrent,
      enabled: false, // Will be enabled when user is authenticated and has teacher role
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  // Get teacher profile by ID (public)
  const useTeacherProfileById = (teacherId: string) => {
    return useQuery({
      queryKey: ["teacher-profile", teacherId],
      queryFn: () => teacherProfileAPI.getById(teacherId),
      enabled: !!teacherId,
      retry: 1,
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  };

  // Search teachers
  const useTeacherSearch = (params: TeacherSearchParams) => {
    return useQuery({
      queryKey: ["teacher-search", params],
      queryFn: () => teacherProfileAPI.search(params),
      enabled: !!params,
      retry: 1,
      staleTime: 2 * 60 * 1000, // 2 minutes
    });
  };

  // Create/Update teacher profile mutation
  const useCreateOrUpdateTeacherProfile = () => {
    return useMutation({
      mutationFn: teacherProfileAPI.createOrUpdate,
      onSuccess: (response) => {
        if (response.success && response.data) {
          // Update current teacher profile in cache
          queryClient.setQueryData(["teacher-profile", "current"], response);
          // Invalidate search results
          queryClient.invalidateQueries({ queryKey: ["teacher-search"] });
        }
      },
      onError: (error) => {
        console.error("Create/Update teacher profile error:", error);
      },
    });
  };

  return {
    useCurrentTeacherProfile,
    useTeacherProfileById,
    useTeacherSearch,
    useCreateOrUpdateTeacherProfile,
  };
};

// React Query hooks for school profiles
export const useSchoolProfileQueries = () => {
  const queryClient = useQueryClient();

  // Get current school profile
  const useCurrentSchoolProfile = () => {
    return useQuery({
      queryKey: ["school-profile", "current"],
      queryFn: schoolProfileAPI.getCurrent,
      enabled: false, // Will be enabled when user is authenticated and has school role
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  // Get school profile by ID (public)
  const useSchoolProfileById = (schoolId: string) => {
    return useQuery({
      queryKey: ["school-profile", schoolId],
      queryFn: () => schoolProfileAPI.getById(schoolId),
      enabled: !!schoolId,
      retry: 1,
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  };

  // Search schools
  const useSchoolSearch = (params: SchoolSearchParams) => {
    return useQuery({
      queryKey: ["school-search", params],
      queryFn: () => schoolProfileAPI.search(params),
      enabled: !!params,
      retry: 1,
      staleTime: 2 * 60 * 1000, // 2 minutes
    });
  };

  // Create/Update school profile mutation
  const useCreateOrUpdateSchoolProfile = () => {
    return useMutation({
      mutationFn: schoolProfileAPI.createOrUpdate,
      onSuccess: (response) => {
        if (response.success && response.data) {
          // Update current school profile in cache
          queryClient.setQueryData(["school-profile", "current"], response);
          // Invalidate search results
          queryClient.invalidateQueries({ queryKey: ["school-search"] });
        }
      },
      onError: (error) => {
        console.error("Create/Update school profile error:", error);
      },
    });
  };

  return {
    useCurrentSchoolProfile,
    useSchoolProfileById,
    useSchoolSearch,
    useCreateOrUpdateSchoolProfile,
  };
};

// Legacy exports for backward compatibility
export const teacherProfileApi = teacherProfileAPI;
export const schoolProfileApi = schoolProfileAPI;
