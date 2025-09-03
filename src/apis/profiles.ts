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

// Certification Types
export interface Certification {
  _id?: string;
  id: string;
  certificationName: string;
  issuingOrganization: string;
  issueDate: string;
  expiryDate: string;
  credentialId: string;
  credentialUrl: string;
  description?: string;
}

export interface CertificationRequest {
  certificationName: string;
  issuingOrganization: string;
  issueDate: string;
  expiryDate: string;
  credentialId: string;
  credentialUrl: string;
  description?: string;
}

export interface Development {
  _id?: string;
  id: string;
  title: string;
  provider: string;
  type:
    | "Course"
    | "Workshop"
    | "Conference"
    | "Seminar"
    | "Online Training"
    | "Other";
  duration: string;
  completionDate: string;
  skills: string[];
  impact: string;
  certificateUrl?: string;
}

export interface DevelopmentRequest {
  title: string;
  provider: string;
  type:
    | "Course"
    | "Workshop"
    | "Conference"
    | "Seminar"
    | "Online Training"
    | "Other";
  duration: string;
  completionDate: string;
  skills: string[];
  impact: string;
  certificateUrl?: string;
}

export interface Membership {
  _id?: string;
  id: string;
  organizationName: string;
  membershipType:
    | "Full Member"
    | "Associate Member"
    | "Student Member"
    | "Honorary Member"
    | "Other";
  membershipId: string;
  joinDate: string;
  expiryDate: string;
  status: "Active" | "Inactive" | "Pending" | "Expired";
  benefits: string[];
  description?: string;
}

export interface MembershipRequest {
  organizationName: string;
  membershipType:
    | "Full Member"
    | "Associate Member"
    | "Student Member"
    | "Honorary Member"
    | "Other";
  membershipId: string;
  joinDate: string;
  expiryDate: string;
  status: "Active" | "Inactive" | "Pending" | "Expired";
  benefits: string[];
  description?: string;
}

export interface Dependent {
  _id?: string;
  id: string;
  dependentName: string;
  relationship: "Spouse" | "Child" | "Parent" | "Sibling" | "Other";
  age?: number;
  nationality: string;
  passportNumber: string;
  passportExpiry: string;
  visaRequired: boolean;
  visaStatus?: "Not Applied" | "Applied" | "Approved" | "Denied";
  accommodationNeeds: string;
  medicalNeeds?: string;
  educationNeeds?: string;
  notes?: string;
}

export interface DependentRequest {
  dependentName: string;
  relationship: "Spouse" | "Child" | "Parent" | "Sibling" | "Other";
  age?: number;
  nationality: string;
  passportNumber: string;
  passportExpiry: string;
  visaRequired: boolean;
  visaStatus?: "Not Applied" | "Applied" | "Approved" | "Denied";
  accommodationNeeds: string;
  medicalNeeds?: string;
  educationNeeds?: string;
  notes?: string;
}

export interface Activity {
  _id?: string;
  id: string;
  name: string;
  type:
    | "Club"
    | "Sport"
    | "Community Service"
    | "Leadership"
    | "Hobby"
    | "Volunteer Work"
    | "Other";
  role: string;
  organization?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
  skillsDeveloped: string[];
  timeCommitment: string;
}

export interface ActivityRequest {
  name: string;
  type:
    | "Club"
    | "Sport"
    | "Community Service"
    | "Leadership"
    | "Hobby"
    | "Volunteer Work"
    | "Other";
  role: string;
  organization?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
  skillsDeveloped: string[];
  timeCommitment: string;
}

// Referee Types
export interface Referee {
  _id?: string;
  id: string;
  name: string;
  position: string;
  organization: string;
  email: string;
  phone: string;
  relationship: string;
  yearsKnown: number;
  notes?: string;
}

