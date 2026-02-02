import React from 'react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  Star,
  Search,
  Upload,
  MessageSquare,
  Crown,
  Infinity,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';

interface UsageItemProps {
  label: string;
  icon: React.ReactNode;
  current: number;
  limit: number | null;
  description?: string;
}

const UsageItem: React.FC<UsageItemProps> = ({ label, icon, current, limit, description }) => {
  const isUnlimited = limit === null;
  const percentUsed = isUnlimited ? 0 : Math.min(100, Math.round((current / limit) * 100));
  const isNearLimit = !isUnlimited && percentUsed >= 80;
  const isAtLimit = !isUnlimited && current >= limit;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-muted-foreground">{icon}</div>
          <span className="text-sm font-medium">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          {isAtLimit ? (
            <Badge variant="destructive" className="text-xs">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Limit Reached
            </Badge>
          ) : isNearLimit ? (
            <Badge variant="outline" className="text-amber-600 border-amber-300 text-xs">
              {limit - current} remaining
            </Badge>
          ) : isUnlimited ? (
            <Badge variant="outline" className="text-green-600 border-green-300 text-xs">
              <Infinity className="h-3 w-3 mr-1" />
              Unlimited
            </Badge>
          ) : null}
          <span className="text-sm font-semibold">
            {current}{isUnlimited ? '' : ` / ${limit}`}
          </span>
        </div>
      </div>
      {!isUnlimited && (
        <Progress
          value={percentUsed}
          className={`h-2 ${isAtLimit ? '[&>div]:bg-red-500' : isNearLimit ? '[&>div]:bg-amber-500' : ''}`}
        />
      )}
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
};

export const UsageCard: React.FC = () => {
  const navigate = useNavigate();
  const {
    subscription,
    hasSubscription,
    usage,
    isActive,
    isTrial,
    isPastDue,
    daysRemaining,
    subscriptionsEnforced,
  } = useSubscription();

  // If subscriptions aren't enforced or user has no subscription
  if (!subscriptionsEnforced) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            All Features Unlocked
          </CardTitle>
          <CardDescription>
            Subscription enforcement is currently disabled. All features are free to use.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!hasSubscription) {
    return (
      <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-500" />
            No Active Subscription
          </CardTitle>
          <CardDescription>
            Subscribe to unlock premium features and usage limits.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => navigate('/pricing')} className="w-full">
            View Plans
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              {subscription?.plan?.name || 'Subscription'}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              {isTrial && (
                <Badge variant="outline" className="text-amber-600">Trial</Badge>
              )}
              {isPastDue && (
                <Badge variant="destructive">Past Due</Badge>
              )}
              {isActive && !isTrial && (
                <Badge variant="outline" className="text-green-600">Active</Badge>
              )}
              {daysRemaining > 0 && (
                <span className="text-sm">
                  {daysRemaining} days remaining
                </span>
              )}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/pricing')}>
            Manage
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Usage Items */}
        {usage.featuredListings && (
          <UsageItem
            label="Featured Listings"
            icon={<Star className="h-4 w-4" />}
            current={usage.featuredListings.current}
            limit={usage.featuredListings.limit}
            description="Highlighted job postings for increased visibility"
          />
        )}

        {usage.candidateSearches && (
          <UsageItem
            label="Candidate Searches"
            icon={<Search className="h-4 w-4" />}
            current={usage.candidateSearches.current}
            limit={usage.candidateSearches.limit}
            description="Browse and search teacher profiles"
          />
        )}

        {usage.resourceUploads && (
          <UsageItem
            label="Resource Uploads"
            icon={<Upload className="h-4 w-4" />}
            current={usage.resourceUploads.current}
            limit={usage.resourceUploads.limit}
            description="Teaching resources uploaded to marketplace"
          />
        )}

        {usage.bulkMessages && (
          <UsageItem
            label="Bulk Messages"
            icon={<MessageSquare className="h-4 w-4" />}
            current={usage.bulkMessages.current}
            limit={usage.bulkMessages.limit}
            description="Messages sent to multiple candidates"
          />
        )}

        {/* If no usage data */}
        {Object.keys(usage).length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No usage limits apply to your current plan.
          </p>
        )}

        {/* Billing period info */}
        {subscription?.currentPeriodEnd && (
          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground text-center">
              Usage resets on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UsageCard;
