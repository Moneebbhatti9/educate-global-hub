/**
 * Subscription System Types
 * Types for subscription plans, user subscriptions, and feature gating
 */

// Subscription status enum
export type SubscriptionStatus = 'active' | 'trial' | 'past_due' | 'cancelled' | 'expired';

// Billing period options
export type BillingPeriod = 'monthly' | 'annual' | 'lifetime';

// User roles that can have subscriptions
export type SubscribableRole = 'teacher' | 'school' | 'recruiter' | 'supplier';

// Feature categories
export type FeatureCategory = 'marketplace' | 'jobs' | 'search' | 'premium' | 'admin';

/**
 * Feature definition - gateable capability
 */
export interface Feature {
  _id: string;
  key: string;
  name: string;
  description: string;
  category: FeatureCategory;
  applicableRoles: SubscribableRole[];
  isActive: boolean;
  sortOrder: number;
  icon?: string;
}

/**
 * Usage limits for a subscription plan
 */
export interface PlanLimits {
  featuredListings?: number | null;
  candidateSearches?: number | null;
  resourceUploads?: number | null;
  bulkMessages?: number | null;
}

/**
 * Subscription plan definition
 */
export interface SubscriptionPlan {
  _id: string;
  name: string;
  slug: string;
  description: string;
  targetRole: SubscribableRole;
  price: number; // in pence
  currency: string;
  billingPeriod: BillingPeriod;
  features: string[]; // feature keys
  limits: PlanLimits;
  trialDays: number;
  isActive: boolean;
  isDefault: boolean;
  sortOrder: number;
  highlight?: string | null;
  stripeProductId?: string;
  stripePriceId?: string;
  discountPercent: number;
  discountExpiresAt?: string | null;
  effectivePrice?: number; // calculated after discount
  hasActiveDiscount?: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Usage tracking for current billing period
 */
export interface UsageInfo {
  current: number;
  limit: number | null;
  remaining: number;
  percentUsed: number;
}

/**
 * User's subscription details
 */
export interface UserSubscription {
  id: string;
  plan: {
    id: string;
    name: string;
    slug: string;
    features: string[];
  };
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  trialEndDate?: string | null;
  daysRemaining: number;
  isInTrial: boolean;
}

/**
 * Response from my-subscription endpoint
 */
export interface MySubscriptionResponse {
  subscription: UserSubscription | null;
  usage: Record<string, UsageInfo>;
  hasSubscription: boolean;
}

/**
 * Subscription history item
 */
export interface SubscriptionHistoryItem {
  id: string;
  plan: {
    name: string;
    slug: string;
  } | null;
  status: SubscriptionStatus;
  startDate: string;
  endDate?: string | null;
  cancelledAt?: string | null;
}

/**
 * Checkout session response
 */
export interface CheckoutResponse {
  checkoutUrl: string;
  sessionId: string;
}

/**
 * Feature access check result
 */
export interface FeatureAccessResult {
  hasAccess: boolean;
  reason: string;
  code?: string;
  subscription?: UserSubscription;
  currentPlan?: string;
}

/**
 * Plans grouped by role
 */
export interface PlansGroupedByRole {
  teacher?: SubscriptionPlan[];
  school?: SubscriptionPlan[];
  recruiter?: SubscriptionPlan[];
  supplier?: SubscriptionPlan[];
}

/**
 * System settings for subscriptions
 */
export interface SubscriptionSystemSettings {
  subscriptionsEnabled: boolean;
  lastUpdatedBy?: string;
  updatedAt?: string;
}

/**
 * Admin subscription analytics
 */
export interface SubscriptionAnalytics {
  totalActiveSubscriptions: number;
  totalTrialSubscriptions: number;
  totalRevenue: number;
  monthlyRecurringRevenue: number;
  churnRate: number;
  subscriptionsByPlan: {
    planId: string;
    planName: string;
    count: number;
    revenue: number;
  }[];
  subscriptionsByStatus: {
    status: SubscriptionStatus;
    count: number;
  }[];
  recentSubscriptions: {
    userId: string;
    userName: string;
    planName: string;
    status: SubscriptionStatus;
    createdAt: string;
  }[];
}

/**
 * Create/update plan request
 */
export interface CreatePlanRequest {
  name: string;
  slug: string;
  description: string;
  targetRole: SubscribableRole;
  price: number;
  currency: string;
  billingPeriod: BillingPeriod;
  features: string[];
  limits: PlanLimits;
  trialDays: number;
  isActive: boolean;
  isDefault: boolean;
  sortOrder: number;
  highlight?: string;
  discountPercent?: number;
  discountExpiresAt?: string;
}

/**
 * Update plan request (partial)
 */
export interface UpdatePlanRequest extends Partial<CreatePlanRequest> {
  _id: string;
}

/**
 * Feature gate error response from API
 */
export interface FeatureGateError {
  code: 'NO_SUBSCRIPTION' | 'SUBSCRIPTION_EXPIRED' | 'FEATURE_NOT_INCLUDED' | 'USAGE_LIMIT_REACHED';
  feature: string;
  featureName: string;
  message: string;
  currentPlan?: string;
  current?: number;
  limit?: number;
}