export interface RefereeRequest {
  name: string;
  position: string;
  organization: string;
  email: string;
  phone: string;
  relationship: string;
  yearsKnown: number;
  notes?: string;
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
  TEACHER_PROFILE_BY_ID: (id: string) => `/teacher-profiles/${id}`,
  TEACHER_EXPERIENCE: "/teacher-profiles/me/employment",
  TEACHER_EDUCATION: "/teacher-profiles/me/education",
  TEACHER_QUALIFICATIONS: "/teacher-profiles/me/qualifications",
  TEACHER_REFEREES: "/teacher-profiles/me/referees",
  TEACHER_CERTIFICATIONS: "/teacher-profiles/me/certifications",
  TEACHER_DEVELOPMENT: "/teacher-profiles/me/development",
  TEACHER_MEMBERSHIPS: "/teacher-profiles/me/memberships",
  TEACHER_DEPENDENTS: "/teacher-profiles/me/dependents",
  TEACHER_ACTIVITIES: "/teacher-profiles/me/activities",
  SCHOOL_PROGRAMS: "/school-profiles/programs",
  SCHOOL_PROGRAM_BY_ID: (id: string) => `/school-profiles/programs/${id}`,
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

  // Create Teacher Referee
  createReferee: async (
    data: RefereeRequest
  ): Promise<ApiResponse<Referee>> => {
    const token = secureStorage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
    return apiHelpers.post<ApiResponse<Referee>>(
      PROFILE_ENDPOINTS.TEACHER_REFEREES,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  // Update Teacher Referee
  updateReferee: async (
    refereeId: string,
    data: RefereeRequest
  ): Promise<ApiResponse<Referee>> => {
    const token = secureStorage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
    return apiHelpers.put<ApiResponse<Referee>>(
      `${PROFILE_ENDPOINTS.TEACHER_REFEREES}/${refereeId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  // Delete Teacher Referee
  deleteReferee: async (
    refereeId: string
  ): Promise<ApiResponse<{ message: string }>> => {
    const token = secureStorage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
    return apiHelpers.delete<ApiResponse<{ message: string }>>(
      `${PROFILE_ENDPOINTS.TEACHER_REFEREES}/${refereeId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  // Create Teacher Certification
  createCertification: async (
    data: CertificationRequest
  ): Promise<ApiResponse<Certification>> => {
    const token = secureStorage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
    return apiHelpers.post<ApiResponse<Certification>>(
      PROFILE_ENDPOINTS.TEACHER_CERTIFICATIONS,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  // Update Teacher Certification
  updateCertification: async (
    certificationId: string,
    data: CertificationRequest
  ): Promise<ApiResponse<Certification>> => {
    const token = secureStorage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
    return apiHelpers.patch<ApiResponse<Certification>>(
      `${PROFILE_ENDPOINTS.TEACHER_CERTIFICATIONS}/${certificationId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  // Delete Teacher Certification
  deleteCertification: async (
    certificationId: string
  ): Promise<ApiResponse<{ message: string }>> => {
    const token = secureStorage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
    return apiHelpers.delete<ApiResponse<{ message: string }>>(
      `${PROFILE_ENDPOINTS.TEACHER_CERTIFICATIONS}/${certificationId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  createDevelopment: async (
    data: DevelopmentRequest
  ): Promise<ApiResponse<Development>> => {
    const token = secureStorage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
    return apiHelpers.post<ApiResponse<Development>>(
      PROFILE_ENDPOINTS.TEACHER_DEVELOPMENT,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  updateDevelopment: async (
    developmentId: string,
    data: DevelopmentRequest
  ): Promise<ApiResponse<Development>> => {
    const token = secureStorage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
    return apiHelpers.patch<ApiResponse<Development>>(
      `${PROFILE_ENDPOINTS.TEACHER_DEVELOPMENT}/${developmentId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  deleteDevelopment: async (
    developmentId: string
  ): Promise<ApiResponse<{ message: string }>> => {
    const token = secureStorage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
    return apiHelpers.delete<ApiResponse<{ message: string }>>(
      `${PROFILE_ENDPOINTS.TEACHER_DEVELOPMENT}/${developmentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  createMembership: async (
    data: MembershipRequest
  ): Promise<ApiResponse<Membership>> => {
    const token = secureStorage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
    return apiHelpers.post<ApiResponse<Membership>>(
      PROFILE_ENDPOINTS.TEACHER_MEMBERSHIPS,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  updateMembership: async (
    membershipId: string,
    data: MembershipRequest
  ): Promise<ApiResponse<Membership>> => {
    const token = secureStorage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
    return apiHelpers.patch<ApiResponse<Membership>>(
      `${PROFILE_ENDPOINTS.TEACHER_MEMBERSHIPS}/${membershipId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  deleteMembership: async (
    membershipId: string
  ): Promise<ApiResponse<{ message: string }>> => {
    const token = secureStorage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
    return apiHelpers.delete<ApiResponse<{ message: string }>>(
      `${PROFILE_ENDPOINTS.TEACHER_MEMBERSHIPS}/${membershipId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  createDependent: async (
    data: DependentRequest
  ): Promise<ApiResponse<Dependent>> => {
    const token = secureStorage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
    return apiHelpers.post<ApiResponse<Dependent>>(
      PROFILE_ENDPOINTS.TEACHER_DEPENDENTS,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  updateDependent: async (
    dependentId: string,
    data: DependentRequest
  ): Promise<ApiResponse<Dependent>> => {
    const token = secureStorage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
    return apiHelpers.put<ApiResponse<Dependent>>(
      `${PROFILE_ENDPOINTS.TEACHER_DEPENDENTS}/${dependentId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  deleteDependent: async (
    dependentId: string
  ): Promise<ApiResponse<{ message: string }>> => {
    const token = secureStorage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
    return apiHelpers.delete<ApiResponse<{ message: string }>>(
      `${PROFILE_ENDPOINTS.TEACHER_DEPENDENTS}/${dependentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  createActivity: async (
    data: ActivityRequest
  ): Promise<ApiResponse<Activity>> => {
    const token = secureStorage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
    return apiHelpers.post<ApiResponse<Activity>>(
      PROFILE_ENDPOINTS.TEACHER_ACTIVITIES,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  updateActivity: async (
    activityId: string,
    data: ActivityRequest
  ): Promise<ApiResponse<Activity>> => {
    const token = secureStorage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
    return apiHelpers.put<ApiResponse<Activity>>(
      `${PROFILE_ENDPOINTS.TEACHER_ACTIVITIES}/${activityId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  deleteActivity: async (
    activityId: string
  ): Promise<ApiResponse<{ message: string }>> => {
    const token = secureStorage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
    return apiHelpers.delete<ApiResponse<{ message: string }>>(
      `${PROFILE_ENDPOINTS.TEACHER_ACTIVITIES}/${activityId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },
};

// Program Types
export interface Program {
  _id?: string;
  id?: string;
  name: string;
  level: "Pre-K" | "Elementary" | "Middle School" | "High School" | "Sixth Form" | "Other";
  curriculum: string;
  ageRange: string;
  duration: string;
  subjects: string[];
  description: string;
  requirements: string[];
  capacity: number;
  fees?: string;
}

export interface ProgramRequest {
  name: string;
  level: "Pre-K" | "Elementary" | "Middle School" | "High School" | "Sixth Form" | "Other";
  curriculum: string;
  ageRange: string;
  duration: string;
  subjects: string[];
  description: string;
  requirements: string[];
  capacity: number;
  fees?: string;
}

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

  // Get All School Profiles with pagination and filters
  getAll: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    country?: string;
    city?: string;
    accreditation?: string;
  }): Promise<SearchApiResponse<SchoolProfile>> => {
    return apiHelpers.get<SearchApiResponse<SchoolProfile>>(
      PROFILE_ENDPOINTS.SCHOOL_PROFILES,
      { params }
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

  // Create School Program
  createProgram: async (
    data: ProgramRequest
  ): Promise<ApiResponse<Program>> => {
    const token = secureStorage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
    return apiHelpers.post<ApiResponse<Program>>(
      PROFILE_ENDPOINTS.SCHOOL_PROGRAMS,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  // Update School Program
  updateProgram: async (
    programId: string,
    data: ProgramRequest
  ): Promise<ApiResponse<Program>> => {
    const token = secureStorage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
    return apiHelpers.put<ApiResponse<Program>>(
      PROFILE_ENDPOINTS.SCHOOL_PROGRAM_BY_ID(programId),
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  // Delete School Program
  deleteProgram: async (
    programId: string
  ): Promise<ApiResponse<{ message: string }>> => {
    const token = secureStorage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
    return apiHelpers.delete<ApiResponse<{ message: string }>>(
      PROFILE_ENDPOINTS.SCHOOL_PROGRAM_BY_ID(programId),
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
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
          queryClient.invalidateQueries({
            queryKey: ["teacher-profile", "current"],
          });
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
      mutationFn: ({
        experienceId,
        data,
      }: {
        experienceId: string;
        data: ExperienceRequest;
      }) => teacherProfileAPI.updateExperience(experienceId, data),
      onSuccess: (response) => {
        if (response.success && response.data) {
          // Invalidate current teacher profile to refresh experience data
          queryClient.invalidateQueries({
            queryKey: ["teacher-profile", "current"],
          });
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
          queryClient.invalidateQueries({
            queryKey: ["teacher-profile", "current"],
          });
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
          queryClient.invalidateQueries({
            queryKey: ["teacher-profile", "current"],
          });
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
          queryClient.invalidateQueries({
            queryKey: ["teacher-profile", "current"],
          });
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
          queryClient.invalidateQueries({
            queryKey: ["teacher-profile", "current"],
          });
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
      mutationFn: ({
        qualificationId,
        data,
      }: {
        qualificationId: string;
        data: QualificationRequest;
      }) => teacherProfileAPI.updateQualification(qualificationId, data),
      onSuccess: (response) => {
        if (response.success && response.data) {
          // Invalidate current teacher profile to refresh qualification data
          queryClient.invalidateQueries({
            queryKey: ["teacher-profile", "current"],
          });
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
          queryClient.invalidateQueries({
            queryKey: ["teacher-profile", "current"],
          });
          // Invalidate teacher profile by ID queries
          queryClient.invalidateQueries({ queryKey: ["teacher-profile"] });
        }
      },
      onError: (error) => {
        console.error("Delete teacher qualification error:", error);
      },
    });
  };

  // Create teacher referee mutation
  const useCreateTeacherReferee = () => {
    return useMutation({
      mutationFn: teacherProfileAPI.createReferee,
      onSuccess: (response) => {
        if (response.success && response.data) {
          // Invalidate current teacher profile to refresh referee data
          queryClient.invalidateQueries({
            queryKey: ["teacher-profile", "current"],
          });
          // Invalidate teacher profile by ID queries
          queryClient.invalidateQueries({ queryKey: ["teacher-profile"] });
        }
      },
      onError: (error) => {
        console.error("Create teacher referee error:", error);
      },
    });
  };

  // Update teacher referee mutation
  const useUpdateTeacherReferee = () => {
    return useMutation({
      mutationFn: ({
        refereeId,
        data,
      }: {
        refereeId: string;
        data: RefereeRequest;
      }) => teacherProfileAPI.updateReferee(refereeId, data),
      onSuccess: (response) => {
        if (response.success && response.data) {
          // Invalidate current teacher profile to refresh referee data
          queryClient.invalidateQueries({
            queryKey: ["teacher-profile", "current"],
          });
          // Invalidate teacher profile by ID queries
          queryClient.invalidateQueries({ queryKey: ["teacher-profile"] });
        }
      },
      onError: (error) => {
        console.error("Update teacher referee error:", error);
      },
    });
  };

  // Delete teacher referee mutation
  const useDeleteTeacherReferee = () => {
    return useMutation({
      mutationFn: teacherProfileAPI.deleteReferee,
      onSuccess: (response) => {
        if (response.success) {
          // Invalidate current teacher profile to refresh referee data
          queryClient.invalidateQueries({
            queryKey: ["teacher-profile", "current"],
          });
          // Invalidate teacher profile by ID queries
          queryClient.invalidateQueries({ queryKey: ["teacher-profile"] });
        }
      },
      onError: (error) => {
        console.error("Delete teacher referee error:", error);
      },
    });
  };

  // Create teacher certification mutation
  const useCreateTeacherCertification = () => {
    return useMutation({
      mutationFn: teacherProfileAPI.createCertification,
      onSuccess: (response) => {
        if (response.success && response.data) {
          // Invalidate current teacher profile to refresh certification data
          queryClient.invalidateQueries({
            queryKey: ["teacher-profile", "current"],
          });
          // Invalidate teacher profile by ID queries
          queryClient.invalidateQueries({ queryKey: ["teacher-profile"] });
        }
      },
      onError: (error) => {
        console.error("Create teacher certification error:", error);
      },
    });
  };

  // Update teacher certification mutation
  const useUpdateTeacherCertification = () => {
    return useMutation({
      mutationFn: ({
        certificationId,
        data,
      }: {
        certificationId: string;
        data: CertificationRequest;
      }) => teacherProfileAPI.updateCertification(certificationId, data),
      onSuccess: (response) => {
        if (response.success && response.data) {
          // Invalidate current teacher profile to refresh certification data
          queryClient.invalidateQueries({
            queryKey: ["teacher-profile", "current"],
          });
          // Invalidate teacher profile by ID queries
          queryClient.invalidateQueries({ queryKey: ["teacher-profile"] });
        }
      },
      onError: (error) => {
        console.error("Update teacher certification error:", error);
      },
    });
  };

  // Delete teacher certification mutation
  const useDeleteTeacherCertification = () => {
    return useMutation({
      mutationFn: teacherProfileAPI.deleteCertification,
      onSuccess: (response) => {
        if (response.success) {
          // Invalidate current teacher profile to refresh certification data
          queryClient.invalidateQueries({
            queryKey: ["teacher-profile", "current"],
          });
          // Invalidate teacher profile by ID queries
          queryClient.invalidateQueries({ queryKey: ["teacher-profile"] });
        }
      },
      onError: (error) => {
        console.error("Delete teacher certification error:", error);
      },
    });
  };

  // Create teacher development mutation
  const useCreateTeacherDevelopment = () => {
    return useMutation({
      mutationFn: (data: DevelopmentRequest) =>
        teacherProfileAPI.createDevelopment(data),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["teacher-profile", "current"],
        });
      },
    });
  };

  // Update teacher development mutation
  const useUpdateTeacherDevelopment = () => {
    return useMutation({
      mutationFn: ({
        developmentId,
        data,
      }: {
        developmentId: string;
        data: DevelopmentRequest;
      }) => teacherProfileAPI.updateDevelopment(developmentId, data),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["teacher-profile", "current"],
        });
      },
    });
  };

  // Delete teacher development mutation
  const useDeleteTeacherDevelopment = () => {
    return useMutation({
      mutationFn: (developmentId: string) =>
        teacherProfileAPI.deleteDevelopment(developmentId),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["teacher-profile", "current"],
        });
      },
    });
  };

  // Create teacher membership mutation
  const useCreateTeacherMembership = () => {
    return useMutation({
      mutationFn: (data: MembershipRequest) =>
        teacherProfileAPI.createMembership(data),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["teacher-profile", "current"],
        });
      },
    });
  };

  // Update teacher membership mutation
  const useUpdateTeacherMembership = () => {
    return useMutation({
      mutationFn: ({
        membershipId,
        data,
      }: {
        membershipId: string;
        data: MembershipRequest;
      }) => teacherProfileAPI.updateMembership(membershipId, data),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["teacher-profile", "current"],
        });
      },
    });
  };

  // Delete teacher membership mutation
  const useDeleteTeacherMembership = () => {
    return useMutation({
      mutationFn: (membershipId: string) =>
        teacherProfileAPI.deleteMembership(membershipId),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["teacher-profile", "current"],
        });
      },
    });
  };

  // Create dependent mutation
  const useCreateDependent = () => {
    return useMutation({
      mutationFn: (data: DependentRequest) =>
        teacherProfileAPI.createDependent(data),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["teacher-profile", "current"],
        });
      },
    });
  };

  // Update dependent mutation
  const useUpdateDependent = () => {
    return useMutation({
      mutationFn: ({
        dependentId,
        data,
      }: {
        dependentId: string;
        data: DependentRequest;
      }) => teacherProfileAPI.updateDependent(dependentId, data),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["teacher-profile", "current"],
        });
      },
    });
  };

  // Delete dependent mutation
  const useDeleteDependent = () => {
    return useMutation({
      mutationFn: (dependentId: string) =>
        teacherProfileAPI.deleteDependent(dependentId),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["teacher-profile", "current"],
        });
      },
    });
  };

  // Create activity mutation
  const useCreateActivity = () => {
    return useMutation({
      mutationFn: (data: ActivityRequest) =>
        teacherProfileAPI.createActivity(data),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["teacher-profile", "current"],
        });
      },
    });
  };

  // Update activity mutation
  const useUpdateActivity = () => {
    return useMutation({
      mutationFn: ({
        activityId,
        data,
      }: {
        activityId: string;
        data: ActivityRequest;
      }) => teacherProfileAPI.updateActivity(activityId, data),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["teacher-profile", "current"],
        });
      },
    });
  };

