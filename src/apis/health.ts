import { apiHelpers } from "./client";

// API response wrapper
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Service health check result
export interface ServiceCheck {
  status: "healthy" | "unhealthy";
  latency?: number;
  error?: string;
  connectedClients?: number;
}

// Overall system health response
export interface SystemHealth {
  status: "healthy" | "degraded";
  uptime: number;
  timestamp: string;
  checks: {
    mongodb: ServiceCheck;
    stripe: ServiceCheck;
    cloudinary: ServiceCheck;
    socketio: ServiceCheck;
  };
  totalLatency: number;
}

// Individual feature flag
export interface FeatureFlag {
  key: string;
  name: string;
  category: string;
  isActive: boolean;
  applicableRoles: string[];
}

// Feature flags response
export interface FeatureFlags {
  systemToggles: {
    subscriptions: boolean;
    advertisements: boolean;
  };
  features: FeatureFlag[];
}

// Webhook event processing stats
export interface WebhookStats {
  total: number;
  processed: number;
  failed: number;
  pending: number;
  byType: Array<{ type: string; count: number }>;
}

// Subscription state comparison detail
export interface SubscriptionConsistencyDetail {
  subscriptionId: string;
  stripeId: string;
  platformStatus: string;
  stripeStatus: string;
  match: boolean;
  error?: string;
}

// Subscription consistency summary
export interface SubscriptionConsistency {
  checked: number;
  matched: number;
  mismatched: number;
  errors: number;
  details: SubscriptionConsistencyDetail[];
}

// Data consistency response
export interface DataConsistency {
  webhookStats: WebhookStats;
  subscriptionConsistency: SubscriptionConsistency;
  lastChecked: string;
}

export const healthApi = {
  /**
   * Get system health status for all dependencies
   */
  getSystemHealth: async (): Promise<SystemHealth> => {
    const response = await apiHelpers.get<ApiResponse<SystemHealth>>(
      "/admin/system/status"
    );
    return response.data;
  },

  /**
   * Get feature flags and system toggles
   */
  getFeatureFlags: async (): Promise<FeatureFlags> => {
    const response = await apiHelpers.get<ApiResponse<FeatureFlags>>(
      "/admin/system/feature-flags"
    );
    return response.data;
  },

  /**
   * Get data consistency check (webhook stats + subscription state comparison)
   */
  getDataConsistency: async (): Promise<DataConsistency> => {
    const response = await apiHelpers.get<ApiResponse<DataConsistency>>(
      "/admin/system/data-consistency"
    );
    return response.data;
  },
};
