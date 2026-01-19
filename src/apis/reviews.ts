import { apiHelpers } from "./client";
import type { ApiResponse } from "../types/auth";

/**
 * Reviews API
 * Handles resource reviews and ratings
 */

// API endpoints
const REVIEW_ENDPOINTS = {
  REVIEWS: "/reviews",
  RESOURCE_REVIEWS: "/reviews/resource",
  MY_REVIEWS: "/reviews/my-reviews",
} as const;

// Types
export interface CreateReviewRequest {
  resourceId: string;
  saleId?: string;
  rating: number;
  comment?: string;
}

export interface Review {
  _id: string;
  resource: string;
  reviewer: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  sale: string;
  rating: number;
  comment?: string;
  status: "pending" | "approved" | "rejected";
  helpful: number;
  notHelpful: number;
  flagged: boolean;
  reviewDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResourceReviewsResponse {
  reviews: Review[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  summary: {
    averageRating: number;
    totalReviews: number;
    distribution: {
      5: number;
      4: number;
      3: number;
      2: number;
      1: number;
    };
  };
}

export const reviewsAPI = {
  /**
   * Create a review for a purchased resource
   */
  createReview: async (
    data: CreateReviewRequest
  ): Promise<ApiResponse<{ review: Review; message: string }>> => {
    try {
      // Validation
      if (!data || typeof data !== "object") {
        throw new Error("Review data is required and must be a valid object");
      }

      if (
        !data.resourceId ||
        typeof data.resourceId !== "string" ||
        data.resourceId.trim().length === 0
      ) {
        throw new Error("Resource ID is required and must be a valid string");
      }

      if (
        !data.rating ||
        typeof data.rating !== "number" ||
        data.rating < 1 ||
        data.rating > 5
      ) {
        throw new Error("Rating is required and must be between 1 and 5");
      }

      const requestBody = {
        resourceId: data.resourceId.trim(),
        saleId: data.saleId?.trim(),
        rating: data.rating,
        comment: data.comment?.trim() || "",
      };

      const response = await apiHelpers.post<
        ApiResponse<{ review: Review; message: string }>
      >(REVIEW_ENDPOINTS.REVIEWS, requestBody);

      if (!response || typeof response !== "object") {
        throw new Error("Invalid response format from server");
      }

      return response;
    } catch (error) {
      console.error("Error in createReview:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to submit review",
        data: undefined,
      };
    }
  },

  /**
   * Get reviews for a specific resource
   */
  getResourceReviews: async (
    resourceId: string,
    params?: {
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
      minRating?: number;
    }
  ): Promise<ApiResponse<ResourceReviewsResponse>> => {
    try {
      if (
        !resourceId ||
        typeof resourceId !== "string" ||
        resourceId.trim().length === 0
      ) {
        throw new Error("Resource ID is required and must be a valid string");
      }

      const queryParams = new URLSearchParams();

      if (params?.page && typeof params.page === "number" && params.page > 0) {
        queryParams.append("page", params.page.toString());
      }

      if (
        params?.limit &&
        typeof params.limit === "number" &&
        params.limit > 0 &&
        params.limit <= 100
      ) {
        queryParams.append("limit", params.limit.toString());
      }

      if (
        params?.sortBy &&
        typeof params.sortBy === "string" &&
        params.sortBy.trim().length > 0
      ) {
        queryParams.append("sortBy", params.sortBy.trim());
      }

      if (
        params?.sortOrder &&
        (params.sortOrder === "asc" || params.sortOrder === "desc")
      ) {
        queryParams.append("sortOrder", params.sortOrder);
      }

      if (
        params?.minRating &&
        typeof params.minRating === "number" &&
        params.minRating >= 1 &&
        params.minRating <= 5
      ) {
        queryParams.append("minRating", params.minRating.toString());
      }

      const url = `${REVIEW_ENDPOINTS.RESOURCE_REVIEWS}/${resourceId.trim()}${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      const response = await apiHelpers.get<
        ApiResponse<ResourceReviewsResponse>
      >(url);

      if (!response || typeof response !== "object") {
        throw new Error("Invalid response format from server");
      }

      return response;
    } catch (error) {
      console.error("Error in getResourceReviews:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch reviews",
        data: undefined,
      };
    }
  },

  /**
   * Get current user's reviews
   */
  getMyReviews: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<any>> => {
    try {
      const queryParams = new URLSearchParams();

      if (params?.page && typeof params.page === "number" && params.page > 0) {
        queryParams.append("page", params.page.toString());
      }

      if (
        params?.limit &&
        typeof params.limit === "number" &&
        params.limit > 0 &&
        params.limit <= 100
      ) {
        queryParams.append("limit", params.limit.toString());
      }

      const url = `${REVIEW_ENDPOINTS.MY_REVIEWS}${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      const response = await apiHelpers.get<ApiResponse<any>>(url);

      if (!response || typeof response !== "object") {
        throw new Error("Invalid response format from server");
      }

      return response;
    } catch (error) {
      console.error("Error in getMyReviews:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch your reviews",
        data: undefined,
      };
    }
  },

  /**
   * Update a review
   */
  updateReview: async (
    reviewId: string,
    data: { rating?: number; comment?: string }
  ): Promise<ApiResponse<{ review: Review }>> => {
    try {
      if (
        !reviewId ||
        typeof reviewId !== "string" ||
        reviewId.trim().length === 0
      ) {
        throw new Error("Review ID is required and must be a valid string");
      }

      if (!data || typeof data !== "object") {
        throw new Error("Update data must be a valid object");
      }

      const requestBody: { rating?: number; comment?: string } = {};

      if (
        data.rating !== undefined &&
        typeof data.rating === "number" &&
        data.rating >= 1 &&
        data.rating <= 5
      ) {
        requestBody.rating = data.rating;
      }

      if (data.comment !== undefined && typeof data.comment === "string") {
        requestBody.comment = data.comment.trim();
      }

      const response = await apiHelpers.put<ApiResponse<{ review: Review }>>(
        `${REVIEW_ENDPOINTS.REVIEWS}/${reviewId.trim()}`,
        requestBody
      );

      if (!response || typeof response !== "object") {
        throw new Error("Invalid response format from server");
      }

      return response;
    } catch (error) {
      console.error("Error in updateReview:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to update review",
        data: undefined,
      };
    }
  },

  /**
   * Delete a review
   */
  deleteReview: async (reviewId: string): Promise<ApiResponse<void>> => {
    try {
      if (
        !reviewId ||
        typeof reviewId !== "string" ||
        reviewId.trim().length === 0
      ) {
        throw new Error("Review ID is required and must be a valid string");
      }

      const response = await apiHelpers.delete<ApiResponse<void>>(
        `${REVIEW_ENDPOINTS.REVIEWS}/${reviewId.trim()}`
      );

      if (!response || typeof response !== "object") {
        throw new Error("Invalid response format from server");
      }

      return response;
    } catch (error) {
      console.error("Error in deleteReview:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to delete review",
        data: undefined,
      };
    }
  },

  /**
   * Mark a review as helpful
   */
  markHelpful: async (
    reviewId: string
  ): Promise<ApiResponse<{ helpful: number }>> => {
    try {
      if (
        !reviewId ||
        typeof reviewId !== "string" ||
        reviewId.trim().length === 0
      ) {
        throw new Error("Review ID is required and must be a valid string");
      }

      const response = await apiHelpers.post<
        ApiResponse<{ helpful: number }>
      >(`${REVIEW_ENDPOINTS.REVIEWS}/${reviewId.trim()}/helpful`);

      if (!response || typeof response !== "object") {
        throw new Error("Invalid response format from server");
      }

      return response;
    } catch (error) {
      console.error("Error in markHelpful:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to mark as helpful",
        data: undefined,
      };
    }
  },

  /**
   * Mark a review as not helpful
   */
  markNotHelpful: async (
    reviewId: string
  ): Promise<ApiResponse<{ notHelpful: number }>> => {
    try {
      if (
        !reviewId ||
        typeof reviewId !== "string" ||
        reviewId.trim().length === 0
      ) {
        throw new Error("Review ID is required and must be a valid string");
      }

      const response = await apiHelpers.post<
        ApiResponse<{ notHelpful: number }>
      >(`${REVIEW_ENDPOINTS.REVIEWS}/${reviewId.trim()}/not-helpful`);

      if (!response || typeof response !== "object") {
        throw new Error("Invalid response format from server");
      }

      return response;
    } catch (error) {
      console.error("Error in markNotHelpful:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to mark as not helpful",
        data: undefined,
      };
    }
  },

  /**
   * Flag a review for moderation
   */
  flagReview: async (
    reviewId: string,
    reason: string
  ): Promise<ApiResponse<void>> => {
    try {
      if (
        !reviewId ||
        typeof reviewId !== "string" ||
        reviewId.trim().length === 0
      ) {
        throw new Error("Review ID is required and must be a valid string");
      }

      if (!reason || typeof reason !== "string" || reason.trim().length === 0) {
        throw new Error("Reason is required and must be a valid string");
      }

      const response = await apiHelpers.post<ApiResponse<void>>(
        `${REVIEW_ENDPOINTS.REVIEWS}/${reviewId.trim()}/flag`,
        { reason: reason.trim() }
      );

      if (!response || typeof response !== "object") {
        throw new Error("Invalid response format from server");
      }

      return response;
    } catch (error) {
      console.error("Error in flagReview:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to flag review",
        data: undefined,
      };
    }
  },
};
