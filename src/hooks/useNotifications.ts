import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationsAPI } from "../apis/notifications";
import { notificationQueryKeys } from "../lib/queryKeys";
import type {
  NotificationSearchParams,
  MarkAsReadRequest,
  DeleteNotificationRequest,
  NotificationPreferences,
} from "../types/notification";

// Query hooks
export const useNotifications = (params: NotificationSearchParams) => {
  return useQuery({
    queryKey: notificationQueryKeys.list(params),
    queryFn: () => notificationsAPI.getNotifications(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useNotification = (notificationId: string) => {
  return useQuery({
    queryKey: notificationQueryKeys.detail(notificationId),
    queryFn: () => notificationsAPI.getNotificationById(notificationId),
    enabled: !!notificationId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUnreadNotifications = () => {
  return useQuery({
    queryKey: notificationQueryKeys.unread(),
    queryFn: () => notificationsAPI.getUnreadNotifications(),
    staleTime: 2 * 60 * 1000, // 2 minutes for real-time updates
  });
};

export const useNotificationStats = () => {
  return useQuery({
    queryKey: notificationQueryKeys.stats(),
    queryFn: () => notificationsAPI.getNotificationStats(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useNotificationsByJob = (
  jobId: string,
  params: NotificationSearchParams
) => {
  return useQuery({
    queryKey: notificationQueryKeys.byJob(jobId),
    queryFn: () => notificationsAPI.getNotificationsByJob(jobId, params),
    enabled: !!jobId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useNotificationPreferences = () => {
  return useQuery({
    queryKey: ["notifications", "preferences"],
    queryFn: () => notificationsAPI.getNotificationPreferences(),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

// Mutation hooks
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MarkAsReadRequest) => notificationsAPI.markAsRead(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationQueryKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: notificationQueryKeys.unread(),
      });
      queryClient.invalidateQueries({
        queryKey: notificationQueryKeys.stats(),
      });
    },
  });
};

export const useDeleteNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DeleteNotificationRequest) =>
      notificationsAPI.deleteNotifications(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationQueryKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: notificationQueryKeys.unread(),
      });
      queryClient.invalidateQueries({
        queryKey: notificationQueryKeys.stats(),
      });
    },
  });
};

export const useUpdateNotificationPreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (preferences: NotificationPreferences) =>
      notificationsAPI.updateNotificationPreferences(preferences),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications", "preferences"],
      });
    },
  });
};

// Utility hooks
export const useMarkSingleAsRead = () => {
  const markAsRead = useMarkAsRead();

  return {
    ...markAsRead,
    markAsRead: (notificationId: string, isRead: boolean = true) =>
      markAsRead.mutate({ notificationIds: [notificationId], isRead }),
  };
};

export const useMarkAllAsRead = () => {
  const markAsRead = useMarkAsRead();

  return {
    ...markAsRead,
    markAllAsRead: (notificationIds: string[]) =>
      markAsRead.mutate({ notificationIds, isRead: true }),
  };
};

export const useDeleteSingleNotification = () => {
  const deleteNotifications = useDeleteNotifications();

  return {
    ...deleteNotifications,
    deleteNotification: (notificationId: string) =>
      deleteNotifications.mutate({ notificationIds: [notificationId] }),
  };
};
