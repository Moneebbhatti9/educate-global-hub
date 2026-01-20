import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { withdrawalsAPI } from "@/apis/withdrawals";
import { salesAPI } from "@/apis/sales";
import {
  DollarSign,
  CreditCard,
  Banknote,
  Clock,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  User,
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/layout/DashboardLayout";
import EmptyState, {
  EmptyWithdrawals,
  EmptyTransactions,
} from "@/components/ui/empty-state";
import { Link } from "react-router-dom";

// Form validation schema
const withdrawalSchema = z.object({
  amount: z
    .number()
    .min(10, "Minimum withdrawal is £10")
    .max(10000, "Maximum withdrawal is £10,000"),
  payoutMethod: z.string().min(1, "Please select a payout method"),

  // Bank Transfer fields
  bankAccount: z.string().optional(),
  bankName: z.string().optional(),
  accountHolderName: z.string().optional(),
  sortCode: z.string().optional(),
  iban: z.string().optional(),
  swiftCode: z.string().optional(),

  // PayPal fields
  paypalEmail: z.string().email("Valid email required").optional(),
  paypalAccountId: z.string().optional(),
  paypalAccountName: z.string().optional(),

  // Stripe fields
  stripeAccountId: z.string().optional(),
  stripeAccountName: z.string().optional(),
  stripeBankLast4: z.string().optional(),

  // Verification fields
  confirmAccountMatch: z.boolean().refine((val) => val === true, {
    message:
      "You must confirm that your account details match your registered information",
  }),
  confirmIdentity: z.boolean().refine((val) => val === true, {
    message: "You must confirm your identity for this withdrawal",
  }),
});

type WithdrawalFormData = z.infer<typeof withdrawalSchema>;

// Currency symbols
const CURRENCY_SYMBOLS: Record<string, string> = {
  GBP: "£",
  USD: "$",
  EUR: "€",
  PKR: "Rs",
};

const PAYOUT_METHODS = [
  {
    id: "stripe",
    name: "Stripe",
    fee: "1.4% + £0.20 (UK) / 2.9% + £0.20 (Int'l)",
    eta: "5-7 business days",
  },
  {
    id: "paypal",
    name: "PayPal",
    fee: "3.4% + £0.20 (UK) / 4.4% + £0.20 (Int'l)",
    eta: "5-7 business days",
  },
  {
    id: "bank_transfer",
    name: "Bank Transfer (UK/SEPA)",
    fee: "£2.50 fixed",
    eta: "3-5 business days (UK) / 5-7 days (Int'l)",
  },
];

const Withdraw = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWithdrawalForm, setShowWithdrawalForm] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("GBP");

  // Fetch withdrawal info
  const { data: withdrawalInfo, isLoading: isLoadingInfo } = useQuery({
    queryKey: ["withdrawalInfo", selectedCurrency],
    queryFn: async () => {
      const response = await withdrawalsAPI.getWithdrawalInfo(selectedCurrency);
      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to fetch withdrawal info");
      }
      return response.data;
    },
  });

  // Fetch withdrawal history
  const { data: withdrawalHistory, isLoading: isLoadingHistory } = useQuery({
    queryKey: ["withdrawalHistory", selectedCurrency],
    queryFn: async () => {
      const response = await withdrawalsAPI.getWithdrawalHistory({
        limit: 5,
        currency: selectedCurrency,
      });
      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to fetch withdrawal history");
      }
      return response.data;
    },
  });

  // Fetch recent sales
  const { data: recentSales, isLoading: isLoadingSales } = useQuery({
    queryKey: ["recentSales", selectedCurrency],
    queryFn: async () => {
      const response = await salesAPI.getMySales({
        limit: 5,
        currency: selectedCurrency,
      });
      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to fetch recent sales");
      }
      return response.data;
    },
  });

  const form = useForm<WithdrawalFormData>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: {
      amount: 0,
      payoutMethod: "stripe",
      confirmAccountMatch: false,
      confirmIdentity: false,
    },
  });

  // Update form amount when withdrawal info loads
  useEffect(() => {
    if (withdrawalInfo?.balance?.available) {
      const availableAmount = withdrawalInfo.balance.available / 100;
      form.setValue("amount", availableAmount);
    }
  }, [withdrawalInfo, form]);

  const watchPayoutMethod = form.watch("payoutMethod");
  const watchAmount = form.watch("amount");

  const onSubmit = async (data: WithdrawalFormData) => {
    setIsSubmitting(true);

    try {
      // Build payout details based on method
      const payoutDetails: any = {};

      if (data.payoutMethod === "bank_transfer") {
        if (
          !data.accountHolderName ||
          !data.bankName ||
          !data.bankAccount ||
          !data.sortCode
        ) {
          toast({
            title: "Missing bank details",
            description:
              "Please fill in all required bank account information.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
        payoutDetails.bankAccountHolder = data.accountHolderName;
        payoutDetails.bankName = data.bankName;
        payoutDetails.accountNumber = data.bankAccount;
        payoutDetails.sortCode = data.sortCode;
        payoutDetails.iban = data.iban;
        payoutDetails.swiftCode = data.swiftCode;
      } else if (data.payoutMethod === "paypal") {
        if (!data.paypalAccountId || !data.paypalEmail || !data.paypalAccountName) {
          toast({
            title: "Missing PayPal details",
            description: "Please fill in PayPal Account ID, email, and account name.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
        payoutDetails.paypalAccountId = data.paypalAccountId;
        payoutDetails.paypalEmail = data.paypalEmail;
        payoutDetails.paypalAccountName = data.paypalAccountName;
      } else if (data.payoutMethod === "stripe") {
        if (!data.stripeAccountId || !data.stripeAccountName || !data.stripeBankLast4) {
          toast({
            title: "Missing Stripe details",
            description: "Please fill in Stripe Account ID, account name, and bank last 4 digits.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
        payoutDetails.stripeAccountId = data.stripeAccountId;
        payoutDetails.stripeAccountName = data.stripeAccountName;
        payoutDetails.stripeBankLast4 = data.stripeBankLast4;
      }

      // Call withdrawal API
      const response = await withdrawalsAPI.requestWithdrawal({
        amount: data.amount,
        currency: selectedCurrency as any,
        payoutMethod: data.payoutMethod as any,
        payoutDetails,
      });

      if (!response.success) {
        throw new Error(response.message || "Withdrawal request failed");
      }

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["withdrawalInfo"] });
      queryClient.invalidateQueries({ queryKey: ["withdrawalHistory"] });

      const currencySymbol = CURRENCY_SYMBOLS[selectedCurrency] || selectedCurrency;

      toast({
        title: "Withdrawal request submitted",
        description: `Your withdrawal of ${currencySymbol}${data.amount.toFixed(
          2
        )} has been processed. ${response.data?.withdrawal.message || ""}`,
      });

      setShowWithdrawalForm(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Withdrawal failed",
        description:
          error instanceof Error ? error.message : "There was an error processing your withdrawal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const lowerStatus = status.toLowerCase();
    switch (lowerStatus) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "processing":
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">{status}</Badge>
        );
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Get currency symbol
  const currencySymbol = withdrawalInfo?.balance?.currency
    ? CURRENCY_SYMBOLS[withdrawalInfo.balance.currency] || withdrawalInfo.balance.currency
    : "£";

  // Calculate available balance
  const availableBalance = withdrawalInfo?.balance?.available
    ? (withdrawalInfo.balance.available / 100).toFixed(2)
    : "0.00";

  // Check if can withdraw
  const canWithdraw = withdrawalInfo?.withdrawal?.canWithdraw ?? false;
  const minWithdrawal = withdrawalInfo?.limits?.minimum?.amount
    ? withdrawalInfo.limits.minimum.amount / 100
    : 10;

  if (isLoadingInfo) {
    return (
      <DashboardLayout role="teacher">
        <div className="space-y-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              Earnings & Payments
            </h1>
            <p className="text-muted-foreground mt-2">
              Loading your earnings information...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Earnings & Payments
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your earnings and withdraw your funds
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Balance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5" />
                  <span>Current Balance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="text-4xl font-bold text-primary">
                    {currencySymbol}
                    {availableBalance}
                  </div>

                  <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">Pending:</span>{" "}
                      {currencySymbol}
                      {withdrawalInfo?.balance?.pending
                        ? (withdrawalInfo.balance.pending / 100).toFixed(2)
                        : "0.00"}
                    </div>
                    <div>
                      <span className="font-medium">Tier:</span>{" "}
                      {withdrawalInfo?.seller?.tier || "Bronze"}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {canWithdraw ? (
                      parseFloat(availableBalance) >= minWithdrawal ? (
                        <Button
                          onClick={() => setShowWithdrawalForm(true)}
                          size="lg"
                          className="w-full sm:w-auto"
                        >
                          Request Withdrawal
                        </Button>
                      ) : (
                        <div className="space-y-2">
                          <Button
                            disabled
                            size="lg"
                            className="w-full sm:w-auto"
                          >
                            Request Withdrawal
                          </Button>
                          <p className="text-sm text-muted-foreground">
                            Minimum withdrawal: {currencySymbol}
                            {minWithdrawal}
                          </p>
                        </div>
                      )
                    ) : (
                      <div className="space-y-2">
                        <Button disabled size="lg" className="w-full sm:w-auto">
                          Request Withdrawal
                        </Button>
                        <p className="text-sm text-muted-foreground">
                          Next withdrawal available:{" "}
                          {withdrawalInfo?.withdrawal?.nextWithdrawalDate || "N/A"}
                        </p>
                      </div>
                    )}
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Important:</strong> Withdrawals require admin approval (once per week limit).
                      Transaction fees apply: Stripe (1.4-2.9% + £0.20), PayPal (3.4-4.4% + £0.20), Bank (£2.50).
                      Processing: 3-7 business days depending on method.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>

            {/* User Profile Information */}
            {showWithdrawalForm && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Your Registered Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Full Name:
                        </span>
                        <span className="font-medium">John Smith</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email:</span>
                        <span className="font-medium">
                          john.smith@email.com
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Phone:</span>
                        <span className="font-medium">+44 7123 456789</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Address:</span>
                        <span className="font-medium">
                          123 Education St, London, UK
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Country:</span>
                        <span className="font-medium">United Kingdom</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Account Status:
                        </span>
                        <Badge className="bg-green-100 text-green-800">
                          Verified
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Alert className="mt-4 border-blue-200 bg-blue-50">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      <strong>Please Note:</strong> The account details you
                      provide below must match the information shown above. Any
                      mismatches will result in withdrawal rejection for
                      security purposes.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            )}

            {/* Withdrawal Form */}
            {showWithdrawalForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Request Withdrawal</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Withdrawal Amount *</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                                  {currencySymbol}
                                </span>
                                <Input
                                  type="number"
                                  step="0.01"
                                  min={minWithdrawal}
                                  max={parseFloat(availableBalance)}
                                  className="pl-8"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                />
                              </div>
                            </FormControl>
                            <FormDescription>
                              Available: {currencySymbol}
                              {availableBalance}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="payoutMethod"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Payout Method *</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {PAYOUT_METHODS.map((method) => (
                                  <SelectItem key={method.id} value={method.id}>
                                    <div className="flex flex-col">
                                      <span>{method.name}</span>
                                      <span className="text-xs text-muted-foreground">
                                        Fee: {method.fee} • ETA: {method.eta}
                                      </span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Method-specific fields */}
                      {watchPayoutMethod === "stripe" && (
                        <div className="space-y-4">
                          <Alert className="border-blue-200 bg-blue-50">
                            <AlertCircle className="h-4 w-4 text-blue-600" />
                            <AlertDescription className="text-blue-800">
                              <strong>Stripe Transfer:</strong> Provide your Stripe account details for direct transfer.
                              Admin will process payment to your linked bank account.
                            </AlertDescription>
                          </Alert>

                          <FormField
                            control={form.control}
                            name="stripeAccountId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Stripe Account ID / Recipient ID *</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="acct_1234567890 or recipient_xyz123"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Your Stripe Connect account ID or recipient ID
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="stripeAccountName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Account Holder Name *</FormLabel>
                                  <FormControl>
                                    <Input placeholder="John Smith" {...field} />
                                  </FormControl>
                                  <FormDescription>
                                    Name on bank account
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="stripeBankLast4"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Bank Account Last 4 Digits *</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="1234"
                                      maxLength={4}
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    For verification purposes
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      )}

                      {watchPayoutMethod === "paypal" && (
                        <div className="space-y-4">
                          <Alert className="border-blue-200 bg-blue-50">
                            <AlertCircle className="h-4 w-4 text-blue-600" />
                            <AlertDescription className="text-blue-800">
                              <strong>PayPal Transfer:</strong> Provide both your PayPal Account ID and email.
                              Admin will process payment directly to your PayPal account.
                            </AlertDescription>
                          </Alert>

                          <FormField
                            control={form.control}
                            name="paypalAccountId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>PayPal Account ID / Merchant ID *</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="ABC123XYZ456 or merchant_id_789"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Your PayPal Account ID or Merchant ID (found in Settings)
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="paypalEmail"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>PayPal Email Address *</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="email"
                                      placeholder="your@email.com"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Email linked to PayPal account
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="paypalAccountName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Account Holder Name *</FormLabel>
                                  <FormControl>
                                    <Input placeholder="John Smith" {...field} />
                                  </FormControl>
                                  <FormDescription>
                                    Name on PayPal account
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      )}

                      {watchPayoutMethod === "bank_transfer" && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="accountHolderName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Account Holder Name *</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="John Smith"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="bankName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Bank Name *</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="HSBC, Barclays, etc."
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="bankAccount"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Account Number *</FormLabel>
                                  <FormControl>
                                    <Input placeholder="12345678" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="sortCode"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Sort Code (UK) *</FormLabel>
                                  <FormControl>
                                    <Input placeholder="12-34-56" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="iban"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>IBAN (International)</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="GB29 NWBK 6016 1331 9268 19"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Required for international transfers
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="swiftCode"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>SWIFT/BIC Code</FormLabel>
                                  <FormControl>
                                    <Input placeholder="NWBKGB2L" {...field} />
                                  </FormControl>
                                  <FormDescription>
                                    Required for international transfers
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      )}

                      {/* Fee Calculation */}
                      {watchAmount && watchPayoutMethod && (
                        <div className="bg-muted/50 p-3 rounded-lg space-y-2">
                          <h4 className="font-medium">Payout Summary</h4>
                          <div className="text-sm space-y-1">
                            <div className="flex justify-between">
                              <span>Withdrawal Amount:</span>
                              <span>
                                {currencySymbol}
                                {watchAmount.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                              <span>Processing Fee:</span>
                              <span>
                                {
                                  PAYOUT_METHODS.find(
                                    (m) => m.id === watchPayoutMethod
                                  )?.fee
                                }
                              </span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                              <span>Expected Arrival:</span>
                              <span>
                                {
                                  PAYOUT_METHODS.find(
                                    (m) => m.id === watchPayoutMethod
                                  )?.eta
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Important Notice */}
                      <Alert className="border-amber-200 bg-amber-50">
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                        <AlertDescription className="text-amber-800">
                          <strong>Important:</strong> All withdrawals require admin approval and transaction fees apply.
                          Your account details must exactly match your registered information.
                          Any discrepancies may result in withdrawal rejection.
                          Processing time: 3-7 business days. Fees are deducted from withdrawal amount.
                        </AlertDescription>
                      </Alert>

                      {/* Verification Checkboxes */}
                      <div className="space-y-4 border border-border rounded-lg p-4">
                        <h4 className="font-medium text-foreground">
                          Verification & Confirmation
                        </h4>

                        <FormField
                          control={form.control}
                          name="confirmAccountMatch"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="text-sm font-normal">
                                  I confirm that the account details provided
                                  above match my registered information exactly
                                </FormLabel>
                                <FormDescription className="text-xs text-muted-foreground">
                                  This includes name, email, and account
                                  information matching your profile
                                </FormDescription>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="confirmIdentity"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="text-sm font-normal">
                                  I confirm my identity and authorize this
                                  withdrawal request
                                </FormLabel>
                                <FormDescription className="text-xs text-muted-foreground">
                                  By checking this box, you confirm you are the
                                  account holder and authorize this transaction
                                </FormDescription>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowWithdrawalForm(false)}
                          disabled={isSubmitting}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting
                            ? "Processing..."
                            : "Submit Withdrawal Request"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingSales ? (
                  <div className="text-center py-4 text-muted-foreground">
                    Loading sales...
                  </div>
                ) : recentSales?.sales && recentSales.sales.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Resource</TableHead>
                        <TableHead>Sale Price</TableHead>
                        <TableHead>Your Royalty</TableHead>
                        <TableHead>Buyer</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentSales.sales.map((sale: any) => (
                        <TableRow key={sale._id}>
                          <TableCell>
                            {new Date(sale.saleDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="font-medium">
                            {typeof sale.resource === 'object'
                              ? sale.resource.title
                              : 'Unknown'}
                          </TableCell>
                          <TableCell>
                            {sale.price}
                          </TableCell>
                          <TableCell className="text-green-600 font-medium">
                            {sale.earnings}
                          </TableCell>
                          <TableCell>
                            {typeof sale.buyer === 'object'
                              ? sale.buyer.name
                              : 'Guest'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <EmptyTransactions
                    onUploadResource={() => }
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Account Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Earned:</span>
                  <span className="font-medium">
                    {currencySymbol}
                    {withdrawalInfo?.seller?.lifetimeEarnings
                      ? (withdrawalInfo.seller.lifetimeEarnings / 100).toFixed(2)
                      : "0.00"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Royalty Tier:</span>
                  <Badge variant="secondary">
                    {withdrawalInfo?.seller?.tier || "Bronze"}
                  </Badge>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Last Withdrawal:
                  </span>
                  <span className="text-sm">
                    {withdrawalInfo?.withdrawal?.lastWithdrawalDate || "Never"}
                  </span>
                </div>

                <Separator />

                <div className="text-xs text-muted-foreground space-y-1">
                  <p>
                    • Minimum withdrawal: {currencySymbol}
                    {minWithdrawal}
                  </p>
                  <p>
                    • Maximum per withdrawal: {currencySymbol}10,000
                  </p>
                  <p>• Withdrawal frequency: Once per week</p>
                </div>
              </CardContent>
            </Card>

            {/* Withdrawal History */}
            <Card>
              <CardHeader>
                <CardTitle>Withdrawal History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {isLoadingHistory ? (
                  <div className="text-center py-4 text-muted-foreground">
                    Loading history...
                  </div>
                ) : withdrawalHistory?.withdrawals && withdrawalHistory.withdrawals.length > 0 ? (
                  <>
                    {withdrawalHistory.withdrawals.slice(0, 3).map((withdrawal: any) => (
                      <div
                        key={withdrawal._id}
                        className="border border-border rounded-lg p-3 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">
                            {CURRENCY_SYMBOLS[withdrawal.currency] || withdrawal.currency}
                            {(withdrawal.amount / 100).toFixed(2)}
                          </span>
                          {getStatusBadge(withdrawal.status)}
                        </div>

                        <div className="text-sm text-muted-foreground space-y-1">
                          <div className="flex justify-between">
                            <span>Date:</span>
                            <span>
                              {new Date(withdrawal.requestedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Method:</span>
                            <span>
                              {withdrawal.payoutMethod === 'bank_transfer'
                                ? 'Bank Transfer'
                                : withdrawal.payoutMethod === 'paypal'
                                ? 'PayPal'
                                : 'Stripe'}
                            </span>
                          </div>
                          {withdrawal.processedAt && (
                            <div className="flex justify-between">
                              <span>Completed:</span>
                              <span>
                                {new Date(withdrawal.processedAt).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/dashboard/teacher/withdrawal-history">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View All History
                      </Link>
                    </Button>
                  </>
                ) : (
                  <EmptyWithdrawals
                    onMakeWithdrawal={() => setShowWithdrawalForm(true)}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Withdraw;
