import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionApi } from '@/apis/subscriptions';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { customToast } from '@/components/ui/sonner';
import {
  Crown,
  Calendar,
  CreditCard,
  ArrowUpCircle,
  ArrowDownCircle,
  XCircle,
  RefreshCw,
  ExternalLink,
  Download,
  Loader2,
  CheckCircle,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import { UsageCard } from './UsageCard';

interface PlanChangePreview {
  currentPlan: { id: string; name: string; price: number };
  newPlan: { id: string; name: string; price: number };
  isUpgrade: boolean;
  proration: {
    immediateCharge: number;
    credit: number;
    nextInvoiceAmount: number;
    currency: string;
  };
}

export const SubscriptionManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const { subscription, hasSubscription, isActive, isTrial, isPastDue, isExpired, daysRemaining, isInGracePeriod, gracePeriodDaysRemaining, refetch } = useSubscription();

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showChangePlanDialog, setShowChangePlanDialog] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [planPreview, setPlanPreview] = useState<PlanChangePreview | null>(null);

  // Fetch available plans for upgrade/downgrade
  const { data: availablePlans, isLoading: plansLoading } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: subscriptionApi.getPlansForRole,
    enabled: hasSubscription,
  });

  // Fetch invoice history
  const { data: invoicesData, isLoading: invoicesLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: () => subscriptionApi.getInvoices(5),
  });

  // Cancel subscription mutation
  const cancelMutation = useMutation({
    mutationFn: () => subscriptionApi.cancelSubscription(false),
    onSuccess: () => {
      customToast.success('Subscription will be cancelled at the end of the billing period');
      refetch();
      setShowCancelDialog(false);
    },
    onError: (error: any) => {
      customToast.error('Failed to cancel subscription', error.message);
    },
  });

  // Reactivate subscription mutation
  const reactivateMutation = useMutation({
    mutationFn: subscriptionApi.reactivateSubscription,
    onSuccess: () => {
      customToast.success('Subscription reactivated successfully');
      refetch();
    },
    onError: (error: any) => {
      customToast.error('Failed to reactivate subscription', error.message);
    },
  });

  // Preview plan change mutation
  const previewMutation = useMutation({
    mutationFn: subscriptionApi.previewPlanChange,
    onSuccess: (data) => {
      setPlanPreview(data);
      setShowChangePlanDialog(true);
    },
    onError: (error: any) => {
      customToast.error('Failed to preview plan change', error.message);
    },
  });

  // Change plan mutation
  const changePlanMutation = useMutation({
    mutationFn: subscriptionApi.changePlan,
    onSuccess: (data) => {
      customToast.success(data.message);
      refetch();
      setShowChangePlanDialog(false);
      setPlanPreview(null);
      setSelectedPlanId(null);
    },
    onError: (error: any) => {
      customToast.error('Failed to change plan', error.message);
    },
  });

  // Billing portal mutation
  const billingPortalMutation = useMutation({
    mutationFn: subscriptionApi.getBillingPortalUrl,
    onSuccess: (data) => {
      window.open(data.url, '_blank');
    },
    onError: (error: any) => {
      customToast.error('Failed to open billing portal', error.message);
    },
  });

  const handlePreviewPlanChange = (planId: string) => {
    setSelectedPlanId(planId);
    previewMutation.mutate(planId);
  };

  const handleConfirmPlanChange = () => {
    if (selectedPlanId) {
      changePlanMutation.mutate(selectedPlanId);
    }
  };

  const formatCurrency = (amount: number, currency: string = 'GBP') => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (!hasSubscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-500" />
            No Active Subscription
          </CardTitle>
          <CardDescription>
            Subscribe to unlock premium features and boost your experience.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => window.location.href = '/pricing'} className="w-full">
            View Available Plans
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Subscription Card */}
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
                  <Badge variant="outline" className="text-amber-600 border-amber-300">
                    Trial
                  </Badge>
                )}
                {isPastDue && (
                  <Badge variant="destructive">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Past Due
                  </Badge>
                )}
                {isActive && !isTrial && !isPastDue && (
                  <Badge variant="outline" className="text-green-600 border-green-300">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                )}
                {subscription?.cancelAtPeriodEnd && (
                  <Badge variant="outline" className="text-red-600 border-red-300">
                    Cancelling
                  </Badge>
                )}
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => billingPortalMutation.mutate()}
              disabled={billingPortalMutation.isPending}
            >
              {billingPortalMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Billing Portal
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Subscription Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Next Billing Date</p>
                <p className="text-sm text-muted-foreground">
                  {subscription?.currentPeriodEnd
                    ? formatDate(subscription.currentPeriodEnd)
                    : 'N/A'}
                </p>
              </div>
            </div>
            {daysRemaining > 0 && (
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Days Remaining</p>
                  <p className="text-sm text-muted-foreground">{daysRemaining} days</p>
                </div>
              </div>
            )}
          </div>

          {/* Past Due / Grace Period Warning */}
          {isPastDue && (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800 dark:text-red-200">
                    Payment Failed
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {isInGracePeriod ? (
                      <>
                        We couldn't process your payment. You have {gracePeriodDaysRemaining} days remaining
                        to update your payment method before your subscription is suspended.
                      </>
                    ) : (
                      <>
                        Your payment failed. Please update your payment method to continue using
                        premium features.
                      </>
                    )}
                  </p>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="mt-2"
                    onClick={() => billingPortalMutation.mutate()}
                    disabled={billingPortalMutation.isPending}
                  >
                    {billingPortalMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <CreditCard className="h-4 w-4 mr-2" />
                    )}
                    Update Payment Method
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Expired Subscription Notice */}
          {isExpired && (
            <div className="bg-gray-50 dark:bg-gray-950/20 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-gray-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    Subscription Expired
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Your subscription has expired. Subscribe again to regain access to premium features.
                  </p>
                  <Button
                    variant="default"
                    size="sm"
                    className="mt-2"
                    onClick={() => window.location.href = '/pricing'}
                  >
                    <Crown className="h-4 w-4 mr-2" />
                    View Plans
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Cancellation Notice */}
          {subscription?.cancelAtPeriodEnd && (
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                    Subscription Ending
                  </p>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Your subscription will end on {subscription.currentPeriodEnd
                      ? formatDate(subscription.currentPeriodEnd)
                      : 'the next billing date'}. You can reactivate anytime before then.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => reactivateMutation.mutate()}
                    disabled={reactivateMutation.isPending}
                  >
                    {reactivateMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-2" />
                    )}
                    Reactivate Subscription
                  </Button>
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {!subscription?.cancelAtPeriodEnd && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setShowCancelDialog(true)}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel Subscription
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Usage Card */}
      <UsageCard />

      {/* Change Plan Section */}
      {!subscription?.cancelAtPeriodEnd && availablePlans && availablePlans.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Change Plan</CardTitle>
            <CardDescription>
              Upgrade or downgrade your subscription plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            {plansLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : (
              <div className="grid gap-3">
                {availablePlans
                  .filter(plan => plan._id !== subscription?.plan?.id)
                  .map((plan) => {
                    const currentPrice = subscription?.plan?.price || 0;
                    const isUpgrade = plan.price > currentPrice;

                    return (
                      <div
                        key={plan._id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {isUpgrade ? (
                            <ArrowUpCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <ArrowDownCircle className="h-5 w-5 text-amber-600" />
                          )}
                          <div>
                            <p className="font-medium">{plan.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatCurrency(plan.price / 100)} / {plan.billingPeriod}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant={isUpgrade ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handlePreviewPlanChange(plan._id)}
                          disabled={previewMutation.isPending && selectedPlanId === plan._id}
                        >
                          {previewMutation.isPending && selectedPlanId === plan._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : isUpgrade ? (
                            'Upgrade'
                          ) : (
                            'Downgrade'
                          )}
                        </Button>
                      </div>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Billing History
          </CardTitle>
          <CardDescription>
            View and download your past invoices
          </CardDescription>
        </CardHeader>
        <CardContent>
          {invoicesLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : invoicesData?.invoices && invoicesData.invoices.length > 0 ? (
            <div className="space-y-2">
              {invoicesData.invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        {invoice.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(invoice.date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {formatCurrency(invoice.amount, invoice.currency)}
                      </p>
                      <Badge
                        variant={invoice.paid ? 'outline' : 'destructive'}
                        className={invoice.paid ? 'text-green-600 border-green-300' : ''}
                      >
                        {invoice.paid ? 'Paid' : invoice.status}
                      </Badge>
                    </div>
                    {invoice.pdfUrl && (
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                      >
                        <a href={invoice.pdfUrl} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {invoicesData.hasMore && (
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => billingPortalMutation.mutate()}
                >
                  View All Invoices
                </Button>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No billing history available
            </p>
          )}
        </CardContent>
      </Card>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Subscription?</AlertDialogTitle>
            <AlertDialogDescription>
              Your subscription will remain active until the end of your current billing period
              on {subscription?.currentPeriodEnd ? formatDate(subscription.currentPeriodEnd) : 'your next billing date'}.
              You can reactivate anytime before then.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => cancelMutation.mutate()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {cancelMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Cancel Subscription
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Plan Change Confirmation Dialog */}
      <Dialog open={showChangePlanDialog} onOpenChange={setShowChangePlanDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {planPreview?.isUpgrade ? 'Upgrade' : 'Downgrade'} Plan
            </DialogTitle>
            <DialogDescription>
              Review the changes before confirming
            </DialogDescription>
          </DialogHeader>

          {planPreview && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Current Plan</p>
                  <p className="font-medium">{planPreview.currentPlan.name}</p>
                </div>
                <ArrowUpCircle className="h-5 w-5 text-muted-foreground rotate-90" />
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">New Plan</p>
                  <p className="font-medium">{planPreview.newPlan.name}</p>
                </div>
              </div>

              {planPreview.isUpgrade && planPreview.proration.immediateCharge > 0 && (
                <div className="p-3 border rounded-lg">
                  <p className="text-sm font-medium">Immediate Charge</p>
                  <p className="text-lg font-semibold text-primary">
                    {formatCurrency(planPreview.proration.immediateCharge, planPreview.proration.currency)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Prorated amount for the remainder of your billing period
                  </p>
                </div>
              )}

              {!planPreview.isUpgrade && (
                <div className="p-3 border rounded-lg bg-amber-50 dark:bg-amber-950/20">
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                    Downgrade Notice
                  </p>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Your plan will change at the end of your current billing period.
                    You'll continue to have access to your current plan features until then.
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowChangePlanDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmPlanChange}
              disabled={changePlanMutation.isPending}
            >
              {changePlanMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Confirm {planPreview?.isUpgrade ? 'Upgrade' : 'Downgrade'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionManagement;
