/**
 * Subscription API Service
 * Handles all subscription-related API calls
 */

import { apiHelpers } from './client';
import type {
  SubscriptionPlan,
  PlansGroupedByRole,
  MySubscriptionResponse,
  SubscriptionHistoryItem,
  CheckoutResponse,
  FeatureAccessResult,
  SubscriptionSystemSettings,
  SubscriptionAnalytics,
  CreatePlanRequest,
  UpdatePlanRequest,
  Feature,
} from '../types/subscription';

// API response wrapper
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * Public subscription endpoints (no auth required for some)
 */
export const subscriptionApi = {
  /**
   * Get all subscription plans grouped by role (public)
   */
  getAllPlans: async (): Promise<PlansGroupedByRole> => {
    const response = await apiHelpers.get<ApiResponse<{ plans: PlansGroupedByRole }>>(
      '/subscriptions/plans/all'
    );
    return response.data.plans;
  },

  /**
   * Get subscription plans for the current user's role
   */
  getPlansForRole: async (): Promise<SubscriptionPlan[]> => {
    const response = await apiHelpers.get<ApiResponse<{ plans: SubscriptionPlan[] }>>(
      '/subscriptions/plans'
    );
    return response.data.plans;
  },

  /**
   * Get current user's subscription
   */
  getMySubscription: async (): Promise<MySubscriptionResponse> => {
    const response = await apiHelpers.get<ApiResponse<MySubscriptionResponse>>(
      '/subscriptions/my-subscription'
    );
    return response.data;
  },

  /**
   * Get subscription history
   */
  getHistory: async (): Promise<SubscriptionHistoryItem[]> => {
    const response = await apiHelpers.get<ApiResponse<{ subscriptions: SubscriptionHistoryItem[] }>>(
      '/subscriptions/history'
    );
    return response.data.subscriptions;
  },

  /**
   * Create checkout session for a plan
   */
  createCheckout: async (planId: string): Promise<CheckoutResponse> => {
    const response = await apiHelpers.post<ApiResponse<CheckoutResponse>>(
      '/subscriptions/create-checkout',
      { planId }
    );
    return response.data;
  },

  /**
   * Cancel subscription
   */
  cancelSubscription: async (immediately: boolean = false): Promise<void> => {
    await apiHelpers.post<ApiResponse<void>>('/subscriptions/cancel', { immediately });
  },

  /**
   * Reactivate cancelled subscription
   */
  reactivateSubscription: async (): Promise<void> => {
    await apiHelpers.post<ApiResponse<void>>('/subscriptions/reactivate');
  },

  /**
   * Check if user has access to a specific feature
   */
  checkFeatureAccess: async (featureKey: string): Promise<FeatureAccessResult> => {
    const response = await apiHelpers.get<ApiResponse<FeatureAccessResult>>(
      `/subscriptions/check-feature/${featureKey}`
    );
    return response.data;
  },

  /**
   * Preview plan change proration
   */
  previewPlanChange: async (newPlanId: string): Promise<{
    currentPlan: { id: string; name: string; price: number };
    newPlan: { id: string; name: string; price: number };
    isUpgrade: boolean;
    proration: {
      immediateCharge: number;
      credit: number;
      nextInvoiceAmount: number;
      currency: string;
    };
  }> => {
    const response = await apiHelpers.post<ApiResponse<{
      currentPlan: { id: string; name: string; price: number };
      newPlan: { id: string; name: string; price: number };
      isUpgrade: boolean;
      proration: {
        immediateCharge: number;
        credit: number;
        nextInvoiceAmount: number;
        currency: string;
      };
    }>>('/subscriptions/preview-change', { newPlanId });
    return response.data;
  },

  /**
   * Change subscription plan (upgrade or downgrade)
   */
  changePlan: async (newPlanId: string): Promise<{
    subscription: {
      id: string;
      plan: { id: string; name: string };
      status: string;
      currentPeriodEnd: string;
    };
    isUpgrade: boolean;
    message: string;
  }> => {
    const response = await apiHelpers.post<ApiResponse<{
      subscription: {
        id: string;
        plan: { id: string; name: string };
        status: string;
        currentPeriodEnd: string;
      };
      isUpgrade: boolean;
      message: string;
    }>>('/subscriptions/change-plan', { newPlanId });
    return response.data;
  },

  /**
   * Get Stripe Billing Portal URL
   */
  getBillingPortalUrl: async (): Promise<{ url: string }> => {
    const response = await apiHelpers.post<ApiResponse<{ url: string }>>(
      '/subscriptions/billing-portal'
    );
    return response.data;
  },

  /**
   * Get billing/invoice history
   */
  getInvoices: async (limit: number = 10): Promise<{
    invoices: Array<{
      id: string;
      number: string | null;
      amount: number;
      currency: string;
      status: string;
      paid: boolean;
      date: string;
      dueDate: string | null;
      pdfUrl: string | null;
      hostedUrl: string | null;
      description: string;
    }>;
    hasMore: boolean;
  }> => {
    const response = await apiHelpers.get<ApiResponse<{
      invoices: Array<{
        id: string;
        number: string | null;
        amount: number;
        currency: string;
        status: string;
        paid: boolean;
        date: string;
        dueDate: string | null;
        pdfUrl: string | null;
        hostedUrl: string | null;
        description: string;
      }>;
      hasMore: boolean;
    }>>(`/subscriptions/invoices?limit=${limit}`);
    return response.data;
  },
};

