/**
 * Ads API Service
 * Handles all ad-related API calls (tiers, requests, management)
 */

import { apiHelpers } from './client';

// API response wrapper
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Ad Tier types
export interface AdTier {
  _id: string;
  name: string;
  slug: string;
  description: string;
  normalPrice: number;
  launchPrice: number;
  currency: string;
  durationDays: number;
  durationLabel: string;
  features: string[];
  isActive: boolean;
  sortOrder: number;
  highlight: string | null;
  isLaunchPricing: boolean;
  effectivePrice: number;
  hasActiveLaunchPricing: boolean;
}

// Ad Request types
export interface AdRequest {
  _id: string;
  jobId: {
    _id: string;
    title: string;
    organization: string;
    slug?: string;
  };
  schoolId: string | {
    _id: string;
    name: string;
    email: string;
  };
  tierId: {
    _id: string;
    name: string;
    slug: string;
    durationLabel: string;
    sortOrder?: number;
  };
  bannerImageUrl: string;
  headline: string | null;
  description: string | null;
  status: AdRequestStatus;
  adminComment: string | null;
  paidAmount: number | null;
  activatedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  isExpired: boolean;
  daysRemaining: number | null;
}

export type AdRequestStatus =
  | 'PENDING_REVIEW'
  | 'APPROVED'
  | 'PENDING_PAYMENT'
  | 'REJECTED'
  | 'CHANGES_REQUESTED'
  | 'ACTIVE'
  | 'EXPIRED'
  | 'CANCELLED';

/**
 * Public ad endpoints
 */
export const adApi = {
  /**
   * Get active banners for carousel (public)
   */
  getActiveBanners: async (): Promise<AdRequest[]> => {
    const response = await apiHelpers.get<ApiResponse<{ banners: AdRequest[] }>>(
      '/ads/banners/active'
    );
    return response.data.banners;
  },

  /**
   * Get all active ad tiers (public)
   */
  getAdTiers: async (): Promise<AdTier[]> => {
    const response = await apiHelpers.get<ApiResponse<{ tiers: AdTier[] }>>(
      '/ads/tiers'
    );
    return response.data.tiers;
  },

  /**
   * Get a single ad tier by slug
   */
  getAdTierBySlug: async (slug: string): Promise<AdTier> => {
    const response = await apiHelpers.get<ApiResponse<{ tier: AdTier }>>(
      `/ads/tiers/${slug}`
    );
    return response.data.tier;
  },

  /**
   * Create an ad request with banner image upload
   */
  createAdRequest: async (data: {
    jobId: string;
    tierId: string;
    banner: File;
    headline?: string;
    description?: string;
  }): Promise<AdRequest> => {
    const formData = new FormData();
    formData.append('jobId', data.jobId);
    formData.append('tierId', data.tierId);
    formData.append('banner', data.banner);
    if (data.headline) formData.append('headline', data.headline);
    if (data.description) formData.append('description', data.description);

    const response = await apiHelpers.upload<ApiResponse<{ adRequest: AdRequest }>>(
      '/ads/requests',
      formData
    );
    return response.data.adRequest;
  },

  /**
   * Get current school's ad requests
   */
  getMyAdRequests: async (): Promise<AdRequest[]> => {
    const response = await apiHelpers.get<ApiResponse<{ adRequests: AdRequest[] }>>(
      '/ads/requests/my'
    );
    return response.data.adRequests;
  },

  /**
   * Cancel a pending ad request
   */
  cancelAdRequest: async (requestId: string): Promise<AdRequest> => {
    const response = await apiHelpers.patch<ApiResponse<{ adRequest: AdRequest }>>(
      `/ads/requests/${requestId}/cancel`
    );
    return response.data.adRequest;
  },

  /**
   * Resubmit an ad request after admin requests changes
   */
  resubmitAdRequest: async (
    requestId: string,
    data: {
      banner?: File;
      headline?: string;
      description?: string;
    }
  ): Promise<AdRequest> => {
    const formData = new FormData();
    if (data.banner) formData.append('banner', data.banner);
    if (data.headline !== undefined) formData.append('headline', data.headline);
    if (data.description !== undefined) formData.append('description', data.description);

    const response = await apiHelpers.upload<ApiResponse<{ adRequest: AdRequest }>>(
      `/ads/requests/${requestId}/resubmit`,
      formData
    );
    return response.data.adRequest;
  },

  /**
   * Create Stripe checkout session for an approved ad
   */
  createAdCheckout: async (requestId: string): Promise<{ checkoutUrl: string; sessionId: string }> => {
    const response = await apiHelpers.post<ApiResponse<{ checkoutUrl: string; sessionId: string }>>(
      `/ads/requests/${requestId}/checkout`
    );
    return response.data;
  },
};

