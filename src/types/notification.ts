import type {
  BaseEntity,
  NotificationType,
  NotificationCategory,
  NotificationPriority,
} from "./job";

export interface JobNotification extends BaseEntity {
  userId: string;
  jobId?: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  category: NotificationCategory;
  isRead: boolean;
  readAt?: string;
  isEmailSent: boolean;
  emailSentAt?: string;
  isPushSent: boolean;
  pushSentAt?: string;
  actionRequired: boolean;
  actionUrl?: string;
  actionText?: string;
  metadata: Record<string, any>;
  expiresAt?: string;
  tags: string[];
}

export interface NotificationFilters {
  type?: NotificationType;
  category?: NotificationCategory;
  isRead?: boolean;
  priority?: NotificationPriority;
}

export interface NotificationSearchParams {
  page?: number;
  limit?: number;
  type?: NotificationType;
  category?: NotificationCategory;
  isRead?: boolean;
  priority?: NotificationPriority;
  sortBy?: "date" | "priority" | "read";
  sortOrder?: "asc" | "desc";
}

export interface NotificationStats {
  totalNotifications: number;
  unreadCount: number;
  urgentCount: number;
  categoryBreakdown: Record<NotificationCategory, number>;
  priorityBreakdown: Record<NotificationPriority, number>;
}

export interface MarkAsReadRequest {
  notificationIds: string[];
  isRead: boolean;
}

export interface DeleteNotificationRequest {
  notificationIds: string[];
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  categories: {
    job: boolean;
    application: boolean;
    reminder: boolean;
    system: boolean;
    recommendation: boolean;
  };
  frequency: "immediate" | "daily" | "weekly";
}
