import { apiHelpers } from "./client";
import apiClient from "./client";
import {
  AdminCreateUserRequest,
  AdminUpdateUserRequest,
  AdminUpdateProfileRequest,
  AdminUserResponse,
  AdminUsersResponse,
  AdminUserProfileResponse,
} from "../types/admin";
import type { ApiResponse } from "../types/auth";

// Platform Settings types
export interface TierSettings {
  name: string;
  royaltyRate: number;
  royaltyRatePercent: number;
  platformFee: number;
  platformFeePercent: number;
  minSales: number;
  maxSales: number;
  minSalesFormatted?: string;
  maxSalesFormatted?: string;
  description?: string;
}

export interface PlatformSettings {
  tiers: {
    bronze: TierSettings;
    silver: TierSettings;
    gold: TierSettings;
  };
  vat: {
    enabled: boolean;
    rate: number;
    ratePercent: number;
    pricingType: "inclusive" | "exclusive";
    applicableRegions: string[];
    applicableCountries: string[];
    euRates: {
      [key: string]: {
        rate: number;
        ratePercent: number;
      };
    };
    b2bReverseCharge: {
      enabled: boolean;
      requireVatNumber: boolean;
      validateVatNumber: boolean;
    };
    invoiceSettings: {
      autoGenerate: boolean;
      sendToEmail: boolean;
      companyName: string;
      companyAddress: string;
      vatNumber: string;
      invoicePrefix: string;
    };
  };
  minimumPayout: {
    GBP: number;
    GBPFormatted: string;
    USD: number;
    USDFormatted: string;
    EUR: number;
    EURFormatted: string;
  };
  general: {
    platformName: string;
    supportEmail: string;
    maintenanceMode: boolean;
  };
  lastUpdatedAt?: string;
  lastUpdatedBy?: string;
}

export interface UpdateTierRequest {
  tiers: {
    bronze?: Partial<TierSettings>;
    silver?: Partial<TierSettings>;
    gold?: Partial<TierSettings>;
  };
}

export interface UpdateVatRequest {
  vat: {
    enabled?: boolean;
    rate?: number;
    pricingType?: "inclusive" | "exclusive";
    applicableRegions?: string[];
    applicableCountries?: string[];
    b2bReverseCharge?: {
      enabled?: boolean;
      requireVatNumber?: boolean;
      validateVatNumber?: boolean;
    };
    invoiceSettings?: {
      autoGenerate?: boolean;
      sendToEmail?: boolean;
      companyName?: string;
      companyAddress?: string;
      vatNumber?: string;
      invoicePrefix?: string;
    };
  };
}

export interface UpdateMinimumPayoutRequest {
  minimumPayout: {
    GBP?: number;
    USD?: number;
    EUR?: number;
  };
}

// General Settings types
export interface GeneralSettings {
  siteName: string;
  siteDescription: string;
  logo: string;
  favicon: string;
  contactEmail: string;
  supportEmail: string;
  phoneNumber: string;
  address: string;
  socialLinks: {
    facebook: string;
    twitter: string;
    linkedin: string;
    instagram: string;
  };
  copyrightText: string;
  updatedAt?: string;
}

// Dashboard stats types
export interface AdminDashboardStats {
  stats: {
    totalUsers: number;
    activeJobs: number;
    forumPosts: number;
    totalSales: number;
    platformRevenue: number;
    platformRevenueFormatted: string;
  };
  platformEarnings: {
    byCurrency: {
      [key: string]: {
        commission: number;
        sales: number;
        totalRevenue: number;
        vat?: number;
        formatted: string;
        revenueFormatted?: string;
      };
    };
    thisMonth: {
      commission: number;
      sales: number;
      formatted: string;
    };
    monthlyBreakdown: Array<{
      _id: { year: number; month: number };
      totalCommission: number;
      totalRevenue: number;
      salesCount: number;
    }>;
    totalFormatted: string;
  };
  recentSales: Array<{
    _id: string;
    saleDate: string;
    resource: {
      _id: string;
      title: string;
      type?: string;
      coverPhoto?: string;
    };
    seller: string;
    sellerEmail?: string;
    buyer: string;
    price: string;
    priceRaw: number;
    platformCommission: string;
    platformCommissionRaw: number;
    sellerEarnings: string;
    sellerEarningsRaw: number;
    vatAmount: string;
    currency: string;
    royaltyRate: string;
    sellerTier: string;
    status: string;
  }>;
  topResources: Array<{
    resource: {
      _id: string;
      title: string;
      type?: string;
      coverPhoto?: string;
    };
    totalSales: number;
    totalRevenue: string;
    totalCommission: string;
  }>;
  recentActivities: Array<{
    type: "school" | "job" | "user" | "system" | "sale";
    name?: string;
    title?: string;
    action?: string;
    details?: string;
    createdAt: string;
    status?: "success" | "warning" | "info";
  }>;
}