  // Delete activity mutation
  const useDeleteActivity = () => {
    return useMutation({
      mutationFn: (activityId: string) =>
        teacherProfileAPI.deleteActivity(activityId),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["teacher-profile", "current"],
        });
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
    useCreateTeacherReferee,
    useUpdateTeacherReferee,
    useDeleteTeacherReferee,
    useCreateTeacherCertification,
    useUpdateTeacherCertification,
    useDeleteTeacherCertification,
    useCreateTeacherDevelopment,
    useUpdateTeacherDevelopment,
    useDeleteTeacherDevelopment,
    useCreateTeacherMembership,
    useUpdateTeacherMembership,
    useDeleteTeacherMembership,
    useCreateDependent,
    useUpdateDependent,
    useDeleteDependent,
    useCreateActivity,
    useUpdateActivity,
    useDeleteActivity,
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

  // Create school program mutation
  const useCreateSchoolProgram = () => {
    return useMutation({
      mutationFn: schoolProfileAPI.createProgram,
      onSuccess: (response) => {
        if (response.success && response.data) {
          // Invalidate current school profile to refresh programs
          queryClient.invalidateQueries({ queryKey: ["school-profile", "current"] });
        }
      },
      onError: (error) => {
        console.error("Create school program error:", error);
      },
    });
  };

  // Update school program mutation
  const useUpdateSchoolProgram = () => {
    return useMutation({
      mutationFn: ({ programId, data }: { programId: string; data: ProgramRequest }) =>
        schoolProfileAPI.updateProgram(programId, data),
      onSuccess: (response) => {
        if (response.success && response.data) {
          // Invalidate current school profile to refresh programs
          queryClient.invalidateQueries({ queryKey: ["school-profile", "current"] });
        }
      },
      onError: (error) => {
        console.error("Update school program error:", error);
      },
    });
  };

  // Delete school program mutation
  const useDeleteSchoolProgram = () => {
    return useMutation({
      mutationFn: schoolProfileAPI.deleteProgram,
      onSuccess: (response) => {
        if (response.success) {
          // Invalidate current school profile to refresh programs
          queryClient.invalidateQueries({ queryKey: ["school-profile", "current"] });
        }
      },
      onError: (error) => {
        console.error("Delete school program error:", error);
      },
    });
  };

  return {
    useCurrentSchoolProfile,
    useSchoolProfileById,
    useSchoolSearch,
    useCreateOrUpdateSchoolProfile,
    useCreateSchoolProgram,
    useUpdateSchoolProgram,
    useDeleteSchoolProgram,
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
        queryClient.invalidateQueries({
          queryKey: ["teacher-profile", "current"],
        });
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
        queryClient.invalidateQueries({
          queryKey: ["teacher-profile", "current"],
        });
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
    mutationFn: ({
      educationId,
      data,
    }: {
      educationId: string;
      data: EducationRequest;
    }) => teacherProfileAPI.updateEducation(educationId, data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Invalidate current teacher profile to refresh education data
        queryClient.invalidateQueries({
          queryKey: ["teacher-profile", "current"],
        });
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
        queryClient.invalidateQueries({
          queryKey: ["teacher-profile", "current"],
        });
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
    mutationFn: ({
      experienceId,
      data,
    }: {
      experienceId: string;
      data: ExperienceRequest;
    }) => teacherProfileAPI.updateExperience(experienceId, data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Invalidate current teacher profile to refresh experience data
        queryClient.invalidateQueries({
          queryKey: ["teacher-profile", "current"],
        });
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
        queryClient.invalidateQueries({
          queryKey: ["teacher-profile", "current"],
        });
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
        queryClient.invalidateQueries({
          queryKey: ["teacher-profile", "current"],
        });
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
    mutationFn: ({
      qualificationId,
      data,
    }: {
      qualificationId: string;
      data: QualificationRequest;
    }) => teacherProfileAPI.updateQualification(qualificationId, data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Invalidate current teacher profile to refresh qualification data
        queryClient.invalidateQueries({
          queryKey: ["teacher-profile", "current"],
        });
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
        queryClient.invalidateQueries({
          queryKey: ["teacher-profile", "current"],
        });
        // Invalidate teacher profile by ID queries
        queryClient.invalidateQueries({ queryKey: ["teacher-profile"] });
      }
    },
    onError: (error) => {
      console.error("Delete teacher qualification error:", error);
    },
  });
};

// Standalone hooks for Referee API
export const useCreateTeacherReferee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: teacherProfileAPI.createReferee,
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Invalidate current teacher profile to refresh referee data
        queryClient.invalidateQueries({
          queryKey: ["teacher-profile", "current"],
        });
        // Invalidate teacher profile by ID queries
        queryClient.invalidateQueries({ queryKey: ["teacher-profile"] });
      }
    },
    onError: (error) => {
      console.error("Create teacher referee error:", error);
    },
  });
};

