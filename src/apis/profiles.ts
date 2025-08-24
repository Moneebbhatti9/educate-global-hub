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
  Education,
  EducationRequest,
} from "../types/profiles";

// Experience Types (replacing TeacherEmployment)
export interface Experience {
  id: string;
  title: string;
  employer: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  responsibilities: string;
  contactPerson?: string;
}

export interface ExperienceRequest {
  title: string;
  employer: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  responsibilities: string;
  contactPerson?: string;
}

// Qualification Types
export interface Qualification {
  _id?: string;
  id: string;
  title: string;
  institution: string;
  subject: string;
  certificationId: string;
  issueDate: string;
  expiryDate: string;
  ageRanges: string[];
  description?: string;
}

export interface QualificationRequest {
  title: string;
  institution: string;
  subject: string;
  certificationId: string;
  issueDate: string;
  expiryDate: string;
  ageRanges: string[];
  description?: string;
}

// Legacy TeacherEmployment types for backward compatibility
export interface TeacherEmployment {
  id?: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface TeacherEmploymentRequest {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

// API endpoints
const PROFILE_ENDPOINTS = {
  TEACHER_PROFILES: "/teacher-profiles",
  SCHOOL_PROFILES: "/school-profiles",
  TEACHER_PROFILE_ME: "/teacher-profiles/me",
  SCHOOL_PROFILE_ME: "/school-profiles/me",
  TEACHER_PROFILE_SEARCH: "/teacher-profiles/search",
  SCHOOL_PROFILE_SEARCH: "/school-profiles/search",
  TEACHER_EMPLOYMENT: "/teacher-profiles/me/employment",
  TEACHER_EDUCATION: "/teacher-profiles/me/education",
  TEACHER_EXPERIENCE: "/teacher-profiles/me/experience",
  TEACHER_QUALIFICATIONS: "/teacher-profiles/me/qualifications",
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

  // Create Teacher Experience (new)
  createExperience: async (
    data: ExperienceRequest
  ): Promise<ApiResponse<Experience>> => {
    const token = secureStorage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
    return apiHelpers.post<ApiResponse<Experience>>(
      PROFILE_ENDPOINTS.TEACHER_EMPLOYMENT,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  // Update Teacher Experience
  updateExperience: async (
    experienceId: string,
    data: ExperienceRequest
  ): Promise<ApiResponse<Experience>> => {
    const token = secureStorage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
    return apiHelpers.put<ApiResponse<Experience>>(
      `${PROFILE_ENDPOINTS.TEACHER_EMPLOYMENT}/${experienceId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  // Delete Teacher Experience
  deleteExperience: async (
    experienceId: string
  ): Promise<ApiResponse<{ message: string }>> => {
    const token = secureStorage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
    return apiHelpers.delete<ApiResponse<{ message: string }>>(
      `${PROFILE_ENDPOINTS.TEACHER_EMPLOYMENT}/${experienceId}`,
      { 
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },



  // Create Teacher Education
  createEducation: async (
    data: EducationRequest
  ): Promise<ApiResponse<Education>> => {
    const token = secureStorage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
    return apiHelpers.post<ApiResponse<Education>>(
      PROFILE_ENDPOINTS.TEACHER_EDUCATION,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  // Update Teacher Education
  updateEducation: async (
    educationId: string,
    data: EducationRequest
  ): Promise<ApiResponse<Education>> => {
    const token = secureStorage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
    return apiHelpers.put<ApiResponse<Education>>(
      `${PROFILE_ENDPOINTS.TEACHER_EDUCATION}/${educationId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  // Delete Teacher Education
  deleteEducation: async (
    educationId: string
  ): Promise<ApiResponse<{ message: string }>> => {
    const token = secureStorage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
    return apiHelpers.delete<ApiResponse<{ message: string }>>(
      `${PROFILE_ENDPOINTS.TEACHER_EDUCATION}/${educationId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  // Create Teacher Qualification
  createQualification: async (
    data: QualificationRequest
  ): Promise<ApiResponse<Qualification>> => {
    const token = secureStorage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
    return apiHelpers.post<ApiResponse<Qualification>>(
      PROFILE_ENDPOINTS.TEACHER_QUALIFICATIONS,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  // Update Teacher Qualification
  updateQualification: async (
    qualificationId: string,
    data: QualificationRequest
  ): Promise<ApiResponse<Qualification>> => {
    const token = secureStorage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
    return apiHelpers.put<ApiResponse<Qualification>>(
      `${PROFILE_ENDPOINTS.TEACHER_QUALIFICATIONS}/${qualificationId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  // Delete Teacher Qualification
  deleteQualification: async (
    qualificationId: string
  ): Promise<ApiResponse<{ message: string }>> => {
    const token = secureStorage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
    return apiHelpers.delete<ApiResponse<{ message: string }>>(
      `${PROFILE_ENDPOINTS.TEACHER_QUALIFICATIONS}/${qualificationId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
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

  // Create teacher experience mutation (new)
  const useCreateTeacherExperience = () => {
    return useMutation({
      mutationFn: teacherProfileAPI.createExperience,
      onSuccess: (response) => {
        if (response.success && response.data) {
          // Invalidate current teacher profile to refresh experience data
          queryClient.invalidateQueries({ queryKey: ["teacher-profile", "current"] });
          // Invalidate teacher profile by ID queries
          queryClient.invalidateQueries({ queryKey: ["teacher-profile"] });
        }
      },
      onError: (error) => {
        console.error("Create teacher experience error:", error);
      },
    });
  };

  // Update teacher experience mutation (new)
  const useUpdateTeacherExperience = () => {
    return useMutation({
      mutationFn: ({ experienceId, data }: { experienceId: string; data: ExperienceRequest }) =>
        teacherProfileAPI.updateExperience(experienceId, data),
      onSuccess: (response) => {
        if (response.success && response.data) {
          // Invalidate current teacher profile to refresh experience data
          queryClient.invalidateQueries({ queryKey: ["teacher-profile", "current"] });
          // Invalidate teacher profile by ID queries
          queryClient.invalidateQueries({ queryKey: ["teacher-profile"] });
        }
      },
      onError: (error) => {
        console.error("Update teacher experience error:", error);
      },
    });
  };

  // Delete teacher experience mutation (new)
  const useDeleteTeacherExperience = () => {
    return useMutation({
      mutationFn: teacherProfileAPI.deleteExperience,
      onSuccess: (response) => {
        if (response.success) {
          // Invalidate current teacher profile to refresh experience data
          queryClient.invalidateQueries({ queryKey: ["teacher-profile", "current"] });
          // Invalidate teacher profile by ID queries
          queryClient.invalidateQueries({ queryKey: ["teacher-profile"] });
        }
      },
      onError: (error) => {
        console.error("Delete teacher experience error:", error);
      },
    });
  };



  // Create teacher education mutation
  const useCreateTeacherEducation = () => {
    return useMutation({
      mutationFn: teacherProfileAPI.createEducation,
      onSuccess: (response) => {
        if (response.success && response.data) {
          // Invalidate current teacher profile to refresh education data
          queryClient.invalidateQueries({ queryKey: ["teacher-profile", "current"] });
          // Invalidate teacher profile by ID queries
          queryClient.invalidateQueries({ queryKey: ["teacher-profile"] });
        }
      },
      onError: (error) => {
        console.error("Create teacher education error:", error);
      },
    });
  };

  // Delete teacher education mutation
  const useDeleteTeacherEducation = () => {
    return useMutation({
      mutationFn: teacherProfileAPI.deleteEducation,
      onSuccess: (response) => {
        if (response.success) {
          // Invalidate current teacher profile to refresh education data
          queryClient.invalidateQueries({ queryKey: ["teacher-profile", "current"] });
          // Invalidate teacher profile by ID queries
          queryClient.invalidateQueries({ queryKey: ["teacher-profile"] });
        }
      },
      onError: (error) => {
        console.error("Delete teacher education error:", error);
      },
    });
  };

  // Create teacher qualification mutation
  const useCreateTeacherQualification = () => {
    return useMutation({
      mutationFn: teacherProfileAPI.createQualification,
      onSuccess: (response) => {
        if (response.success && response.data) {
          // Invalidate current teacher profile to refresh qualification data
          queryClient.invalidateQueries({ queryKey: ["teacher-profile", "current"] });
          // Invalidate teacher profile by ID queries
          queryClient.invalidateQueries({ queryKey: ["teacher-profile"] });
        }
      },
      onError: (error) => {
        console.error("Create teacher qualification error:", error);
      },
    });
  };

  // Update teacher qualification mutation
  const useUpdateTeacherQualification = () => {
    return useMutation({
      mutationFn: ({ qualificationId, data }: { qualificationId: string; data: QualificationRequest }) =>
        teacherProfileAPI.updateQualification(qualificationId, data),
      onSuccess: (response) => {
        if (response.success && response.data) {
          // Invalidate current teacher profile to refresh qualification data
          queryClient.invalidateQueries({ queryKey: ["teacher-profile", "current"] });
          // Invalidate teacher profile by ID queries
          queryClient.invalidateQueries({ queryKey: ["teacher-profile"] });
        }
      },
      onError: (error) => {
        console.error("Update teacher qualification error:", error);
      },
    });
  };

  // Delete teacher qualification mutation
  const useDeleteTeacherQualification = () => {
    return useMutation({
      mutationFn: teacherProfileAPI.deleteQualification,
      onSuccess: (response) => {
        if (response.success) {
          // Invalidate current teacher profile to refresh qualification data
          queryClient.invalidateQueries({ queryKey: ["teacher-profile", "current"] });
          // Invalidate teacher profile by ID queries
          queryClient.invalidateQueries({ queryKey: ["teacher-profile"] });
        }
      },
      onError: (error) => {
        console.error("Delete teacher qualification error:", error);
      },
    });
  };

  return {
    useCurrentTeacherProfile,
    useTeacherProfileById,
    useTeacherSearch,
    useCreateOrUpdateTeacherProfile,
    useCreateTeacherExperience,
    useUpdateTeacherExperience,
    useDeleteTeacherExperience,
    useCreateTeacherEducation,
    useDeleteTeacherEducation,
    useCreateTeacherQualification,
    useUpdateTeacherQualification,
    useDeleteTeacherQualification,
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



export const useCreateTeacherEducation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: teacherProfileAPI.createEducation,
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Invalidate current teacher profile to refresh education data
        queryClient.invalidateQueries({ queryKey: ["teacher-profile", "current"] });
        // Invalidate teacher profile by ID queries
        queryClient.invalidateQueries({ queryKey: ["teacher-profile"] });
      }
    },
    onError: (error) => {
      console.error("Create teacher education error:", error);
    },
  });
};

export const useDeleteTeacherEducation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: teacherProfileAPI.deleteEducation,
    onSuccess: (response) => {
      if (response.success) {
        // Invalidate current teacher profile to refresh education data
        queryClient.invalidateQueries({ queryKey: ["teacher-profile", "current"] });
        // Invalidate teacher profile by ID queries
        queryClient.invalidateQueries({ queryKey: ["teacher-profile"] });
      }
    },
    onError: (error) => {
      console.error("Delete teacher education error:", error);
    },
  });
};

export const useUpdateTeacherEducation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ educationId, data }: { educationId: string; data: EducationRequest }) =>
      teacherProfileAPI.updateEducation(educationId, data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Invalidate current teacher profile to refresh education data
        queryClient.invalidateQueries({ queryKey: ["teacher-profile", "current"] });
        // Invalidate teacher profile by ID queries
        queryClient.invalidateQueries({ queryKey: ["teacher-profile"] });
      }
    },
    onError: (error) => {
      console.error("Update teacher education error:", error);
    },
  });
};

// New standalone hooks for Experience API
export const useCreateTeacherExperience = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: teacherProfileAPI.createExperience,
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Invalidate current teacher profile to refresh experience data
        queryClient.invalidateQueries({ queryKey: ["teacher-profile", "current"] });
        // Invalidate teacher profile by ID queries
        queryClient.invalidateQueries({ queryKey: ["teacher-profile"] });
      }
    },
    onError: (error) => {
      console.error("Create teacher experience error:", error);
    },
  });
};

export const useUpdateTeacherExperience = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ experienceId, data }: { experienceId: string; data: ExperienceRequest }) =>
      teacherProfileAPI.updateExperience(experienceId, data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Invalidate current teacher profile to refresh experience data
        queryClient.invalidateQueries({ queryKey: ["teacher-profile", "current"] });
        // Invalidate teacher profile by ID queries
        queryClient.invalidateQueries({ queryKey: ["teacher-profile"] });
      }
    },
    onError: (error) => {
      console.error("Update teacher experience error:", error);
    },
  });
};

export const useDeleteTeacherExperience = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: teacherProfileAPI.deleteExperience,
    onSuccess: (response) => {
      if (response.success) {
        // Invalidate current teacher profile to refresh experience data
        queryClient.invalidateQueries({ queryKey: ["teacher-profile", "current"] });
        // Invalidate teacher profile to refresh experience data
        queryClient.invalidateQueries({ queryKey: ["teacher-profile"] });
      }
    },
    onError: (error) => {
      console.error("Delete teacher experience error:", error);
    },
  });
};

// Standalone hooks for Qualification API
export const useCreateTeacherQualification = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: teacherProfileAPI.createQualification,
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Invalidate current teacher profile to refresh qualification data
        queryClient.invalidateQueries({ queryKey: ["teacher-profile", "current"] });
        // Invalidate teacher profile by ID queries
        queryClient.invalidateQueries({ queryKey: ["teacher-profile"] });
      }
    },
    onError: (error) => {
      console.error("Create teacher qualification error:", error);
    },
  });
};

export const useUpdateTeacherQualification = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ qualificationId, data }: { qualificationId: string; data: QualificationRequest }) =>
      teacherProfileAPI.updateQualification(qualificationId, data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Invalidate current teacher profile to refresh qualification data
        queryClient.invalidateQueries({ queryKey: ["teacher-profile", "current"] });
        // Invalidate teacher profile by ID queries
        queryClient.invalidateQueries({ queryKey: ["teacher-profile"] });
      }
    },
    onError: (error) => {
      console.error("Update teacher qualification error:", error);
    },
  });
};

export const useDeleteTeacherQualification = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: teacherProfileAPI.deleteQualification,
    onSuccess: (response) => {
      if (response.success) {
        // Invalidate current teacher profile to refresh qualification data
        queryClient.invalidateQueries({ queryKey: ["teacher-profile", "current"] });
        // Invalidate teacher profile by ID queries
        queryClient.invalidateQueries({ queryKey: ["teacher-profile"] });
      }
    },
    onError: (error) => {
      console.error("Delete teacher qualification error:", error);
    },
  });
};