// Admin API endpoints
export const adminApi = {
  // Get admin dashboard stats
  getDashboard: async (): Promise<ApiResponse<AdminDashboardStats>> => {
    return apiHelpers.get<ApiResponse<AdminDashboardStats>>("/admin-dashboard/dashboard");
  },
  // Get all users with pagination, search, and filters
  getAllUsers: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
  }): Promise<AdminUsersResponse> => {
    return apiHelpers.get<AdminUsersResponse>("/admin/allUsers", { params });
  },

  // Get user by ID
  getUserById: async (id: string): Promise<AdminUserResponse> => {
    return apiHelpers.get<AdminUserResponse>(`/admin/users/${id}`);
  },

  // Create new user
  createUser: async (
    userData: AdminCreateUserRequest
  ): Promise<AdminUserResponse> => {
    return apiHelpers.post<AdminUserResponse>("/admin/add-users", userData);
  },

  // Update user
  updateUser: async (
    id: string,
    userData: AdminUpdateUserRequest
  ): Promise<AdminUserResponse> => {
    return apiHelpers.put<AdminUserResponse>(
      `/admin/update-users/${id}`,
      userData
    );
  },

  // Delete user
  deleteUser: async (id: string): Promise<AdminUserResponse> => {
    return apiHelpers.delete<AdminUserResponse>(`/admin/delete-users/${id}`);
  },

  // Change user status
  changeUserStatus: async (
    id: string,
    status: string
  ): Promise<AdminUserResponse> => {
    return apiHelpers.patch<AdminUserResponse>(`/admin/users/${id}/status`, {
      status,
    });
  },

  // Get user profile details
  getUserProfile: async (id: string): Promise<AdminUserProfileResponse> => {
    return apiHelpers.get<AdminUserProfileResponse>(
      `/admin/users/${id}/profile`
    );
  },

  // Update user profile
  updateUserProfile: async (
    id: string,
    profileData: AdminUpdateProfileRequest
  ): Promise<AdminUserResponse> => {
    return apiHelpers.put<AdminUserResponse>(
      `/admin/users/${id}/profile`,
      profileData
    );
  },

  // Export users to CSV/Excel
  exportUsers: async (params: {
    format?: "csv" | "excel";
    role?: string;
    status?: string;
  }): Promise<Blob> => {
    const response = await apiClient.get("/admin/users/export", {
      params,
      responseType: "blob",
    });
    return response.data;
  },

  // ==================== Platform Settings ====================

  // Get platform settings
  getPlatformSettings: async (): Promise<ApiResponse<PlatformSettings>> => {
    return apiHelpers.get<ApiResponse<PlatformSettings>>("/admin/settings");
  },

  // Update tier/royalty settings
  updateTierSettings: async (
    data: UpdateTierRequest
  ): Promise<ApiResponse<{ tiers: PlatformSettings["tiers"] }>> => {
    return apiHelpers.put<ApiResponse<{ tiers: PlatformSettings["tiers"] }>>(
      "/admin/settings/tiers",
      data
    );
  },

  // Update VAT settings
  updateVatSettings: async (
    data: UpdateVatRequest
  ): Promise<ApiResponse<{ vat: PlatformSettings["vat"] }>> => {
    return apiHelpers.put<ApiResponse<{ vat: PlatformSettings["vat"] }>>(
      "/admin/settings/vat",
      data
    );
  },

  // Update minimum payout thresholds
  updateMinimumPayout: async (
    data: UpdateMinimumPayoutRequest
  ): Promise<ApiResponse<{ minimumPayout: PlatformSettings["minimumPayout"] }>> => {
    return apiHelpers.put<
      ApiResponse<{ minimumPayout: PlatformSettings["minimumPayout"] }>
    >("/admin/settings/minimum-payout", data);
  },

  // Update all settings at once
  updateAllSettings: async (
    data: Partial<PlatformSettings>
  ): Promise<ApiResponse<PlatformSettings>> => {
    return apiHelpers.put<ApiResponse<PlatformSettings>>(
      "/admin/settings/all",
      data
    );
  },

  // ==================== General Settings ====================

  // Get general settings (public - for logo, site name, etc.)
  getGeneralSettings: async (): Promise<ApiResponse<GeneralSettings>> => {
    return apiHelpers.get<ApiResponse<GeneralSettings>>("/admin/settings/general");
  },

  // Update general settings (admin only)
  updateGeneralSettings: async (
    formData: FormData
  ): Promise<ApiResponse<GeneralSettings>> => {
    const response = await apiClient.put<ApiResponse<GeneralSettings>>(
      "/admin/settings/general",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },
};