export const useUpdateTeacherReferee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      refereeId,
      data,
    }: {
      refereeId: string;
      data: RefereeRequest;
    }) => teacherProfileAPI.updateReferee(refereeId, data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Invalidate current teacher profile to refresh referee data
        queryClient.invalidateQueries({
          queryKey: ["teacher-profile", "current"],
        });
        // Invalidate teacher profile by ID queries
        queryClient.invalidateQueries({ queryKey: ["teacher-profile"] });
      }
    },
    onError: (error) => {
      console.error("Update teacher referee error:", error);
    },
  });
};

export const useDeleteTeacherReferee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: teacherProfileAPI.deleteReferee,
    onSuccess: (response) => {
      if (response.success) {
        // Invalidate current teacher profile to refresh referee data
        queryClient.invalidateQueries({
          queryKey: ["teacher-profile", "current"],
        });
        // Invalidate teacher profile by ID queries
        queryClient.invalidateQueries({ queryKey: ["teacher-profile"] });
      }
    },
    onError: (error) => {
      console.error("Delete teacher referee error:", error);
    },
  });
};

// Standalone hooks for Certification API
export const useCreateTeacherCertification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: teacherProfileAPI.createCertification,
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Invalidate current teacher profile to refresh certification data
        queryClient.invalidateQueries({
          queryKey: ["teacher-profile", "current"],
        });
        // Invalidate teacher profile by ID queries
        queryClient.invalidateQueries({ queryKey: ["teacher-profile"] });
      }
    },
    onError: (error) => {
      console.error("Create teacher certification error:", error);
    },
  });
};

