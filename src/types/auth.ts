export type UserRole =
  | "teacher"
  | "school"
  | "recruiter"
  | "supplier"
  | "admin";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isEmailVerified: boolean;
  isProfileComplete: boolean;
  status?: "pending" | "active" | "inactive" | "suspended";
  is2FAEnabled?: boolean;
  avatarUrl?: string;
  avatar?: string; // Keep for backward compatibility
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupCredentials {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  agreeToTerms: boolean;
}

export interface ProfileCompletionData {
  fullName?: string;
  phone: string;
  avatar?: File;
  bio?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  // Role-specific fields
  teacher?: {
    subjects: string[];
    experience: number;
    qualification: string;
    pgce: string;
    keyAchievements?: string;
    certifications: string[];
  };
  school?: {
    schoolName: string;
    schoolEmail: string;
    schoolContactNumber: string;
    curriculum: string;
    schoolWebsite?: string;
    aboutSchool: string;
    schoolType: string;
    ageGroup: string;
    studentCount: number;
    location: string;
  };
  recruiter?: {
    companyName: string;
    industry: string;
    position: string;
  };
  supplier?: {
    companyName: string;
    products: string[];
    website?: string;
  };
}

export interface OTPVerificationData {
  email: string;
  otp: string;
  type?: "verification" | "reset" | "signin";
}

export interface TwoFAVerificationData {
  email: string;
  otp: string;
}

export interface TwoFALoginResponse {
  requires2FA: boolean;
  email: string;
  method: "email" | "sms";
}

export interface PasswordResetData {
  email: string;
}

export interface PasswordResetConfirmData {
  email: string;
  otp: string;
  newPassword: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface OTPResponse {
  message: string;
  expiresIn: number;
}

export interface UserStatusResponse {
  user: User;
  redirectTo:
    | "verify-email"
    | "complete-profile"
    | "pending-approval"
    | "dashboard";
  requiresStatusApproval?: boolean;
}

// Form validation schemas
export interface FormErrors {
  [key: string]: string;
}

// Route protection types
export interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireProfileCompletion?: boolean;
}

// JWT Token types
export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  REFRESH_TOKEN: "refresh_token",
  USER_DATA: "user_data",
  REMEMBER_ME: "remember_me",
} as const;
