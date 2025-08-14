import { apiHelpers } from "./client";
import type {
  SavedJob,
  SaveJobRequest,
  UpdateSavedJobRequest,
  SavedJobSearchParams,
  SavedJobStats,
  SavedJobAnalytics,
  ReminderRequest,
  TagRequest,
  PriorityRequest,
  NotesRequest,
} from "../types/savedJob";
import { ApiResponse, PaginatedResponse } from "@/types/job";

// API endpoints
const SAVED_JOB_ENDPOINTS = {
  // Save Job
  SAVE_JOB: "/jobs",

  // Get Saved Jobs
  GET_SAVED_JOBS: "/jobs/saved",

  // Get Saved Job by ID
  GET_SAVED_JOB_BY_ID: "/jobs/saved",

  // Update Saved Job
  UPDATE_SAVED_JOB: "/jobs/saved",

  // Remove Saved Job
  REMOVE_SAVED_JOB: "/jobs/saved",

  // Check if Job is Saved
  CHECK_JOB_SAVED: "/jobs",

  // Get Saved Job Stats
  GET_SAVED_JOB_STATS: "/jobs/saved/stats",

  // Get Jobs to Apply
  GET_JOBS_TO_APPLY: "/jobs/saved/to-apply",

  // Get Overdue Reminders
  GET_OVERDUE_REMINDERS: "/jobs/saved/overdue-reminders",

  // Set Reminder
  SET_REMINDER: "/jobs/saved",

  // Update Priority
  UPDATE_PRIORITY: "/jobs/saved",

  // Add Notes
  ADD_NOTES: "/jobs/saved",

  // Add Tags
  ADD_TAGS: "/jobs/saved",

  // Remove Tags
  REMOVE_TAGS: "/jobs/saved",

  // Get Saved Jobs by Tags
  GET_SAVED_JOBS_BY_TAGS: "/jobs/saved/by-tags",

  // Get Teacher Tags
  GET_TEACHER_TAGS: "/jobs/saved/tags",

  // Bulk Save Jobs
  BULK_SAVE_JOBS: "/jobs/saved/bulk/save",

  // Bulk Remove Saved Jobs
  BULK_REMOVE_SAVED_JOBS: "/jobs/saved/bulk/remove",

  // Mark as Applied
  MARK_AS_APPLIED: "/jobs/saved",

  // Get Saved Job Analytics
  GET_SAVED_JOB_ANALYTICS: "/jobs/saved/analytics",

  // Export Saved Jobs
  EXPORT_SAVED_JOBS: "/jobs/saved/export",
} as const;

