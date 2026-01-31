import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Sparkles, ArrowRight, Crown, Zap } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
  featureDescription?: string;
  currentPlan?: string | null;
  requiredPlan?: string;
  errorCode?: 'NO_SUBSCRIPTION' | 'SUBSCRIPTION_EXPIRED' | 'FEATURE_NOT_INCLUDED' | 'USAGE_LIMIT_REACHED';
  usageInfo?: {
    current: number;
    limit: number;
  };
}

/**
 * UpgradeModal - Shown when user attempts to access a gated feature
 * Displays upgrade options and directs to pricing page
 */
export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  featureName,
  featureDescription,
  currentPlan,
  requiredPlan,
  errorCode = 'NO_SUBSCRIPTION',
  usageInfo,
}) => {
  const navigate = useNavigate();

  const handleViewPlans = () => {
    onClose();
    navigate('/pricing');
  };

  const getIcon = () => {
    switch (errorCode) {
      case 'USAGE_LIMIT_REACHED':
        return <Zap className="h-12 w-12 text-amber-500" />;
      case 'SUBSCRIPTION_EXPIRED':
        return <Lock className="h-12 w-12 text-red-500" />;
      default:
        return <Crown className="h-12 w-12 text-primary" />;
    }
  };

  const getTitle = () => {
    switch (errorCode) {
      case 'USAGE_LIMIT_REACHED':
        return 'Usage Limit Reached';
      case 'SUBSCRIPTION_EXPIRED':
        return 'Subscription Expired';
      case 'FEATURE_NOT_INCLUDED':
        return 'Upgrade Required';
      default:
        return 'Subscription Required';
    }
  };

  const getMessage = () => {
    switch (errorCode) {
      case 'USAGE_LIMIT_REACHED':
        return `You've used ${usageInfo?.current || 0} of ${usageInfo?.limit || 0} ${featureName.toLowerCase()} this billing period. Upgrade your plan for more.`;
      case 'SUBSCRIPTION_EXPIRED':
        return 'Your subscription has expired. Renew now to continue using this feature.';
      case 'FEATURE_NOT_INCLUDED':
        return `${featureName} is not included in your ${currentPlan || 'current'} plan. Upgrade to access this feature.`;
      default:
        return `${featureName} requires an active subscription. Subscribe now to unlock this and other premium features.`;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            {getIcon()}
          </div>
          <DialogTitle className="text-xl">{getTitle()}</DialogTitle>
          <DialogDescription className="text-center pt-2">
            {getMessage()}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {/* Feature highlight */}
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-sm">{featureName}</h4>
                {featureDescription && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {featureDescription}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Current plan badge */}
          {currentPlan && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <span>Current plan:</span>
              <Badge variant="outline">{currentPlan}</Badge>
            </div>
          )}

          {/* Benefits teaser */}
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium text-center">Unlock with a subscription:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Upload and sell teaching resources
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Access analytics and insights
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Priority support
              </li>
            </ul>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button onClick={handleViewPlans} className="w-full gap-2">
            View Plans
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" onClick={onClose} className="w-full">
            Maybe Later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeModal;