/**
 * Admin ad endpoints
 */
export interface AdStats {
  totalRequests: number;
  pendingReview: number;
  active: number;
  pendingPayment: number;
  rejected: number;
  expired: number;
  cancelled: number;
  changesRequested: number;
  approved: number;
}

// Admin Ad Tier types
export interface AdminAdTier {
  _id: string;
  name: string;
  slug: string;
  description: string;
  normalPrice: number;
  launchPrice: number;
  currency: string;
  durationDays: number;
  durationLabel: string;
  features: string[];
  isActive: boolean;
  sortOrder: number;
  highlight: string | null;
  stripeProductId?: string;
  stripePriceId?: string;
  stripeLaunchPriceId?: string;
  isLaunchPricing: boolean;
  launchPricingExpiresAt: string | null;
  effectivePrice: number;
  hasActiveLaunchPricing: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdTierFormData {
  name: string;
  slug: string;
  description?: string;
  normalPrice: number;
  launchPrice: number;
  currency?: string;
  durationDays: number;
  durationLabel: string;
  features?: string[];
  isActive?: boolean;
  sortOrder?: number;
  highlight?: string | null;
  isLaunchPricing?: boolean;
  launchPricingExpiresAt?: string | null;
}

export const adminAdApi = {
  /**
   * Get ad request statistics (admin view)
   */
  getAdStats: async (): Promise<AdStats> => {
    const response = await apiHelpers.get<ApiResponse<{ stats: AdStats }>>(
      '/ads/admin/stats'
    );
    return response.data.stats;
  },

  /**
   * Get all ad requests (admin view)
   */
  getAdRequests: async (params?: { status?: string; search?: string }): Promise<AdRequest[]> => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.search) queryParams.append('search', params.search);

    const response = await apiHelpers.get<ApiResponse<{ adRequests: AdRequest[] }>>(
      `/ads/admin/requests?${queryParams.toString()}`
    );
    return response.data.adRequests;
  },

  /**
   * Get ad request detail (admin view)
   */
  getAdRequestDetail: async (id: string): Promise<AdRequest> => {
    const response = await apiHelpers.get<ApiResponse<{ adRequest: AdRequest }>>(
      `/ads/admin/requests/${id}`
    );
    return response.data.adRequest;
  },

  /**
   * Approve an ad request
   */
  approveAdRequest: async (id: string): Promise<AdRequest> => {
    const response = await apiHelpers.patch<ApiResponse<{ adRequest: AdRequest }>>(
      `/ads/admin/requests/${id}/approve`
    );
    return response.data.adRequest;
  },

  /**
   * Reject an ad request with comment
   */
  rejectAdRequest: async (id: string, comment: string): Promise<AdRequest> => {
    const response = await apiHelpers.patch<ApiResponse<{ adRequest: AdRequest }>>(
      `/ads/admin/requests/${id}/reject`,
      { comment }
    );
    return response.data.adRequest;
  },

  /**
   * Request changes on an ad request with feedback
   */
  requestChanges: async (id: string, comment: string): Promise<AdRequest> => {
    const response = await apiHelpers.patch<ApiResponse<{ adRequest: AdRequest }>>(
      `/ads/admin/requests/${id}/request-changes`,
      { comment }
    );
    return response.data.adRequest;
  },

  // ==========================================
  // Ad Tier CRUD
  // ==========================================

  /**
   * Get all ad tiers (including inactive) for admin management
   */
  getAllAdTiers: async (): Promise<AdminAdTier[]> => {
    const response = await apiHelpers.get<ApiResponse<{ tiers: AdminAdTier[] }>>(
      '/ads/admin/tiers'
    );
    return response.data.tiers;
  },

  /**
   * Create a new ad tier
   */
  createAdTier: async (data: AdTierFormData): Promise<AdminAdTier> => {
    const response = await apiHelpers.post<ApiResponse<{ tier: AdminAdTier }>>(
      '/ads/admin/tiers',
      data
    );
    return response.data.tier;
  },

  /**
   * Update an ad tier
   */
  updateAdTier: async (id: string, data: Partial<AdTierFormData>): Promise<AdminAdTier> => {
    const response = await apiHelpers.put<ApiResponse<{ tier: AdminAdTier }>>(
      `/ads/admin/tiers/${id}`,
      data
    );
    return response.data.tier;
  },

  /**
   * Delete an ad tier
   */
  deleteAdTier: async (id: string): Promise<void> => {
    await apiHelpers.delete<ApiResponse<null>>(
      `/ads/admin/tiers/${id}`
    );
  },
};

export default adApi;
