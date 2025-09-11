import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import { secureStorage, sessionStorage } from "../helpers/storage";
import { STORAGE_KEYS } from "../types/auth";
import { jwtHelpers } from "../helpers/jwt";
import { errorHandler } from "../utils/errorHandler";

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_TIMEOUT = 30000; // 30 seconds

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest", // CSRF protection
    "Cache-Control": "no-cache, no-store, must-revalidate", // Prevent caching of sensitive data
    Pragma: "no-cache",
    Expires: "0",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    try {
      const token = secureStorage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);

      if (token && jwtHelpers.isValidTokenStructure(token)) {
        // Check if token is expired
        if (jwtHelpers.isTokenExpired(token)) {
          // Token is expired, try to refresh
          const refreshToken = secureStorage.getItem<string>(
            STORAGE_KEYS.REFRESH_TOKEN
          );
          if (refreshToken) {
            // Store the current request to retry after token refresh
            sessionStorage.setItem("pendingRequest", config);
            // Trigger token refresh (this will be handled by the auth context)
            window.dispatchEvent(new CustomEvent("tokenExpired"));
            return Promise.reject(new Error("Token expired"));
          } else {
            // No refresh token, clear auth and redirect to login
            secureStorage.clearAuth();
            window.dispatchEvent(new CustomEvent("authExpired"));
            return Promise.reject(new Error("Authentication expired"));
          }
        }

        config.headers.Authorization = `Bearer ${token}`;

        // Debug: Log when Authorization header is added
        if (import.meta.env.DEV) {
          console.log("🔐 Authorization header added to request:", config.url);
          console.log("🔐 Token validation passed:", {
            url: config.url,
            hasToken: !!token,
            tokenLength: token.length,
            isExpired: jwtHelpers.isTokenExpired(token),
            userId: jwtHelpers.getUserId(token),
            userRole: jwtHelpers.getUserRole(token),
            userEmail: jwtHelpers.getUserEmail(token),
          });
          console.log("🔐 Request headers:", {
            "Content-Type": config.headers["Content-Type"],
            Authorization: `Bearer ${token.substring(0, 20)}...`,
            "User-Agent": config.headers["User-Agent"],
          });
        }
      } else if (token) {
        // Token exists but is invalid - log for debugging but don't clear auth immediately
        console.warn("Invalid token structure detected in request interceptor");
        if (import.meta.env.DEV) {
          console.log("Token:", token);
          console.log("Token validation failed:", {
            url: config.url,
            hasToken: !!token,
            tokenLength: token.length,
            isValidStructure: jwtHelpers.isValidTokenStructure(token),
            parseResult: jwtHelpers.parseToken(token),
          });
        }
      } else {
        // No token available
        if (import.meta.env.DEV) {
          console.warn("⚠️ No access token available for request:", config.url);
        }
      }
    } catch (error) {
      console.error("Error in request interceptor:", error);
      // Only clear auth data if it's a critical error
      if (error instanceof Error && error.message.includes("storage")) {
        secureStorage.clearAuth();
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Enhanced error logging
    if (import.meta.env.DEV) {
      console.error("🚨 API Error Response:", {
        url: originalRequest?.url,
        method: originalRequest?.method,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        requestHeaders: originalRequest?.headers,
      });
    }

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = secureStorage.getItem<string>(
          STORAGE_KEYS.REFRESH_TOKEN
        );

        if (refreshToken) {
          try {
            // Try to refresh the token
            const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
              refreshToken,
            });

            const { accessToken, refreshToken: newRefreshToken } =
              response.data.data;

            // Store new tokens
            secureStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, accessToken);
            secureStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);

            // Retry the original request
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return apiClient(originalRequest);
          } catch (refreshError) {
            // Refresh failed, clear auth and redirect to login
            secureStorage.clearAuth();
            window.dispatchEvent(new CustomEvent("authExpired"));
            return Promise.reject(
              errorHandler.createError(refreshError as AxiosError)
            );
          }
        } else {
          // No refresh token, clear auth and redirect to login
          secureStorage.clearAuth();
          window.dispatchEvent(new CustomEvent("authExpired"));
          return Promise.reject(errorHandler.createError(error));
        }
      } catch (storageError) {
        errorHandler.logError(storageError, "Storage Error");
        // Clear corrupted auth data
        secureStorage.clearAuth();
        window.dispatchEvent(new CustomEvent("authExpired"));
        return Promise.reject(errorHandler.createError(error));
      }
    }

    // Handle other errors
    if (error.response?.status === 403) {
      // Forbidden - user doesn't have permission
      window.dispatchEvent(new CustomEvent("accessDenied"));
    }

    // Convert all errors to user-friendly messages
    return Promise.reject(errorHandler.createError(error));
  }
);

// API helper functions
export const apiHelpers = {
  // Generic GET request
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.get<T>(url, config);
    return response.data;
  },

  // Generic POST request
  post: async <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response = await apiClient.post<T>(url, data, config);
    return response.data;
  },

  // Generic PUT request
  put: async <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response = await apiClient.put<T>(url, data, config);
    return response.data;
  },

  // Generic PATCH request
  patch: async <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response = await apiClient.patch<T>(url, data, config);
    return response.data;
  },

  // Generic DELETE request
  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.delete<T>(url, config);
    return response.data;
  },

  // File upload helper
  upload: async <T>(
    url: string,
    formData: FormData,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response = await apiClient.post<T>(url, formData, {
      ...config,
      headers: {
        ...config?.headers,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

export default apiClient;
