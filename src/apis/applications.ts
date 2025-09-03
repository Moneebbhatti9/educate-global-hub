import { apiHelpers } from "./client";
import type {
  JobApplication,
  CreateApplicationRequest,
  UpdateApplicationStatusRequest,
  ApplicationSearchParams,
  ApplicationStats,
  ApplicationTimeline,
  InterviewScheduleRequest,
  ApplicationRejectionRequest,
  ApplicationAcceptanceRequest,
  ApplicationShortlistRequest,
  ApplicationReviewRequest,
  SchoolDashboardCardsResponse,
  TeacherDashboardCardsResponse,
} from "../types/application";
import { ApiResponse, PaginatedResponse } from "@/types/job";

// API endpoints
const APPLICATION_ENDPOINTS = {
  // Submit Application
  SUBMIT_APPLICATION: "/jobs",

  // Get Application by ID
  GET_APPLICATION_BY_ID: "/jobs/applications",

  // Update Application Status
  UPDATE_APPLICATION_STATUS: "/jobs/applications",

  // Withdraw Application
  WITHDRAW_APPLICATION: "/jobs/applications",

  // Get Applications by Job
  GET_APPLICATIONS_BY_JOB: "/jobs",

  // Get All School Applications
  GET_ALL_SCHOOL_APPLICATIONS: "/jobs/applications/school/all",

  // Get Applications by Teacher
  GET_APPLICATIONS_BY_TEACHER: "/jobs/applications/teacher/me",

  // Get School Card
  GET_SCHOOLDASHBOARD_CARDS: "/schoolDashboard/dashboardCards",

  // Get Teaceher Card
  GET_TEACHERDASHBOARD_CARDS: "/teacherDashboard/dashboardCards",

  // Get Recent Applications
  GET_RECENT_APPLICATIONS: "/jobs/applications/recent",

  // Get Overdue Applications
  GET_OVERDUE_APPLICATIONS: "/jobs/applications/overdue",

  // Bulk Update Application Statuses
  BULK_UPDATE_APPLICATION_STATUSES: "/jobs/applications/bulk/status",

  // Schedule Interview
  SCHEDULE_INTERVIEW: "/jobs/applications",

  // Accept Application
  ACCEPT_APPLICATION: "/jobs/applications",

  // Reject Application
  REJECT_APPLICATION: "/jobs/applications",

  // Shortlist Application
  SHORTLIST_APPLICATION: "/jobs/applications",

  // Move to Reviewing
  MOVE_TO_REVIEWING: "/jobs/applications",

  // Get Application Timeline
  GET_APPLICATION_TIMELINE: "/jobs/applications",

  // Export Applications
  EXPORT_APPLICATIONS: "/jobs/applications",

  GET_MY_APPLICATIONS: "/jobs/applications/my-applications",
} as const;

