import { AxiosError } from "axios";

// Error message mapping for common API errors
const ERROR_MESSAGES = {
  INVALID_CREDENTIALS:
    "Invalid email or password. Please check your credentials and try again.",
  EMAIL_NOT_VERIFIED: "Please verify your email address before signing in.",
  ACCOUNT_LOCKED:
    "Your account has been temporarily locked. Please try again later or contact support.",
  TOKEN_EXPIRED: "Your session has expired. Please sign in again.",
  INVALID_TOKEN: "Your session is invalid. Please sign in again.",
  REFRESH_TOKEN_EXPIRED: "Your session has expired. Please sign in again.",
  EMAIL_ALREADY_EXISTS:
    "An account with this email already exists. Please sign in or use a different email.",
  WEAK_PASSWORD: "Password is too weak. Please choose a stronger password.",
  INVALID_EMAIL: "Please enter a valid email address.",
  PASSWORDS_DONT_MATCH: "Passwords do not match. Please try again.",
  INVALID_OTP:
    "Invalid verification code. Please check your email and try again.",
  OTP_EXPIRED: "Verification code has expired. Please request a new one.",
  OTP_ALREADY_USED:
    "This verification code has already been used. Please request a new one.",
  PROFILE_INCOMPLETE: "Please complete your profile information.",
  INVALID_PHONE: "Please enter a valid phone number.",
  FILE_TOO_LARGE: "File size is too large. Please choose a smaller file.",
  INVALID_FILE_TYPE: "Invalid file type. Please choose a valid image file.",
  ACCESS_DENIED: "You don't have permission to access this resource.",
  INSUFFICIENT_PERMISSIONS:
    "You don't have sufficient permissions to perform this action.",
  NETWORK_ERROR:
    "Network connection error. Please check your internet connection and try again.",
  TIMEOUT_ERROR: "Request timed out. Please try again.",
  SERVER_ERROR: "Server error. Please try again later.",
  UNKNOWN_ERROR: "An unexpected error occurred. Please try again.",
  VALIDATION_ERROR: "Please check your input and try again.",
} as const;

// HTTP status code to error message mapping
const HTTP_ERROR_MESSAGES = {
  400: "Bad request. Please check your input and try again.",
  401: "Authentication required. Please sign in again.",
  403: "Access denied. You don't have permission to perform this action.",
  404: "Resource not found. Please check the URL and try again.",
  409: "Conflict. The resource already exists or conflicts with current state.",
  422: "Validation error. Please check your input and try again.",
  429: "Too many requests. Please wait a moment and try again.",
  500: "Server error. Please try again later.",
  502: "Bad gateway. Please try again later.",
  503: "Service unavailable. Please try again later.",
  504: "Gateway timeout. Please try again later.",
} as const;

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: Record<string, string[]>;
}

export class AppError extends Error {
  public code?: string;
  public status?: number;
  public details?: Record<string, string[]>;

  constructor(
    message: string,
    code?: string,
    status?: number,
    details?: Record<string, string[]>
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export const errorHandler = {
  extractErrorMessage: (error: AxiosError): string => {
    try {
      if (error.response?.data) {
        const responseData = error.response.data as Record<string, unknown>;

        // Check errors field first (more specific error message)
        if (responseData.errors) {
          // Handle string format: { "errors": "Error message" }
          if (typeof responseData.errors === "string") {
            return responseData.errors;
          }
          // Handle array format: { "errors": ["error1", "error2"] }
          if (
            Array.isArray(responseData.errors) &&
            responseData.errors.length > 0
          ) {
            return responseData.errors[0] as string;
          }
          // Handle object format: { "errors": { "field": ["error1"] } }
          if (typeof responseData.errors === "object") {
            const firstError = Object.values(responseData.errors)[0];
            if (Array.isArray(firstError) && firstError.length > 0) {
              return firstError[0] as string;
            }
          }
        }

        // Fall back to message field
        if (typeof responseData.message === "string") {
          return responseData.message;
        }

        if (
          typeof responseData.code === "string" &&
          ERROR_MESSAGES[responseData.code as keyof typeof ERROR_MESSAGES]
        ) {
          return ERROR_MESSAGES[
            responseData.code as keyof typeof ERROR_MESSAGES
          ];
        }
      }

      if (error.response?.status) {
        const statusMessage =
          HTTP_ERROR_MESSAGES[
            error.response.status as keyof typeof HTTP_ERROR_MESSAGES
          ];
        if (statusMessage) {
          return statusMessage;
        }
      }

      if (error.code === "ECONNABORTED") {
        return ERROR_MESSAGES.TIMEOUT_ERROR;
      }

      if (!error.response) {
        return ERROR_MESSAGES.NETWORK_ERROR;
      }

      return ERROR_MESSAGES.UNKNOWN_ERROR;
    } catch {
      return ERROR_MESSAGES.UNKNOWN_ERROR;
    }
  },

  createError: (error: AxiosError): AppError => {
    const message = errorHandler.extractErrorMessage(error);
    const status = error.response?.status;

    let code: string | undefined;
    let details: Record<string, string[]> | undefined;

    try {
      if (error.response?.data) {
        const responseData = error.response.data as Record<string, unknown>;
        if (typeof responseData.code === "string") {
          code = responseData.code;
        }
        if (responseData.errors) {
          // Handle string format: { "errors": "Error message" }
          if (typeof responseData.errors === "string") {
            details = { general: [responseData.errors] };
          }
          // Handle array format: { "errors": ["error1", "error2"] }
          else if (Array.isArray(responseData.errors)) {
            // Convert array to object format for consistency
            details = { general: responseData.errors };
          }
          // Handle object format: { "errors": { "field": ["error1"] } }
          else if (typeof responseData.errors === "object") {
            details = responseData.errors as Record<string, string[]>;
          }
        }
      }
    } catch {
      // Ignore parsing errors
    }

    return new AppError(message, code, status, details);
  },

  getFieldError: (
    fieldName: string,
    details?: Record<string, string[]>
  ): string | undefined => {
    if (!details || !details[fieldName]) {
      return undefined;
    }

    const fieldErrors = details[fieldName];
    return Array.isArray(fieldErrors) && fieldErrors.length > 0
      ? fieldErrors[0]
      : undefined;
  },

  logError: (error: unknown, context?: string): void => {
    if (import.meta.env.DEV) {
      console.error(`[${context || "Error"}]:`, error);
    }
  },
};

export default errorHandler;