/**
 * Admin subscription endpoints
 */
export const adminSubscriptionApi = {
  /**
   * Get subscription system settings (global toggle, etc.)
   */
  getSettings: async (): Promise<SubscriptionSystemSettings> => {
    const response = await apiHelpers.get<ApiResponse<{ settings: SubscriptionSystemSettings }>>(
      '/admin/subscriptions/settings'
    );
    return response.data.settings;
  },

  /**
   * Update subscription system settings
   */
  updateSettings: async (settings: Partial<SubscriptionSystemSettings>): Promise<SubscriptionSystemSettings> => {
    const response = await apiHelpers.put<ApiResponse<{ settings: SubscriptionSystemSettings }>>(
      '/admin/subscriptions/settings',
      settings
    );
    return response.data.settings;
  },

  /**
   * Toggle subscription enforcement globally
   */
  toggleSubscriptions: async (enabled: boolean): Promise<SubscriptionSystemSettings> => {
    const response = await apiHelpers.post<ApiResponse<{ settings: SubscriptionSystemSettings }>>(
      '/admin/subscriptions/toggle',
      { enabled }
    );
    return response.data.settings;
  },

  /**
   * Get all subscription plans (admin view)
   */
  getAllPlans: async (): Promise<SubscriptionPlan[]> => {
    const response = await apiHelpers.get<ApiResponse<{ plans: SubscriptionPlan[] }>>(
      '/admin/subscriptions/plans'
    );
    return response.data.plans;
  },

  /**
   * Get a single plan by ID
   */
  getPlan: async (planId: string): Promise<SubscriptionPlan> => {
    const response = await apiHelpers.get<ApiResponse<{ plan: SubscriptionPlan }>>(
      `/admin/subscriptions/plans/${planId}`
    );
    return response.data.plan;
  },

  /**
   * Create a new subscription plan
   */
  createPlan: async (plan: CreatePlanRequest): Promise<SubscriptionPlan> => {
    const response = await apiHelpers.post<ApiResponse<{ plan: SubscriptionPlan }>>(
      '/admin/subscriptions/plans',
      plan
    );
    return response.data.plan;
  },

  /**
   * Update a subscription plan
   */
  updatePlan: async (planId: string, updates: Partial<CreatePlanRequest>): Promise<SubscriptionPlan> => {
    const response = await apiHelpers.put<ApiResponse<{ plan: SubscriptionPlan }>>(
      `/admin/subscriptions/plans/${planId}`,
      updates
    );
    return response.data.plan;
  },

  /**
   * Delete a subscription plan
   */
  deletePlan: async (planId: string): Promise<void> => {
    await apiHelpers.delete<ApiResponse<void>>(`/admin/subscriptions/plans/${planId}`);
  },

  /**
   * Sync plan with Stripe (create/update product and price)
   */
  syncPlanWithStripe: async (planId: string): Promise<SubscriptionPlan> => {
    const response = await apiHelpers.post<ApiResponse<{ plan: SubscriptionPlan }>>(
      `/admin/subscriptions/plans/${planId}/sync-stripe`
    );
    return response.data.plan;
  },

  /**
   * Get all features
   */
  getAllFeatures: async (): Promise<Feature[]> => {
    const response = await apiHelpers.get<ApiResponse<{ features: Feature[] }>>(
      '/admin/subscriptions/features'
    );
    return response.data.features;
  },

  /**
   * Update a feature
   */
  updateFeature: async (featureId: string, updates: Partial<Feature>): Promise<Feature> => {
    const response = await apiHelpers.put<ApiResponse<{ feature: Feature }>>(
      `/admin/subscriptions/features/${featureId}`,
      updates
    );
    return response.data.feature;
  },

  /**
   * Get subscription analytics
   */
  getAnalytics: async (): Promise<SubscriptionAnalytics> => {
    const response = await apiHelpers.get<ApiResponse<{ analytics: SubscriptionAnalytics }>>(
      '/admin/subscriptions/analytics'
    );
    return response.data.analytics;
  },

  /**
   * Get all user subscriptions (with pagination)
   */
  getUserSubscriptions: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    planId?: string;
  }): Promise<{
    subscriptions: Array<{
      _id: string;
      userId: { _id: string; firstName: string; lastName: string; email: string };
      planId: { _id: string; name: string; slug: string };
      status: string;
      currentPeriodEnd: string;
      createdAt: string;
    }>;
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.planId) queryParams.append('planId', params.planId);

    const response = await apiHelpers.get<ApiResponse<{
      subscriptions: Array<{
        _id: string;
        userId: { _id: string; firstName: string; lastName: string; email: string };
        planId: { _id: string; name: string; slug: string };
        status: string;
        currentPeriodEnd: string;
        createdAt: string;
      }>;
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>>(`/admin/subscriptions/user-subscriptions?${queryParams.toString()}`);
    return response.data;
  },
};

export default subscriptionApi;
