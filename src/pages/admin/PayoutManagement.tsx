import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { withdrawalsAPI } from "@/apis/withdrawals";
import {
  DollarSign,
  Search,
  Filter,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  CreditCard,
  Building,
  Banknote,
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

const PAYOUT_METHOD_ICONS: Record<string, any> = {
  stripe: CreditCard,
  paypal: DollarSign,
  bank_transfer: Building,
};

const PayoutManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [methodFilter, setMethodFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [showProcessDialog, setShowProcessDialog] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<any>(null);
  const [processAction, setProcessAction] = useState<"approve" | "reject">("approve");
  const [transactionId, setTransactionId] = useState("");
  const [notes, setNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch pending withdrawals
  const { data: withdrawalsData, isLoading, refetch } = useQuery({
    queryKey: ["pendingWithdrawals", page, methodFilter],
    queryFn: async () => {
      const params: any = {
        page,
        limit: 20,
      };

      if (methodFilter && methodFilter !== "all") {
        params.payoutMethod = methodFilter;
      }

      const response = await withdrawalsAPI.getPendingWithdrawals(params);
      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to fetch withdrawals");
      }
      return response.data;
    },
  });

  const handleProcess = async () => {
    if (!selectedWithdrawal) return;

    if (processAction === "approve" && !transactionId.trim()) {
      toast({
        title: "Error",
        description: "Please provide a transaction ID for approval",
        variant: "destructive",
      });
      return;
    }

    if (processAction === "reject" && !notes.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for rejection",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const response = await withdrawalsAPI.processWithdrawal(
        selectedWithdrawal._id,
        {
          action: processAction,
          transactionId: processAction === "approve" ? transactionId : undefined,
          notes: notes || undefined,
        }
      );

      if (!response.success) {
        throw new Error(response.message || "Failed to process withdrawal");
      }

      toast({
        title: "Withdrawal processed",
        description: `Withdrawal has been ${processAction}d successfully.`,
      });

      setShowProcessDialog(false);
      setSelectedWithdrawal(null);
      setTransactionId("");
      setNotes("");
      queryClient.invalidateQueries({ queryKey: ["pendingWithdrawals"] });
    } catch (error) {
      toast({
        title: "Processing failed",
        description:
          error instanceof Error ? error.message : "Failed to process withdrawal",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
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
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Failed
          </Badge>
        );
      case "processing":
        return (
          <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
            <RefreshCw className="w-3 h-3" />
            Processing
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Pending
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

  const filteredWithdrawals = withdrawalsData?.withdrawals?.filter((w: any) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      w.seller.email?.toLowerCase().includes(search) ||
      w.seller.firstName?.toLowerCase().includes(search) ||
      w.seller.lastName?.toLowerCase().includes(search) ||
      w._id.toLowerCase().includes(search)
    );
  });

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Payout Management</h1>
            <p className="text-muted-foreground mt-2">
              Review and process seller withdrawal requests
            </p>
          </div>

          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Requests
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {withdrawalsData?.withdrawals?.filter((w) => w.status === "pending")
                  .length || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Awaiting approval
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Processing</CardTitle>
              <RefreshCw className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {withdrawalsData?.withdrawals?.filter((w) => w.status === "processing")
                  .length || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Currently processing
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {withdrawalsData?.withdrawals?.reduce((acc, w) => acc + w.amount, 0) || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                All pending requests
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {withdrawalsData?.pagination?.total || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by seller or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={methodFilter} onValueChange={setMethodFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All methods" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="stripe">Stripe</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setMethodFilter("all");
                }}
              >
                <Filter className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Withdrawals Table */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Withdrawals</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading withdrawals...</div>
            ) : filteredWithdrawals && filteredWithdrawals.length > 0 ? (
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Requested</TableHead>
                      <TableHead>Seller</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Fee</TableHead>
                      <TableHead className="text-right">Net</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWithdrawals.map((withdrawal: any) => {
                      const currencySymbol = CURRENCY_SYMBOLS[withdrawal.currency];

                      return (
                        <TableRow key={withdrawal._id}>
                          <TableCell>
                            {new Date(withdrawal.requestedAt).toLocaleDateString()}
                            <div className="text-xs text-muted-foreground">
                              {new Date(withdrawal.requestedAt).toLocaleTimeString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {withdrawal.seller.firstName} {withdrawal.seller.lastName}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {withdrawal.seller.email}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {currencySymbol}
                            {(withdrawal.amount / 100).toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {currencySymbol}
                            {(withdrawal.feeAmount / 100).toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {currencySymbol}
                            {(withdrawal.netAmount / 100).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            {getPayoutMethodBadge(withdrawal.payoutMethod)}
                          </TableCell>
                          <TableCell>{getStatusBadge(withdrawal.status)}</TableCell>
                          <TableCell>
                            {(withdrawal.status === "pending" ||
                              withdrawal.status === "processing") && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedWithdrawal(withdrawal);
                                  setShowProcessDialog(true);
                                }}
                              >
                                Process
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {withdrawalsData.pagination && withdrawalsData.pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Showing {(page - 1) * 20 + 1} to{" "}
                      {Math.min(page * 20, withdrawalsData.pagination.total)} of{" "}
                      {withdrawalsData.pagination.total} results
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
                        disabled={page >= withdrawalsData.pagination.totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No pending withdrawals</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Process Dialog */}
        <Dialog open={showProcessDialog} onOpenChange={setShowProcessDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Process Withdrawal Request</DialogTitle>
              <DialogDescription>
                Review the withdrawal details and approve or reject the request.
              </DialogDescription>
            </DialogHeader>

            {selectedWithdrawal && (
              <div className="space-y-4">
                {/* Withdrawal Details */}
                <div className="bg-muted p-4 rounded-lg space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Seller</p>
                      <p className="font-medium">
                        {selectedWithdrawal.seller.firstName}{" "}
                        {selectedWithdrawal.seller.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedWithdrawal.seller.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Requested</p>
                      <p className="font-medium">
                        {new Date(selectedWithdrawal.requestedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-3 border-t">
                    <div>
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className="font-medium text-lg">
                        {CURRENCY_SYMBOLS[selectedWithdrawal.currency]}
                        {(selectedWithdrawal.amount / 100).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Fee</p>
                      <p className="font-medium text-lg">
                        {CURRENCY_SYMBOLS[selectedWithdrawal.currency]}
                        {(selectedWithdrawal.feeAmount / 100).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Net Payout</p>
                      <p className="font-medium text-lg text-green-600">
                        {CURRENCY_SYMBOLS[selectedWithdrawal.currency]}
                        {(selectedWithdrawal.netAmount / 100).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t">
                    <p className="text-sm text-muted-foreground mb-2">Payout Method</p>
                    <div>{getPayoutMethodBadge(selectedWithdrawal.payoutMethod)}</div>
                  </div>

                  {/* Payout Details */}
                  <div className="pt-3 border-t">
                    <p className="text-sm font-medium mb-2">Payout Details:</p>
                    <div className="text-sm space-y-1">
                      {Object.entries(selectedWithdrawal.payoutDetails).map(
                        ([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-muted-foreground capitalize">
                              {key.replace(/([A-Z])/g, " $1").trim()}:
                            </span>
                            <span className="font-mono">{String(value)}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Selection */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Action *</Label>
                    <Select
                      value={processAction}
                      onValueChange={(value: any) => setProcessAction(value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="approve">Approve & Process</SelectItem>
                        <SelectItem value="reject">Reject</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {processAction === "approve" && (
                    <div className="space-y-2">
                      <Label htmlFor="transactionId">Transaction ID *</Label>
                      <Input
                        id="transactionId"
                        placeholder="Enter transaction/reference ID"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Payment reference from Stripe, PayPal, or bank
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="notes">
                      Notes {processAction === "reject" && "*"}
                    </Label>
                    <Textarea
                      id="notes"
                      placeholder={
                        processAction === "approve"
                          ? "Optional notes..."
                          : "Reason for rejection..."
                      }
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowProcessDialog(false)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                onClick={handleProcess}
                disabled={isProcessing}
                variant={processAction === "reject" ? "destructive" : "default"}
              >
                {isProcessing
                  ? "Processing..."
                  : processAction === "approve"
                  ? "Approve & Process"
                  : "Reject Request"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default PayoutManagement;
