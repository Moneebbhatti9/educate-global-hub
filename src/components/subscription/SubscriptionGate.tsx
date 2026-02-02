import React, { useState, useCallback } from 'react';
import { useSubscription, useFeatureAccess } from '@/contexts/SubscriptionContext';
import { UpgradeModal } from './UpgradeModal';
import { Skeleton } from '@/components/ui/skeleton';

interface SubscriptionGateProps {
  /**
   * Feature key to check access for
   */
  featureKey: string;
  /**
   * Display name of the feature (shown in modal)
   */
  featureName: string;
  /**
   * Optional description of the feature
   */
  featureDescription?: string;
  /**
   * Content to render if user has access
   */
  children: React.ReactNode;
  /**
   * Optional fallback content if user doesn't have access
   * If not provided, children will be rendered but clicking triggers modal
   */
  fallback?: React.ReactNode;
  /**
   * Whether to show the upgrade modal automatically when blocked
   * Default: false (shows fallback or disabled state instead)
   */
  showModalOnBlock?: boolean;
  /**
   * Whether to render children but in a disabled/locked state
   * Default: false
   */
  renderDisabled?: boolean;
  /**
   * Callback when access is denied and modal is shown
   */
  onAccessDenied?: () => void;
}

/**
 * SubscriptionGate - Wrapper component for feature gating
 *
 * Usage:
 * ```tsx
 * <SubscriptionGate
 *   featureKey="resource_upload"
 *   featureName="Resource Upload"
 *   featureDescription="Upload teaching resources to the marketplace"
 * >
 *   <UploadButton />
 * </SubscriptionGate>
 * ```
 */
export const SubscriptionGate: React.FC<SubscriptionGateProps> = ({
  featureKey,
  featureName,
  featureDescription,
  children,
  fallback,
  showModalOnBlock = false,
  renderDisabled = false,
  onAccessDenied,
}) => {
  const [showModal, setShowModal] = useState(false);
  const { hasAccess, isLoading, subscriptionsEnforced, currentPlan } = useFeatureAccess(featureKey);

  const handleBlockedClick = useCallback(() => {
    setShowModal(true);
    onAccessDenied?.();
  }, [onAccessDenied]);

  // Still loading - show skeleton
  if (isLoading) {
    return <Skeleton className="h-10 w-full" />;
  }

  // Has access - render children normally
  if (hasAccess || !subscriptionsEnforced) {
    return <>{children}</>;
  }

  // No access - handle based on props
  if (showModalOnBlock) {
    // Show modal immediately
    return (
      <>
        {fallback || children}
        <UpgradeModal
          isOpen={true}
          onClose={() => {}}
          featureName={featureName}
          featureDescription={featureDescription}
          currentPlan={currentPlan}
          errorCode="NO_SUBSCRIPTION"
        />
      </>
    );
  }

  // If fallback is provided, show it
  if (fallback) {
    return (
      <>
        {fallback}
        <UpgradeModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          featureName={featureName}
          featureDescription={featureDescription}
          currentPlan={currentPlan}
          errorCode="NO_SUBSCRIPTION"
        />
      </>
    );
  }

  // Render children with click handler to show modal
  if (renderDisabled) {
    return (
      <>
        <div
          onClick={handleBlockedClick}
          className="cursor-pointer opacity-60 relative"
          title={`${featureName} requires a subscription`}
        >
          {children}
          <div className="absolute inset-0" />
        </div>
        <UpgradeModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          featureName={featureName}
          featureDescription={featureDescription}
          currentPlan={currentPlan}
          errorCode="NO_SUBSCRIPTION"
        />
      </>
    );
  }

  // Default: wrap children with click interceptor
  return (
    <>
      <div onClick={handleBlockedClick} className="cursor-pointer">
        {children}
      </div>
      <UpgradeModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        featureName={featureName}
        featureDescription={featureDescription}
        currentPlan={currentPlan}
        errorCode="NO_SUBSCRIPTION"
      />
    </>
  );
};

/**
 * Hook for programmatic feature gating
 * Returns a function that checks access and shows modal if denied
 */
export const useFeatureGate = (featureKey: string, featureName: string, featureDescription?: string) => {
  const [showModal, setShowModal] = useState(false);
  const { hasAccess, isLoading, subscriptionsEnforced, currentPlan } = useFeatureAccess(featureKey);
  const { subscription } = useSubscription();

  const checkAccess = useCallback((): boolean => {
    if (isLoading) return false;
    if (!subscriptionsEnforced) return true;
    if (hasAccess) return true;

    setShowModal(true);
    return false;
  }, [hasAccess, isLoading, subscriptionsEnforced]);

  const UpgradeModalComponent = useCallback(() => (
    <UpgradeModal
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      featureName={featureName}
      featureDescription={featureDescription}
      currentPlan={currentPlan}
      errorCode={subscription ? 'FEATURE_NOT_INCLUDED' : 'NO_SUBSCRIPTION'}
    />
  ), [showModal, featureName, featureDescription, currentPlan, subscription]);

  return {
    hasAccess: hasAccess || !subscriptionsEnforced,
    isLoading,
    checkAccess,
    showModal,
    setShowModal,
    UpgradeModal: UpgradeModalComponent,
  };
};

/**
 * Hook for checking usage limits
 */
export const useUsageLimitGate = (
  featureKey: string,
  usageKey: string,
  featureName: string,
  featureDescription?: string
) => {
  const [showModal, setShowModal] = useState(false);
  const { hasFeatureAccess, isWithinLimit, getUsage, subscription, subscriptionsEnforced } = useSubscription();

  const usage = getUsage(usageKey);
  const hasAccess = hasFeatureAccess(featureKey);
  const withinLimit = isWithinLimit(usageKey);

  const checkAccess = useCallback((): boolean => {
    if (!subscriptionsEnforced) return true;

    if (!hasAccess) {
      setShowModal(true);
      return false;
    }

    if (!withinLimit) {
      setShowModal(true);
      return false;
    }

    return true;
  }, [subscriptionsEnforced, hasAccess, withinLimit]);

  const getErrorCode = () => {
    if (!hasAccess) {
      return subscription ? 'FEATURE_NOT_INCLUDED' : 'NO_SUBSCRIPTION';
    }
    return 'USAGE_LIMIT_REACHED';
  };

  const UpgradeModalComponent = useCallback(() => (
    <UpgradeModal
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      featureName={featureName}
      featureDescription={featureDescription}
      currentPlan={subscription?.plan?.name}
      errorCode={getErrorCode() as any}
      usageInfo={usage ? { current: usage.current, limit: usage.limit || 0 } : undefined}
    />
  ), [showModal, featureName, featureDescription, subscription, usage]);

  return {
    hasAccess: hasAccess && withinLimit,
    isLoading: false,
    checkAccess,
    usage,
    UpgradeModal: UpgradeModalComponent,
  };
};

export default SubscriptionGate;
