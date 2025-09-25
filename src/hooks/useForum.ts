import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useSocket } from "./useSocket";
import { forumAPI } from "../apis/forum";
import {
  Discussion,
  Reply,
  TrendingTopic,
  CategoryStats,
  CommunityOverview,
  CreateDiscussionData,
  CreateReplyData,
  DiscussionFeedParams,
} from "../types/forum";
import {
  transformDiscussion,
  transformReply,
  transformTrendingTopic,
  transformCategoryStats,
  transformCommunityOverview,
  validateDiscussionData,
  validateReplyData,
} from "../utils/forumTransformers";

export const useForum = () => {
  const { user } = useAuth();
  const { socket, on, off } = useSocket();
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
  const [communityOverview, setCommunityOverview] =
    useState<CommunityOverview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper: check if discussion already exists
  const discussionExists = useCallback(
    (id: string) => discussions.some((d) => d._id === id),
    [discussions]
  );

  // Helper: refresh sidebar data (trending, categories, overview)
  const refreshSidebarData = useCallback(async () => {
    try {
      const [trending, categories, overview] = await Promise.all([
        forumAPI.getTrendingTopics(5),
        forumAPI.getCategoryStats(),
        forumAPI.getCommunityOverview(),
      ]);
      setTrendingTopics(trending.map(transformTrendingTopic));
      setCategoryStats(categories.map(transformCategoryStats));
      setCommunityOverview(transformCommunityOverview(overview));
    } catch (err) {
      // Non-blocking; log only
      console.warn("Failed to refresh sidebar data:", err);
    }
  }, []);

  // Set up real-time listeners
  useEffect(() => {
    if (socket) {
      // Listen for new discussions
      const handleNewDiscussion = (...args: any[]) => {
        const discussion = args[0] as any;
        const transformed = transformDiscussion(discussion);
        setDiscussions((prev) => {
          if (prev.some((d) => d._id === transformed._id)) return prev;
          return [transformed, ...prev];
        });
        // Refresh sidebar aggregates on new discussion
        refreshSidebarData();
      };

      // Listen for new replies
      const handleNewReply = (...args: any[]) => {
        const reply = args[0] as any;
        const transformed = transformReply(reply);
        // Update discussion reply count
        setDiscussions((prev) =>
          prev.map((discussion) =>
            discussion._id === transformed.discussion
              ? { ...discussion, replyCount: (discussion.replyCount || 0) + 1 }
              : discussion
          )
        );
      };

      // Listen for discussion updates (likes, etc.)
      const handleDiscussionUpdate = (...args: any[]) => {
        const data = args[0] as { discussionId: string; updates: Partial<Discussion> };
        setDiscussions((prev) =>
          prev.map((discussion) =>
            discussion._id === data.discussionId
              ? { ...discussion, ...data.updates }
              : discussion
          )
        );
      };

      on("newDiscussion", handleNewDiscussion);
      on("newReply", handleNewReply);
      on("discussionUpdate", handleDiscussionUpdate);

      return () => {
        off("newDiscussion", handleNewDiscussion);
        off("newReply", handleNewReply);
        off("discussionUpdate", handleDiscussionUpdate);
      };
    }
  }, [socket, on, off]);

  // Load initial data (trending topics, categories, community stats)
  const loadInitialData = useCallback(async () => {
    try {
      const [trending, categories, overview] = await Promise.all([
        forumAPI.getTrendingTopics(5),
        forumAPI.getCategoryStats(),
        forumAPI.getCommunityOverview(),
      ]);

      setTrendingTopics(trending.map(transformTrendingTopic));
      setCategoryStats(categories.map(transformCategoryStats));
      setCommunityOverview(transformCommunityOverview(overview));
    } catch (err) {
      console.error("Failed to load initial forum data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load forum data"
      );
    }
  }, []);

  // Load discussions based on parameters
  const loadDiscussions = useCallback(async (params: DiscussionFeedParams) => {
    try {
      setLoading(true);
      setError(null);

      const response = await forumAPI.getDiscussionFeed(params);
      const transformedDiscussions = response.data.map(transformDiscussion);
      setDiscussions(transformedDiscussions);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load discussions"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new discussion
  const createDiscussion = useCallback(async (data: CreateDiscussionData) => {
    try {
      setError(null);

      // Validate data
      const validation = validateDiscussionData(data);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(", "));
      }

      const newDiscussion = await forumAPI.createDiscussion(data);
      const transformed = transformDiscussion(newDiscussion);

      // Add to the beginning of discussions list, avoiding duplicates
      setDiscussions((prev) => {
        if (prev.some((d) => d._id === transformed._id)) return prev;
        return [transformed, ...prev];
      });

      // Refresh sidebar aggregates after creation
      refreshSidebarData();

      return transformed;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create discussion";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [refreshSidebarData]);

  // Toggle like on discussion
  const toggleLikeDiscussion = useCallback(
    async (discussionId: string) => {
      if (!user) {
        throw new Error("You must be logged in to like discussions");
      }

      try {
        await forumAPI.toggleLikeDiscussion(discussionId);

        // Update local state optimistically
        setDiscussions((prev) =>
          prev.map((discussion) =>
            discussion._id === discussionId
              ? {
                  ...discussion,
                  likes: discussion.likes.includes((user as any)?._id || (user as any)?.id)
                    ? discussion.likes.filter((id) => id !== ((user as any)?._id || (user as any)?.id))
                    : [...discussion.likes, ((user as any)?._id || (user as any)?.id)],
                }
              : discussion
          )
        );
      } catch (err) {
        console.error("Failed to toggle like:", err);
        throw err;
      }
    },
    [user]
  );

  // Report discussion
  const reportDiscussion = useCallback(
    async (discussionId: string, reason: string) => {
      try {
        await forumAPI.reportDiscussion(discussionId, reason);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to report discussion";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    []
  );

  // Search discussions
  const searchDiscussions = useCallback(
    async (query: string, page = 1, limit = 10) => {
      try {
        setLoading(true);
        setError(null);

        const response = await forumAPI.searchDiscussions(query, page, limit);
        const transformedDiscussions = response.data.map(transformDiscussion);
        setDiscussions(transformedDiscussions);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to search discussions"
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    discussions,
    trendingTopics,
    categoryStats,
    communityOverview,
    loading,
    error,

    // Actions
    loadInitialData,
    loadDiscussions,
    createDiscussion,
    toggleLikeDiscussion,
    reportDiscussion,
    searchDiscussions,
    clearError,
  };
};

export const useForumDetail = (discussionId: string) => {
  const { user } = useAuth();
  const { socket, on, off } = useSocket();
  const [discussion, setDiscussion] = useState<Discussion | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittingReply, setSubmittingReply] = useState(false);

  // Set up real-time listeners for this specific discussion
  useEffect(() => {
    if (socket && discussionId) {
      // Listen for new replies to this discussion
      const handleNewReply = (...args: any[]) => {
        const reply = args[0] as any;
        const transformed = transformReply(reply);
        if (transformed.discussion === discussionId) {
          setReplies((prev) => [...prev, transformed]);
          // Update discussion reply count
          setDiscussion((prev) =>
            prev ? { ...prev, replyCount: (prev.replyCount || 0) + 1 } : null
          );
        }
      };

      // Listen for reply updates (likes, etc.)
      const handleReplyUpdate = (...args: any[]) => {
        const data = args[0] as { replyId: string; updates: Partial<Reply> };
        setReplies((prev) =>
          prev.map((reply) =>
            reply._id === data.replyId ? { ...reply, ...data.updates } : reply
          )
        );
      };

      // Listen for discussion updates
      const handleDiscussionUpdate = (...args: any[]) => {
        const data = args[0] as { discussionId: string; updates: Partial<Discussion> };
        if (data.discussionId === discussionId) {
          setDiscussion((prev) => (prev ? { ...prev, ...data.updates } : null));
        }
      };

      on("newReply", handleNewReply);
      on("replyUpdate", handleReplyUpdate);
      on("discussionUpdate", handleDiscussionUpdate);

      return () => {
        off("newReply", handleNewReply);
        off("replyUpdate", handleReplyUpdate);
        off("discussionUpdate", handleDiscussionUpdate);
      };
    }
  }, [socket, discussionId, on, off]);

  // Load discussion and replies
  const loadDiscussion = useCallback(
    async (page = 1, limit = 10) => {
      try {
        setLoading(true);
        setError(null);

        const response = await forumAPI.getDiscussionById(
          discussionId,
          page,
          limit
        );
        setDiscussion(transformDiscussion(response.discussion));
        setReplies(response.replies.map(transformReply));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load discussion"
        );
      } finally {
        setLoading(false);
      }
    },
    [discussionId]
  );

  // Post reply
  const postReply = useCallback(
    async (data: CreateReplyData) => {
      if (!user) {
        throw new Error("You must be logged in to post replies");
      }

      try {
        setSubmittingReply(true);
        setError(null);

        // Validate reply data
        const validation = validateReplyData(data.content);
        if (!validation.isValid) {
          throw new Error(validation.errors.join(", "));
        }

        const newReply = await forumAPI.postReply(data);
        const transformed = transformReply(newReply);

        setReplies((prev) => [...prev, transformed]);
        return transformed;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to post reply";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setSubmittingReply(false);
      }
    },
    [user]
  );

  // Toggle like on reply
  const toggleLikeReply = useCallback(
    async (replyId: string) => {
      if (!user) {
        throw new Error("You must be logged in to like replies");
      }

      try {
        await forumAPI.toggleLikeReply(replyId);

        // Update local state optimistically
        setReplies((prev) =>
          prev.map((reply) =>
            reply._id === replyId
              ? {
                  ...reply,
                  likes: reply.likes.includes((user as any)?._id || (user as any)?.id)
                    ? reply.likes.filter((id) => id !== ((user as any)?._id || (user as any)?.id))
                    : [...reply.likes, ((user as any)?._id || (user as any)?.id)],
                }
              : reply
          )
        );
      } catch (err) {
        console.error("Failed to toggle like:", err);
        throw err;
      }
    },
    [user]
  );

  // Load more replies
  const loadMoreReplies = useCallback(
    async (page: number, limit = 10) => {
      try {
        const response = await forumAPI.getRepliesForDiscussion(
          discussionId,
          page,
          limit
        );
        const newReplies = response.replies.map(transformReply);
        setReplies((prev) => [...prev, ...newReplies]);
        return response.pagination;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load more replies"
        );
        throw err;
      }
    },
    [discussionId]
  );

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    discussion,
    replies,
    loading,
    error,
    submittingReply,

    // Actions
    loadDiscussion,
    postReply,
    toggleLikeReply,
    loadMoreReplies,
    clearError,
  };
};
