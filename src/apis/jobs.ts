import { apiHelpers } from "./client";
import type {
  Job,
  CreateJobRequest,
  UpdateJobRequest,
  JobSearchParams,
  PaginatedResponse,
  JobAnalytics,
  JobStatus,
  JobDashboardStats,
  JobStatistics,
  ApiResponse,
  PaginationParams,
} from "../types/job";

// API endpoints
const JOB_ENDPOINTS = {
  // Job Management (School Only)
  CREATE_JOB: "/jobs",
  GET_SCHOOL_JOBS: "/jobs/school",
  UPDATE_JOB: "/jobs",
  DELETE_JOB: "/jobs",
  UPDATE_JOB_STATUS: "/jobs",
  GET_JOB_APPLICATIONS: "/jobs",
  GET_JOB_ANALYTICS: "/jobs",
  EXPORT_JOBS: "/jobs",

  // Job Search & Viewing (Public)
  SEARCH_JOBS: "/jobs/search",
  GET_FEATURED_JOBS: "/jobs/featured",
  GET_URGENT_JOBS: "/jobs/urgent",
  GET_JOBS_BY_CATEGORY: "/jobs/category",
  GET_JOBS_BY_LOCATION: "/jobs/location",
  GET_JOB_BY_ID: "/jobs",
  GET_JOB_RECOMMENDATIONS: "/jobs/recommendations",

  // School Dashboard (School Only)
  GET_SCHOOL_DASHBOARD_STATS: "/jobs/dashboard/school",
  GET_JOB_STATISTICS: "/jobs/dashboard/stats",
  BULK_UPDATE_JOB_STATUSES: "/jobs/bulk/status",

  // Admin Job Management
  ADMIN_GET_ALL_JOBS: "/admin/jobs",
  ADMIN_GET_JOB_STATISTICS: "/admin/jobs/statistics",
  ADMIN_GET_JOB_BY_ID: "/admin/jobs",
  ADMIN_UPDATE_JOB_STATUS: "/admin/jobs",
  ADMIN_DELETE_JOB: "/admin/jobs",
  ADMIN_EXPORT_JOBS: "/admin/jobs/export",
  ADMIN_GET_JOB_APPLICATIONS: "/admin/jobs",
  ADMIN_BULK_UPDATE_JOB_STATUSES: "/admin/jobs/bulk-status",
  ADMIN_GET_JOB_ANALYTICS: "/admin/jobs/analytics",
} as const;

