import { apiHelpers } from "./client";
import apiClient from "./client";
import type { ApiResponse } from "../types/auth";

// Date filter params used across multiple endpoints
export interface FinancialDateParams {
  startDate?: string;
  endDate?: string;
  preset?: "7d" | "30d" | "90d" | "1y";
}

// Revenue stream data
export interface RevenueStreamData {
  revenue: number;
  count: number;
  formatted: string;
}

// GET /financial/overview response
export interface RevenueOverview {
  schoolSubscriptions: RevenueStreamData;
  teacherSubscriptions: RevenueStreamData;
  marketplaceCommissions: RevenueStreamData;
  adPayments: RevenueStreamData;
  totalRevenue: number;
  totalFormatted: string;
}

// GET /financial/time-series response
export interface TimeSeriesPoint {
  date: string;
  schoolSubscriptions: number;
  teacherSubscriptions: number;
  marketplaceCommissions: number;
  adPayments: number;
  total: number;
}

// GET /financial/subscription-metrics response
export interface SubscriptionMetrics {
  mrr: number;
  mrrFormatted: string;
  activeSubscribers: number;
  churnRate: number;
  churnedCount: number;
  startCount: number;
}

// GET /financial/recent-transactions response
export interface Transaction {
  type: "subscription" | "sale" | "ad";
  amount: number;
  amountFormatted: string;
  date: string;
  status: string;
  description: string;
  source: string;
}

// GET /financial/breakdown response
export interface RevenueBreakdownStream {
  name: string;
  revenue: number;
  percentage: number;
  count: number;
  formatted: string;
}

export interface RevenueBreakdown {
  streams: RevenueBreakdownStream[];
  total: number;
  totalFormatted: string;
}

// GET /financial/per-school response
export interface SchoolRevenue {
  schoolId: string;
  schoolName: string;
  subscriptionRevenue: number;
  adRevenue: number;
  totalRevenue: number;
  formatted: string;
}

export interface PerSchoolResponse {
  schools: SchoolRevenue[];
  pagination: { page: number; limit: number; total: number; pages: number };
  grandTotal: number;
  grandTotalFormatted: string;
}

// GET /financial/creator-earnings response
export interface CreatorEarning {
  userId: string;
  name: string;
  email: string;
  totalSales: number;
  totalEarnings: number;
  totalEarningsFormatted: string;
  totalCommission: number;
  totalCommissionFormatted: string;
  currentBalance: number;
  currentBalanceFormatted: string;
  withdrawals: {
    count: number;
    totalAmount: number;
    totalAmountFormatted: string;
  };
}

export interface CreatorEarningsResponse {
  creators: CreatorEarning[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

// Financial dashboard API endpoints
export const financialApi = {
  // Revenue overview with date filtering
  getRevenueOverview: async (
    params?: FinancialDateParams
  ): Promise<ApiResponse<RevenueOverview>> => {
    return apiHelpers.get<ApiResponse<RevenueOverview>>(
      "/admin-dashboard/financial/overview",
      { params }
    );
  },

  // Time-series data for charts
  getTimeSeries: async (
    params?: FinancialDateParams & { granularity?: "day" | "month" }
  ): Promise<ApiResponse<TimeSeriesPoint[]>> => {
    return apiHelpers.get<ApiResponse<TimeSeriesPoint[]>>(
      "/admin-dashboard/financial/time-series",
      { params }
    );
  },

  // Subscription metrics (MRR, churn)
  getSubscriptionMetrics: async (): Promise<
    ApiResponse<SubscriptionMetrics>
  > => {
    return apiHelpers.get<ApiResponse<SubscriptionMetrics>>(
      "/admin-dashboard/financial/subscription-metrics"
    );
  },

  // Recent transactions across all types
  getRecentTransactions: async (
    params?: { limit?: number; type?: string }
  ): Promise<ApiResponse<Transaction[]>> => {
    return apiHelpers.get<ApiResponse<Transaction[]>>(
      "/admin-dashboard/financial/recent-transactions",
      { params }
    );
  },

  // Revenue breakdown by type
  getRevenueBreakdown: async (
    params?: FinancialDateParams
  ): Promise<ApiResponse<RevenueBreakdown>> => {
    return apiHelpers.get<ApiResponse<RevenueBreakdown>>(
      "/admin-dashboard/financial/breakdown",
      { params }
    );
  },

  // Per-school revenue tracking
  getPerSchoolRevenue: async (
    params?: FinancialDateParams & { page?: number; limit?: number }
  ): Promise<ApiResponse<PerSchoolResponse>> => {
    return apiHelpers.get<ApiResponse<PerSchoolResponse>>(
      "/admin-dashboard/financial/per-school",
      { params }
    );
  },

  // Creator earnings with payout history
  getCreatorEarnings: async (
    params?: FinancialDateParams & { page?: number; limit?: number }
  ): Promise<ApiResponse<CreatorEarningsResponse>> => {
    return apiHelpers.get<ApiResponse<CreatorEarningsResponse>>(
      "/admin-dashboard/financial/creator-earnings",
      { params }
    );
  },

  // CSV export (returns blob)
  exportCSV: async (
    params?: FinancialDateParams & { type?: string }
  ): Promise<Blob> => {
    const response = await apiClient.get(
      "/admin-dashboard/financial/export/csv",
      {
        params,
        responseType: "blob",
      }
    );
    return response.data;
  },

  // PDF export (returns blob)
  exportPDF: async (params?: FinancialDateParams): Promise<Blob> => {
    const response = await apiClient.get(
      "/admin-dashboard/financial/export/pdf",
      {
        params,
        responseType: "blob",
      }
    );
    return response.data;
  },
};
