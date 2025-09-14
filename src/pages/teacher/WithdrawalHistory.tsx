import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Download,
  Filter,
  Search,
  Calendar,
  DollarSign,
  ExternalLink,
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

// Mock data - replace with actual API calls
const mockWithdrawalHistory = [
  {
    id: "wd_001",
    date: "2024-01-15",
    amount: 125.5,
    method: "Stripe Connect",
    status: "Completed",
    paidTo: "••••1234",
    eta: "5-7 working days",
    completedDate: "2024-01-18",
    reference: "TXN-2024-001",
    fee: 3.94,
  },
  {
    id: "wd_002",
    date: "2024-01-08",
    amount: 89.2,
    method: "PayPal",
    status: "Completed",
    paidTo: "john••••@gmail.com",
    eta: "5-7 working days",
    completedDate: "2024-01-11",
    reference: "TXN-2024-002",
    fee: 3.38,
  },
  {
    id: "wd_003",
    date: "2023-12-28",
    amount: 156.75,
    method: "Bank Transfer",
    status: "Completed",
    paidTo: "••••5678",
    eta: "10-12 working days",
    completedDate: "2024-01-05",
    reference: "TXN-2023-156",
    fee: 2.5,
  },
  {
    id: "wd_004",
    date: "2023-12-20",
    amount: 78.4,
    method: "Stripe Connect",
    status: "Processing",
    paidTo: "••••1234",
    eta: "5-7 working days",
    completedDate: null,
    reference: "TXN-2023-155",
    fee: 2.57,
  },
  {
    id: "wd_005",
    date: "2023-12-10",
    amount: 200.0,
    method: "PayPal",
    status: "Failed",
    paidTo: "john••••@gmail.com",
    eta: "5-7 working days",
    completedDate: null,
    reference: "TXN-2023-154",
    fee: 0,
    failureReason: "Invalid account details",
  },
  {
    id: "wd_006",
    date: "2023-11-25",
    amount: 95.5,
    method: "Bank Transfer",
    status: "Completed",
    paidTo: "••••5678",
    eta: "10-12 working days",
    completedDate: "2023-12-02",
    reference: "TXN-2023-153",
    fee: 2.5,
  },
  {
    id: "wd_007",
    date: "2023-11-15",
    amount: 67.8,
    method: "Stripe Connect",
    status: "Completed",
    paidTo: "••••1234",
    eta: "5-7 working days",
    completedDate: "2023-11-20",
    reference: "TXN-2023-152",
    fee: 2.26,
  },
  {
    id: "wd_008",
    date: "2023-11-05",
    amount: 145.25,
    method: "PayPal",
    status: "Completed",
    paidTo: "john••••@gmail.com",
    eta: "5-7 working days",
    completedDate: "2023-11-10",
    reference: "TXN-2023-151",
    fee: 5.29,
  },
];

const STATUS_FILTERS = ["All", "Completed", "Processing", "Failed"];
const METHOD_FILTERS = ["All", "Stripe Connect", "PayPal", "Bank Transfer"];

const WithdrawalHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [methodFilter, setMethodFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case "Processing":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Processing
          </Badge>
        );
      case "Failed":
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

  const filteredWithdrawals = mockWithdrawalHistory.filter((withdrawal) => {
    const matchesSearch =
      withdrawal.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      withdrawal.paidTo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || withdrawal.status === statusFilter;
    const matchesMethod =
      methodFilter === "All" || withdrawal.method === methodFilter;

    return matchesSearch && matchesStatus && matchesMethod;
  });

  const totalWithdrawn = mockWithdrawalHistory
    .filter((w) => w.status === "Completed")
    .reduce((sum, w) => sum + w.amount, 0);

  const totalFees = mockWithdrawalHistory
    .filter((w) => w.status === "Completed")
    .reduce((sum, w) => sum + w.fee, 0);

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button variant="outline" size="sm" asChild>
              <Link to="/dashboard/teacher/withdraw">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Withdrawals
              </Link>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Withdrawn
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                £{totalWithdrawn.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                From{" "}
                {
                  mockWithdrawalHistory.filter((w) => w.status === "Completed")
                    .length
                }{" "}
                successful withdrawals
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Fees</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">£{totalFees.toFixed(2)}</div>
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
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  mockWithdrawalHistory.filter((w) => w.status === "Processing")
                    .length
                }
              </div>
              <p className="text-xs text-muted-foreground">
                Currently being processed
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
                    placeholder="Search by reference or account..."
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
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_FILTERS.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Method</label>
                <Select value={methodFilter} onValueChange={setMethodFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {METHOD_FILTERS.map((method) => (
                      <SelectItem key={method} value={method}>
                        {method}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Time</SelectItem>
                    <SelectItem value="Last 30 days">Last 30 days</SelectItem>
                    <SelectItem value="Last 3 months">Last 3 months</SelectItem>
                    <SelectItem value="Last year">Last year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Withdrawal History Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Withdrawal History</CardTitle>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {filteredWithdrawals.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Paid To</TableHead>
                      <TableHead>Fee</TableHead>
                      <TableHead>Completed</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWithdrawals.map((withdrawal) => (
                      <TableRow key={withdrawal.id}>
                        <TableCell className="font-medium">
                          {new Date(withdrawal.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {withdrawal.reference}
                        </TableCell>
                        <TableCell className="font-medium">
                          £{withdrawal.amount.toFixed(2)}
                        </TableCell>
                        <TableCell>{withdrawal.method}</TableCell>
                        <TableCell>
                          {getStatusBadge(withdrawal.status)}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {withdrawal.paidTo}
                        </TableCell>
                        <TableCell>
                          {withdrawal.fee > 0
                            ? `£${withdrawal.fee.toFixed(2)}`
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {withdrawal.completedDate ? (
                            new Date(
                              withdrawal.completedDate
                            ).toLocaleDateString()
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {withdrawal.status === "Failed" &&
                              withdrawal.failureReason && (
                                <Button variant="outline" size="sm">
                                  <AlertCircle className="w-4 h-4 mr-1" />
                                  View Error
                                </Button>
                              )}
                            {withdrawal.status === "Completed" && (
                              <Button variant="outline" size="sm">
                                <ExternalLink className="w-4 h-4 mr-1" />
                                Receipt
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <EmptyState
                icon={Search}
                title="No Withdrawals Found"
                description="No withdrawals match your current filters. Try adjusting your search criteria."
                action={{
                  label: "Clear Filters",
                  onClick: () => {
                    setSearchTerm("");
                    setStatusFilter("All");
                    setMethodFilter("All");
                    setDateFilter("All");
                  },
                  variant: "outline",
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