// Jobs API functions
export const jobsAPI = {
  // Create Job
  createJob: async (data: CreateJobRequest): Promise<ApiResponse<Job>> => {
    return apiHelpers.post<ApiResponse<Job>>(JOB_ENDPOINTS.CREATE_JOB, data);
  },

  // Get Jobs by School
  getJobsBySchool: async (
    schoolId: string,
    params: { page?: number; limit?: number }
  ): Promise<ApiResponse<PaginatedResponse<any>>> => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());

    const url = `${JOB_ENDPOINTS.GET_SCHOOL_JOBS}/${schoolId}${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    return apiHelpers.get<ApiResponse<PaginatedResponse<any>>>(url);
  },

  // Update Job
  updateJob: async (
    jobId: string,
    data: UpdateJobRequest
  ): Promise<ApiResponse<Job>> => {
    return apiHelpers.put<ApiResponse<Job>>(
      `${JOB_ENDPOINTS.UPDATE_JOB}/${jobId}`,
      data
    );
  },

  // Delete Job
  deleteJob: async (jobId: string): Promise<ApiResponse<void>> => {
    return apiHelpers.delete<ApiResponse<void>>(
      `${JOB_ENDPOINTS.DELETE_JOB}/${jobId}`
    );
  },

  // Update Job Status
  updateJobStatus: async (
    jobId: string,
    status: JobStatus,
    notes?: string
  ): Promise<ApiResponse<Job>> => {
    return apiHelpers.patch<ApiResponse<Job>>(
      `${JOB_ENDPOINTS.UPDATE_JOB_STATUS}/${jobId}/status`,
      { status, notes }
    );
  },

  // Get Job Applications
  getJobApplications: async (
    jobId: string,
    params: { status?: string; page?: number; limit?: number }
  ): Promise<ApiResponse<PaginatedResponse<any>>> => {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append("status", params.status);
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());

    const url = `${JOB_ENDPOINTS.GET_JOB_APPLICATIONS}/${jobId}/applications${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    return apiHelpers.get<ApiResponse<PaginatedResponse<any>>>(url);
  },

  // Get Job Analytics
  getJobAnalytics: async (
    jobId: string
  ): Promise<ApiResponse<JobAnalytics>> => {
    return apiHelpers.get<ApiResponse<JobAnalytics>>(
      `${JOB_ENDPOINTS.GET_JOB_ANALYTICS}/${jobId}/analytics`
    );
  },

  // Export Jobs
  exportJobs: async (jobId: string): Promise<Blob> => {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}${
        JOB_ENDPOINTS.EXPORT_JOBS
      }/${jobId}/export`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      }
    );
    return response.blob();
  },

  // Search Jobs
  searchJobs: async (
    params: JobSearchParams
  ): Promise<ApiResponse<PaginatedResponse<any>>> => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString());
      }
    });

    const url = `${JOB_ENDPOINTS.SEARCH_JOBS}${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    return apiHelpers.get<ApiResponse<PaginatedResponse<any>>>(url);
  },

  // Get Featured Jobs
  getFeaturedJobs: async (): Promise<ApiResponse<Job[]>> => {
    return apiHelpers.get<ApiResponse<Job[]>>(JOB_ENDPOINTS.GET_FEATURED_JOBS);
  },

  // Get Urgent Jobs
  getUrgentJobs: async (): Promise<ApiResponse<Job[]>> => {
    return apiHelpers.get<ApiResponse<Job[]>>(JOB_ENDPOINTS.GET_URGENT_JOBS);
  },

  // Get Jobs by Category
  getJobsByCategory: async (
    category: string,
    params: { page?: number; limit?: number }
  ): Promise<ApiResponse<PaginatedResponse<any>>> => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());

    const url = `${JOB_ENDPOINTS.GET_JOBS_BY_CATEGORY}/${category}${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    return apiHelpers.get<ApiResponse<PaginatedResponse<any>>>(url);
  },

  // Get Jobs by Location
  getJobsByLocation: async (
    country: string,
    city: string,
    params: { page?: number; limit?: number }
  ): Promise<ApiResponse<PaginatedResponse<any>>> => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());

    const url = `${JOB_ENDPOINTS.GET_JOBS_BY_LOCATION}/${country}/${city}${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    return apiHelpers.get<ApiResponse<PaginatedResponse<any>>>(url);
  },

  // Get Job by ID
  getJobById: async (jobId: string): Promise<ApiResponse<Job>> => {
    return apiHelpers.get<ApiResponse<Job>>(
      `${JOB_ENDPOINTS.GET_JOB_BY_ID}/${jobId}`
    );
  },

  // Get Job Recommendations
  getJobRecommendations: async (
    params?: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<any>>> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, value.toString());
        }
      });
    }
    const url = `${JOB_ENDPOINTS.GET_JOB_RECOMMENDATIONS}${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    return apiHelpers.get<ApiResponse<PaginatedResponse<any>>>(url);
  },

  // Get Recommended Jobs for Teacher
  getTeacherRecommendedJobs: async (
    limit: number = 5
  ): Promise<ApiResponse<Job[]>> => {
    const url = `/teacher-profiles/me/recommended-jobs?limit=${limit}`;
    return apiHelpers.get<ApiResponse<Job[]>>(url);
  },

  // Get School Dashboard Stats
  getSchoolDashboardStats: async (
    schoolId: string
  ): Promise<ApiResponse<JobDashboardStats>> => {
    return apiHelpers.get<ApiResponse<JobDashboardStats>>(
      `${JOB_ENDPOINTS.GET_SCHOOL_DASHBOARD_STATS}/${schoolId}`
    );
  },

  // Get Job Statistics
  getJobStatistics: async (): Promise<ApiResponse<JobStatistics>> => {
    return apiHelpers.get<ApiResponse<JobStatistics>>(
      JOB_ENDPOINTS.GET_JOB_STATISTICS
    );
  },

  // Bulk Update Job Statuses
  bulkUpdateJobStatuses: async (
    jobIds: string[],
    status: JobStatus,
    notes?: string
  ): Promise<ApiResponse<void>> => {
    return apiHelpers.patch<ApiResponse<void>>(
      JOB_ENDPOINTS.BULK_UPDATE_JOB_STATUSES,
      { jobIds, status, notes }
    );
  },

  // ===== ADMIN JOB MANAGEMENT APIs =====

  // Get All Jobs (Admin)
  adminGetAllJobs: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    jobType?: string;
    country?: string;
    city?: string;
    educationLevel?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<ApiResponse<PaginatedResponse<any>>> => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString());
      }
    });

    const url = `${JOB_ENDPOINTS.ADMIN_GET_ALL_JOBS}${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    return apiHelpers.get<ApiResponse<PaginatedResponse<any>>>(url);
  },

  // Get Job Statistics (Admin)
  adminGetJobStatistics: async (): Promise<
    ApiResponse<{
      totalJobs: number;
      activeJobs: number;
      pendingJobs: number;
      suspendedJobs: number;
      expiredJobs: number;
    }>
  > => {
    return apiHelpers.get<
      ApiResponse<{
        totalJobs: number;
        activeJobs: number;
        pendingJobs: number;
        suspendedJobs: number;
        expiredJobs: number;
      }>
    >(JOB_ENDPOINTS.ADMIN_GET_JOB_STATISTICS);
  },

  // Get Job by ID (Admin)
  adminGetJobById: async (jobId: string): Promise<ApiResponse<Job>> => {
    return apiHelpers.get<ApiResponse<Job>>(
      `${JOB_ENDPOINTS.ADMIN_GET_JOB_BY_ID}/${jobId}`
    );
  },

  // Update Job Status (Admin)
  adminUpdateJobStatus: async (
    jobId: string,
    status: string,
    reason?: string
  ): Promise<ApiResponse<Job>> => {
    return apiHelpers.put<ApiResponse<Job>>(
      `${JOB_ENDPOINTS.ADMIN_UPDATE_JOB_STATUS}/${jobId}/status`,
      { status, reason }
    );
  },

  // Delete Job (Admin)
  adminDeleteJob: async (
    jobId: string,
    reason?: string
  ): Promise<ApiResponse<void>> => {
    return apiHelpers.delete<ApiResponse<void>>(
      `${JOB_ENDPOINTS.ADMIN_DELETE_JOB}/${jobId}`,
      { data: { reason } }
    );
  },

  // Export Jobs (Admin)
  adminExportJobs: async (params: {
    format?: string;
    status?: string;
    jobType?: string;
    country?: string;
    city?: string;
    educationLevel?: string;
  }): Promise<Blob> => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString());
      }
    });

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}${JOB_ENDPOINTS.ADMIN_EXPORT_JOBS}${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      }
    );
    return response.blob();
  },

  // Get Job Applications (Admin)
  adminGetJobApplications: async (
    jobId: string,
    params: {
      page?: number;
      limit?: number;
      status?: string;
      sortBy?: string;
      sortOrder?: string;
    }
  ): Promise<ApiResponse<PaginatedResponse<any>>> => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString());
      }
    });

    const url = `${
      JOB_ENDPOINTS.ADMIN_GET_JOB_APPLICATIONS
    }/${jobId}/applications${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    return apiHelpers.get<ApiResponse<PaginatedResponse<any>>>(url);
  },

  // Bulk Update Job Statuses (Admin)
  adminBulkUpdateJobStatuses: async (
    jobIds: string[],
    status: string,
    reason?: string
  ): Promise<
    ApiResponse<{
      updatedCount: number;
      updatedJobs: string[];
    }>
  > => {
    return apiHelpers.put<
      ApiResponse<{
        updatedCount: number;
        updatedJobs: string[];
      }>
    >(JOB_ENDPOINTS.ADMIN_BULK_UPDATE_JOB_STATUSES, {
      jobIds,
      status,
      reason,
    });
  },

  // Get Job Analytics (Admin)
  adminGetJobAnalytics: async (params: {
    period?: string;
  }): Promise<
    ApiResponse<{
      totalJobs: number;
      jobsByType: Record<string, number>;
      jobsByCountry: Record<string, number>;
      jobsByStatus: Record<string, number>;
    }>
  > => {
    const queryParams = new URLSearchParams();
    if (params.period) queryParams.append("period", params.period);

    const url = `${JOB_ENDPOINTS.ADMIN_GET_JOB_ANALYTICS}${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    return apiHelpers.get<
      ApiResponse<{
        totalJobs: number;
        jobsByType: Record<string, number>;
        jobsByCountry: Record<string, number>;
        jobsByStatus: Record<string, number>;
      }>
    >(url);
  },
};
