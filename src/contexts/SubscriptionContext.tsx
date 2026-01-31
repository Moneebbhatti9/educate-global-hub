import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useCallback,
  useMemo,
} from 'react';
import { useAuth } from './AuthContext';
import { subscriptionApi } from '../apis/subscriptions';
import type {
  UserSubscription,
  UsageInfo,
  SubscriptionStatus,
  SubscriptionPlan,
} from '../types/subscription';

/**
 * Subscription state interface
 */
interface SubscriptionState {
  subscription: UserSubscription | null;
  usage: Record<string, UsageInfo>;
  hasSubscription: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  // Global subscription enforcement status
  subscriptionsEnforced: boolean;
}

/**
 * Subscription context value interface
 */
interface SubscriptionContextValue extends SubscriptionState {
  // Actions
  refreshSubscription: () => Promise<void>;
  refetch: () => Promise<void>; // Alias for refreshSubscription
  hasFeatureAccess: (featureKey: string) => boolean;
  getUsage: (usageKey: string) => UsageInfo | null;
  isWithinLimit: (usageKey: string) => boolean;
  // Helpers
  canUpload: boolean;
  canSell: boolean;
  canUseFeaturedListings: boolean;
  canSearchCandidates: boolean;
  // Status helpers
  isActive: boolean;
  isTrial: boolean;
  isPastDue: boolean;
  isCancelled: boolean;
  isExpired: boolean;
  daysRemaining: number;
  // Grace period
  isInGracePeriod: boolean;
  gracePeriodDaysRemaining: number;
}

