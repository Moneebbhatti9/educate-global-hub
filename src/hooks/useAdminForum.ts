import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { forumAPI } from "@/apis/forum";
import { customToast } from "@/components/ui/sonner";

// Hook for fetching admin forum statistics
export const useAdminForumStats = () => {
  return useQuery({
    queryKey: ["adminForumStats"],
    queryFn: forumAPI.getAdminForumStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

// Hook for fetching admin forum discussions list
export const useAdminForumList = (params: {
  status?: string;
  category?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["adminForumList", params],
    queryFn: () => forumAPI.getAdminForumList(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  });
};

// Hook for toggling pin status
export const useTogglePinDiscussion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: forumAPI.togglePinDiscussion,
    onSuccess: (_, discussionId) => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ["adminForumList"] });
      queryClient.invalidateQueries({ queryKey: ["adminForumStats"] });

      customToast.success(
        "Pin Status Updated",
        "Discussion pin status has been updated successfully"
      );
    },
    onError: (error: Error) => {
      customToast.error(
        "Update Failed",
        error.message || "Failed to update pin status"
      );
    },
  });
};

// Hook for toggling lock status
export const useToggleLockDiscussion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: forumAPI.toggleLockDiscussion,
    onSuccess: (_, discussionId) => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ["adminForumList"] });
      queryClient.invalidateQueries({ queryKey: ["adminForumStats"] });

      customToast.success(
        "Lock Status Updated",
        "Discussion lock status has been updated successfully"
      );
    },
    onError: (error: Error) => {
      customToast.error(
        "Update Failed",
        error.message || "Failed to update lock status"
      );
    },
  });
};

// Hook for deleting discussion
export const useDeleteDiscussion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: forumAPI.deleteDiscussion,
    onSuccess: (_, discussionId) => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ["adminForumList"] });
      queryClient.invalidateQueries({ queryKey: ["adminForumStats"] });

      customToast.success(
        "Discussion Deleted",
        "Discussion has been deleted successfully"
      );
    },
    onError: (error: Error) => {
      customToast.error(
        "Delete Failed",
        error.message || "Failed to delete discussion"
      );
    },
  });
};
