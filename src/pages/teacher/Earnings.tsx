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
  const [timeRange, setTimeRange] = useState<string>("all");

  // Fetch earnings dashboard
  const { data: earnings, isLoading } = useQuery({
    queryKey: ["earnings Dashboard"],
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
        </div>
      </DashboardLayout>
    );
  }

  const currencySymbol = CURRENCY_SYMBOLS[selectedCurrency] || selectedCurrency;

  // Get earnings for selected currency
  const totalEarnings = earnings?.totalEarnings?.[selectedCurrency as keyof typeof earnings.totalEarnings];
  const thisMonth = earnings?.thisMonth?.[selectedCurrency as keyof typeof earnings.thisMonth];
  const last30Days = earnings?.last30Days?.[selectedCurrency as keyof typeof earnings.last30Days];
  const last12Months = earnings?.last12Months?.[selectedCurrency as keyof typeof earnings.last12Months];

  // Calculate tier progress
  const currentTier = earnings?.sellerTier?.current || "Bronze";
  const tierInfo = TIER_INFO[currentTier as keyof typeof TIER_INFO];
  const tierProgress = earnings?.sellerTier?.nextTier
    ? ((earnings.sellerTier.last12MonthsSales || 0) /
        (earnings.sellerTier.nextTier.requiredSales || 1)) *
      100
    : 100;

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

            <Button variant="outline" size="icon">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Earnings */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalEarnings?.formatted || `${currencySymbol}0.00`}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Gross: {currencySymbol}
                {((totalEarnings?.gross || 0) / 100).toFixed(2)}
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
                {thisMonth?.formatted || `${currencySymbol}0.00`}
              </div>
              <div className="flex items-center text-xs text-green-600 mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                <span>Active this month</span>
              </div>
            </CardContent>
          </Card>

          {/* Last 30 Days */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last 30 Days</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {last30Days?.formatted || `${currencySymbol}0.00`}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Net: {currencySymbol}
                {((last30Days?.net || 0) / 100).toFixed(2)}
              </p>
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
                <Badge className={tierInfo.color}>{currentTier}</Badge>
                <span className="text-sm font-medium">{tierInfo.rate}</span>
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
            {earnings?.sellerTier?.nextTier && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Progress to {earnings.sellerTier.nextTier.tier}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>12-Month Sales</span>
                      <span className="font-medium">
                        {currencySymbol}
                        {((earnings.sellerTier.last12MonthsSales || 0) / 100).toFixed(2)} /{" "}
                        {currencySymbol}
                        {((earnings.sellerTier.nextTier.requiredSales || 0) / 100).toFixed(2)}
                      </span>
                    </div>
                    <Progress value={tierProgress} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Remaining</p>
                      <p className="font-medium">
                        {currencySymbol}
                        {((earnings.sellerTier.nextTier.remainingSales || 0) / 100).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Next Tier Rate</p>
                      <p className="font-medium">
                        {TIER_INFO[earnings.sellerTier.nextTier.tier as keyof typeof TIER_INFO]?.rate}
                      </p>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      You're {tierProgress.toFixed(0)}% of the way to{" "}
                      {earnings.sellerTier.nextTier.tier} tier! Keep up the great work.
                    </p>
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
                {earnings?.topResources && earnings.topResources.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Resource</TableHead>
                        <TableHead className="text-right">Sales</TableHead>
                        <TableHead className="text-right">Earnings</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {earnings.topResources.map((resource, index) => (
                        <TableRow key={resource.resourceId}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-muted-foreground">
                                #{index + 1}
                              </span>
                              <Link
                                to={`/dashboard/teacher/resources/${resource.resourceId}`}
                                className="hover:underline"
                              >
                                {resource.title}
                              </Link>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {resource.salesCount}
                          </TableCell>
                          <TableCell className="text-right font-medium text-green-600">
                            {currencySymbol}
                            {(resource.totalEarnings / 100).toFixed(2)}
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
                {earnings?.recentSales && earnings.recentSales.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Resource</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Earnings</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {earnings.recentSales.map((sale) => {
                        const resource = typeof sale.resource === "object" ? sale.resource : null;
                        return (
                          <TableRow key={sale._id}>
                            <TableCell>
                              {new Date(sale.saleDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="font-medium">
                              {resource?.title || "Unknown"}
                            </TableCell>
                            <TableCell className="text-right">
                              {CURRENCY_SYMBOLS[sale.currency]}
                              {(sale.price / 100).toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right text-green-600 font-medium">
                              {CURRENCY_SYMBOLS[sale.currency]}
                              {(sale.sellerEarnings / 100).toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  sale.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : sale.status === "refunded"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                                }
                              >
                                {sale.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
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
            {/* Monthly Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {earnings?.monthlySales && earnings.monthlySales.length > 0 ? (
                  earnings.monthlySales.slice(0, 6).map((month) => (
                    <div
                      key={month.month}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-muted-foreground">
                        {month.month}
                      </span>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {currencySymbol}
                          {(month.earnings / 100).toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {month.sales} sales
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

            {/* Sales by Country */}
            <Card>
              <CardHeader>
                <CardTitle>Sales by Country</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {earnings?.salesByCountry && earnings.salesByCountry.length > 0 ? (
                  earnings.salesByCountry.slice(0, 5).map((country) => (
                    <div
                      key={country.country}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-muted-foreground">
                        {country.country}
                      </span>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {country.count} sales
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {currencySymbol}
                          {(country.earnings / 100).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No geographic data available
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