// Action types
type SubscriptionAction =
  | { type: 'INITIALIZE'; payload: { subscription: UserSubscription | null; usage: Record<string, UsageInfo>; hasSubscription: boolean } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_ENFORCED'; payload: boolean }
  | { type: 'CLEAR' };

// Initial state
const initialState: SubscriptionState = {
  subscription: null,
  usage: {},
  hasSubscription: false,
  isLoading: false,
  isInitialized: false,
  error: null,
  subscriptionsEnforced: true, // Default to enforced until we know otherwise
};

// Reducer
const subscriptionReducer = (state: SubscriptionState, action: SubscriptionAction): SubscriptionState => {
  switch (action.type) {
    case 'INITIALIZE':
      return {
        ...state,
        subscription: action.payload.subscription,
        usage: action.payload.usage,
        hasSubscription: action.payload.hasSubscription,
        isLoading: false,
        isInitialized: true,
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case 'SET_ENFORCED':
      return {
        ...state,
        subscriptionsEnforced: action.payload,
      };
    case 'CLEAR':
      return {
        ...initialState,
        isInitialized: true,
        subscriptionsEnforced: state.subscriptionsEnforced,
      };
    default:
      return state;
  }
};

// Create context
const SubscriptionContext = createContext<SubscriptionContextValue | undefined>(undefined);

/**
 * Subscription Provider Component
 */
export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(subscriptionReducer, initialState);
  const { isAuthenticated, user } = useAuth();

  /**
   * Fetch user's subscription data
   */
  const refreshSubscription = useCallback(async () => {
    if (!isAuthenticated) {
      dispatch({ type: 'CLEAR' });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const response = await subscriptionApi.getMySubscription();
      dispatch({
        type: 'INITIALIZE',
        payload: {
          subscription: response.subscription,
          usage: response.usage || {},
          hasSubscription: response.hasSubscription,
        },
      });
    } catch (error) {
      console.error('Error fetching subscription:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load subscription' });
      // Still mark as initialized so UI can render
      dispatch({
        type: 'INITIALIZE',
        payload: {
          subscription: null,
          usage: {},
          hasSubscription: false,
        },
      });
    }
  }, [isAuthenticated]);

  /**
   * Check if user has access to a specific feature
   */
  const hasFeatureAccess = useCallback((featureKey: string): boolean => {
    // If subscriptions aren't enforced, everyone has access
    if (!state.subscriptionsEnforced) {
      return true;
    }

    // If no subscription, no access to gated features
    if (!state.hasSubscription || !state.subscription) {
      return false;
    }

    // Check if feature is in plan
    return state.subscription.plan.features.includes(featureKey.toLowerCase());
  }, [state.subscriptionsEnforced, state.hasSubscription, state.subscription]);

  /**
   * Get usage info for a specific usage key
   */
  const getUsage = useCallback((usageKey: string): UsageInfo | null => {
    return state.usage[usageKey] || null;
  }, [state.usage]);

  /**
   * Check if user is within usage limit
   */
  const isWithinLimit = useCallback((usageKey: string): boolean => {
    // If subscriptions aren't enforced, always within limit
    if (!state.subscriptionsEnforced) {
      return true;
    }

    const usage = state.usage[usageKey];
    if (!usage) {
      return true; // No limit defined
    }

    if (usage.limit === null) {
      return true; // Unlimited
    }

    return usage.current < usage.limit;
  }, [state.subscriptionsEnforced, state.usage]);

  // Load subscription data when auth changes
  useEffect(() => {
    if (isAuthenticated) {
      refreshSubscription();
    } else {
      dispatch({ type: 'CLEAR' });
    }
  }, [isAuthenticated, refreshSubscription]);

  // Computed values
  const isActive = state.subscription?.status === 'active';
  const isTrial = state.subscription?.status === 'trial' || state.subscription?.isInTrial === true;
  const isPastDue = state.subscription?.status === 'past_due';
  const isCancelled = state.subscription?.status === 'cancelled';
  const isExpired = state.subscription?.status === 'expired';
  const daysRemaining = state.subscription?.daysRemaining || 0;

  // Grace period calculation (7 days after past_due status)
  const GRACE_PERIOD_DAYS = 7;
  const isInGracePeriod = isPastDue && daysRemaining > 0;
  const gracePeriodDaysRemaining = isPastDue ? Math.max(0, GRACE_PERIOD_DAYS - (7 - daysRemaining)) : 0;

  // Feature access shortcuts
  const canUpload = hasFeatureAccess('resource_upload');
  const canSell = hasFeatureAccess('resource_sell');
  const canUseFeaturedListings = hasFeatureAccess('featured_listing') && isWithinLimit('featuredListings');
  const canSearchCandidates = hasFeatureAccess('candidate_search') && isWithinLimit('candidateSearches');

  // Memoize context value
  const value = useMemo<SubscriptionContextValue>(() => ({
    ...state,
    refreshSubscription,
    refetch: refreshSubscription, // Alias for convenience
    hasFeatureAccess,
    getUsage,
    isWithinLimit,
    canUpload,
    canSell,
    canUseFeaturedListings,
    canSearchCandidates,
    isActive,
    isTrial,
    isPastDue,
    isCancelled,
    isExpired,
    daysRemaining,
    isInGracePeriod,
    gracePeriodDaysRemaining,
  }), [
    state,
    refreshSubscription,
    hasFeatureAccess,
    getUsage,
    isWithinLimit,
    canUpload,
    canSell,
    canUseFeaturedListings,
    canSearchCandidates,
    isActive,
    isTrial,
    isPastDue,
    isCancelled,
    isExpired,
    daysRemaining,
    isInGracePeriod,
    gracePeriodDaysRemaining,
  ]);

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

/**
 * Hook to access subscription context
 */
export const useSubscription = (): SubscriptionContextValue => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

/**
 * Hook to check feature access with loading state
 */
export const useFeatureAccess = (featureKey: string) => {
  const { hasFeatureAccess, isLoading, isInitialized, subscriptionsEnforced, subscription } = useSubscription();

  return {
    hasAccess: hasFeatureAccess(featureKey),
    isLoading: !isInitialized || isLoading,
    subscriptionsEnforced,
    currentPlan: subscription?.plan?.name || null,
  };
};

/**
 * Hook to check usage limits
 */
export const useUsageLimit = (usageKey: string) => {
  const { getUsage, isWithinLimit, isLoading, isInitialized } = useSubscription();
  const usage = getUsage(usageKey);

  return {
    usage,
    isWithinLimit: isWithinLimit(usageKey),
    isLoading: !isInitialized || isLoading,
    current: usage?.current || 0,
    limit: usage?.limit,
    remaining: usage?.remaining || 0,
    percentUsed: usage?.percentUsed || 0,
  };
};

export default SubscriptionContext;
