import { z } from "zod";
import { UserRole } from "../types/auth";

// Common validation patterns
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const phonePattern = /^\+?[\d\s\-()]{10,}$/;

// Base validation schemas
export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Please enter a valid email address")
  .regex(emailPattern, "Please enter a valid email address");

export const passwordSchema = z
  .string()
  .min(1, "Password is required")
  .min(8, "Password must be at least 8 characters")
  .regex(
    passwordPattern,
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
  );

export const confirmPasswordSchema = z
  .string()
  .min(1, "Please confirm your password");

export const nameSchema = z
  .string()
  .min(1, "This field is required")
  .min(2, "Must be at least 2 characters")
  .max(50, "Must be less than 50 characters")
  .regex(/^[a-zA-Z\s]+$/, "Only letters and spaces are allowed");

export const phoneSchema = z
  .string()
  .min(1, "Phone number is required")
  .regex(phonePattern, "Please enter a valid phone number");

// Login form validation
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

// Signup form validation
export const signupSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
    firstName: nameSchema,
    lastName: nameSchema,
    role: z.enum(
      ["teacher", "school", "recruiter", "supplier", "admin"] as const,
      {
        required_error: "Please select a role",
      }
    ),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
    receiveUpdates: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// OTP verification schema
export const otpSchema = z.object({
  email: emailSchema,
  otp: z
    .string()
    .min(1, "OTP is required")
    .length(6, "OTP must be 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only numbers"),
});

// Password reset request schema
export const passwordResetSchema = z.object({
  email: emailSchema,
});

// Password reset confirmation schema
export const passwordResetConfirmSchema = z
  .object({
    email: emailSchema,
    otp: z
      .string()
      .min(1, "OTP is required")
      .length(6, "OTP must be 6 digits")
      .regex(/^\d{6}$/, "OTP must contain only numbers"),
    newPassword: passwordSchema,
    confirmPassword: confirmPasswordSchema,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Change password schema
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordSchema,
    confirmPassword: confirmPasswordSchema,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Profile completion schemas
const addressSchema = z.object({
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  zipCode: z.string().min(1, "ZIP code is required"),
});

const teacherProfileSchema = z.object({
  subjects: z.array(z.string()).min(1, "At least one subject is required"),
  experience: z.number().min(0, "Experience must be 0 or greater"),
  education: z.string().min(1, "Education is required"),
  certifications: z.array(z.string()).optional(),
});

const schoolProfileSchema = z.object({
  schoolName: z.string().min(1, "School name is required"),
  schoolType: z.enum(["primary", "secondary", "both"], {
    required_error: "Please select school type",
  }),
  studentCount: z.number().min(1, "Student count must be at least 1"),
  location: z.string().min(1, "Location is required"),
});

const recruiterProfileSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  industry: z.string().min(1, "Industry is required"),
  position: z.string().min(1, "Position is required"),
});

const supplierProfileSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  products: z.array(z.string()).min(1, "At least one product is required"),
  website: z.string().url().optional().or(z.literal("")),
});

// Teacher Profile Form Schema
export const teacherProfileFormSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .min(2, "Full name must be at least 2 characters"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  province: z.string().min(1, "Province/State is required"),
  zipCode: z.string().min(1, "ZIP code is required"),
  address: z.string().min(1, "Address is required"),
  qualification: z.enum(
    ["Bachelor", "Master", "PhD", "Diploma", "Certificate", "Other"],
    {
      required_error: "Please select a qualification",
    }
  ),
  subject: z.string().min(1, "Teaching subject is required"),
  pgce: z.boolean().optional(),
  yearsOfTeachingExperience: z
    .number()
    .min(0, "Years of experience cannot be negative")
    .max(50, "Years of experience cannot exceed 50"),
  professionalBio: z
    .string()
    .min(50, "Professional bio must be at least 50 characters")
    .max(1000, "Professional bio must be less than 1000 characters"),
  keyAchievements: z.array(z.string()).optional(),
  certifications: z.array(z.string()).optional(),
  additionalQualifications: z.array(z.string()).optional(),
});

// School Profile Form Schema
export const schoolProfileFormSchema = z.object({
  schoolName: z
    .string()
    .min(1, "School name is required")
    .min(2, "School name must be at least 2 characters"),
  schoolEmail: z
    .string()
    .min(1, "School email is required")
    .email("Please enter a valid email address"),
  schoolContactNumber: z.string().min(1, "School contact number is required"),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  province: z.string().min(1, "Province/State is required"),
  zipCode: z.string().min(1, "ZIP code is required"),
  address: z.string().min(1, "School address is required"),
  curriculum: z.array(z.string()).min(1, "At least one curriculum is required"),
  schoolSize: z.enum(
    [
      "Small (1-500 students)",
      "Medium (501-1000 students)",
      "Large (1001+ students)",
    ],
    {
      required_error: "Please select school size",
    }
  ),
  schoolType: z.enum(
    ["Public", "Private", "International", "Charter", "Religious", "Other"],
    {
      required_error: "Please select school type",
    }
  ),
  genderType: z.enum(["Boys Only", "Girls Only", "Mixed"], {
    required_error: "Please select gender type",
  }),
  ageGroup: z.array(z.string()).min(1, "At least one age group is required"),
  schoolWebsite: z.string().url().optional().or(z.literal("")),
  aboutSchool: z
    .string()
    .min(100, "About school must be at least 100 characters")
    .max(2000, "About school must be less than 2000 characters"),
});

