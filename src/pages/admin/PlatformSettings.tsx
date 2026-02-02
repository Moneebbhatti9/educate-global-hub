import { useState } from "react";
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
  PoundSterling,
  DollarSign,
  Save,
  RefreshCw,
  Award,
  Receipt,
  CreditCard,
  Crown,
  Sparkles,
  Check,
  X,
  Pencil,
  Building2,
  FileText,
  Globe,
  Plus,
  Trash2,
  Zap,
  Users,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { adminApi, PlatformSettings as PlatformSettingsType } from "@/apis/admin";
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
// SUBSCRIPTION TAB - GLOBAL TOGGLE SECTION
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
// SUBSCRIPTION TAB - PLANS SECTION
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
  const [formData, setFormData] = useState<Partial<CreatePlanRequest>>({
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

  // Update form data when plan changes
  useState(() => {
    if (plan && !isCreateMode) {
      setFormData({
        name: plan.name,
        slug: plan.slug,
        description: plan.description,
        targetRole: plan.targetRole,
        price: plan.price,
        currency: plan.currency,
        billingPeriod: plan.billingPeriod,
        features: plan.features,
        limits: plan.limits,
        trialDays: plan.trialDays,
        isActive: plan.isActive,
        isDefault: plan.isDefault,
        sortOrder: plan.sortOrder,
        highlight: plan.highlight || "",
        discountPercent: plan.discountPercent,
      });
    }
  });

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
// SUBSCRIPTION TAB - FEATURES SECTION
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
// SUBSCRIPTION TAB - ANALYTICS SECTION
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
// SUBSCRIPTION TAB - MAIN COMPONENT
// ============================================

const SubscriptionTab = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="settings" className="space-y-4">
        <TabsList className="grid w-full max-w-xl grid-cols-4">
          <TabsTrigger value="settings" className="text-xs sm:text-sm">
            <Settings className="w-4 h-4 mr-1 hidden sm:inline" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="plans" className="text-xs sm:text-sm">
            <Crown className="w-4 h-4 mr-1 hidden sm:inline" />
            Plans
          </TabsTrigger>
          <TabsTrigger value="features" className="text-xs sm:text-sm">
            <Sparkles className="w-4 h-4 mr-1 hidden sm:inline" />
            Features
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs sm:text-sm">
            <BarChart3 className="w-4 h-4 mr-1 hidden sm:inline" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-4">
          <GlobalToggleSection />
        </TabsContent>

        <TabsContent value="plans" className="space-y-4">
          <PlansSection />
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <FeaturesSection />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <AnalyticsSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// ============================================
// FINANCIAL SETTINGS TAB COMPONENT
// ============================================

const FinancialSettingsTab = () => {
  const queryClient = useQueryClient();

  // Modal states
  const [tierModalOpen, setTierModalOpen] = useState(false);
  const [vatModalOpen, setVatModalOpen] = useState(false);
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);

  // Edit states
  const [editedTiers, setEditedTiers] = useState<{
    bronze: { royaltyRatePercent: number; minSales: number; maxSales: number };
    silver: { royaltyRatePercent: number; minSales: number; maxSales: number };
    gold: { royaltyRatePercent: number; minSales: number; maxSales: number };
  } | null>(null);

  const [editedVat, setEditedVat] = useState<{
    enabled: boolean;
    ratePercent: number;
    pricingType: "inclusive" | "exclusive";
    applicableRegions: string[];
    b2bReverseCharge: {
      enabled: boolean;
      requireVatNumber: boolean;
    };
  } | null>(null);

  const [editedPayout, setEditedPayout] = useState<{
    GBP: number;
    USD: number;
    EUR: number;
  } | null>(null);

  const [editedInvoice, setEditedInvoice] = useState<{
    autoGenerate: boolean;
    sendToEmail: boolean;
    companyName: string;
    companyAddress: string;
    vatNumber: string;
    invoicePrefix: string;
  } | null>(null);

  // Fetch platform settings
  const { data: settingsData, isLoading, refetch } = useQuery({
    queryKey: ["platformSettings"],
    queryFn: async () => {
      const response = await adminApi.getPlatformSettings();
      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to fetch settings");
      }
      return response.data;
    },
  });

  // Update tier settings mutation
  const updateTiersMutation = useMutation({
    mutationFn: async (tiers: typeof editedTiers) => {
      if (!tiers) return;
      return adminApi.updateTierSettings({
        tiers: {
          bronze: {
            royaltyRate: tiers.bronze.royaltyRatePercent / 100,
            minSales: tiers.bronze.minSales,
            maxSales: tiers.bronze.maxSales,
          },
          silver: {
            royaltyRate: tiers.silver.royaltyRatePercent / 100,
            minSales: tiers.silver.minSales,
            maxSales: tiers.silver.maxSales,
          },
          gold: {
            royaltyRate: tiers.gold.royaltyRatePercent / 100,
            minSales: tiers.gold.minSales,
            maxSales: tiers.gold.maxSales,
          },
        },
      });
    },
    onSuccess: () => {
      customToast.success("Tier settings updated successfully");
      queryClient.invalidateQueries({ queryKey: ["platformSettings"] });
      setTierModalOpen(false);
      setEditedTiers(null);
    },
    onError: (error: Error) => {
      customToast.error(error.message || "Failed to update tier settings");
    },
  });

  // Update VAT settings mutation
  const updateVatMutation = useMutation({
    mutationFn: async (vat: typeof editedVat) => {
      if (!vat) return;
      return adminApi.updateVatSettings({
        vat: {
          enabled: vat.enabled,
          rate: vat.ratePercent / 100,
          pricingType: vat.pricingType,
          applicableRegions: vat.applicableRegions,
          b2bReverseCharge: vat.b2bReverseCharge,
        },
      });
    },
    onSuccess: () => {
      customToast.success("VAT settings updated successfully");
      queryClient.invalidateQueries({ queryKey: ["platformSettings"] });
      setVatModalOpen(false);
      setEditedVat(null);
    },
    onError: (error: Error) => {
      customToast.error(error.message || "Failed to update VAT settings");
    },
  });

  // Update minimum payout mutation
  const updatePayoutMutation = useMutation({
    mutationFn: async (payout: typeof editedPayout) => {
      if (!payout) return;
      return adminApi.updateMinimumPayout({
        minimumPayout: {
          GBP: payout.GBP,
          USD: payout.USD,
          EUR: payout.EUR,
        },
      });
    },
    onSuccess: () => {
      customToast.success("Minimum payout thresholds updated successfully");
      queryClient.invalidateQueries({ queryKey: ["platformSettings"] });
      setPayoutModalOpen(false);
      setEditedPayout(null);
    },
    onError: (error: Error) => {
      customToast.error(error.message || "Failed to update payout thresholds");
    },
  });

  // Update invoice settings mutation
  const updateInvoiceMutation = useMutation({
    mutationFn: async (invoice: typeof editedInvoice) => {
      if (!invoice) return;
      return adminApi.updateVatSettings({
        vat: {
          invoiceSettings: invoice,
        },
      });
    },
    onSuccess: () => {
      customToast.success("Invoice settings updated successfully");
      queryClient.invalidateQueries({ queryKey: ["platformSettings"] });
      setInvoiceModalOpen(false);
      setEditedInvoice(null);
    },
    onError: (error: Error) => {
      customToast.error(error.message || "Failed to update invoice settings");
    },
  });

  // Open tier modal
  const openTierModal = () => {
    if (settingsData?.tiers) {
      setEditedTiers({
        bronze: {
          royaltyRatePercent: settingsData.tiers.bronze?.royaltyRatePercent ?? 60,
          minSales: settingsData.tiers.bronze?.minSales ?? 0,
          maxSales: settingsData.tiers.bronze?.maxSales ?? 999.99,
        },
        silver: {
          royaltyRatePercent: settingsData.tiers.silver?.royaltyRatePercent ?? 70,
          minSales: settingsData.tiers.silver?.minSales ?? 1000,
          maxSales: settingsData.tiers.silver?.maxSales ?? 5999.99,
        },
        gold: {
          royaltyRatePercent: settingsData.tiers.gold?.royaltyRatePercent ?? 80,
          minSales: settingsData.tiers.gold?.minSales ?? 6000,
          maxSales: Infinity,
        },
      });
      setTierModalOpen(true);
    }
  };

  // Open VAT modal
  const openVatModal = () => {
    if (settingsData?.vat) {
      setEditedVat({
        enabled: settingsData.vat.enabled ?? true,
        ratePercent: settingsData.vat.ratePercent ?? 20,
        pricingType: settingsData.vat.pricingType ?? "inclusive",
        applicableRegions: settingsData.vat.applicableRegions ?? ["UK", "EU"],
        b2bReverseCharge: settingsData.vat.b2bReverseCharge ?? {
          enabled: true,
          requireVatNumber: true,
        },
      });
      setVatModalOpen(true);
    }
  };

  // Open payout modal
  const openPayoutModal = () => {
    if (settingsData?.minimumPayout) {
      setEditedPayout({
        GBP: settingsData.minimumPayout.GBP ?? 5000,
        USD: settingsData.minimumPayout.USD ?? 6500,
        EUR: settingsData.minimumPayout.EUR ?? 6000,
      });
      setPayoutModalOpen(true);
    }
  };

  // Open invoice modal
  const openInvoiceModal = () => {
    if (settingsData?.vat?.invoiceSettings) {
      setEditedInvoice({
        autoGenerate: settingsData.vat.invoiceSettings.autoGenerate ?? true,
        sendToEmail: settingsData.vat.invoiceSettings.sendToEmail ?? true,
        companyName: settingsData.vat.invoiceSettings.companyName ?? "Educate Link Ltd",
        companyAddress: settingsData.vat.invoiceSettings.companyAddress ?? "",
        vatNumber: settingsData.vat.invoiceSettings.vatNumber ?? "",
        invoicePrefix: settingsData.vat.invoiceSettings.invoicePrefix ?? "INV",
      });
      setInvoiceModalOpen(true);
    }
  };

  // Save handlers
  const handleSaveTiers = () => {
    if (editedTiers) {
      if (
        editedTiers.bronze.royaltyRatePercent < 0 ||
        editedTiers.bronze.royaltyRatePercent > 100 ||
        editedTiers.silver.royaltyRatePercent < 0 ||
        editedTiers.silver.royaltyRatePercent > 100 ||
        editedTiers.gold.royaltyRatePercent < 0 ||
        editedTiers.gold.royaltyRatePercent > 100
      ) {
        customToast.error("Royalty rates must be between 0% and 100%");
        return;
      }

      if (editedTiers.bronze.maxSales >= editedTiers.silver.minSales) {
        customToast.error("Bronze max sales must be less than Silver min sales");
        return;
      }
      if (editedTiers.silver.maxSales >= editedTiers.gold.minSales) {
        customToast.error("Silver max sales must be less than Gold min sales");
        return;
      }

      updateTiersMutation.mutate(editedTiers);
    }
  };

  const handleSaveVat = () => {
    if (editedVat) {
      if (editedVat.ratePercent < 0 || editedVat.ratePercent > 100) {
        customToast.error("VAT rate must be between 0% and 100%");
        return;
      }
      updateVatMutation.mutate(editedVat);
    }
  };

  const handleSavePayout = () => {
    if (editedPayout) {
      if (editedPayout.GBP < 0 || editedPayout.USD < 0 || editedPayout.EUR < 0) {
        customToast.error("Payout thresholds must be positive");
        return;
      }
      updatePayoutMutation.mutate(editedPayout);
    }
  };

  const handleSaveInvoice = () => {
    if (editedInvoice) {
      updateInvoiceMutation.mutate(editedInvoice);
    }
  };

  const getTierBadgeColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case "bronze":
        return "bg-amber-600";
      case "silver":
        return "bg-gray-400";
      case "gold":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tier/Royalty Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              <div>
                <CardTitle>Seller Tier & Royalty Rates</CardTitle>
                <CardDescription>
                  Configure royalty rates and sales thresholds for each seller tier
                </CardDescription>
              </div>
            </div>
            <Button onClick={openTierModal}>
              <Pencil className="w-4 h-4 mr-2" />
              Edit Tiers
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tier</TableHead>
                <TableHead className="text-center">Seller Royalty</TableHead>
                <TableHead className="text-center">Platform Fee</TableHead>
                <TableHead className="text-center">Min Sales (GBP)</TableHead>
                <TableHead className="text-center">Max Sales (GBP)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {settingsData?.tiers &&
                (["bronze", "silver", "gold"] as const).map((tierKey) => {
                  const tier = settingsData.tiers[tierKey];
                  return (
                    <TableRow key={tierKey}>
                      <TableCell>
                        <Badge className={`${getTierBadgeColor(tierKey)} text-white`}>
                          {tier?.name || tierKey}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-semibold text-green-600">
                          {tier?.royaltyRatePercent}%
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-orange-600">{tier?.platformFeePercent}%</span>
                      </TableCell>
                      <TableCell className="text-center">{tier?.minSalesFormatted}</TableCell>
                      <TableCell className="text-center">{tier?.maxSalesFormatted}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* VAT Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-primary" />
              <div>
                <CardTitle>VAT Settings</CardTitle>
                <CardDescription>
                  Configure VAT collection, rates, and B2B reverse charge
                </CardDescription>
              </div>
            </div>
            <Button onClick={openVatModal}>
              <Pencil className="w-4 h-4 mr-2" />
              Edit VAT
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label className="text-muted-foreground">VAT Collection</Label>
              <div className="flex items-center gap-2">
                {settingsData?.vat?.enabled ? (
                  <Badge className="bg-green-600 text-white">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Enabled
                  </Badge>
                ) : (
                  <Badge variant="secondary">Disabled</Badge>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Default UK VAT Rate</Label>
              <p className="text-2xl font-bold">{settingsData?.vat?.ratePercent ?? 0}%</p>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Pricing Type</Label>
              <Badge variant="outline" className="capitalize">
                {settingsData?.vat?.pricingType || "inclusive"}
              </Badge>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">B2B Reverse Charge</Label>
              <div className="flex items-center gap-2">
                {settingsData?.vat?.b2bReverseCharge?.enabled ? (
                  <Badge className="bg-blue-600 text-white">
                    <Building2 className="w-3 h-3 mr-1" />
                    Enabled for Schools
                  </Badge>
                ) : (
                  <Badge variant="secondary">Disabled</Badge>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <Label className="text-muted-foreground">Applicable Regions</Label>
            <div className="flex flex-wrap gap-1">
              {settingsData?.vat?.applicableRegions?.map((region) => (
                <Badge key={region} variant="outline">
                  <Globe className="w-3 h-3 mr-1" />
                  {region}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <div>
                <CardTitle>Invoice Settings</CardTitle>
                <CardDescription>
                  Configure automatic invoice generation and company details
                </CardDescription>
              </div>
            </div>
            <Button onClick={openInvoiceModal}>
              <Pencil className="w-4 h-4 mr-2" />
              Edit Invoice
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Auto-Generate Invoices</Label>
              <div className="flex items-center gap-2">
                {settingsData?.vat?.invoiceSettings?.autoGenerate ? (
                  <Badge className="bg-green-600 text-white">Yes</Badge>
                ) : (
                  <Badge variant="secondary">No</Badge>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Send to Email</Label>
              <div className="flex items-center gap-2">
                {settingsData?.vat?.invoiceSettings?.sendToEmail ? (
                  <Badge className="bg-green-600 text-white">Yes</Badge>
                ) : (
                  <Badge variant="secondary">No</Badge>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Invoice Prefix</Label>
              <p className="font-semibold">{settingsData?.vat?.invoiceSettings?.invoicePrefix || "INV"}</p>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Company Name</Label>
              <p className="font-semibold">{settingsData?.vat?.invoiceSettings?.companyName || "Not set"}</p>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">VAT Number</Label>
              <p className="font-semibold">{settingsData?.vat?.invoiceSettings?.vatNumber || "Not set"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Minimum Payout Thresholds */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              <div>
                <CardTitle>Minimum Payout Thresholds</CardTitle>
                <CardDescription>
                  Minimum balance required before sellers can request withdrawals
                </CardDescription>
              </div>
            </div>
            <Button onClick={openPayoutModal}>
              <Pencil className="w-4 h-4 mr-2" />
              Edit Thresholds
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10">
              <div className="flex items-center gap-2 mb-2">
                <PoundSterling className="w-5 h-5 text-blue-600" />
                <Label className="text-lg">GBP</Label>
              </div>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {settingsData?.minimumPayout?.GBPFormatted ?? "£0.00"}
              </p>
            </div>

            <div className="p-4 border rounded-lg bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/10">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <Label className="text-lg">USD</Label>
              </div>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                {settingsData?.minimumPayout?.USDFormatted ?? "$0.00"}
              </p>
            </div>

            <div className="p-4 border rounded-lg bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/10">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-5 h-5 text-purple-600 text-lg font-bold">€</span>
                <Label className="text-lg">EUR</Label>
              </div>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                {settingsData?.minimumPayout?.EURFormatted ?? "€0.00"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Last Updated Info */}
      {settingsData?.lastUpdatedAt && (
        <div className="text-sm text-muted-foreground text-right">
          Last updated: {new Date(settingsData.lastUpdatedAt).toLocaleString()}
        </div>
      )}

      {/* ===== MODALS ===== */}

      {/* Tier Edit Modal */}
      <Dialog open={tierModalOpen} onOpenChange={setTierModalOpen}>
        <DialogContent className="w-[95vw] sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Edit Seller Tier Settings
            </DialogTitle>
            <DialogDescription>
              Configure royalty rates and sales thresholds for each seller tier.
            </DialogDescription>
          </DialogHeader>

          {editedTiers && (
            <div className="space-y-6 py-4">
              {(["bronze", "silver", "gold"] as const).map((tierKey) => (
                <div key={tierKey} className="space-y-3 p-4 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Badge className={`${getTierBadgeColor(tierKey)} text-white`}>
                      {tierKey.charAt(0).toUpperCase() + tierKey.slice(1)}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Royalty Rate (%)</Label>
                      <Input
                        type="number"
                        value={editedTiers[tierKey].royaltyRatePercent}
                        onChange={(e) =>
                          setEditedTiers((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  [tierKey]: {
                                    ...prev[tierKey],
                                    royaltyRatePercent: Number(e.target.value),
                                  },
                                }
                              : null
                          )
                        }
                        min={0}
                        max={100}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Min Sales (£)</Label>
                      <Input
                        type="number"
                        value={editedTiers[tierKey].minSales}
                        onChange={(e) =>
                          setEditedTiers((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  [tierKey]: {
                                    ...prev[tierKey],
                                    minSales: Number(e.target.value),
                                  },
                                }
                              : null
                          )
                        }
                        min={0}
                      />
                    </div>

                    {tierKey !== "gold" && (
                      <div className="space-y-2">
                        <Label>Max Sales (£)</Label>
                        <Input
                          type="number"
                          value={editedTiers[tierKey].maxSales}
                          onChange={(e) =>
                            setEditedTiers((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    [tierKey]: {
                                      ...prev[tierKey],
                                      maxSales: Number(e.target.value),
                                    },
                                  }
                                : null
                            )
                          }
                          min={0}
                        />
                      </div>
                    )}

                    {tierKey === "gold" && (
                      <div className="space-y-2">
                        <Label>Max Sales</Label>
                        <p className="text-sm text-muted-foreground mt-2">Unlimited</p>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Platform Fee: {100 - editedTiers[tierKey].royaltyRatePercent}%
                  </p>
                </div>
              ))}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setTierModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTiers} disabled={updateTiersMutation.isPending}>
              {updateTiersMutation.isPending ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* VAT Edit Modal */}
      <Dialog open={vatModalOpen} onOpenChange={setVatModalOpen}>
        <DialogContent className="w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="w-5 h-5" />
              Edit VAT Settings
            </DialogTitle>
            <DialogDescription>
              Configure VAT collection and B2B reverse charge settings.
            </DialogDescription>
          </DialogHeader>

          {editedVat && (
            <div className="space-y-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable VAT Collection</Label>
                  <p className="text-sm text-muted-foreground">
                    Apply VAT to purchases from UK/EU buyers
                  </p>
                </div>
                <Switch
                  checked={editedVat.enabled}
                  onCheckedChange={(checked) =>
                    setEditedVat((prev) => (prev ? { ...prev, enabled: checked } : null))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Default UK VAT Rate (%)</Label>
                <Input
                  type="number"
                  value={editedVat.ratePercent}
                  onChange={(e) =>
                    setEditedVat((prev) =>
                      prev ? { ...prev, ratePercent: Number(e.target.value) } : null
                    )
                  }
                  min={0}
                  max={100}
                  disabled={!editedVat.enabled}
                />
              </div>

              <div className="space-y-2">
                <Label>Pricing Type</Label>
                <Select
                  value={editedVat.pricingType}
                  onValueChange={(value: "inclusive" | "exclusive") =>
                    setEditedVat((prev) =>
                      prev ? { ...prev, pricingType: value } : null
                    )
                  }
                  disabled={!editedVat.enabled}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inclusive">VAT Inclusive (prices include VAT)</SelectItem>
                    <SelectItem value="exclusive">VAT Exclusive (VAT added at checkout)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Applicable Regions</Label>
                <div className="flex flex-wrap gap-2">
                  {["UK", "EU"].map((region) => (
                    <Badge
                      key={region}
                      variant={editedVat.applicableRegions.includes(region) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() =>
                        setEditedVat((prev) => {
                          if (!prev) return null;
                          const regions = prev.applicableRegions.includes(region)
                            ? prev.applicableRegions.filter((r) => r !== region)
                            : [...prev.applicableRegions, region];
                          return { ...prev, applicableRegions: regions };
                        })
                      }
                    >
                      {region}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>B2B Reverse Charge (Schools)</Label>
                    <p className="text-sm text-muted-foreground">
                      No VAT charged to Schools with valid VAT number
                    </p>
                  </div>
                  <Switch
                    checked={editedVat.b2bReverseCharge.enabled}
                    onCheckedChange={(checked) =>
                      setEditedVat((prev) =>
                        prev
                          ? {
                              ...prev,
                              b2bReverseCharge: { ...prev.b2bReverseCharge, enabled: checked },
                            }
                          : null
                      )
                    }
                    disabled={!editedVat.enabled}
                  />
                </div>

                {editedVat.b2bReverseCharge.enabled && (
                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <Label>Require VAT Number</Label>
                      <p className="text-sm text-muted-foreground">
                        Schools must provide VAT number for reverse charge
                      </p>
                    </div>
                    <Switch
                      checked={editedVat.b2bReverseCharge.requireVatNumber}
                      onCheckedChange={(checked) =>
                        setEditedVat((prev) =>
                          prev
                            ? {
                                ...prev,
                                b2bReverseCharge: {
                                  ...prev.b2bReverseCharge,
                                  requireVatNumber: checked,
                                },
                              }
                            : null
                        )
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setVatModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveVat} disabled={updateVatMutation.isPending}>
              {updateVatMutation.isPending ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payout Edit Modal */}
      <Dialog open={payoutModalOpen} onOpenChange={setPayoutModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Edit Minimum Payout Thresholds
            </DialogTitle>
            <DialogDescription>
              Set the minimum balance required before sellers can withdraw funds.
            </DialogDescription>
          </DialogHeader>

          {editedPayout && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <PoundSterling className="w-4 h-4" />
                  GBP Minimum (in pounds)
                </Label>
                <Input
                  type="number"
                  value={editedPayout.GBP / 100}
                  onChange={(e) =>
                    setEditedPayout((prev) =>
                      prev ? { ...prev, GBP: Number(e.target.value) * 100 } : null
                    )
                  }
                  min={0}
                  step={0.01}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  USD Minimum (in dollars)
                </Label>
                <Input
                  type="number"
                  value={editedPayout.USD / 100}
                  onChange={(e) =>
                    setEditedPayout((prev) =>
                      prev ? { ...prev, USD: Number(e.target.value) * 100 } : null
                    )
                  }
                  min={0}
                  step={0.01}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <span className="text-lg">€</span>
                  EUR Minimum (in euros)
                </Label>
                <Input
                  type="number"
                  value={editedPayout.EUR / 100}
                  onChange={(e) =>
                    setEditedPayout((prev) =>
                      prev ? { ...prev, EUR: Number(e.target.value) * 100 } : null
                    )
                  }
                  min={0}
                  step={0.01}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setPayoutModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePayout} disabled={updatePayoutMutation.isPending}>
              {updatePayoutMutation.isPending ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invoice Settings Modal */}
      <Dialog open={invoiceModalOpen} onOpenChange={setInvoiceModalOpen}>
        <DialogContent className="w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Edit Invoice Settings
            </DialogTitle>
            <DialogDescription>
              Configure automatic invoice generation and company details for invoices.
            </DialogDescription>
          </DialogHeader>

          {editedInvoice && (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-Generate Invoices</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically create invoice after each purchase
                  </p>
                </div>
                <Switch
                  checked={editedInvoice.autoGenerate}
                  onCheckedChange={(checked) =>
                    setEditedInvoice((prev) =>
                      prev ? { ...prev, autoGenerate: checked } : null
                    )
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Send Invoice to Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Email invoice to buyer after purchase
                  </p>
                </div>
                <Switch
                  checked={editedInvoice.sendToEmail}
                  onCheckedChange={(checked) =>
                    setEditedInvoice((prev) =>
                      prev ? { ...prev, sendToEmail: checked } : null
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Invoice Number Prefix</Label>
                <Input
                  value={editedInvoice.invoicePrefix}
                  onChange={(e) =>
                    setEditedInvoice((prev) =>
                      prev ? { ...prev, invoicePrefix: e.target.value } : null
                    )
                  }
                  placeholder="INV"
                />
              </div>

              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input
                  value={editedInvoice.companyName}
                  onChange={(e) =>
                    setEditedInvoice((prev) =>
                      prev ? { ...prev, companyName: e.target.value } : null
                    )
                  }
                  placeholder="Educate Link Ltd"
                />
              </div>

              <div className="space-y-2">
                <Label>Company Address</Label>
                <Textarea
                  value={editedInvoice.companyAddress}
                  onChange={(e) =>
                    setEditedInvoice((prev) =>
                      prev ? { ...prev, companyAddress: e.target.value } : null
                    )
                  }
                  placeholder="123 Business Street, City, Postcode"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>VAT Registration Number</Label>
                <Input
                  value={editedInvoice.vatNumber}
                  onChange={(e) =>
                    setEditedInvoice((prev) =>
                      prev ? { ...prev, vatNumber: e.target.value } : null
                    )
                  }
                  placeholder="GB123456789"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setInvoiceModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveInvoice} disabled={updateInvoiceMutation.isPending}>
              {updateInvoiceMutation.isPending ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const PlatformSettings = () => {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
            Subscription & Financial Settings
          </h1>
          <p className="text-muted-foreground">
            Manage subscription plans, royalty rates, VAT, and payment configurations
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="subscription" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="subscription">
              <Crown className="w-4 h-4 mr-2" />
              Subscription
            </TabsTrigger>
            <TabsTrigger value="financial">
              <CreditCard className="w-4 h-4 mr-2" />
              Tier, VAT & Payout
            </TabsTrigger>
          </TabsList>

          <TabsContent value="subscription" className="mt-6">
            <SubscriptionTab />
          </TabsContent>

          <TabsContent value="financial" className="mt-6">
            <FinancialSettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default PlatformSettings;
