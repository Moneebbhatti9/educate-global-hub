import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Download,
  Filter,
  Search,
  DollarSign,
  ExternalLink,
  RefreshCw,
  CreditCard,
  Building,
  Banknote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EmptyState from "@/components/ui/empty-state";
import DashboardLayout from "@/layout/DashboardLayout";
import { withdrawalsAPI } from "@/apis/withdrawals";

// Currency symbols
const CURRENCY_SYMBOLS: Record<string, string> = {
  GBP: "£",
  USD: "$",
  EUR: "€",
  PKR: "Rs",
};

const PAYOUT_METHOD_ICONS: Record<string, any> = {
  stripe: CreditCard,
  paypal: DollarSign,
  bank_transfer: Building,
};

const WithdrawalHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currencyFilter, setCurrencyFilter] = useState<string>("all");
  const [page, setPage] = useState(1);

  // Fetch withdrawal history
  const { data: historyData, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["withdrawalHistory", page, statusFilter, currencyFilter],
    queryFn: async () => {
      const params: any = {
        page,
        limit: 20,
      };

      if (statusFilter && statusFilter !== "all") {
        params.status = statusFilter;
      }
      if (currencyFilter && currencyFilter !== "all") {
        params.currency = currencyFilter;
      }

      const response = await withdrawalsAPI.getWithdrawalHistory(params);
      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to fetch withdrawal history");
      }
      return response.data;
    },
  });

  const getStatusBadge = (status: string) => {
    const lowerStatus = status?.toLowerCase();
    switch (lowerStatus) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case "processing":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            <RefreshCw className="w-3 h-3 mr-1" />
            Processing
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPayoutMethodBadge = (method: string) => {
    const Icon = PAYOUT_METHOD_ICONS[method] || Banknote;
    const methodNames: Record<string, string> = {
      stripe: "Stripe",
      paypal: "PayPal",
      bank_transfer: "Bank Transfer",
    };

    return (
      <Badge variant="outline" className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {methodNames[method] || method}
      </Badge>
    );
  };

  // Filter withdrawals based on search
  const filteredWithdrawals = historyData?.withdrawals?.filter((withdrawal: any) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return withdrawal._id?.toLowerCase().includes(search);
  });

  // Calculate totals from completed withdrawals
  const completedWithdrawals = historyData?.withdrawals?.filter(
    (w: any) => w.status?.toLowerCase() === "completed"
  ) || [];

  const totalWithdrawn = completedWithdrawals.reduce(
    (sum: number, w: any) => sum + parseFloat(w.netAmount || 0),
    0
  );

  const totalFees = completedWithdrawals.reduce(
    (sum: number, w: any) => sum + parseFloat(w.fee || 0),
    0
  );

  const pendingCount = historyData?.withdrawals?.filter(
    (w: any) => w.status?.toLowerCase() === "pending" || w.status?.toLowerCase() === "processing"
  ).length || 0;

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button variant="outline" size="sm" asChild>
              <Link to="/dashboard/teacher/withdraw">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Withdrawals
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isRefetching}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefetching ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            Withdrawal History
          </h1>
          <p className="text-muted-foreground mt-2">
            View all your withdrawal requests and their status
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Withdrawn
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                £{(totalWithdrawn / 100).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                From {completedWithdrawals.length} successful withdrawals
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Fees</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                £{(totalFees / 100).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Processing and transaction fees
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Withdrawals
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {pendingCount}
              </div>
              <p className="text-xs text-muted-foreground">
                Currently being processed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Can Withdraw
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {historyData?.canWithdraw ? "Yes" : "No"}
              </div>
              <p className="text-xs text-muted-foreground">
                {historyData?.daysUntilNextWithdrawal > 0
                  ? `${historyData.daysUntilNextWithdrawal} days until next`
                  : "Ready to withdraw"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search by ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Currency</label>
                <Select value={currencyFilter} onValueChange={setCurrencyFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Currencies" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Currencies</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="PKR">PKR (Rs)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">&nbsp;</label>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setCurrencyFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Withdrawal History Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Withdrawal History</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading withdrawal history...</p>
              </div>
            ) : filteredWithdrawals && filteredWithdrawals.length > 0 ? (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Requested</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Fee</TableHead>
                        <TableHead className="text-right">Net</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Completed</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredWithdrawals.map((withdrawal: any) => {
                        const currencySymbol = CURRENCY_SYMBOLS[withdrawal.currency] || "£";
                        return (
                          <TableRow key={withdrawal._id}>
                            <TableCell className="font-medium">
                              {new Date(withdrawal.requestedAt).toLocaleDateString()}
                              <div className="text-xs text-muted-foreground">
                                {new Date(withdrawal.requestedAt).toLocaleTimeString()}
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {currencySymbol}
                              {(parseFloat(withdrawal.amount) / 100).toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right text-muted-foreground">
                              {currencySymbol}
                              {(parseFloat(withdrawal.fee) / 100).toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right font-semibold text-green-600">
                              {currencySymbol}
                              {(parseFloat(withdrawal.netAmount) / 100).toFixed(2)}
                            </TableCell>
                            <TableCell>
                              {getPayoutMethodBadge(withdrawal.payoutMethod)}
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(withdrawal.status)}
                            </TableCell>
                            <TableCell>
                              {withdrawal.completedAt ? (
                                <div>
                                  <div>{new Date(withdrawal.completedAt).toLocaleDateString()}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {new Date(withdrawal.completedAt).toLocaleTimeString()}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {historyData?.pagination && historyData.pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Showing {(page - 1) * 20 + 1} to{" "}
                      {Math.min(page * 20, historyData.pagination.total)} of{" "}
                      {historyData.pagination.total} results
                    </p>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page + 1)}
                        disabled={page >= historyData.pagination.totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <EmptyState
                icon={Search}
                title="No Withdrawals Found"
                description="No withdrawals match your current filters, or you haven't made any withdrawal requests yet."
                action={{
                  label: "Request Withdrawal",
                  href: "/dashboard/teacher/withdraw",
                  variant: "default",
                }}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default WithdrawalHistory;
