import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DollarSign, CreditCard, Banknote, Clock, AlertCircle, CheckCircle2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";

// Form validation schema
const withdrawalSchema = z.object({
  amount: z.number().min(10, "Minimum withdrawal is £10").max(10000, "Maximum withdrawal is £10,000"),
  payoutMethod: z.string().min(1, "Please select a payout method"),
  bankAccount: z.string().optional(),
  paypalEmail: z.string().email("Valid email required").optional(),
  stripeAccount: z.string().optional()
});

type WithdrawalFormData = z.infer<typeof withdrawalSchema>;

// Mock data - replace with actual API calls
const mockAccountData = {
  currentBalance: 247.85,
  pendingBalance: 42.30,
  currency: "£",
  royaltyTier: "Silver (70%)",
  totalEarned: 1580.45,
  lastWithdrawal: "2024-01-15",
  canWithdraw: true,
  minWithdrawal: 10,
  maxWithdrawal: 247.85,
  nextWithdrawalDate: "2024-01-29" // 1 week from last withdrawal
};

const mockWithdrawalHistory = [
  {
    id: "wd_001",
    date: "2024-01-15",
    amount: 125.50,
    method: "Stripe Connect",
    status: "Completed",
    paidTo: "••••1234",
    eta: "5-7 working days",
    completedDate: "2024-01-18"
  },
  {
    id: "wd_002", 
    date: "2024-01-08",
    amount: 89.20,
    method: "PayPal",
    status: "Completed",
    paidTo: "john••••@gmail.com",
    eta: "5-7 working days",
    completedDate: "2024-01-11"
  },
  {
    id: "wd_003",
    date: "2023-12-28",
    amount: 156.75,
    method: "Bank Transfer",
    status: "Completed",
    paidTo: "••••5678",
    eta: "10-12 working days",
    completedDate: "2024-01-05"
  },
  {
    id: "wd_004",
    date: "2023-12-20", 
    amount: 78.40,
    method: "Stripe Connect",
    status: "Processing",
    paidTo: "••••1234",
    eta: "5-7 working days",
    completedDate: null
  }
];

const mockRecentTransactions = [
  {
    id: "txn_001",
    date: "2024-01-22",
    resource: "Mathematics Worksheet Bundle",
    salePrice: 4.99,
    royalty: 2.79,
    buyer: "Anonymous"
  },
  {
    id: "txn_002",
    date: "2024-01-21", 
    resource: "Science Experiment Guide",
    salePrice: 6.50,
    royalty: 3.64,
    buyer: "Anonymous"
  },
  {
    id: "txn_003",
    date: "2024-01-20",
    resource: "History Timeline Template",
    salePrice: 2.99,
    royalty: 1.47,
    buyer: "Anonymous"
  },
  {
    id: "txn_004",
    date: "2024-01-19",
    resource: "Mathematics Worksheet Bundle", 
    salePrice: 4.99,
    royalty: 2.79,
    buyer: "Anonymous"
  },
  {
    id: "txn_005",
    date: "2024-01-18",
    resource: "Reading Comprehension Pack",
    salePrice: 3.50,
    royalty: 1.95,
    buyer: "Anonymous"
  }
];

const PAYOUT_METHODS = [
  { id: "stripe", name: "Stripe Connect", fee: "2.9% + £0.30", eta: "5-7 working days (UK)" },
  { id: "paypal", name: "PayPal", fee: "3.4% + £0.35", eta: "5-7 working days (UK)" },
  { id: "bank", name: "Bank Transfer", fee: "£2.50 fixed", eta: "10-12 working days (International)" }
];

