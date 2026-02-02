import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  CheckCircle,
  Settings,
  Crown,
  Sparkles,
  Check,
  X,
  Pencil,
  Trash2,
  Plus,
  RefreshCw,
  BarChart3,
  Users,
  CreditCard,
  TrendingUp,
  Zap,
  ExternalLink,
} from "lucide-react";
import { adminSubscriptionApi } from "@/apis/subscriptions";
import { customToast } from "@/components/ui/sonner";
import type {
  SubscriptionPlan,
  Feature,
  SubscriptionAnalytics,
  CreatePlanRequest,
  BillingPeriod,
  SubscribableRole,
} from "@/types/subscription";

// ============================================
// GLOBAL TOGGLE SECTION
// ============================================

const GlobalToggleSection = () => {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["adminSubscriptionSettings"],
    queryFn: () => adminSubscriptionApi.getSettings(),
  });

  const toggleMutation = useMutation({
    mutationFn: (enabled: boolean) => adminSubscriptionApi.toggleSubscriptions(enabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminSubscriptionSettings"] });
      customToast.success("Settings updated", "Subscription enforcement toggled");
    },
    onError: (error: any) => {
      customToast.error("Error", error.message || "Failed to update settings");
    },
  });

  if (isLoading) {
    return <Skeleton className="h-32 w-full" />;
  }

  const isEnabled = settings?.subscriptionsEnabled ?? true;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary" />
          <div>
            <CardTitle>Subscription Enforcement</CardTitle>
            <CardDescription>
              Control whether subscription requirements are enforced platform-wide
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="space-y-1">
            <p className="font-medium">
              {isEnabled ? "Subscriptions Enabled" : "Subscriptions Disabled"}
            </p>
            <p className="text-sm text-muted-foreground">
              {isEnabled
                ? "Users need active subscriptions to access gated features"
                : "All features are free for all users (marketing mode)"}
            </p>
          </div>
          <Switch
            checked={isEnabled}
            onCheckedChange={(checked) => toggleMutation.mutate(checked)}
            disabled={toggleMutation.isPending}
          />
        </div>
        {!isEnabled && (
          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5" />
              <p className="text-sm text-amber-800 dark:text-amber-200">
                Subscriptions are currently disabled. All premium features are accessible to all users.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// ============================================
// PLANS MANAGEMENT SECTION
// ============================================

const PlansSection = () => {
  const queryClient = useQueryClient();
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [deleteConfirmPlan, setDeleteConfirmPlan] = useState<SubscriptionPlan | null>(null);

  const { data: plans, isLoading } = useQuery({
    queryKey: ["adminSubscriptionPlans"],
    queryFn: () => adminSubscriptionApi.getAllPlans(),
  });

  const { data: features } = useQuery({
    queryKey: ["adminSubscriptionFeatures"],
    queryFn: () => adminSubscriptionApi.getAllFeatures(),
  });

  const deleteMutation = useMutation({
    mutationFn: (planId: string) => adminSubscriptionApi.deletePlan(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminSubscriptionPlans"] });
      customToast.success("Plan deleted", "The subscription plan has been removed");
      setDeleteConfirmPlan(null);
    },
    onError: (error: any) => {
      customToast.error("Error", error.message || "Failed to delete plan");
    },
  });

  const syncStripeMutation = useMutation({
    mutationFn: (planId: string) => adminSubscriptionApi.syncPlanWithStripe(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminSubscriptionPlans"] });
      customToast.success("Synced with Stripe", "Plan is now available for purchase");
    },
    onError: (error: any) => {
      customToast.error("Stripe sync failed", error.message || "Failed to sync with Stripe");
    },
  });

  const formatPrice = (price: number, currency: string = "GBP") => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency,
    }).format(price / 100);
  };

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  // Group plans by role
  const plansByRole = (plans || []).reduce((acc, plan) => {
    if (!acc[plan.targetRole]) {
      acc[plan.targetRole] = [];
    }
    acc[plan.targetRole].push(plan);
    return acc;
  }, {} as Record<string, SubscriptionPlan[]>);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-primary" />
              <div>
                <CardTitle>Subscription Plans</CardTitle>
                <CardDescription>
                  Manage subscription plans and pricing
                </CardDescription>
              </div>
            </div>
            <Button onClick={() => { setIsCreateMode(true); setEditingPlan(null); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Plan
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {Object.entries(plansByRole).map(([role, rolePlans]) => (
            <div key={role} className="mb-6 last:mb-0">
              <h3 className="text-lg font-semibold mb-3 capitalize flex items-center gap-2">
                <Badge variant="outline">{role}</Badge>
                Plans
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rolePlans.map((plan) => (
                  <Card
                    key={plan._id}
                    className={`relative ${plan.isDefault ? "border-primary border-2" : ""} ${!plan.isActive ? "opacity-60" : ""}`}
                  >
                    {plan.isDefault && (
                      <Badge className="absolute -top-2 right-2 bg-primary">Default</Badge>
                    )}
                    {plan.highlight && (
                      <Badge className="absolute -top-2 left-2 bg-amber-500">{plan.highlight}</Badge>
                    )}
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                        <Badge variant={plan.isActive ? "default" : "secondary"}>
                          {plan.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="mt-2">
                        <span className="text-2xl font-bold">
                          {formatPrice(plan.price, plan.currency)}
                        </span>
                        <span className="text-muted-foreground">/{plan.billingPeriod}</span>
                        {plan.hasActiveDiscount && (
                          <Badge variant="destructive" className="ml-2">
                            {plan.discountPercent}% OFF
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <p className="text-sm text-muted-foreground mb-3">{plan.description}</p>
                      <div className="text-xs space-y-1 mb-3">
                        <p><strong>Features:</strong> {plan.features.length} included</p>
                        <p><strong>Trial:</strong> {plan.trialDays > 0 ? `${plan.trialDays} days` : "None"}</p>
                        {!plan.stripePriceId && (
                          <p className="text-amber-600">
                            <AlertCircle className="w-3 h-3 inline mr-1" />
                            Not synced with Stripe
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => { setEditingPlan(plan); setIsCreateMode(false); }}
                        >
                          <Pencil className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        {!plan.stripePriceId && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => syncStripeMutation.mutate(plan._id)}
                            disabled={syncStripeMutation.isPending}
                          >
                            <Zap className="w-3 h-3 mr-1" />
                            Sync
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteConfirmPlan(plan)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}

          {(!plans || plans.length === 0) && (
            <div className="text-center py-8 text-muted-foreground">
              <Crown className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No subscription plans yet</p>
              <Button
                variant="outline"
                className="mt-3"
                onClick={() => { setIsCreateMode(true); setEditingPlan(null); }}
              >
                Create your first plan
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Plan Edit/Create Modal */}
      <PlanModal
        isOpen={isCreateMode || !!editingPlan}
        onClose={() => { setEditingPlan(null); setIsCreateMode(false); }}
        plan={editingPlan}
        features={features || []}
        isCreateMode={isCreateMode}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmPlan} onOpenChange={() => setDeleteConfirmPlan(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Plan</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deleteConfirmPlan?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmPlan(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirmPlan && deleteMutation.mutate(deleteConfirmPlan._id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

// ============================================
// PLAN MODAL
// ============================================

interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: SubscriptionPlan | null;
  features: Feature[];
  isCreateMode: boolean;
}

const PlanModal = ({ isOpen, onClose, plan, features, isCreateMode }: PlanModalProps) => {
  const queryClient = useQueryClient();

  const getInitialFormData = (): Partial<CreatePlanRequest> => ({
    name: "",
    slug: "",
    description: "",
    targetRole: "teacher",
    price: 0,
    currency: "GBP",
    billingPeriod: "monthly",
    features: [],
    limits: {},
    trialDays: 0,
    isActive: true,
    isDefault: false,
    sortOrder: 0,
    highlight: "",
    discountPercent: 0,
  });

  const [formData, setFormData] = useState<Partial<CreatePlanRequest>>(getInitialFormData());

  // Update form data when plan changes or modal opens
  useEffect(() => {
    if (isOpen) {
      if (plan && !isCreateMode) {
        setFormData({
          name: plan.name || "",
          slug: plan.slug || "",
          description: plan.description || "",
          targetRole: plan.targetRole || "teacher",
          price: plan.price || 0,
          currency: plan.currency || "GBP",
          billingPeriod: plan.billingPeriod || "monthly",
          features: plan.features || [],
          limits: plan.limits || {},
          trialDays: plan.trialDays || 0,
          isActive: plan.isActive ?? true,
          isDefault: plan.isDefault ?? false,
          sortOrder: plan.sortOrder || 0,
          highlight: plan.highlight || "",
          discountPercent: plan.discountPercent || 0,
        });
      } else {
        // Reset to initial state for create mode
        setFormData(getInitialFormData());
      }
    }
  }, [plan, isCreateMode, isOpen]);

  const createMutation = useMutation({
    mutationFn: (data: CreatePlanRequest) => adminSubscriptionApi.createPlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminSubscriptionPlans"] });
      customToast.success("Plan created", "The new subscription plan has been added");
      onClose();
    },
    onError: (error: any) => {
      customToast.error("Error", error.message || "Failed to create plan");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { planId: string; updates: Partial<CreatePlanRequest> }) =>
      adminSubscriptionApi.updatePlan(data.planId, data.updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminSubscriptionPlans"] });
      customToast.success("Plan updated", "The subscription plan has been updated");
      onClose();
    },
    onError: (error: any) => {
      customToast.error("Error", error.message || "Failed to update plan");
    },
  });

  const handleSubmit = () => {
    if (isCreateMode) {
      createMutation.mutate(formData as CreatePlanRequest);
    } else if (plan) {
      updateMutation.mutate({ planId: plan._id, updates: formData });
    }
  };

  const toggleFeature = (featureKey: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features?.includes(featureKey)
        ? prev.features.filter((f) => f !== featureKey)
        : [...(prev.features || []), featureKey],
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isCreateMode ? "Create Plan" : "Edit Plan"}</DialogTitle>
          <DialogDescription>
            {isCreateMode
              ? "Create a new subscription plan"
              : "Update the subscription plan details"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Plan Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Creator"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })
                }
                placeholder="e.g., teacher-creator"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what this plan offers"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Target Role *</Label>
              <Select
                value={formData.targetRole}
                onValueChange={(value: SubscribableRole) =>
                  setFormData({ ...formData, targetRole: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="school">School</SelectItem>
                  <SelectItem value="recruiter">Recruiter</SelectItem>
                  <SelectItem value="supplier">Supplier</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price (pence) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
              />
              <p className="text-xs text-muted-foreground">
                £{((formData.price || 0) / 100).toFixed(2)}
              </p>
            </div>
            <div className="space-y-2">
              <Label>Billing Period *</Label>
              <Select
                value={formData.billingPeriod}
                onValueChange={(value: BillingPeriod) =>
                  setFormData({ ...formData, billingPeriod: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="annual">Annual</SelectItem>
                  <SelectItem value="lifetime">Lifetime</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="trialDays">Trial Days</Label>
              <Input
                id="trialDays"
                type="number"
                value={formData.trialDays}
                onChange={(e) => setFormData({ ...formData, trialDays: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discountPercent">Discount %</Label>
              <Input
                id="discountPercent"
                type="number"
                max={100}
                value={formData.discountPercent}
                onChange={(e) =>
                  setFormData({ ...formData, discountPercent: parseInt(e.target.value) || 0 })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sortOrder">Sort Order</Label>
              <Input
                id="sortOrder"
                type="number"
                value={formData.sortOrder}
                onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="highlight">Highlight Badge</Label>
            <Input
              id="highlight"
              value={formData.highlight}
              onChange={(e) => setFormData({ ...formData, highlight: e.target.value })}
              placeholder="e.g., Most Popular, Best Value"
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label>Active</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.isDefault}
                onCheckedChange={(checked) => setFormData({ ...formData, isDefault: checked })}
              />
              <Label>Default for role</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Features Included</Label>
            <div className="grid grid-cols-2 gap-2 p-3 border rounded-lg max-h-40 overflow-y-auto">
              {features.map((feature) => (
                <div key={feature._id} className="flex items-center gap-2">
                  <Checkbox
                    checked={formData.features?.includes(feature.key)}
                    onCheckedChange={() => toggleFeature(feature.key)}
                  />
                  <span className="text-sm">{feature.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {createMutation.isPending || updateMutation.isPending
              ? "Saving..."
              : isCreateMode
              ? "Create Plan"
              : "Update Plan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ============================================
// FEATURES SECTION
// ============================================

const FeaturesSection = () => {
  const { data: features, isLoading } = useQuery({
    queryKey: ["adminSubscriptionFeatures"],
    queryFn: () => adminSubscriptionApi.getAllFeatures(),
  });

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  // Group features by category
  const featuresByCategory = (features || []).reduce((acc, feature) => {
    if (!acc[feature.category]) {
      acc[feature.category] = [];
    }
    acc[feature.category].push(feature);
    return acc;
  }, {} as Record<string, Feature[]>);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <div>
            <CardTitle>Feature Definitions</CardTitle>
            <CardDescription>
              Features that can be included in subscription plans
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(featuresByCategory).map(([category, categoryFeatures]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold mb-2 capitalize text-muted-foreground">
                {category}
              </h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Key</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categoryFeatures.map((feature) => (
                    <TableRow key={feature._id}>
                      <TableCell className="font-mono text-sm">{feature.key}</TableCell>
                      <TableCell>{feature.name}</TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {feature.applicableRoles.map((role) => (
                            <Badge key={role} variant="outline" className="text-xs">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={feature.isActive ? "default" : "secondary"}>
                          {feature.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// ============================================
// ANALYTICS SECTION
// ============================================

const AnalyticsSection = () => {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["adminSubscriptionAnalytics"],
    queryFn: () => adminSubscriptionApi.getAnalytics(),
  });

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Subscriptions</p>
                <p className="text-2xl font-bold">{analytics?.totalActiveSubscriptions || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Trial Users</p>
                <p className="text-2xl font-bold">{analytics?.totalTrialSubscriptions || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <CreditCard className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">
                  £{(analytics?.totalRevenue || 0).toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-100 dark:bg-amber-900 rounded-lg">
                <TrendingUp className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">MRR</p>
                <p className="text-2xl font-bold">
                  £{(analytics?.monthlyRecurringRevenue || 0).toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Subscriptions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Recent Subscriptions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analytics?.recentSubscriptions?.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{sub.userName}</p>
                      <p className="text-sm text-muted-foreground">{sub.userEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>{sub.planName}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        sub.status === "active"
                          ? "default"
                          : sub.status === "trial"
                          ? "outline"
                          : "secondary"
                      }
                    >
                      {sub.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              )) || (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No subscriptions yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const SubscriptionSettings = () => {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Subscription Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage subscription plans, features, and enforcement settings
          </p>
        </div>

        <Tabs defaultValue="settings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="plans">Plans</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="space-y-6">
            <GlobalToggleSection />
          </TabsContent>

          <TabsContent value="plans" className="space-y-6">
            <PlansSection />
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <FeaturesSection />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsSection />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SubscriptionSettings;
