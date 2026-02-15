import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  RefreshCw,
  Database,
  CreditCard,
  Cloud,
  Wifi,
  CheckCircle,
  XCircle,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { healthApi } from "@/apis/health";
import type {
  ServiceCheck,
  FeatureFlag,
  DataConsistency,
  SubscriptionConsistencyDetail,
} from "@/apis/health";

// ============================================
// HELPERS
// ============================================

const formatUptime = (seconds: number): string => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  parts.push(`${minutes}m`);

  return parts.join(" ");
};

const SERVICE_CONFIG = {
  mongodb: { label: "MongoDB", icon: Database },
  stripe: { label: "Stripe", icon: CreditCard },
  cloudinary: { label: "Cloudinary", icon: Cloud },
  socketio: { label: "Socket.IO", icon: Wifi },
} as const;

type ServiceKey = keyof typeof SERVICE_CONFIG;

// ============================================
// SERVICE HEALTH CARD
// ============================================

interface ServiceCardProps {
  serviceKey: ServiceKey;
  check: ServiceCheck;
}

const ServiceCard = ({ serviceKey, check }: ServiceCardProps) => {
  const config = SERVICE_CONFIG[serviceKey];
  const Icon = config.icon;
  const isHealthy = check.status === "healthy";

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`p-2 rounded-lg ${
                isHealthy
                  ? "bg-green-100 dark:bg-green-900"
                  : "bg-red-100 dark:bg-red-900"
              }`}
            >
              <Icon
                className={`w-5 h-5 ${
                  isHealthy ? "text-green-600" : "text-red-600"
                }`}
              />
            </div>
            <CardTitle className="text-base">{config.label}</CardTitle>
          </div>
          <Badge
            className={
              isHealthy
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            }
          >
            {isHealthy ? "Healthy" : "Unhealthy"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        {isHealthy && check.latency !== undefined && (
          <p className="text-sm text-muted-foreground">
            Latency: {check.latency}ms
          </p>
        )}
        {serviceKey === "socketio" &&
          isHealthy &&
          check.connectedClients !== undefined && (
            <p className="text-sm text-muted-foreground">
              {check.connectedClients} connected client
              {check.connectedClients !== 1 ? "s" : ""}
            </p>
          )}
        {!isHealthy && check.error && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {check.error}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

// ============================================
// SERVICE HEALTH SECTION
// ============================================

const ServiceHealthSection = () => {
  const {
    data: healthData,
    isLoading,
    isError,
    error,
    refetch: refetchHealth,
  } = useQuery({
    queryKey: ["systemHealth"],
    queryFn: healthApi.getSystemHealth,
    refetchInterval: 30000,
    staleTime: 10000,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <XCircle className="w-10 h-10 text-red-500" />
            <p className="text-muted-foreground">
              Failed to load system health data.
            </p>
            <p className="text-sm text-red-600">
              {(error as Error)?.message || "Unknown error"}
            </p>
            <Button variant="outline" onClick={() => refetchHealth()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!healthData) return null;

  const isAllHealthy = healthData.status === "healthy";

  return (
    <div className="space-y-4">
      {/* Overall status banner */}
      <div
        className={`flex items-center gap-3 p-4 rounded-lg ${
          isAllHealthy
            ? "bg-green-50 border border-green-200 dark:bg-green-950 dark:border-green-800"
            : "bg-amber-50 border border-amber-200 dark:bg-amber-950 dark:border-amber-800"
        }`}
      >
        {isAllHealthy ? (
          <CheckCircle className="w-5 h-5 text-green-600" />
        ) : (
          <AlertCircle className="w-5 h-5 text-amber-600" />
        )}
        <p
          className={`font-medium ${
            isAllHealthy
              ? "text-green-800 dark:text-green-200"
              : "text-amber-800 dark:text-amber-200"
          }`}
        >
          {isAllHealthy ? "All Systems Operational" : "System Degraded"}
        </p>
      </div>

      {/* Service cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {(Object.keys(SERVICE_CONFIG) as ServiceKey[]).map((key) => (
          <ServiceCard
            key={key}
            serviceKey={key}
            check={healthData.checks[key]}
          />
        ))}
      </div>
    </div>
  );
};

// ============================================
// FEATURE FLAGS SECTION
// ============================================

const FeatureFlagsSection = () => {
  const {
    data: flagData,
    isLoading,
    isError,
    error,
    refetch: refetchFlags,
  } = useQuery({
    queryKey: ["featureFlags"],
    queryFn: healthApi.getFeatureFlags,
    refetchInterval: 60000,
  });

  if (isLoading) {
    return <Skeleton className="h-48 w-full" />;
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <XCircle className="w-10 h-10 text-red-500" />
            <p className="text-muted-foreground">
              Failed to load feature flags.
            </p>
            <p className="text-sm text-red-600">
              {(error as Error)?.message || "Unknown error"}
            </p>
            <Button variant="outline" onClick={() => refetchFlags()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!flagData) return null;

  // Group features by category
  const featuresByCategory = flagData.features.reduce(
    (acc: Record<string, FeatureFlag[]>, feature: FeatureFlag) => {
      if (!acc[feature.category]) {
        acc[feature.category] = [];
      }
      acc[feature.category].push(feature);
      return acc;
    },
    {} as Record<string, FeatureFlag[]>
  );

  return (
    <div className="space-y-4">
      {/* System Toggles */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">System Toggles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-3">
              {flagData.systemToggles.subscriptions ? (
                <ToggleRight className="w-5 h-5 text-green-600" />
              ) : (
                <ToggleLeft className="w-5 h-5 text-red-500" />
              )}
              <span className="font-medium">Subscriptions</span>
              <Badge
                className={
                  flagData.systemToggles.subscriptions
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                }
              >
                {flagData.systemToggles.subscriptions ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              {flagData.systemToggles.advertisements ? (
                <ToggleRight className="w-5 h-5 text-green-600" />
              ) : (
                <ToggleLeft className="w-5 h-5 text-red-500" />
              )}
              <span className="font-medium">Advertisements</span>
              <Badge
                className={
                  flagData.systemToggles.advertisements
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                }
              >
                {flagData.systemToggles.advertisements
                  ? "Enabled"
                  : "Disabled"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Access */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Feature Access</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(featuresByCategory).length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No features configured.
            </p>
          ) : (
            <div className="space-y-4">
              {Object.entries(featuresByCategory).map(
                ([category, features]) => (
                  <div key={category}>
                    <h4 className="text-sm font-semibold mb-2 capitalize text-muted-foreground">
                      {category}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {features.map((feature: FeatureFlag) => (
                        <div
                          key={feature.key}
                          className="flex items-center justify-between p-2 bg-muted/50 rounded-lg"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {feature.name}
                            </p>
                            <div className="flex gap-1 flex-wrap mt-1">
                              {feature.applicableRoles.map((role: string) => (
                                <Badge
                                  key={role}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {role}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <Badge
                            className={
                              feature.isActive
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 ml-2"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 ml-2"
                            }
                          >
                            {feature.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// ============================================
// DATA CONSISTENCY SECTION
// ============================================

const DataConsistencySection = () => {
  const {
    data: consistencyData,
    isLoading,
    isError,
    error,
    refetch: refetchConsistency,
    isFetching,
  } = useQuery({
    queryKey: ["dataConsistency"],
    queryFn: healthApi.getDataConsistency,
    refetchInterval: 300000, // 5 minutes -- expensive check
    staleTime: 120000,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <XCircle className="w-10 h-10 text-red-500" />
            <p className="text-muted-foreground">
              Failed to load data consistency check.
            </p>
            <p className="text-sm text-red-600">
              {(error as Error)?.message || "Unknown error"}
            </p>
            <Button variant="outline" onClick={() => refetchConsistency()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!consistencyData) return null;

  const { webhookStats, subscriptionConsistency } = consistencyData;
  const hasFailed = webhookStats.failed > 0;
  const hasMismatch = subscriptionConsistency.mismatched > 0;
  const hasErrors = subscriptionConsistency.errors > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">
          Data Consistency
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetchConsistency()}
          disabled={isFetching}
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${isFetching ? "animate-spin" : ""}`}
          />
          Run Consistency Check
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Webhook Health sub-section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Webhook Health</CardTitle>
              {hasFailed ? (
                <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                  {webhookStats.failed} Failed
                </Badge>
              ) : (
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  All Processed
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Last 24h: {webhookStats.processed} processed, {webhookStats.failed}{" "}
              failed, {webhookStats.pending} pending
            </p>
            {webhookStats.total === 0 ? (
              <p className="text-sm text-muted-foreground">
                No webhook events recorded in the last 24 hours.
              </p>
            ) : (
              <>
                <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase">
                  Top Event Types
                </p>
                <div className="space-y-1">
                  {webhookStats.byType.map(
                    (entry: { type: string; count: number }) => (
                      <div
                        key={entry.type}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="font-mono text-xs truncate max-w-[200px]">
                          {entry.type}
                        </span>
                        <Badge variant="outline" className="text-xs ml-2">
                          {entry.count}
                        </Badge>
                      </div>
                    )
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Subscription Consistency sub-section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                Subscription Consistency
              </CardTitle>
              {hasMismatch || hasErrors ? (
                <Badge
                  className={
                    hasMismatch
                      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                  }
                >
                  {hasMismatch
                    ? `${subscriptionConsistency.mismatched} Mismatched`
                    : `${subscriptionConsistency.errors} Errors`}
                </Badge>
              ) : (
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  All Consistent
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Checked {subscriptionConsistency.checked} subscriptions:{" "}
              {subscriptionConsistency.matched} matched,{" "}
              {subscriptionConsistency.mismatched} mismatched,{" "}
              {subscriptionConsistency.errors} errors
            </p>
            {subscriptionConsistency.checked === 0 && (
              <p className="text-sm text-muted-foreground">
                No active subscriptions to check.
              </p>
            )}
            {hasMismatch && (
              <div className="mt-2">
                <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase">
                  Mismatched Subscriptions
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-1 pr-2">Subscription</th>
                        <th className="text-left py-1 pr-2">Platform</th>
                        <th className="text-left py-1">Stripe</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscriptionConsistency.details
                        .filter(
                          (d: SubscriptionConsistencyDetail) => !d.match && !d.error
                        )
                        .map((d: SubscriptionConsistencyDetail) => (
                          <tr key={d.subscriptionId} className="border-b">
                            <td className="py-1 pr-2 font-mono truncate max-w-[120px]">
                              {d.stripeId.slice(-8)}
                            </td>
                            <td className="py-1 pr-2">
                              <Badge
                                variant="outline"
                                className="text-xs bg-blue-50 dark:bg-blue-950"
                              >
                                {d.platformStatus}
                              </Badge>
                            </td>
                            <td className="py-1">
                              <Badge
                                variant="outline"
                                className="text-xs bg-purple-50 dark:bg-purple-950"
                              >
                                {d.stripeStatus}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Last checked timestamp */}
      <p className="text-xs text-muted-foreground text-right">
        Last checked: {new Date(consistencyData.lastChecked).toLocaleTimeString()}
      </p>
    </div>
  );
};

// ============================================
// SYSTEM INFO SECTION
// ============================================

interface SystemInfoSectionProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

const SystemInfoSection = ({
  onRefresh,
  isRefreshing,
}: SystemInfoSectionProps) => {
  const { data: healthData } = useQuery({
    queryKey: ["systemHealth"],
    queryFn: healthApi.getSystemHealth,
    refetchInterval: 30000,
    staleTime: 10000,
  });

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex gap-6 flex-wrap">
            {healthData && (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Uptime</p>
                  <p className="font-medium">
                    {formatUptime(healthData.uptime)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Checked</p>
                  <p className="font-medium">
                    {new Date(healthData.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Latency
                  </p>
                  <p className="font-medium">{healthData.totalLatency}ms</p>
                </div>
              </>
            )}
          </div>
          <Button
            variant="outline"
            onClick={onRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const SystemStatus = () => {
  const {
    refetch: refetchHealth,
    isFetching: isHealthFetching,
  } = useQuery({
    queryKey: ["systemHealth"],
    queryFn: healthApi.getSystemHealth,
    refetchInterval: 30000,
    staleTime: 10000,
  });

  const { refetch: refetchFlags, isFetching: isFlagsFetching } = useQuery({
    queryKey: ["featureFlags"],
    queryFn: healthApi.getFeatureFlags,
    refetchInterval: 60000,
  });

  const { refetch: refetchConsistency, isFetching: isConsistencyFetching } =
    useQuery({
      queryKey: ["dataConsistency"],
      queryFn: healthApi.getDataConsistency,
      refetchInterval: 300000,
      staleTime: 120000,
    });

  const handleRefresh = () => {
    refetchHealth();
    refetchFlags();
    refetchConsistency();
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">System Status</h1>
          <p className="text-muted-foreground mt-2">
            Monitor service health, feature flags, and data consistency
          </p>
        </div>

        {/* Section 1: Service Health */}
        <ServiceHealthSection />

        {/* Section 2: Feature Flags */}
        <FeatureFlagsSection />

        {/* Section 3: Data Consistency */}
        <DataConsistencySection />

        {/* Section 4: System Info */}
        <SystemInfoSection
          onRefresh={handleRefresh}
          isRefreshing={
            isHealthFetching || isFlagsFetching || isConsistencyFetching
          }
        />
      </div>
    </DashboardLayout>
  );
};

export default SystemStatus;
