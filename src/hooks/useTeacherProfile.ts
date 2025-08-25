import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { teacherProfileAPI } from "@/apis/profiles";
import type { TeacherProfileRequest } from "@/types/profiles";

// Query keys for teacher profiles
export const teacherProfileQueryKeys = {
  all: ["teacher-profile"] as const,
  current: () => [...teacherProfileQueryKeys.all, "current"] as const,
  byId: (teacherId: string) => [...teacherProfileQueryKeys.all, teacherId] as const,
  search: (params: any) => [...teacherProfileQueryKeys.all, "search", params] as const,
};

// Hook to get teacher profile by ID
export const useTeacherProfileById = (teacherId: string) => {
  return useQuery({
    queryKey: teacherProfileQueryKeys.byId(teacherId),
    queryFn: () => teacherProfileAPI.getById(teacherId),
    enabled: !!teacherId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  });
};

// Hook to get current teacher profile
export const useCurrentTeacherProfile = () => {
  return useQuery({
    queryKey: teacherProfileQueryKeys.current(),
    queryFn: teacherProfileAPI.getCurrent,
    enabled: false, // Will be enabled when user is authenticated and has teacher role
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

// Hook to search teachers
export const useTeacherSearch = (params: any) => {
  return useQuery({
    queryKey: teacherProfileQueryKeys.search(params),
    queryFn: () => teacherProfileAPI.search(params),
    enabled: !!params,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
  });
};

// Hook to create/update teacher profile
export const useCreateOrUpdateTeacherProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: teacherProfileAPI.createOrUpdate,
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Update current teacher profile in cache
        queryClient.setQueryData(teacherProfileQueryKeys.current(), response);
        // Invalidate search results
        queryClient.invalidateQueries({ queryKey: teacherProfileQueryKeys.search([]) });
      }
    },
    onError: (error) => {
      console.error("Create/Update teacher profile error:", error);
    },
  });
};

// Hook to get teacher profile with loading and error states
export const useTeacherProfile = (teacherId?: string) => {
  const currentProfileQuery = useCurrentTeacherProfile();
  const profileByIdQuery = useTeacherProfileById(teacherId || "");

  if (teacherId) {
    return profileByIdQuery;
  }

  return currentProfileQuery;
};
