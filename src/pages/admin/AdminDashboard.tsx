import { useQuery } from "@tanstack/react-query";
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
  Users,
  Briefcase,
  MessageSquare,
  TrendingUp,
  ArrowRight,
  FileText,
  Shield,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  DollarSign,
  CreditCard,
  ShoppingCart,
  PoundSterling,
  Calendar,
  Package,
  Percent,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { adminApi } from "@/apis/admin";

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Fetch dashboard data
  const { data: dashboardData, isLoading, refetch } = useQuery({
    queryKey: ["adminDashboard"],
    queryFn: async () => {
      const response = await adminApi.getDashboard();
      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to fetch dashboard data");
      }
      return response.data;
    },
  });

  // Format time ago
  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  // Format month name
  const formatMonthName = (year: number, month: number) => {
    const date = new Date(year, month - 1);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  // Transform activities from API
  const recentActivities = dashboardData?.recentActivities?.map((activity, index) => ({
    id: index + 1,
    type: activity.type,
    action: activity.action || "Activity",
    details: activity.name || activity.title || activity.details || "Platform activity",
    time: formatTimeAgo(activity.createdAt),
    status: activity.status || "success",
  })) || [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      default:
        return <Shield className="w-4 h-4 text-blue-600" />;
    }
  };

  // Platform earnings data
  const platformEarnings = dashboardData?.platformEarnings;
  const recentSales = dashboardData?.recentSales || [];
  const topResources = dashboardData?.topResources || [];

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Monitor platform performance and manage system operations.
            </p>
          </div>
          <Button variant="outline" onClick={() => refetch()} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Main Stats Cards - Gradient Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10 border-blue-200/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Total Users
              </CardTitle>
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                {isLoading ? "..." : (dashboardData?.stats?.totalUsers || 0).toLocaleString()}
              </div>
              <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-1">
                Registered users
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/10 border-green-200/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
                Active Jobs
              </CardTitle>
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900 dark:text-green-100">
                {isLoading ? "..." : (dashboardData?.stats?.activeJobs || 0).toLocaleString()}
              </div>
              <p className="text-xs text-green-600/70 dark:text-green-400/70 mt-1">
                Published listings
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/20 dark:to-amber-900/10 border-amber-200/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-300">
                Total Sales
              </CardTitle>
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-900 dark:text-amber-100">
                {isLoading ? "..." : (dashboardData?.stats?.totalSales || 0).toLocaleString()}
              </div>
              <p className="text-xs text-amber-600/70 dark:text-amber-400/70 mt-1">
                Completed transactions
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/10 border-purple-200/50 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate("sales")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
                Platform Revenue
              </CardTitle>
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <PoundSterling className="h-5 w-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                {isLoading ? "..." : (dashboardData?.stats?.platformRevenueFormatted || "£0.00")}
              </div>
              <p className="text-xs text-purple-600/70 dark:text-purple-400/70 mt-1">
                Total commission earned
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Platform Earnings Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Earnings by Currency */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Earnings by Currency
              </CardTitle>
              <CardDescription>Platform commission breakdown</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {platformEarnings?.byCurrency ? (
                Object.entries(platformEarnings.byCurrency).map(([currency, data]: [string, any]) => (
                  <div key={currency} className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold">{currency}</span>
                      <span className="text-green-600 font-bold">{data.formatted}</span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{data.sales} sales</span>
                      <span>Revenue: {data.revenueFormatted || data.formatted}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">No earnings data</p>
              )}

              {/* This Month */}
              {platformEarnings?.thisMonth && (
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">This Month</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">{platformEarnings.thisMonth.sales} sales</span>
                    <span className="text-lg font-bold text-green-600">
                      {platformEarnings.thisMonth.formatted}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Sales with Commission */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Recent Sales
                  </CardTitle>
                  <CardDescription>Latest transactions with commission details</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate("sales")}>
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentSales && recentSales.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Resource</TableHead>
                      <TableHead>Seller</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Commission</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentSales.slice(0, 5).map((sale: any) => (
                      <TableRow key={sale._id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {sale.resource?.coverPhoto && (
                              <img
                                src={sale.resource.coverPhoto}
                                alt={sale.resource.title}
                                className="w-8 h-8 rounded object-cover"
                              />
                            )}
                            <div>
                              <div className="font-medium text-sm truncate max-w-[150px]">
                                {sale.resource?.title || "Unknown"}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {sale.resource?.type}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{sale.seller}</div>
                          <Badge variant="outline" className="text-xs">
                            {sale.sellerTier}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {sale.price}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-green-600 font-semibold">
                            {sale.platformCommission}
                          </span>
                          <div className="text-xs text-muted-foreground">
                            {sale.royaltyRate} to seller
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {new Date(sale.saleDate).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No sales yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Monthly Breakdown & Top Resources */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Earnings Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Monthly Earnings
              </CardTitle>
              <CardDescription>Platform commission over time</CardDescription>
            </CardHeader>
            <CardContent>
              {platformEarnings?.monthlyBreakdown && platformEarnings.monthlyBreakdown.length > 0 ? (
                <div className="space-y-3">
                  {platformEarnings.monthlyBreakdown.map((month: any) => (
                    <div
                      key={`${month._id?.year}-${month._id?.month}`}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div>
                        <div className="font-medium">
                          {formatMonthName(month._id?.year, month._id?.month)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {month.salesCount} sales
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-green-600 font-bold">
                          £{((month.totalCommission || 0) / 100).toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Revenue: £{((month.totalRevenue || 0) / 100).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No monthly data available</p>
              )}
            </CardContent>
          </Card>

          {/* Top Selling Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Top Selling Resources
              </CardTitle>
              <CardDescription>Best performing resources by sales</CardDescription>
            </CardHeader>
            <CardContent>
              {topResources && topResources.length > 0 ? (
                <div className="space-y-3">
                  {topResources.map((item: any, index: number) => (
                    <div
                      key={item.resource?._id || index}
                      className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                        #{index + 1}
                      </div>
                      {item.resource?.coverPhoto && (
                        <img
                          src={item.resource.coverPhoto}
                          alt={item.resource.title}
                          className="w-10 h-10 rounded object-cover"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{item.resource?.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.totalSales} sales
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-green-600 font-semibold">{item.totalCommission}</div>
                        <div className="text-xs text-muted-foreground">commission</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No top resources yet</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Activities</CardTitle>
                  <Button variant="outline" size="sm">
                    View All
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
                <CardDescription>Latest system activities and user actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivities.length > 0 ? (
                  recentActivities.slice(0, 5).map((activity) => (
                    <div
                      key={activity.id}
                      className="p-4 border rounded-lg hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(activity.status)}
                          <h4 className="font-semibold text-sm">{activity.action}</h4>
                        </div>
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{activity.details}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">No recent activities</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => navigate("users")}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Manage Users
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => navigate("jobs")}
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  Job Management
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => navigate("resources")}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Resource Management
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => navigate("sales")}
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Sales Management
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => navigate("payouts")}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Payout Management
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => navigate("forum")}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Forum Management
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => navigate("platform-settings")}
                >
                  <Percent className="w-4 h-4 mr-2" />
                  Platform Settings
                </Button>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">API Status</span>
                  <Badge className="bg-green-600 text-white">Operational</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Database</span>
                  <Badge className="bg-green-600 text-white">Healthy</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">File Storage</span>
                  <Badge className="bg-green-600 text-white">Online</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Payment Gateway</span>
                  <Badge className="bg-green-600 text-white">Active</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