// Applications API functions
export const applicationsAPI = {
  // Submit Application
  submitApplication: async (
    jobId: string,
    data: CreateApplicationRequest
  ): Promise<ApiResponse<JobApplication>> => {
    return apiHelpers.post<ApiResponse<JobApplication>>(
      `${APPLICATION_ENDPOINTS.SUBMIT_APPLICATION}/${jobId}/apply`,
      data
    );
  },

  // Get Application by ID
  getApplicationById: async (
    applicationId: string
  ): Promise<ApiResponse<JobApplication>> => {
    return apiHelpers.get<ApiResponse<JobApplication>>(
      `${APPLICATION_ENDPOINTS.GET_APPLICATION_BY_ID}/${applicationId}`
    );
  },

  // Update Application Status
  updateApplicationStatus: async (
    applicationId: string,
    data: UpdateApplicationStatusRequest
  ): Promise<ApiResponse<JobApplication>> => {
    return apiHelpers.patch<ApiResponse<JobApplication>>(
      `${APPLICATION_ENDPOINTS.UPDATE_APPLICATION_STATUS}/${applicationId}/status`,
      data
    );
  },

  // Withdraw Application
  withdrawApplication: async (
    applicationId: string,
    reason?: string
  ): Promise<ApiResponse<void>> => {
    return apiHelpers.post<ApiResponse<void>>(
      `${APPLICATION_ENDPOINTS.WITHDRAW_APPLICATION}/${applicationId}/withdraw`,
      { reason }
    );
  },

  // Get Applications by Job
  getApplicationsByJob: async (
    jobId: string,
    params: ApplicationSearchParams
  ): Promise<ApiResponse<PaginatedResponse<JobApplication>>> => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString());
      }
    });

    const url = `${
      APPLICATION_ENDPOINTS.GET_APPLICATIONS_BY_JOB
    }/${jobId}/applications${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    return apiHelpers.get<ApiResponse<PaginatedResponse<JobApplication>>>(url);
  },

  // Fetch All Candidates
  getAllSchoolApplications: async (params: {
    querySearch?: string;
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<ApiResponse<PaginatedResponse<JobApplication>>> => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString());
      }
    });

    const url = `${APPLICATION_ENDPOINTS.GET_ALL_SCHOOL_APPLICATIONS}${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    return apiHelpers.get<ApiResponse<PaginatedResponse<JobApplication>>>(url);
  },

  // Get Applications by Teacher
  getApplicationsByTeacher: async (
    teacherId: string,
    params: ApplicationSearchParams
  ): Promise<ApiResponse<PaginatedResponse<JobApplication>>> => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString());
      }
    });

    const url = `${
      APPLICATION_ENDPOINTS.GET_APPLICATIONS_BY_TEACHER
    }/${teacherId}${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    return apiHelpers.get<ApiResponse<PaginatedResponse<JobApplication>>>(url);
  },

  // Get Applications for Current Teacher
  getCurrentTeacherApplications: async (
    params: ApplicationSearchParams
  ): Promise<ApiResponse<PaginatedResponse<JobApplication>>> => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString());
      }
    });

    const url = `${APPLICATION_ENDPOINTS.GET_APPLICATIONS_BY_TEACHER}${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    return apiHelpers.get<ApiResponse<PaginatedResponse<JobApplication>>>(url);
  },

  // Get Application Stats
  // getApplicationStats: async (): Promise<ApiResponse<ApplicationStats>> => {
  //   return apiHelpers.get<ApiResponse<ApplicationStats>>(
  //     APPLICATION_ENDPOINTS.GET_APPLICATION_STATS
  //   );
  // },

  getSchoolDashboardCardsData: async (): Promise<
    ApiResponse<SchoolDashboardCardsResponse>
  > => {
    return apiHelpers.get<ApiResponse<SchoolDashboardCardsResponse>>(
      APPLICATION_ENDPOINTS.GET_SCHOOLDASHBOARD_CARDS
    );
  },

  getTeacherDashboardCardsData: async (): Promise<
    ApiResponse<TeacherDashboardCardsResponse>
  > => {
    return apiHelpers.get<ApiResponse<TeacherDashboardCardsResponse>>(
      APPLICATION_ENDPOINTS.GET_TEACHERDASHBOARD_CARDS
    );
  },

  // Get Recent Applications
  getRecentApplications: async (): Promise<ApiResponse<JobApplication[]>> => {
    return apiHelpers.get<ApiResponse<JobApplication[]>>(
      APPLICATION_ENDPOINTS.GET_RECENT_APPLICATIONS
    );
  },

  getMyApplications: async (): Promise<ApiResponse<JobApplication[]>> => {
    return apiHelpers.get<ApiResponse<JobApplication[]>>(
      APPLICATION_ENDPOINTS.GET_MY_APPLICATIONS
    );
  },

  // Get Overdue Applications
  getOverdueApplications: async (): Promise<ApiResponse<JobApplication[]>> => {
    return apiHelpers.get<ApiResponse<JobApplication[]>>(
      APPLICATION_ENDPOINTS.GET_OVERDUE_APPLICATIONS
    );
  },

  // Bulk Update Application Statuses
  bulkUpdateApplicationStatuses: async (
    applicationIds: string[],
    status: string,
    notes?: string
  ): Promise<ApiResponse<void>> => {
    return apiHelpers.patch<ApiResponse<void>>(
      APPLICATION_ENDPOINTS.BULK_UPDATE_APPLICATION_STATUSES,
      { applicationIds, status, notes }
    );
  },

  // Schedule Interview
  scheduleInterview: async (
    applicationId: string,
    data: InterviewScheduleRequest
  ): Promise<ApiResponse<JobApplication>> => {
    return apiHelpers.post<ApiResponse<JobApplication>>(
      `${APPLICATION_ENDPOINTS.SCHEDULE_INTERVIEW}/${applicationId}/interview`,
      data
    );
  },

  // Accept Application
  acceptApplication: async (
    applicationId: string,
    data: ApplicationAcceptanceRequest
  ): Promise<ApiResponse<JobApplication>> => {
    return apiHelpers.post<ApiResponse<JobApplication>>(
      `${APPLICATION_ENDPOINTS.ACCEPT_APPLICATION}/${applicationId}/accept`,
      data
    );
  },

  // Reject Application
  rejectApplication: async (
    applicationId: string,
    data: ApplicationRejectionRequest
  ): Promise<ApiResponse<JobApplication>> => {
    return apiHelpers.post<ApiResponse<JobApplication>>(
      `${APPLICATION_ENDPOINTS.REJECT_APPLICATION}/${applicationId}/reject`,
      data
    );
  },

  // Shortlist Application
  shortlistApplication: async (
    applicationId: string,
    data: ApplicationShortlistRequest
  ): Promise<ApiResponse<JobApplication>> => {
    return apiHelpers.post<ApiResponse<JobApplication>>(
      `${APPLICATION_ENDPOINTS.SHORTLIST_APPLICATION}/${applicationId}/shortlist`,
      data
    );
  },

  // Move to Reviewing
  moveToReviewing: async (
    applicationId: string,
    data: ApplicationReviewRequest
  ): Promise<ApiResponse<JobApplication>> => {
    return apiHelpers.post<ApiResponse<JobApplication>>(
      `${APPLICATION_ENDPOINTS.MOVE_TO_REVIEWING}/${applicationId}/reviewing`,
      data
    );
  },

  // Get Application Timeline
  getApplicationTimeline: async (
    applicationId: string
  ): Promise<ApiResponse<ApplicationTimeline[]>> => {
    return apiHelpers.get<ApiResponse<ApplicationTimeline[]>>(
      `${APPLICATION_ENDPOINTS.GET_APPLICATION_TIMELINE}/${applicationId}/timeline`
    );
  },

  // Export Applications
  exportApplications: async (jobId: string): Promise<Blob> => {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}${
        APPLICATION_ENDPOINTS.EXPORT_APPLICATIONS
      }/${jobId}/export`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      }
    );
    return response.blob();
  },
};
