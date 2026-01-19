import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { salesAPI } from "@/apis/sales";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Award,
  Package,
  Download,
  Calendar,
  Target,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Progress } from "@/components/ui/progress";
import DashboardLayout from "@/layout/DashboardLayout";
import { Link } from "react-router-dom";

// Currency symbols
const CURRENCY_SYMBOLS: Record<string, string> = {
  GBP: "£",
  USD: "$",
  EUR: "€",
  PKR: "Rs",
};

// Tier information
const TIER_INFO = {
  Bronze: {
    name: "Bronze",
    rate: "60%",
    color: "bg-amber-600",
    nextTier: "Silver",
    requiredSales: 1000,
  },
  Silver: {
    name: "Silver",
    rate: "70%",
    color: "bg-gray-400",
    nextTier: "Gold",
    requiredSales: 6000,
  },
  Gold: {
    name: "Gold",
    rate: "80%",
    color: "bg-yellow-500",
    nextTier: null,
    requiredSales: null,
  },
};

const Earnings = () => {
  const [selectedCurrency, setSelectedCurrency] = useState<string>("GBP");

  // Fetch earnings dashboard
  const { data: earnings, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["earningsDashboard"],
    queryFn: async () => {
      const response = await salesAPI.getEarningsDashboard();
      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to fetch earnings");
      }
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <DashboardLayout role="teacher">
        <div className="space-y-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Earnings Dashboard</h1>
            <p className="text-muted-foreground mt-2">Loading your earnings data...</p>
          </div>
          <div className="flex justify-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const currencySymbol = CURRENCY_SYMBOLS[selectedCurrency] || selectedCurrency;

  // Get data from API response - mapping to actual structure
  const balances = earnings?.balances || {};
  const tier = earnings?.tier || {};
  const stats = earnings?.stats || {};
  const earningsData = earnings?.earnings || {};
  const recentSales = earnings?.recentSales || [];
  const salesByMonth = earnings?.salesByMonth || [];
  const topResources = earnings?.topResources || [];

  // Get balance for selected currency
  const currencyBalance = balances[selectedCurrency as keyof typeof balances] || { available: 0, formatted: `${currencySymbol}0.00` };
  const currencyEarnings = earningsData[selectedCurrency as keyof typeof earningsData] || { totalEarnings: 0, totalSales: 0 };

  // Current tier info
  const currentTier = tier.current || "Bronze";
  const tierInfo = TIER_INFO[currentTier as keyof typeof TIER_INFO];
  const tierProgress = parseFloat(tier.progressToNextTier || "0");

  // Format month name from salesByMonth
  const formatMonthName = (year: number, month: number) => {
    const date = new Date(year, month - 1);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Earnings Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Track your sales, earnings, and tier progress
            </p>
          </div>

          <div className="flex gap-2">
            <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GBP">GBP (£)</SelectItem>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="PKR">PKR (Rs)</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon" onClick={() => refetch()} disabled={isRefetching}>
              <RefreshCw className={`w-4 h-4 ${isRefetching ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Available Balance */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {currencyBalance.formatted}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Ready to withdraw
              </p>
            </CardContent>
          </Card>

          {/* Total Sales */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalSales || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Lifetime: {stats.lifetimeEarningsFormatted || "£0.00"}
              </p>
            </CardContent>
          </Card>

          {/* This Month */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.thisMonthSales || 0} sales
              </div>
              <div className="flex items-center text-xs mt-1">
                {stats.monthOverMonthChange > 0 ? (
                  <>
                    <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
                    <span className="text-green-600">+{stats.monthOverMonthChange}% vs last month</span>
                  </>
                ) : stats.monthOverMonthChange < 0 ? (
                  <>
                    <TrendingDown className="w-3 h-3 mr-1 text-red-600" />
                    <span className="text-red-600">{stats.monthOverMonthChange}% vs last month</span>
                  </>
                ) : (
                  <span className="text-muted-foreground">Same as last month</span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Seller Tier */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Seller Tier</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge className={tierInfo?.color || "bg-amber-600"}>{currentTier}</Badge>
                <span className="text-sm font-medium">{tier.ratePercentage || tierInfo?.rate}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Royalty rate on sales
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tier Progress */}
            {tier.nextTier && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Progress to {tier.nextTier} Tier
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>12-Month Sales</span>
                      <span className="font-medium">
                        {tier.last12MonthsSalesFormatted || `£${(tier.last12MonthsSales || 0).toFixed(2)}`} / £{(tier.nextTierThreshold || 0).toFixed(2)}
                      </span>
                    </div>
                    <Progress value={tierProgress} className="h-2" />
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Current Progress</p>
                      <p className="font-medium text-primary">
                        {tierProgress.toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Remaining</p>
                      <p className="font-medium">
                        £{Math.max(0, (tier.nextTierThreshold || 0) - (tier.last12MonthsSales || 0)).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Next Tier Rate</p>
                      <p className="font-medium text-green-600">
                        {TIER_INFO[tier.nextTier as keyof typeof TIER_INFO]?.rate || "80%"}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Award className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-900">
                          {tierProgress >= 100
                            ? `Congratulations! You've reached ${tier.nextTier} tier!`
                            : `${(100 - tierProgress).toFixed(1)}% more to reach ${tier.nextTier} tier`
                          }
                        </p>
                        <p className="text-xs text-blue-700 mt-1">
                          {tier.nextTier === "Gold"
                            ? "Gold tier earns 80% royalty on every sale!"
                            : tier.nextTier === "Silver"
                            ? "Silver tier earns 70% royalty on every sale!"
                            : "Keep selling to unlock higher royalty rates!"
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Top Selling Resources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Top Selling Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                {topResources && topResources.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Resource</TableHead>
                        <TableHead className="text-right">Sales</TableHead>
                        <TableHead className="text-right">Earnings</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topResources.map((item: any, index: number) => (
                        <TableRow key={item.resource?._id || index}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <span className="font-medium text-muted-foreground">
                                #{index + 1}
                              </span>
                              {item.resource?.coverPhoto && (
                                <img
                                  src={item.resource.coverPhoto}
                                  alt={item.resource.title}
                                  className="w-10 h-10 rounded object-cover"
                                />
                              )}
                              <Link
                                to={`/resources/${item.resource?._id}`}
                                className="hover:underline font-medium"
                              >
                                {item.resource?.title || "Unknown Resource"}
                              </Link>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {item.totalSales}
                          </TableCell>
                          <TableCell className="text-right font-medium text-green-600">
                            {item.totalEarnings}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No sales yet</p>
                    <Button variant="link" asChild className="mt-2">
                      <Link to="/dashboard/teacher/upload-resource">
                        Upload your first resource
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Sales */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Sales</CardTitle>
                  <Button variant="link" asChild>
                    <Link to="/dashboard/teacher/sales-history">View All</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {recentSales && recentSales.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Resource</TableHead>
                        <TableHead>Buyer</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Earnings</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentSales.map((sale: any) => (
                        <TableRow key={sale._id}>
                          <TableCell>
                            {new Date(sale.saleDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {sale.resource?.coverPhoto && (
                                <img
                                  src={sale.resource.coverPhoto}
                                  alt={sale.resource.title}
                                  className="w-8 h-8 rounded object-cover"
                                />
                              )}
                              <span className="font-medium">
                                {sale.resource?.title || "Unknown"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {sale.buyer || "Guest"}
                          </TableCell>
                          <TableCell className="text-right">
                            {sale.price}
                          </TableCell>
                          <TableCell className="text-right text-green-600 font-medium">
                            {sale.earnings}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <DollarSign className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No recent sales</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Earnings by Currency */}
            <Card>
              <CardHeader>
                <CardTitle>Earnings by Currency</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(earningsData).map(([currency, data]: [string, any]) => (
                  <div
                    key={currency}
                    className={`flex items-center justify-between p-2 rounded ${
                      currency === selectedCurrency ? "bg-primary/10" : ""
                    }`}
                  >
                    <span className="text-sm font-medium">{currency}</span>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">
                        {data.totalFormatted || `${CURRENCY_SYMBOLS[currency]}0.00`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {data.totalSales || 0} sales
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Monthly Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {salesByMonth && salesByMonth.length > 0 ? (
                  salesByMonth.slice(0, 6).map((month: any) => (
                    <div
                      key={`${month._id?.year}-${month._id?.month}`}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-muted-foreground">
                        {formatMonthName(month._id?.year, month._id?.month)}
                      </span>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {currencySymbol}
                          {((month.earnings || 0) / 100).toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {month.count} sales
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No sales data available
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/dashboard/teacher/withdraw">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Request Withdrawal
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/dashboard/teacher/upload-resource">
                    <Package className="w-4 h-4 mr-2" />
                    Upload Resource
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/dashboard/teacher/resource-management">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Manage Resources
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Earnings;
