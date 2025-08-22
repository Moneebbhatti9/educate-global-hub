import { User } from "./auth";

// Admin User Interface (extends base User with admin-specific fields)
export interface AdminUser extends User {
  _id?: string;
  status?: string;
  location?: string;
  lastActive?: Date;
}

// Admin Create User Request
export interface AdminCreateUserRequest {
  role: "teacher" | "school" | "recruiter" | "supplier";
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  country?: string;
  city?: string;
  province?: string;
  zipCode?: string;
  address?: string;
  qualification?: string;
  subject?: string;
  pgce?: boolean;
  yearsOfTeachingExperience?: number;
  professionalBio?: string;
  keyAchievements?: string[];
  certifications?: string[];
  additionalQualifications?: string[];
  schoolName?: string;
  schoolEmail?: string;
  schoolContactNumber?: string;
  curriculum?: string[];
  schoolSize?:
    | "Small (1-500 students)"
    | "Medium (501-1000 students)"
    | "Large (1001+ students)";
  schoolType?:
    | "Public"
    | "Private"
    | "International"
    | "Charter"
    | "Religious"
    | "Other";
  genderType?: "Boys Only" | "Girls Only" | "Mixed";
  ageGroup?: string[];
  schoolWebsite?: string;
  aboutSchool?: string;
}

// Admin Update User Request
export interface AdminUpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: "teacher" | "school" | "recruiter" | "supplier";
  phone?: string;
}

// Admin Update Profile Request
export interface AdminUpdateProfileRequest {
  country?: string;
  city?: string;
  province?: string;
  zipCode?: string;
  address?: string;
  phoneNumber?: string;
  qualification?:
    | "Bachelor"
    | "Master"
    | "PhD"
    | "Diploma"
    | "Certificate"
    | "Other";
  subject?: string;
  pgce?: boolean;
  yearsOfTeachingExperience?: number;
  professionalBio?: string;
  keyAchievements?: string[];
  certifications?: string[];
  additionalQualifications?: string[];
  schoolName?: string;
  schoolEmail?: string;
  schoolContactNumber?: string;
  curriculum?: string[];
  schoolSize?:
    | "Small (1-500 students)"
    | "Medium (501-1000 students)"
    | "Large (1001+ students)";
  schoolType?:
    | "Public"
    | "Private"
    | "International"
    | "Charter"
    | "Religious"
    | "Other";
  genderType?: "Boys Only" | "Girls Only" | "Mixed";
  ageGroup?: string[];
  schoolWebsite?: string;
  aboutSchool?: string;
}

// Admin User Response
export interface AdminUserResponse {
  success: boolean;
  message: string;
  data: AdminUser;
}

// Admin Users Response with Pagination
export interface AdminUsersResponse {
  success: boolean;
  message: string;
  data: {
    data: AdminUser[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

// Teacher Profile Interface
export interface TeacherProfile {
  _id: string;
  userId: string;
  fullName: string;
  phoneNumber: string;
  country: string;
  city: string;
  province: string;
  zipCode: string;
  address: string;
  qualification: string;
  subject: string;
  pgce: boolean;
  yearsOfTeachingExperience: number;
  professionalBio: string;
  keyAchievements: string[];
  profileCompletion: number;
  isProfileComplete: boolean;
  createdAt: string;
  updatedAt: string;
  user: UserSummary;
  employment: any[];
  education: any[];
  qualifications: any[];
  referees: any[];
  certifications: any[];
  development: any[];
  memberships: any[];
}

// School Profile Interface
export interface SchoolProfile {
  _id: string;
  userId: string;
  schoolName: string;
  schoolEmail: string;
  schoolContactNumber: string;
  country: string;
  city: string;
  province: string;
  zipCode: string;
  address: string;
  curriculum: string[];
  schoolSize: string;
  schoolType: string;
  genderType: string;
  ageGroup: string[];
  schoolWebsite: string;
  aboutSchool: string;
  profileCompletion: number;
  isProfileComplete: boolean;
  createdAt: string;
  updatedAt: string;
  user: UserSummary;
}

// User Summary Interface
export interface UserSummary {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatar?: string;
}

// Admin User Profile Response
export interface AdminUserProfileResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    profile: TeacherProfile | SchoolProfile;
  };
}
