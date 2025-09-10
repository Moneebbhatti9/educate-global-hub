import { apiHelpers } from "./client";
import {
  Discussion,
  Reply,
  DiscussionFeedResponse,
  DiscussionDetailResponse,
  CreateDiscussionData,
  CreateReplyData,
  LikeResponse,
  TrendingTopic,
  CategoryStats,
  CommunityOverview,
  DiscussionFeedParams,
  ReplyListResponse,
  ApiResponse,
} from "../types/forum";

// Forum API endpoints
export const forumAPI = {
  // Discussion endpoints
  getDiscussionFeed: async (
    params: DiscussionFeedParams
  ): Promise<DiscussionFeedResponse> => {
    const queryString = new URLSearchParams();

    if (params.tab) queryString.append("tab", params.tab);
    if (params.page) queryString.append("page", params.page.toString());
    if (params.limit) queryString.append("limit", params.limit.toString());
    if (params.search) queryString.append("search", params.search);
    if (params.category) queryString.append("category", params.category);

    const response = await apiHelpers.get<ApiResponse<DiscussionFeedResponse>>(
      `/discussion/feed?${queryString.toString()}`
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to fetch discussions");
    }

    return response.data;
  },

  getDiscussionById: async (
    id: string,
    page = 1,
    limit = 10
  ): Promise<DiscussionDetailResponse> => {
    const response = await apiHelpers.get<
      ApiResponse<DiscussionDetailResponse>
    >(`/discussion/get-specific-discussion/${id}?page=${page}&limit=${limit}`);

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to fetch discussion");
    }

    return response.data;
  },

  createDiscussion: async (data: CreateDiscussionData): Promise<Discussion> => {
    const response = await apiHelpers.post<ApiResponse<Discussion>>(
      "/discussion/create-discussion",
      data
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to create discussion");
    }

    return response.data;
  },

  toggleLikeDiscussion: async (id: string): Promise<LikeResponse> => {
    const response = await apiHelpers.post<ApiResponse<LikeResponse>>(
      `/discussion/${id}/like`
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to toggle like");
    }

    return response.data;
  },

  reportDiscussion: async (id: string, reason: string): Promise<void> => {
    const response = await apiHelpers.post<ApiResponse<void>>(
      `/discussion/${id}/report`,
      { reason }
    );

    if (!response.success) {
      throw new Error(response.message || "Failed to report discussion");
    }
  },

  getTrendingTopics: async (limit = 5): Promise<TrendingTopic[]> => {
    const response = await apiHelpers.get<ApiResponse<TrendingTopic[]>>(
      `/discussion/trending?limit=${limit}`
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to fetch trending topics");
    }

    return response.data;
  },

  getRelatedDiscussions: async (id: string): Promise<Discussion[]> => {
    const response = await apiHelpers.get<ApiResponse<Discussion[]>>(
      `/discussion/${id}/related`
    );

    if (!response.success || !response.data) {
      throw new Error(
        response.message || "Failed to fetch related discussions"
      );
    }

    return response.data;
  },

  getCategoryStats: async (): Promise<CategoryStats[]> => {
    const response = await apiHelpers.get<ApiResponse<CategoryStats[]>>(
      "/discussion/categories/stats"
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to fetch category stats");
    }

    return response.data;
  },

  getCommunityOverview: async (): Promise<CommunityOverview> => {
    const response = await apiHelpers.get<ApiResponse<CommunityOverview>>(
      "/discussion/community/overview"
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to fetch community overview");
    }

    return response.data;
  },

  getDiscussionStats: async (): Promise<{
    totalDiscussions: number;
    totalReplies: number;
  }> => {
    const response = await apiHelpers.get<
      ApiResponse<{ totalDiscussions: number; totalReplies: number }>
    >("/discussion/overview");

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to fetch discussion stats");
    }

    return response.data;
  },

  // Reply endpoints
  postReply: async (data: CreateReplyData): Promise<Reply> => {
    const response = await apiHelpers.post<ApiResponse<Reply>>(
      "/reply/add-reply",
      data
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to post reply");
    }

    return response.data;
  },

  getRepliesForDiscussion: async (
    discussionId: string,
    page = 1,
    limit = 10
  ): Promise<ReplyListResponse> => {
    const response = await apiHelpers.get<ApiResponse<ReplyListResponse>>(
      `/reply/get-replies/${discussionId}?page=${page}&limit=${limit}`
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to fetch replies");
    }

    return response.data;
  },

  toggleLikeReply: async (id: string): Promise<LikeResponse> => {
    const response = await apiHelpers.patch<ApiResponse<LikeResponse>>(
      `/reply/toggle-like/${id}`
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to toggle like");
    }

    return response.data;
  },

  // Search endpoints
  searchDiscussions: async (
    query: string,
    page = 1,
    limit = 10
  ): Promise<DiscussionFeedResponse> => {
    const response = await apiHelpers.get<ApiResponse<DiscussionFeedResponse>>(
      `/discussion/search?q=${encodeURIComponent(
        query
      )}&page=${page}&limit=${limit}`
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to search discussions");
    }

    return response.data;
  },

  // User-specific endpoints
  getUserDiscussions: async (
    userId: string,
    page = 1,
    limit = 10
  ): Promise<DiscussionFeedResponse> => {
    const response = await apiHelpers.get<ApiResponse<DiscussionFeedResponse>>(
      `/discussion/user/${userId}?page=${page}&limit=${limit}`
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to fetch user discussions");
    }

    return response.data;
  },

  getUserReplies: async (
    userId: string,
    page = 1,
    limit = 10
  ): Promise<ReplyListResponse> => {
    const response = await apiHelpers.get<ApiResponse<ReplyListResponse>>(
      `/reply/user/${userId}?page=${page}&limit=${limit}`
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to fetch user replies");
    }

    return response.data;
  },

  // Bookmark endpoints (if implemented)
  bookmarkDiscussion: async (id: string): Promise<void> => {
    const response = await apiHelpers.post<ApiResponse<void>>(
      `/discussion/${id}/bookmark`
    );

    if (!response.success) {
      throw new Error(response.message || "Failed to bookmark discussion");
    }
  },

  unbookmarkDiscussion: async (id: string): Promise<void> => {
    const response = await apiHelpers.delete<ApiResponse<void>>(
      `/discussion/${id}/bookmark`
    );

    if (!response.success) {
      throw new Error(response.message || "Failed to unbookmark discussion");
    }
  },

  getBookmarkedDiscussions: async (
    page = 1,
    limit = 10
  ): Promise<DiscussionFeedResponse> => {
    const response = await apiHelpers.get<ApiResponse<DiscussionFeedResponse>>(
      `/discussion/bookmarked?page=${page}&limit=${limit}`
    );

    if (!response.success || !response.data) {
      throw new Error(
        response.message || "Failed to fetch bookmarked discussions"
      );
    }

    return response.data;
  },
};