// Saved Jobs API functions
export const savedJobsAPI = {
  // Save Job
  saveJob: async (
    jobId: string,
    data: SaveJobRequest
  ): Promise<ApiResponse<SavedJob>> => {
    return apiHelpers.post<ApiResponse<SavedJob>>(
      `${SAVED_JOB_ENDPOINTS.SAVE_JOB}/${jobId}/save`,
      data
    );
  },

  // Get Saved Jobs
  getSavedJobs: async (
    params: SavedJobSearchParams
  ): Promise<ApiResponse<PaginatedResponse<SavedJob>>> => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (Array.isArray(value)) {
          value.forEach((v) => queryParams.append(key, v));
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });

    const url = `${SAVED_JOB_ENDPOINTS.GET_SAVED_JOBS}${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    return apiHelpers.get<ApiResponse<PaginatedResponse<SavedJob>>>(url);
  },

  // Get Saved Job by ID
  getSavedJobById: async (
    savedJobId: string
  ): Promise<ApiResponse<SavedJob>> => {
    return apiHelpers.get<ApiResponse<SavedJob>>(
      `${SAVED_JOB_ENDPOINTS.GET_SAVED_JOB_BY_ID}/${savedJobId}`
    );
  },

  // Update Saved Job
  updateSavedJob: async (
    savedJobId: string,
    data: UpdateSavedJobRequest
  ): Promise<ApiResponse<SavedJob>> => {
    return apiHelpers.put<ApiResponse<SavedJob>>(
      `${SAVED_JOB_ENDPOINTS.UPDATE_SAVED_JOB}/${savedJobId}`,
      data
    );
  },

  // Remove Saved Job
  removeSavedJob: async (savedJobId: string): Promise<ApiResponse<void>> => {
    return apiHelpers.delete<ApiResponse<void>>(
      `${SAVED_JOB_ENDPOINTS.REMOVE_SAVED_JOB}/${savedJobId}`
    );
  },

  // Check if Job is Saved
  isJobSaved: async (
    jobId: string
  ): Promise<ApiResponse<{ isSaved: boolean }>> => {
    return apiHelpers.get<ApiResponse<{ isSaved: boolean }>>(
      `${SAVED_JOB_ENDPOINTS.CHECK_JOB_SAVED}/${jobId}/saved`
    );
  },

  // Get Saved Job Stats
  getSavedJobStats: async (): Promise<ApiResponse<SavedJobStats>> => {
    return apiHelpers.get<ApiResponse<SavedJobStats>>(
      SAVED_JOB_ENDPOINTS.GET_SAVED_JOB_STATS
    );
  },

  // Get Jobs to Apply
  getJobsToApply: async (limit?: number): Promise<ApiResponse<SavedJob[]>> => {
    const queryParams = new URLSearchParams();
    if (limit) queryParams.append("limit", limit.toString());

    const url = `${SAVED_JOB_ENDPOINTS.GET_JOBS_TO_APPLY}${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    return apiHelpers.get<ApiResponse<SavedJob[]>>(url);
  },

  // Get Overdue Reminders
  getOverdueReminders: async (): Promise<ApiResponse<SavedJob[]>> => {
    return apiHelpers.get<ApiResponse<SavedJob[]>>(
      SAVED_JOB_ENDPOINTS.GET_OVERDUE_REMINDERS
    );
  },

  // Set Reminder
  setReminder: async (
    savedJobId: string,
    data: ReminderRequest
  ): Promise<ApiResponse<SavedJob>> => {
    return apiHelpers.post<ApiResponse<SavedJob>>(
      `${SAVED_JOB_ENDPOINTS.SET_REMINDER}/${savedJobId}/reminder`,
      data
    );
  },

  // Update Priority
  updatePriority: async (
    savedJobId: string,
    data: PriorityRequest
  ): Promise<ApiResponse<SavedJob>> => {
    return apiHelpers.patch<ApiResponse<SavedJob>>(
      `${SAVED_JOB_ENDPOINTS.UPDATE_PRIORITY}/${savedJobId}/priority`,
      data
    );
  },

  // Add Notes
  addNotes: async (
    savedJobId: string,
    data: NotesRequest
  ): Promise<ApiResponse<SavedJob>> => {
    return apiHelpers.post<ApiResponse<SavedJob>>(
      `${SAVED_JOB_ENDPOINTS.ADD_NOTES}/${savedJobId}/notes`,
      data
    );
  },

  // Add Tags
  addTags: async (
    savedJobId: string,
    data: TagRequest
  ): Promise<ApiResponse<SavedJob>> => {
    return apiHelpers.post<ApiResponse<SavedJob>>(
      `${SAVED_JOB_ENDPOINTS.ADD_TAGS}/${savedJobId}/tags`,
      data
    );
  },

  // Remove Tags
  removeTags: async (
    savedJobId: string,
    data: TagRequest
  ): Promise<ApiResponse<void>> => {
    return apiHelpers.delete<ApiResponse<void>>(
      `${SAVED_JOB_ENDPOINTS.REMOVE_TAGS}/${savedJobId}/tags`,
      { data }
    );
  },

  // Get Saved Jobs by Tags
  getSavedJobsByTags: async (
    tags: string[],
    params: { page?: number; limit?: number }
  ): Promise<ApiResponse<PaginatedResponse<SavedJob>>> => {
    const queryParams = new URLSearchParams();
    tags.forEach((tag) => queryParams.append("tags", tag));
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());

    const url = `${SAVED_JOB_ENDPOINTS.GET_SAVED_JOBS_BY_TAGS}${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    return apiHelpers.get<ApiResponse<PaginatedResponse<SavedJob>>>(url);
  },

  // Get Teacher Tags
  getTeacherTags: async (): Promise<ApiResponse<string[]>> => {
    return apiHelpers.get<ApiResponse<string[]>>(
      SAVED_JOB_ENDPOINTS.GET_TEACHER_TAGS
    );
  },

  // Bulk Save Jobs
  bulkSaveJobs: async (jobIds: string[]): Promise<ApiResponse<void>> => {
    return apiHelpers.post<ApiResponse<void>>(
      SAVED_JOB_ENDPOINTS.BULK_SAVE_JOBS,
      { jobIds }
    );
  },

  // Bulk Remove Saved Jobs
  bulkRemoveSavedJobs: async (
    savedJobIds: string[]
  ): Promise<ApiResponse<void>> => {
    return apiHelpers.delete<ApiResponse<void>>(
      SAVED_JOB_ENDPOINTS.BULK_REMOVE_SAVED_JOBS,
      { data: { savedJobIds } }
    );
  },

  // Mark as Applied
  markAsApplied: async (savedJobId: string): Promise<ApiResponse<SavedJob>> => {
    return apiHelpers.patch<ApiResponse<SavedJob>>(
      `${SAVED_JOB_ENDPOINTS.MARK_AS_APPLIED}/${savedJobId}/applied`
    );
  },

  // Get Saved Job Analytics
  getSavedJobAnalytics: async (): Promise<ApiResponse<SavedJobAnalytics>> => {
    return apiHelpers.get<ApiResponse<SavedJobAnalytics>>(
      SAVED_JOB_ENDPOINTS.GET_SAVED_JOB_ANALYTICS
    );
  },

  // Export Saved Jobs
  exportSavedJobs: async (): Promise<Blob> => {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}${
        SAVED_JOB_ENDPOINTS.EXPORT_SAVED_JOBS
      }`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      }
    );
    return response.blob();
  },
};