export const profileCompletionSchema = z
  .object({
    phone: phoneSchema,
    avatar: z.instanceof(File).optional(),
    bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
    address: addressSchema.optional(),
    teacher: teacherProfileSchema.optional(),
    school: schoolProfileSchema.optional(),
    recruiter: recruiterProfileSchema.optional(),
    supplier: supplierProfileSchema.optional(),
  })
  .refine(
    (data) => {
      // Ensure role-specific data is provided based on user role
      // This will be validated in the component based on the user's role
      return true;
    },
    {
      message: "Please provide all required information for your role",
    }
  );

// PostJob Form Schema
export const postJobFormSchema = z
  .object({
    title: z
      .string()
      .min(1, "Job title is required")
      .min(3, "Job title must be at least 3 characters"),
    organization: z.string().min(1, "Organization name is required"),
    country: z.string().min(1, "Country is required"),
    city: z.string().min(1, "City is required"),
    educationLevel: z.string().min(1, "Education level is required"),
    subjects: z.array(z.string()).min(1, "At least one subject is required"),
    position: z.object({
      category: z.string().min(1, "Position category is required"),
      subcategory: z.string().min(1, "Position type is required"),
    }),
    organizationType: z.array(z.string()).optional(),
    description: z
      .string()
      .min(1, "Job description is required")
      .min(50, "Job description must be at least 50 characters"),
    salaryMin: z.string().min(1, "Minimum salary is required"),
    salaryMax: z.string().min(1, "Maximum salary is required"),
    currency: z.string().min(1, "Currency is required"),
    benefits: z.array(z.string()).optional(),
    salaryDisclose: z.boolean(),
    visaSponsorship: z.boolean(),
    quickApply: z.boolean(),
    externalLink: z.string().url().optional().or(z.literal("")),
    minExperience: z.string().optional(),
    qualification: z.string().min(1, "Qualification is required"),
    applicationDeadline: z.date({
      required_error: "Application deadline is required",
      invalid_type_error: "Please select a valid date",
    }),
    applicantEmail: z.string().email("Please enter a valid email address"),
    screeningQuestions: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      const minSalary = parseFloat(data.salaryMin);
      const maxSalary = parseFloat(data.salaryMax);
      return minSalary <= maxSalary;
    },
    {
      message: "Maximum salary must be greater than minimum salary",
      path: ["salaryMax"],
    }
  );

// JobApplication Form Schema
export const jobApplicationFormSchema = z.object({
  coverLetter: z
    .string()
    .min(1, "Cover letter is required")
    .min(200, "Cover letter must be at least 200 characters"),
  expectedSalary: z.string().min(1, "Expected salary is required"),
  availableFrom: z.date({
    required_error: "Available from date is required",
    invalid_type_error: "Please select a valid date",
  }),
  reasonForApplying: z
    .string()
    .min(1, "Reason for applying is required")
    .min(50, "Reason must be at least 50 characters"),
  additionalComments: z.string().optional(),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
  screeningAnswers: z
    .record(z.string(), z.string().min(1, "Answer is required"))
    .optional(),
});

// Form validation helper functions
export const validationHelpers = {
  // Get field error message
  getFieldError: (errors: unknown, fieldName: string): string | undefined => {
    return (errors as Record<string, { message?: string }>)?.[fieldName]
      ?.message;
  },

  // Check if field has error
  hasFieldError: (errors: unknown, fieldName: string): boolean => {
    return !!(errors as Record<string, unknown>)?.[fieldName];
  },

  // Check if field is touched and has error
  isFieldInvalid: (
    errors: unknown,
    touchedFields: unknown,
    fieldName: string
  ): boolean => {
    return !!(
      (errors as Record<string, unknown>)?.[fieldName] &&
      (touchedFields as Record<string, unknown>)?.[fieldName]
    );
  },

  // Get validation schema based on form type
  getSchema: (
    formType:
      | "login"
      | "signup"
      | "otp"
      | "passwordReset"
      | "passwordResetConfirm"
      | "changePassword"
      | "profileCompletion"
      | "teacherProfileForm"
      | "schoolProfileForm"
  ) => {
    switch (formType) {
      case "login":
        return loginSchema;
      case "signup":
        return signupSchema;
      case "otp":
        return otpSchema;
      case "passwordReset":
        return passwordResetSchema;
      case "passwordResetConfirm":
        return passwordResetConfirmSchema;
      case "changePassword":
        return changePasswordSchema;
      case "profileCompletion":
        return profileCompletionSchema;
      case "teacherProfileForm":
        return teacherProfileFormSchema;
      case "schoolProfileForm":
        return schoolProfileFormSchema;
      default:
        return z.object({});
    }
  },

  // Validate single field
  validateField: async (
    schema: z.ZodSchema,
    fieldName: string,
    value: unknown
  ) => {
    try {
      // Use Zod's getShape to avoid 'any' and type errors
      if (!("shape" in schema) || typeof schema.shape !== "object") {
        return { isValid: false, error: "Invalid schema" };
      }
      // Use Zod's getShape method to avoid 'any' and type errors
      const shape = (schema as z.ZodObject<z.ZodRawShape>).shape;
      const fieldSchema = shape[fieldName as keyof typeof shape];
      if (!fieldSchema) {
        return { isValid: false, error: "Invalid field" };
      }
      await fieldSchema.parseAsync(value);
      return { isValid: true, error: undefined };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.errors.find((err) =>
          err.path.includes(fieldName)
        );
        return { isValid: false, error: fieldError?.message };
      }
      return { isValid: false, error: "Validation failed" };
    }
  },
};
