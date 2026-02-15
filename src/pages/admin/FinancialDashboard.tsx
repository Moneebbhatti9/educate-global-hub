import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { io, type Socket } from "socket.io-client";
import DashboardLayout from "@/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  Users,
  Activity,
  Download,
  PoundSterling,
  RefreshCw,
  School,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  financialApi,
  type FinancialDateParams,
  type Transaction,
  type PerSchoolResponse,
  type CreatorEarningsResponse,
} from "@/apis/financialDashboard";

// ============================================
// CONSTANTS
// ============================================

const STREAM_COLORS = {
  schoolSubscriptions: "#8884d8",
  teacherSubscriptions: "#82ca9d",
  marketplaceCommissions: "#ffc658",
  adPayments: "#ff7300",
  total: "#333333",
} as const;

const PIE_COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300"];

// ============================================
// HELPERS
// ============================================

const formatDate = (dateStr: string): string => {
  try {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

const getTypeBadgeColor = (
  type: Transaction["type"]
): string => {
  switch (type) {
    case "subscription":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "sale":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "ad":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};

const getStatusBadgeColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case "completed":
    case "succeeded":
    case "paid":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "pending":
    case "processing":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "failed":
    case "refunded":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};

// ============================================
// LOADING SKELETONS
// ============================================

const CardSkeleton = () => (
  <Card>
    <CardHeader className="pb-2">
      <Skeleton className="h-4 w-32" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-8 w-24 mb-1" />
      <Skeleton className="h-3 w-16" />
    </CardContent>
  </Card>
);

const ChartSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-5 w-48" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-[400px] w-full" />
    </CardContent>
  </Card>
);

// ============================================
// REVENUE OVERVIEW SECTION
// ============================================

interface RevenueOverviewSectionProps {
  dateParams: FinancialDateParams;
}

const RevenueOverviewSection = ({ dateParams }: RevenueOverviewSectionProps) => {
  const { data: overview, isLoading } = useQuery({
    queryKey: ["financial-overview", dateParams],
    queryFn: async () => {
      const res = await financialApi.getRevenueOverview(dateParams);
      if (!res.success || !res.data) throw new Error(res.message || "Failed to load overview");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
        <CardSkeleton />
      </div>
    );
  }

  const streams = [
    {
      label: "School Subscriptions",
      subtitle: "School subscription revenue",
      data: overview?.schoolSubscriptions,
      icon: Users,
      colorName: "blue",
    },
    {
      label: "Teacher Subscriptions",
      subtitle: "Teacher subscription revenue",
      data: overview?.teacherSubscriptions,
      icon: Users,
      colorName: "green",
    },
    {
      label: "Marketplace Commissions",
      subtitle: "Resource marketplace commissions",
      data: overview?.marketplaceCommissions,
      icon: TrendingUp,
      colorName: "amber",
    },
    {
      label: "Ad Payments",
      subtitle: "Advertisement payments",
      data: overview?.adPayments,
      icon: Activity,
      colorName: "orange",
    },
  ];

  const colorMap: Record<string, { card: string; title: string; icon: string; iconBg: string; value: string; subtitle: string }> = {
    blue: {
      card: "bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10 border-blue-200/50",
      title: "text-blue-700 dark:text-blue-300",
      icon: "text-blue-600",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      value: "text-blue-900 dark:text-blue-100",
      subtitle: "text-blue-600/70 dark:text-blue-400/70",
    },
    green: {
      card: "bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/10 border-green-200/50",
      title: "text-green-700 dark:text-green-300",
      icon: "text-green-600",
      iconBg: "bg-green-100 dark:bg-green-900/30",
      value: "text-green-900 dark:text-green-100",
      subtitle: "text-green-600/70 dark:text-green-400/70",
    },
    amber: {
      card: "bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/20 dark:to-amber-900/10 border-amber-200/50",
      title: "text-amber-700 dark:text-amber-300",
      icon: "text-amber-600",
      iconBg: "bg-amber-100 dark:bg-amber-900/30",
      value: "text-amber-900 dark:text-amber-100",
      subtitle: "text-amber-600/70 dark:text-amber-400/70",
    },
    orange: {
      card: "bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/20 dark:to-orange-900/10 border-orange-200/50",
      title: "text-orange-700 dark:text-orange-300",
      icon: "text-orange-600",
      iconBg: "bg-orange-100 dark:bg-orange-900/30",
      value: "text-orange-900 dark:text-orange-100",
      subtitle: "text-orange-600/70 dark:text-orange-400/70",
    },
  };

  return (
    <div className="space-y-4">
      {/* 4 stream cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {streams.map((stream) => {
          const Icon = stream.icon;
          const colors = colorMap[stream.colorName];
          return (
            <Card key={stream.label} className={colors.card}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm font-medium ${colors.title}`}>
                  {stream.label}
                </CardTitle>
                <div className={`w-10 h-10 rounded-full ${colors.iconBg} flex items-center justify-center`}>
                  <Icon className={`h-5 w-5 ${colors.icon}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${colors.value}`}>
                  {stream.data?.formatted || "£0.00"}
                </div>
                <p className={`text-xs ${colors.subtitle} mt-1`}>
                  {stream.data?.count ?? 0} transaction
                  {(stream.data?.count ?? 0) !== 1 ? "s" : ""}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Total revenue card */}
      <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/10 border-purple-200/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
            Total Revenue
          </CardTitle>
          <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <PoundSterling className="h-5 w-5 text-purple-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">
            {overview?.totalFormatted || "£0.00"}
          </div>
          <p className="text-xs text-purple-600/70 dark:text-purple-400/70 mt-1">
            Across all revenue streams
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

// ============================================
// SUBSCRIPTION METRICS SECTION
// ============================================

const SubscriptionMetricsSection = () => {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["financial-subscription-metrics"],
    queryFn: async () => {
      const res = await financialApi.getSubscriptionMetrics();
      if (!res.success || !res.data) throw new Error(res.message || "Failed to load metrics");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const churnRate = metrics?.churnRate ?? 0;
  const churnColor =
    churnRate < 5
      ? "text-green-600"
      : churnRate < 10
      ? "text-yellow-600"
      : "text-red-600";
  const churnBg =
    churnRate < 5
      ? "bg-green-100 dark:bg-green-900"
      : churnRate < 10
      ? "bg-yellow-100 dark:bg-yellow-900"
      : "bg-red-100 dark:bg-red-900";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Monthly Recurring Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {metrics?.mrrFormatted || "£0.00"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Based on active subscriptions
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Active Subscribers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {metrics?.activeSubscribers ?? 0}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Schools and teachers combined
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Churn Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <p className={`text-2xl font-bold ${churnColor}`}>
              {churnRate.toFixed(1)}%
            </p>
            <Badge className={`${churnBg} ${churnColor} text-xs`}>
              {churnRate < 5 ? "Healthy" : churnRate < 10 ? "Warning" : "High"}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {metrics?.churnedCount ?? 0} churned of {metrics?.startCount ?? 0}{" "}
            starting
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

// ============================================
// TIME SERIES CHART SECTION
// ============================================

interface TimeSeriesChartSectionProps {
  dateParams: FinancialDateParams;
}

const TimeSeriesChartSection = ({ dateParams }: TimeSeriesChartSectionProps) => {
  const [chartType, setChartType] = useState<string>("line");

  const { data: timeSeries, isLoading } = useQuery({
    queryKey: ["financial-time-series", dateParams],
    queryFn: async () => {
      const res = await financialApi.getTimeSeries(dateParams);
      if (!res.success || !res.data) throw new Error(res.message || "Failed to load time series");
      // Backend returns { series: [...], granularity, dataPoints } — extract the array
      const data = res.data;
      return Array.isArray(data) ? data : (data as any).series || [];
    },
  });

  if (isLoading) {
    return <ChartSkeleton />;
  }

  // Defensive: handle both array and { series: [...] } shapes
  const seriesData = Array.isArray(timeSeries)
    ? timeSeries
    : (timeSeries as any)?.series || [];
  const chartData = seriesData.map((point: any) => ({
    ...point,
    date: formatDate(point.date),
  }));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <CardTitle className="text-lg">Revenue Trends</CardTitle>
            <CardDescription>
              Revenue across all streams over time
            </CardDescription>
          </div>
          <Tabs value={chartType} onValueChange={setChartType}>
            <TabsList>
              <TabsTrigger value="line">Line</TabsTrigger>
              <TabsTrigger value="bar">Bar</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-[400px] text-muted-foreground">
            No time-series data available for this period.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            {chartType === "line" ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value: number | string) => {
                    const num = typeof value === "number" ? value : Number(value);
                    return isNaN(num) ? "£0.00" : `£${num.toLocaleString("en-GB", { minimumFractionDigits: 2 })}`;
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="schoolSubscriptions"
                  name="School Subs"
                  stroke={STREAM_COLORS.schoolSubscriptions}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="teacherSubscriptions"
                  name="Teacher Subs"
                  stroke={STREAM_COLORS.teacherSubscriptions}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="marketplaceCommissions"
                  name="Marketplace"
                  stroke={STREAM_COLORS.marketplaceCommissions}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="adPayments"
                  name="Ads"
                  stroke={STREAM_COLORS.adPayments}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  name="Total"
                  stroke={STREAM_COLORS.total}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            ) : (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value: number | string) => {
                    const num = typeof value === "number" ? value : Number(value);
                    return isNaN(num) ? "£0.00" : `£${num.toLocaleString("en-GB", { minimumFractionDigits: 2 })}`;
                  }}
                />
                <Legend />
                <Bar
                  dataKey="schoolSubscriptions"
                  name="School Subs"
                  stackId="revenue"
                  fill={STREAM_COLORS.schoolSubscriptions}
                />
                <Bar
                  dataKey="teacherSubscriptions"
                  name="Teacher Subs"
                  stackId="revenue"
                  fill={STREAM_COLORS.teacherSubscriptions}
                />
                <Bar
                  dataKey="marketplaceCommissions"
                  name="Marketplace"
                  stackId="revenue"
                  fill={STREAM_COLORS.marketplaceCommissions}
                />
                <Bar
                  dataKey="adPayments"
                  name="Ads"
                  stackId="revenue"
                  fill={STREAM_COLORS.adPayments}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

// ============================================
// REVENUE BREAKDOWN SECTION
// ============================================

interface RevenueBreakdownSectionProps {
  dateParams: FinancialDateParams;
}

const RevenueBreakdownSection = ({ dateParams }: RevenueBreakdownSectionProps) => {
  const { data: breakdown, isLoading } = useQuery({
    queryKey: ["financial-breakdown", dateParams],
    queryFn: async () => {
      const res = await financialApi.getRevenueBreakdown(dateParams);
      if (!res.success || !res.data) throw new Error(res.message || "Failed to load breakdown");
      return res.data;
    },
  });

  if (isLoading) {
    return <ChartSkeleton />;
  }

  const streams = breakdown?.streams || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Revenue Breakdown</CardTitle>
        <CardDescription>
          Distribution across revenue streams
          {breakdown?.totalFormatted && (
            <span className="ml-2 font-semibold text-foreground">
              (Total: {breakdown.totalFormatted})
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {streams.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            No breakdown data available.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={streams}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="revenue"
                    nameKey="name"
                    label={({ name, percentage }) =>
                      `${name}: ${(percentage ?? 0).toFixed(1)}%`
                    }
                    labelLine={false}
                  >
                    {streams.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number | string, name: string) => {
                      const num = typeof value === "number" ? value : Number(value);
                      return [
                        isNaN(num) ? "£0.00" : `£${num.toLocaleString("en-GB", { minimumFractionDigits: 2 })}`,
                        name,
                      ];
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Stream list */}
            <div className="space-y-4">
              {streams.map((stream, index) => (
                <div key={stream.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor:
                            PIE_COLORS[index % PIE_COLORS.length],
                        }}
                      />
                      <span className="text-sm font-medium">{stream.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold">
                        {stream.formatted}
                      </span>
                      <span className="text-xs text-muted-foreground ml-2">
                        ({(stream.percentage ?? 0).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(stream.percentage ?? 0, 100)}%`,
                        backgroundColor:
                          PIE_COLORS[index % PIE_COLORS.length],
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {stream.count} transaction{stream.count !== 1 ? "s" : ""}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// ============================================
// RECENT TRANSACTIONS SECTION
// ============================================

const RecentTransactionsSection = () => {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ["financial-recent-transactions"],
    queryFn: async () => {
      const res = await financialApi.getRecentTransactions({ limit: 20 });
      if (!res.success || !res.data) throw new Error(res.message || "Failed to load transactions");
      // Backend returns { transactions: [...], count } — extract the array
      const data = res.data;
      return Array.isArray(data) ? data : (data as any).transactions || [];
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Defensive: handle both array and { transactions: [...] } shapes
  const txList = Array.isArray(transactions)
    ? transactions
    : (transactions as any)?.transactions || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Transactions</CardTitle>
        <CardDescription>
          Latest payments across all revenue streams
        </CardDescription>
      </CardHeader>
      <CardContent>
        {txList.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            No transactions found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {txList.map((tx, index) => (
                  <TableRow key={`${tx.date}-${tx.type}-${index}`}>
                    <TableCell className="text-sm whitespace-nowrap">
                      {formatDate(tx.date)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeBadgeColor(tx.type)}>
                        {tx.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm max-w-[200px] truncate">
                      {tx.description}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {tx.source}
                    </TableCell>
                    <TableCell className="text-right font-medium text-sm">
                      {tx.amountFormatted}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(tx.status)}>
                        {tx.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// ============================================
// EXPORT ACTIONS
// ============================================

interface ExportActionsSectionProps {
  dateParams: FinancialDateParams;
}

const ExportActionsSection = ({ dateParams }: ExportActionsSectionProps) => {
  const [isExportingCSV, setIsExportingCSV] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const handleExportCSV = async () => {
    setIsExportingCSV(true);
    try {
      const blob = await financialApi.exportCSV(dateParams);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `financial-report-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("CSV export failed:", error);
    } finally {
      setIsExportingCSV(false);
    }
  };

  const handleExportPDF = async () => {
    setIsExportingPDF(true);
    try {
      const blob = await financialApi.exportPDF(dateParams);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `financial-report-${new Date().toISOString().split("T")[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF export failed:", error);
    } finally {
      setIsExportingPDF(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleExportCSV}
        disabled={isExportingCSV}
      >
        <Download className="w-4 h-4 mr-2" />
        {isExportingCSV ? "Exporting..." : "Export CSV"}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleExportPDF}
        disabled={isExportingPDF}
      >
        <Download className="w-4 h-4 mr-2" />
        {isExportingPDF ? "Exporting..." : "Export PDF"}
      </Button>
    </div>
  );
};

// ============================================
// PER-SCHOOL REVENUE SECTION
// ============================================

interface PerSchoolRevenueSectionProps {
  dateParams: FinancialDateParams;
}

const PerSchoolRevenueSection = ({ dateParams }: PerSchoolRevenueSectionProps) => {
  const [schoolPage, setSchoolPage] = useState(1);

  const { data: perSchool, isLoading: perSchoolLoading } = useQuery({
    queryKey: ["financial-per-school", dateParams, schoolPage],
    queryFn: async () => {
      const res = await financialApi.getPerSchoolRevenue({
        ...dateParams,
        page: schoolPage,
        limit: 15,
      });
      if (!res.success || !res.data) throw new Error(res.message || "Failed");
      return res.data;
    },
  });

  if (perSchoolLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const schools = perSchool?.schools || [];
  const pagination = perSchool?.pagination;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <School className="w-5 h-5" />
          Per-School Revenue
        </CardTitle>
        <CardDescription>
          Revenue from each school's subscriptions and ad payments
          {perSchool?.grandTotalFormatted && (
            <span className="ml-2 font-semibold text-foreground">
              (Grand Total: {perSchool.grandTotalFormatted})
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {schools.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            No per-school revenue data available.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>School Name</TableHead>
                    <TableHead className="text-right">Subscription Revenue</TableHead>
                    <TableHead className="text-right">Ad Revenue</TableHead>
                    <TableHead className="text-right">Total Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schools.map((school) => (
                    <TableRow key={school.schoolId}>
                      <TableCell className="font-medium">
                        {school.schoolName}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {`\u00A3${(school.subscriptionRevenue / 100).toFixed(2)}`}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {`\u00A3${(school.adRevenue / 100).toFixed(2)}`}
                      </TableCell>
                      <TableCell className="text-right font-medium text-sm">
                        {school.formatted || `\u00A3${(school.totalRevenue / 100).toFixed(2)}`}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Page {pagination.page} of {pagination.pages} ({pagination.total} schools)
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSchoolPage((p) => Math.max(1, p - 1))}
                    disabled={pagination.page <= 1}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSchoolPage((p) => Math.min(pagination.pages, p + 1))}
                    disabled={pagination.page >= pagination.pages}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

// ============================================
// CREATOR EARNINGS SECTION
// ============================================

interface CreatorEarningsSectionProps {
  dateParams: FinancialDateParams;
}

const CreatorEarningsSection = ({ dateParams }: CreatorEarningsSectionProps) => {
  const [creatorPage, setCreatorPage] = useState(1);

  const { data: creatorEarnings, isLoading: creatorLoading } = useQuery({
    queryKey: ["financial-creator-earnings", dateParams, creatorPage],
    queryFn: async () => {
      const res = await financialApi.getCreatorEarnings({
        ...dateParams,
        page: creatorPage,
        limit: 15,
      });
      if (!res.success || !res.data) throw new Error(res.message || "Failed");
      return res.data;
    },
  });

  if (creatorLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const creators = creatorEarnings?.creators || [];
  const pagination = creatorEarnings?.pagination;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="w-5 h-5" />
          Creator Earnings
        </CardTitle>
        <CardDescription>
          Teacher sales, commissions, current balance, and withdrawal history
        </CardDescription>
      </CardHeader>
      <CardContent>
        {creators.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            No creator earnings data available.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-right">Sales</TableHead>
                    <TableHead className="text-right">Total Earnings</TableHead>
                    <TableHead className="text-right">Platform Commission</TableHead>
                    <TableHead className="text-right">Current Balance</TableHead>
                    <TableHead className="text-right">Withdrawals</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {creators.map((creator) => (
                    <TableRow key={creator.userId}>
                      <TableCell className="font-medium">
                        {creator.name}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {creator.email}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {creator.totalSales}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {creator.totalEarningsFormatted}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {creator.totalCommissionFormatted}
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={`text-sm font-medium ${
                            creator.currentBalance > 0
                              ? "text-green-600 dark:text-green-400"
                              : "text-muted-foreground"
                          }`}
                        >
                          {creator.currentBalanceFormatted}
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {creator.withdrawals.count > 0 ? (
                          <span>
                            {creator.withdrawals.count}x ({creator.withdrawals.totalAmountFormatted})
                          </span>
                        ) : (
                          <span className="text-muted-foreground">None</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Page {pagination.page} of {pagination.pages} ({pagination.total} creators)
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCreatorPage((p) => Math.max(1, p - 1))}
                    disabled={pagination.page <= 1}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCreatorPage((p) => Math.min(pagination.pages, p + 1))}
                    disabled={pagination.page >= pagination.pages}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

// ============================================
// REVENUE TICKER SECTION
// ============================================

interface RevenuePayment {
  type: string;
  amount: number;
  currency: string;
  description: string;
  timestamp: string;
}

interface RevenueTickerSectionProps {
  queryClient: ReturnType<typeof useQueryClient>;
}

const RevenueTickerSection = ({ queryClient }: RevenueTickerSectionProps) => {
  const [recentPayments, setRecentPayments] = useState<RevenuePayment[]>([]);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
    if (!apiUrl) return;

    // Strip /api/v1 suffix if present to get the base server URL for Socket.IO
    const socketUrl = apiUrl.replace(/\/api\/v\d+\/?$/, "");
    const socket: Socket = io(socketUrl, { transports: ["websocket", "polling"] });

    socket.on("connect", () => {
      socket.emit("admin:join", "financial");
    });

    socket.on("revenue:payment", (payment: RevenuePayment) => {
      setRecentPayments((prev) => [payment, ...prev.slice(0, 9)]); // Keep last 10
      // Invalidate queries to refresh dashboard data
      queryClient.invalidateQueries({ queryKey: ["financial-overview"] });
      queryClient.invalidateQueries({ queryKey: ["financial-recent-transactions"] });
      queryClient.invalidateQueries({ queryKey: ["financial-per-school"] });
      queryClient.invalidateQueries({ queryKey: ["financial-creator-earnings"] });
    });

    return () => {
      socket.emit("admin:leave", "financial");
      socket.disconnect();
    };
  }, [queryClient]);

  if (recentPayments.length === 0) {
    return null;
  }

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case "subscription":
        return "sub";
      case "sale":
        return "sale";
      case "ad":
        return "ad";
      default:
        return "pay";
    }
  };

  return (
    <Card className="mb-6 border-green-200 dark:border-green-900">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Activity className="w-4 h-4 text-green-500 animate-pulse" />
          Live Revenue Feed
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          {recentPayments.map((payment, idx) => (
            <Badge key={`${payment.timestamp}-${idx}`} variant="outline" className="text-xs py-1">
              <span className="font-semibold mr-1">[{getPaymentIcon(payment.type)}]</span>
              {`\u00A3${(payment.amount / 100).toFixed(2)}`} &mdash; {payment.description}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const FinancialDashboard = () => {
  const queryClient = useQueryClient();

  // State for date filtering
  const [datePreset, setDatePreset] = useState<string>("30d");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");

  // Compute params from state
  const dateParams: FinancialDateParams =
    datePreset === "custom"
      ? { startDate: customStartDate, endDate: customEndDate }
      : { preset: datePreset as "7d" | "30d" | "90d" | "1y" };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Financial Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Revenue overview, metrics, and transaction history
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Date preset selector */}
            <Select value={datePreset} onValueChange={setDatePreset}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
                <SelectItem value="custom">Custom range</SelectItem>
              </SelectContent>
            </Select>

            {/* Custom date inputs */}
            {datePreset === "custom" && (
              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="w-[150px]"
                />
                <span className="text-muted-foreground text-sm">to</span>
                <Input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="w-[150px]"
                />
              </div>
            )}

            {/* Export actions */}
            <ExportActionsSection dateParams={dateParams} />
          </div>
        </div>

        {/* Live Revenue Ticker */}
        <RevenueTickerSection queryClient={queryClient} />

        {/* Tabbed sections */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
            <TabsTrigger value="per-school">Per-School Revenue</TabsTrigger>
            <TabsTrigger value="creator-earnings">Creator Earnings</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <RevenueOverviewSection dateParams={dateParams} />
            <SubscriptionMetricsSection />
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <TimeSeriesChartSection dateParams={dateParams} />
          </TabsContent>

          {/* Breakdown Tab */}
          <TabsContent value="breakdown" className="space-y-6">
            <RevenueBreakdownSection dateParams={dateParams} />
          </TabsContent>

          {/* Per-School Revenue Tab */}
          <TabsContent value="per-school" className="space-y-6">
            <PerSchoolRevenueSection dateParams={dateParams} />
          </TabsContent>

          {/* Creator Earnings Tab */}
          <TabsContent value="creator-earnings" className="space-y-6">
            <CreatorEarningsSection dateParams={dateParams} />
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <RecentTransactionsSection />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default FinancialDashboard;