export const useUpdateTeacherCertification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      certificationId,
      data,
    }: {
      certificationId: string;
      data: CertificationRequest;
    }) => teacherProfileAPI.updateCertification(certificationId, data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Invalidate current teacher profile to refresh certification data
        queryClient.invalidateQueries({
          queryKey: ["teacher-profile", "current"],
        });
        // Invalidate teacher profile by ID queries
        queryClient.invalidateQueries({ queryKey: ["teacher-profile"] });
      }
    },
    onError: (error) => {
      console.error("Update teacher certification error:", error);
    },
  });
};

export const useDeleteTeacherCertification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (certificationId: string) =>
      teacherProfileAPI.deleteCertification(certificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teacher-profile", "current"],
      });
    },
  });
};

export const useCreateTeacherDevelopment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DevelopmentRequest) =>
      teacherProfileAPI.createDevelopment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teacher-profile", "current"],
      });
    },
  });
};

export const useUpdateTeacherDevelopment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      developmentId,
      data,
    }: {
      developmentId: string;
      data: DevelopmentRequest;
    }) => teacherProfileAPI.updateDevelopment(developmentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teacher-profile", "current"],
      });
    },
  });
};

export const useDeleteTeacherDevelopment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (developmentId: string) =>
      teacherProfileAPI.deleteDevelopment(developmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teacher-profile", "current"],
      });
    },
  });
};