const Withdraw = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWithdrawalForm, setShowWithdrawalForm] = useState(false);

  const form = useForm<WithdrawalFormData>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: {
      amount: mockAccountData.currentBalance,
      payoutMethod: "stripe"
    }
  });

  const watchPayoutMethod = form.watch("payoutMethod");
  const watchAmount = form.watch("amount");

  const onSubmit = async (data: WithdrawalFormData) => {
    setIsSubmitting(true);
    
    try {
      // TODO: Implement actual withdrawal API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Withdrawal request submitted",
        description: `Your withdrawal of ${mockAccountData.currency}${data.amount} has been processed. Expected arrival: ${PAYOUT_METHODS.find(m => m.id === data.payoutMethod)?.eta}`
      });

      setShowWithdrawalForm(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Withdrawal failed",
        description: "There was an error processing your withdrawal. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "Processing":
        return <Badge className="bg-yellow-100 text-yellow-800">Processing</Badge>;
      case "Failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <nav className="text-sm text-muted-foreground mb-4">
              Home / Teacher Dashboard / Earnings & Payments
            </nav>
            <h1 className="text-3xl font-bold text-foreground">Earnings & Payments</h1>
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
                      {mockAccountData.currency}{mockAccountData.currentBalance.toFixed(2)}
                    </div>
                    
                    <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Pending:</span> {mockAccountData.currency}{mockAccountData.pendingBalance.toFixed(2)}
                      </div>
                      <div>
                        <span className="font-medium">Tier:</span> {mockAccountData.royaltyTier}
                      </div>
                    </div>

                    <div className="space-y-2">
                      {mockAccountData.canWithdraw ? (
                        mockAccountData.currentBalance >= mockAccountData.minWithdrawal ? (
                          <Button 
                            onClick={() => setShowWithdrawalForm(true)}
                            size="lg"
                            className="w-full sm:w-auto"
                          >
                            Request Withdrawal
                          </Button>
                        ) : (
                          <div className="space-y-2">
                            <Button disabled size="lg" className="w-full sm:w-auto">
                              Request Withdrawal
                            </Button>
                            <p className="text-sm text-muted-foreground">
                              Minimum withdrawal: {mockAccountData.currency}{mockAccountData.minWithdrawal}
                            </p>
                          </div>
                        )
                      ) : (
                        <div className="space-y-2">
                          <Button disabled size="lg" className="w-full sm:w-auto">
                            Request Withdrawal
                          </Button>
                          <p className="text-sm text-muted-foreground">
                            Next withdrawal available: {mockAccountData.nextWithdrawalDate}
                          </p>
                        </div>
                      )}
                    </div>

                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Withdrawals are limited to once per week. Typical arrival: 5-7 working days (UK), 10-12 working days (International).
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>

              {/* Withdrawal Form */}
              {showWithdrawalForm && (
                <Card>
                  <CardHeader>
                    <CardTitle>Request Withdrawal</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="amount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Withdrawal Amount *</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                                    {mockAccountData.currency}
                                  </span>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    min={mockAccountData.minWithdrawal}
                                    max={mockAccountData.maxWithdrawal}
                                    className="pl-8"
                                    {...field}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                  />
                                </div>
                              </FormControl>
                              <FormDescription>
                                Available: {mockAccountData.currency}{mockAccountData.maxWithdrawal}
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
                              <Select onValueChange={field.onChange} value={field.value}>
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
                          <FormField
                            control={form.control}
                            name="stripeAccount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Stripe Account</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="acct_1234567890"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Your Stripe Connect account ID
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}

                        {watchPayoutMethod === "paypal" && (
                          <FormField
                            control={form.control}
                            name="paypalEmail"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>PayPal Email</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="email"
                                    placeholder="your@email.com"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Email associated with your PayPal account
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}

                        {watchPayoutMethod === "bank" && (
                          <FormField
                            control={form.control}
                            name="bankAccount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Bank Account</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Account details"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Bank account number or IBAN
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}

                        {/* Fee Calculation */}
                        {watchAmount && watchPayoutMethod && (
                          <div className="bg-muted/50 p-3 rounded-lg space-y-2">
                            <h4 className="font-medium">Payout Summary</h4>
                            <div className="text-sm space-y-1">
                              <div className="flex justify-between">
                                <span>Withdrawal Amount:</span>
                                <span>{mockAccountData.currency}{watchAmount.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-muted-foreground">
                                <span>Processing Fee:</span>
                                <span>
                                  {PAYOUT_METHODS.find(m => m.id === watchPayoutMethod)?.fee}
                                </span>
                              </div>
                              <div className="flex justify-between text-muted-foreground">
                                <span>Expected Arrival:</span>
                                <span>
                                  {PAYOUT_METHODS.find(m => m.id === watchPayoutMethod)?.eta}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

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
                            {isSubmitting ? "Processing..." : "Submit Withdrawal Request"}
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
                      {mockRecentTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{transaction.date}</TableCell>
                          <TableCell className="font-medium">
                            {transaction.resource}
                          </TableCell>
                          <TableCell>
                            {mockAccountData.currency}{transaction.salePrice}
                          </TableCell>
                          <TableCell className="text-green-600 font-medium">
                            {mockAccountData.currency}{transaction.royalty}
                          </TableCell>
                          <TableCell>{transaction.buyer}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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
                      {mockAccountData.currency}{mockAccountData.totalEarned.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Royalty Tier:</span>
                    <Badge variant="secondary">{mockAccountData.royaltyTier}</Badge>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Withdrawal:</span>
                    <span className="text-sm">{mockAccountData.lastWithdrawal}</span>
                  </div>

                  <Separator />

                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>• Minimum withdrawal: {mockAccountData.currency}{mockAccountData.minWithdrawal}</p>
                    <p>• Maximum per withdrawal: {mockAccountData.currency}10,000</p>
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
                  {mockWithdrawalHistory.map((withdrawal) => (
                    <div key={withdrawal.id} className="border border-border rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          {mockAccountData.currency}{withdrawal.amount}
                        </span>
                        {getStatusBadge(withdrawal.status)}
                      </div>
                      
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div className="flex justify-between">
                          <span>Date:</span>
                          <span>{withdrawal.date}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Method:</span>
                          <span>{withdrawal.method}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>To:</span>
                          <span>{withdrawal.paidTo}</span>
                        </div>
                        {withdrawal.completedDate && (
                          <div className="flex justify-between">
                            <span>Completed:</span>
                            <span>{withdrawal.completedDate}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  <Button variant="outline" className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View All History
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Withdraw;