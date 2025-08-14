import { apiHelpers } from "./client";
import type {
  JobNotification,
  NotificationFilters,
  NotificationSearchParams,
  NotificationStats,
  MarkAsReadRequest,
  DeleteNotificationRequest,
  NotificationPreferences,
} from "../types/notification";

import { ApiResponse, PaginatedResponse } from "@/types/job";

// API endpoints
const NOTIFICATION_ENDPOINTS = {
  // Get Notifications
  GET_NOTIFICATIONS: "/notifications",

  // Get Notification by ID
  GET_NOTIFICATION_BY_ID: "/notifications",

  // Mark as Read/Unread
  MARK_AS_READ: "/notifications/mark-read",

  // Delete Notifications
  DELETE_NOTIFICATIONS: "/notifications/delete",

  // Get Unread Notifications
  GET_UNREAD_NOTIFICATIONS: "/notifications/unread",

  // Get Notification Stats
  GET_NOTIFICATION_STATS: "/notifications/stats",

  // Get Notifications by Job
  GET_NOTIFICATIONS_BY_JOB: "/notifications/job",

  // Update Notification Preferences
  UPDATE_NOTIFICATION_PREFERENCES: "/notifications/preferences",

  // Get Notification Preferences
  GET_NOTIFICATION_PREFERENCES: "/notifications/preferences",
} as const;

// Notifications API functions
export const notificationsAPI = {
  // Get Notifications
  getNotifications: async (
    params: NotificationSearchParams
  ): Promise<ApiResponse<PaginatedResponse<JobNotification>>> => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString());
      }
    });

    const url = `${NOTIFICATION_ENDPOINTS.GET_NOTIFICATIONS}${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    return apiHelpers.get<ApiResponse<PaginatedResponse<JobNotification>>>(url);
  },

  // Get Notification by ID
  getNotificationById: async (
    notificationId: string
  ): Promise<ApiResponse<JobNotification>> => {
    return apiHelpers.get<ApiResponse<JobNotification>>(
      `${NOTIFICATION_ENDPOINTS.GET_NOTIFICATION_BY_ID}/${notificationId}`
    );
  },

  // Mark as Read/Unread
  markAsRead: async (data: MarkAsReadRequest): Promise<ApiResponse<void>> => {
    return apiHelpers.patch<ApiResponse<void>>(
      NOTIFICATION_ENDPOINTS.MARK_AS_READ,
      data
    );
  },

  // Delete Notifications
  deleteNotifications: async (
    data: DeleteNotificationRequest
  ): Promise<ApiResponse<void>> => {
    return apiHelpers.delete<ApiResponse<void>>(
      NOTIFICATION_ENDPOINTS.DELETE_NOTIFICATIONS,
      { data }
    );
  },

  // Get Unread Notifications
  getUnreadNotifications: async (): Promise<ApiResponse<JobNotification[]>> => {
    return apiHelpers.get<ApiResponse<JobNotification[]>>(
      NOTIFICATION_ENDPOINTS.GET_UNREAD_NOTIFICATIONS
    );
  },

  // Get Notification Stats
  getNotificationStats: async (): Promise<ApiResponse<NotificationStats>> => {
    return apiHelpers.get<ApiResponse<NotificationStats>>(
      NOTIFICATION_ENDPOINTS.GET_NOTIFICATION_STATS
    );
  },

  // Get Notifications by Job
  getNotificationsByJob: async (
    jobId: string,
    params: NotificationSearchParams
  ): Promise<ApiResponse<PaginatedResponse<JobNotification>>> => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString());
      }
    });

    const url = `${NOTIFICATION_ENDPOINTS.GET_NOTIFICATIONS_BY_JOB}/${jobId}${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    return apiHelpers.get<ApiResponse<PaginatedResponse<JobNotification>>>(url);
  },

  // Update Notification Preferences
  updateNotificationPreferences: async (
    preferences: NotificationPreferences
  ): Promise<ApiResponse<void>> => {
    return apiHelpers.put<ApiResponse<void>>(
      NOTIFICATION_ENDPOINTS.UPDATE_NOTIFICATION_PREFERENCES,
      preferences
    );
  },

  // Get Notification Preferences
  getNotificationPreferences: async (): Promise<
    ApiResponse<NotificationPreferences>
  > => {
    return apiHelpers.get<ApiResponse<NotificationPreferences>>(
      NOTIFICATION_ENDPOINTS.GET_NOTIFICATION_PREFERENCES
    );
  },
};
