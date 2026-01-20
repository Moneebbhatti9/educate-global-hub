import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { salesAPI } from "@/apis/sales";
import {
  DollarSign,
  Search,
  Filter,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useDropdownOptions } from "@/components/ui/dynamic-select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/layout/DashboardLayout";

// Currency symbols
const CURRENCY_SYMBOLS: Record<string, string> = {
  GBP: "£",
  USD: "$",
  EUR: "€",
  PKR: "Rs",
};

const SalesManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currencyFilter, setCurrencyFilter] = useState<string>("all");
  const [page, setPage] = useState(1);

  // Dynamic dropdown options
  const { data: currencyOptions, isLoading: loadingCurrencies } = useDropdownOptions("currency");
  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const [selectedSale, setSelectedSale] = useState<any>(null);
  const [refundReason, setRefundReason] = useState("");
  const [isRefunding, setIsRefunding] = useState(false);

  // Fetch all sales
  const { data: salesData, isLoading, refetch } = useQuery({
    queryKey: ["adminSales", page, statusFilter, currencyFilter, searchTerm],
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

      if (searchTerm) {
        params.search = searchTerm;
      }

      const response = await salesAPI.getMySales(params);
      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to fetch sales");
      }
      return response.data;
    },
  });

  const handleRefund = async () => {
    if (!selectedSale || !refundReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for the refund",
        variant: "destructive",
      });
      return;
    }

    setIsRefunding(true);

    try {
      const response = await salesAPI.refundSale(selectedSale._id, {
        reason: refundReason,
      });

      if (!response.success) {
        throw new Error(response.message || "Failed to process refund");
      }

      toast({
        title: "Refund processed",
        description: `Sale ${selectedSale._id} has been refunded successfully.`,
      });

      setShowRefundDialog(false);
      setSelectedSale(null);
      setRefundReason("");
      refetch();
    } catch (error) {
      toast({
        title: "Refund failed",
        description:
          error instanceof Error ? error.message : "Failed to process refund",
        variant: "destructive",
      });
    } finally {
      setIsRefunding(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const lowerStatus = status.toLowerCase();
    switch (lowerStatus) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Completed
          </Badge>
        );
      case "refunded":
        return (
          <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Refunded
          </Badge>
        );
      case "disputed":
        return (
          <Badge className="bg-orange-100 text-orange-800 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Disputed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
            <RefreshCw className="w-3 h-3" />
            Pending
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Sales Management</h1>
            <p className="text-muted-foreground mt-2">
              Monitor and manage all platform sales
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {salesData?.pagination?.total || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Platform-wide sales
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Object.keys(salesData?.totalEarnings || {}).length > 0 &&
                  Object.entries(salesData.totalEarnings).map(([currency, amount]) => (
                    <div key={currency} className="text-sm">
                      {CURRENCY_SYMBOLS[currency]}
                      {((amount as number) / 100).toFixed(2)}
                    </div>
                  ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">All currencies</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {salesData?.sales?.filter((s) => s.status === "completed").length || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Successful sales</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Refunded</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {salesData?.sales?.filter((s) => s.status === "refunded").length || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Refunded sales</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by resource or buyer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                  <SelectItem value="disputed">Disputed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={currencyFilter} onValueChange={setCurrencyFilter} disabled={loadingCurrencies}>
                <SelectTrigger>
                  <SelectValue placeholder={loadingCurrencies ? "Loading..." : "All currencies"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Currencies</SelectItem>
                  {currencyOptions?.map((option) => (
                    <SelectItem key={option._id} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setCurrencyFilter("all");
                }}
              >
                <Filter className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sales Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Sales</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading sales...</div>
            ) : salesData?.sales && salesData.sales.length > 0 ? (
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Resource</TableHead>
                      <TableHead>Seller</TableHead>
                      <TableHead>Buyer</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Seller Earnings</TableHead>
                      <TableHead className="text-right">Platform Fee</TableHead>
                      <TableHead>Tier</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salesData.sales.map((sale) => {
                      const resource =
                        typeof sale.resource === "object" ? sale.resource : null;
                      const buyer = typeof sale.buyer === "object" ? sale.buyer : null;
                      const currencySymbol = CURRENCY_SYMBOLS[sale.currency];

                      return (
                        <TableRow key={sale._id}>
                          <TableCell>
                            {new Date(sale.saleDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="font-medium max-w-[200px] truncate">
                            {resource?.title || "Unknown"}
                          </TableCell>
                          <TableCell>
                            {typeof sale.seller === "string"
                              ? sale.seller
                              : "Unknown"}
                          </TableCell>
                          <TableCell>
                            {buyer
                              ? `${buyer.firstName} ${buyer.lastName}`
                              : "Anonymous"}
                          </TableCell>
                          <TableCell className="text-right">
                            {currencySymbol}
                            {(sale.price / 100).toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right text-green-600">
                            {currencySymbol}
                            {(sale.sellerEarnings / 100).toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">
                            {currencySymbol}
                            {(sale.platformCommission / 100).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{sale.sellerTier}</Badge>
                          </TableCell>
                          <TableCell>{getStatusBadge(sale.status)}</TableCell>
                          <TableCell>
                            {sale.status === "completed" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedSale(sale);
                                  setShowRefundDialog(true);
                                }}
                              >
                                Refund
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {salesData.pagination && salesData.pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Showing {(page - 1) * 20 + 1} to{" "}
                      {Math.min(page * 20, salesData.pagination.total)} of{" "}
                      {salesData.pagination.total} results
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
                        disabled={page >= salesData.pagination.totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No sales found
              </div>
            )}
          </CardContent>
        </Card>

        {/* Refund Dialog */}
        <Dialog open={showRefundDialog} onOpenChange={setShowRefundDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Process Refund</DialogTitle>
              <DialogDescription>
                Please provide a reason for refunding this sale. The buyer will receive
                a full refund and the seller's balance will be adjusted.
              </DialogDescription>
            </DialogHeader>

            {selectedSale && (
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sale ID:</span>
                    <span className="font-mono">{selectedSale._id}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-medium">
                      {CURRENCY_SYMBOLS[selectedSale.currency]}
                      {(selectedSale.price / 100).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Seller Earnings:</span>
                    <span className="font-medium text-green-600">
                      {CURRENCY_SYMBOLS[selectedSale.currency]}
                      {(selectedSale.sellerEarnings / 100).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="refundReason">Refund Reason *</Label>
                  <Textarea
                    id="refundReason"
                    placeholder="Enter the reason for this refund..."
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowRefundDialog(false)}
                disabled={isRefunding}
              >
                Cancel
              </Button>
              <Button
                onClick={handleRefund}
                disabled={isRefunding || !refundReason.trim()}
              >
                {isRefunding ? "Processing..." : "Process Refund"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default SalesManagement;