export const useCreateTeacherMembership = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: MembershipRequest) =>
      teacherProfileAPI.createMembership(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teacher-profile", "current"],
      });
    },
  });
};

export const useUpdateTeacherMembership = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      membershipId,
      data,
    }: {
      membershipId: string;
      data: MembershipRequest;
    }) => teacherProfileAPI.updateMembership(membershipId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teacher-profile", "current"],
      });
    },
  });
};

export const useDeleteTeacherMembership = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (membershipId: string) =>
      teacherProfileAPI.deleteMembership(membershipId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teacher-profile", "current"],
      });
    },
  });
};

// Standalone hooks for Dependent API
export const useCreateDependent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DependentRequest) =>
      teacherProfileAPI.createDependent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teacher-profile", "current"],
      });
    },
  });
};

export const useUpdateDependent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      dependentId,
      data,
    }: {
      dependentId: string;
      data: DependentRequest;
    }) => teacherProfileAPI.updateDependent(dependentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teacher-profile", "current"],
      });
    },
  });
};

export const useDeleteDependent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dependentId: string) =>
      teacherProfileAPI.deleteDependent(dependentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teacher-profile", "current"],
      });
    },
  });
};

// Standalone hooks for Activity API
export const useCreateActivity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ActivityRequest) =>
      teacherProfileAPI.createActivity(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teacher-profile", "current"],
      });
    },
  });
};

export const useUpdateActivity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      activityId,
      data,
    }: {
      activityId: string;
      data: ActivityRequest;
    }) => teacherProfileAPI.updateActivity(activityId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teacher-profile", "current"],
      });
    },
  });
};

export const useDeleteActivity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (activityId: string) =>
      teacherProfileAPI.deleteActivity(activityId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teacher-profile", "current"],
      });
    },
  });
};
