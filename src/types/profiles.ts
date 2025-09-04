// Profile Types
export type UserRole =
  | "teacher"
  | "school"
  | "recruiter"
  | "supplier"
  | "admin";

// Base Profile Interface
export interface BaseProfile {
  _id?: string;
  userId?: string;
  isProfileComplete?: boolean;
  createdAt?: string;
  updatedAt?: string;
  user?: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    avatarUrl?: string;
  };
}

// Teacher Profile Types
export interface TeacherProfile extends BaseProfile {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  country: string;
  city: string;
  province: string;
  zipCode: string;
  address: string;
  qualification:
    | "Bachelor"
    | "Master"
    | "PhD"
    | "Diploma"
    | "Certificate"
    | "Other";
  subject: string;
  pgce: boolean;
  yearsOfTeachingExperience: number;
  professionalBio: string;
  keyAchievements?: string[];
  certifications?: string[];
  additionalQualifications?: string[];
  profileCompletion?: number;
  employment?: any[];
  education?: Education[];
  qualifications?: any[];
  referees?: any[];
  development?: any[];
  memberships?: any[];
  dependents?: any[];
  activities?: any[];
}

// Education Types
export interface Education {
  id?: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: number;
  thesis?: string;
  honors?: string;
  type?: "University" | "School" | "Professional";
}

export interface EducationRequest {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: number;
  thesis?: string;
  honors?: string;
  type?: "University" | "School" | "Professional";
}

export interface TeacherProfileRequest {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  country: string;
  city: string;
  province: string;
  zipCode: string;
  address: string;
  qualification:
    | "Bachelor"
    | "Master"
    | "PhD"
    | "Diploma"
    | "Certificate"
    | "Other";
  subject: string;
  pgce?: boolean;
  yearsOfTeachingExperience: number;
  professionalBio: string;
  keyAchievements?: string[];
  certifications?: string[];
  additionalQualifications?: string[];
  profileCompletion?: number;
}

// School Profile Types
export interface SchoolProfile extends BaseProfile {
  schoolName: string;
  schoolEmail: string;
  schoolContactNumber: string;
  alternateContact?: string;
  country: string;
  city: string;
  province: string;
  zipCode: string;
  address: string;
  curriculum: string[];
  schoolSize:
    | "Small (1-500 students)"
    | "Medium (501-1000 students)"
    | "Large (1001+ students)";
  schoolType:
    | "Public"
    | "Private"
    | "International"
    | "Charter"
    | "Religious"
    | "Other";
  genderType: "Boys Only" | "Girls Only" | "Mixed";
  ageGroup: string[];
  schoolWebsite?: string;
  aboutSchool: string;
  establishedYear?: string;
  registrationNumber?: string;
  professionalSummary?: string;
  mission?: string;
  vision?: string;
  careerObjectives?: string;
  programs?: any[];
  media?: any[];
}

export interface SchoolProfileRequest {
  schoolName: string;
  schoolEmail: string;
  schoolContactNumber: string;
  country: string;
  city: string;
  province: string;
  zipCode: string;
  address: string;
  curriculum: string[];
  schoolSize:
    | "Small (1-500 students)"
    | "Medium (501-1000 students)"
    | "Large (1001+ students)";
  schoolType:
    | "Public"
    | "Private"
    | "International"
    | "Charter"
    | "Religious"
    | "Other";
  genderType: "Boys Only" | "Girls Only" | "Mixed";
  ageGroup: string[];
  schoolWebsite?: string;
  aboutSchool: string;
}

// Search Parameters
export interface TeacherSearchParams {
  country?: string;
  city?: string;
  subject?: string;
  qualification?: string;
  minExperience?: number;
  maxExperience?: number;
  page?: number;
  limit?: number;
}

export interface SchoolSearchParams {
  country?: string;
  city?: string;
  curriculum?: string;
  schoolType?: string;
  genderType?: string;
  ageGroup?: string;
  schoolSize?: string;
  page?: number;
  limit?: number;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface SearchApiResponse<T> {
  success: boolean;
  message: string;
  data: {
    data: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

// Form Options Constants
export const CURRICULUM_OPTIONS = [
  "British Curriculum",
  "American Curriculum",
  "IB (International Baccalaureate)",
  "Canadian Curriculum",
  "Australian Curriculum",
  "National Curriculum",
  "Montessori",
  "Waldorf",
  "Reggio Emilia",
  "Other",
] as const;

export const SCHOOL_SIZE_OPTIONS = [
  "Small (1-500 students)",
  "Medium (501-1000 students)",
  "Large (1001+ students)",
] as const;

export const SCHOOL_TYPE_OPTIONS = [
  "Public",
  "Private",
  "International",
  "Charter",
  "Religious",
  "Other",
] as const;

export const GENDER_TYPE_OPTIONS = [
  "Boys Only",
  "Girls Only",
  "Mixed",
] as const;

export const AGE_GROUP_OPTIONS = [
  "Early Years (2-5 years)",
  "Primary (6-11 years)",
  "Secondary (12-16 years)",
  "Sixth Form/High School (17-18 years)",
  "All Ages",
] as const;

export const QUALIFICATION_OPTIONS = [
  "Bachelor",
  "Master",
  "PhD",
  "Diploma",
  "Certificate",
  "Other",
] as const;

// Local Storage Keys
export const PROFILE_STORAGE_KEYS = {
  TEACHER_PROFILE: "teacher_profile",
  SCHOOL_PROFILE: "school_profile",
  PROFILE_COMPLETION_STATE: "profile_completion_state",
} as const;

