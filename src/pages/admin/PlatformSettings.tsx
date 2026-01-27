import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  CheckCircle,
  Settings,
  PoundSterling,
  DollarSign,
  Save,
  RefreshCw,
  Award,
  Receipt,
  CreditCard,
  Crown,
  Sparkles,
  Check,
  X,
  Pencil,
  Building2,
  FileText,
  Globe,
} from "lucide-react";
import { adminApi, PlatformSettings as PlatformSettingsType } from "@/apis/admin";
import { customToast } from "@/components/ui/sonner";

// EU Countries for VAT rates
const EU_COUNTRIES = [
  { code: "AT", name: "Austria" },
  { code: "BE", name: "Belgium" },
  { code: "BG", name: "Bulgaria" },
  { code: "HR", name: "Croatia" },
  { code: "CY", name: "Cyprus" },
  { code: "CZ", name: "Czech Republic" },
  { code: "DK", name: "Denmark" },
  { code: "EE", name: "Estonia" },
  { code: "FI", name: "Finland" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "GR", name: "Greece" },
  { code: "HU", name: "Hungary" },
  { code: "IE", name: "Ireland" },
  { code: "IT", name: "Italy" },
  { code: "LV", name: "Latvia" },
  { code: "LT", name: "Lithuania" },
  { code: "LU", name: "Luxembourg" },
  { code: "MT", name: "Malta" },
  { code: "NL", name: "Netherlands" },
  { code: "PL", name: "Poland" },
  { code: "PT", name: "Portugal" },
  { code: "RO", name: "Romania" },
  { code: "SK", name: "Slovakia" },
  { code: "SI", name: "Slovenia" },
  { code: "ES", name: "Spain" },
  { code: "SE", name: "Sweden" },
];

// ============================================
// SUBSCRIPTION TAB COMPONENT
// ============================================

const SubscriptionTab = () => {
  // Placeholder subscription plans data
  const subscriptionPlans = [
    {
      id: "free",
      name: "Free",
      price: 0,
      period: "forever",
      features: [
        { name: "Basic job listings", included: true },
        { name: "Limited resource uploads", included: true },
        { name: "Community forum access", included: true },
        { name: "Priority support", included: false },
        { name: "Analytics dashboard", included: false },
        { name: "Featured listings", included: false },
      ],
      isActive: true,
    },
    {
      id: "basic",
      name: "Basic",
      price: 9.99,
      period: "month",
      features: [
        { name: "Enhanced job listings", included: true },
        { name: "50 resource uploads/month", included: true },
        { name: "Community forum access", included: true },
        { name: "Email support", included: true },
        { name: "Basic analytics", included: true },
        { name: "Featured listings", included: false },
      ],
      isActive: true,
    },
    {
      id: "pro",
      name: "Professional",
      price: 29.99,
      period: "month",
      features: [
        { name: "Unlimited job listings", included: true },
        { name: "Unlimited resource uploads", included: true },
        { name: "Community forum access", included: true },
        { name: "Priority support", included: true },
        { name: "Advanced analytics", included: true },
        { name: "Featured listings", included: true },
      ],
      isActive: true,
      popular: true,
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-primary" />
              <div>
                <CardTitle>Subscription Plans</CardTitle>
                <CardDescription>
                  Manage subscription tiers and pricing for your platform
                </CardDescription>
              </div>
            </div>
            <Button>
              <Sparkles className="w-4 h-4 mr-2" />
              Add Plan
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subscriptionPlans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative ${plan.popular ? "border-primary border-2" : ""}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">
                      {plan.price === 0 ? "Free" : `$${plan.price}`}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-muted-foreground">/{plan.period}</span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li
                        key={index}
                        className={`flex items-center gap-2 text-sm ${
                          !feature.included ? "text-muted-foreground" : ""
                        }`}
                      >
                        {feature.included ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <X className="w-4 h-4 text-gray-300" />
                        )}
                        {feature.name}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Edit
                    </Button>
                    <Button
                      variant={plan.isActive ? "destructive" : "default"}
                      size="sm"
                      className="flex-1"
                    >
                      {plan.isActive ? "Disable" : "Enable"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">
                  Subscription Feature Coming Soon
                </p>
                <p>
                  Full subscription management including Stripe integration, automated
                  billing, and plan upgrades/downgrades will be available in the next
                  release.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ============================================
// FINANCIAL SETTINGS TAB COMPONENT
// ============================================

const FinancialSettingsTab = () => {
  const queryClient = useQueryClient();

  // Modal states
  const [tierModalOpen, setTierModalOpen] = useState(false);
  const [vatModalOpen, setVatModalOpen] = useState(false);
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);

  // Edit states
  const [editedTiers, setEditedTiers] = useState<{
    bronze: { royaltyRatePercent: number; minSales: number; maxSales: number };
    silver: { royaltyRatePercent: number; minSales: number; maxSales: number };
    gold: { royaltyRatePercent: number; minSales: number; maxSales: number };
  } | null>(null);

  const [editedVat, setEditedVat] = useState<{
    enabled: boolean;
    ratePercent: number;
    pricingType: "inclusive" | "exclusive";
    applicableRegions: string[];
    b2bReverseCharge: {
      enabled: boolean;
      requireVatNumber: boolean;
    };
  } | null>(null);

  const [editedPayout, setEditedPayout] = useState<{
    GBP: number;
    USD: number;
    EUR: number;
  } | null>(null);

  const [editedInvoice, setEditedInvoice] = useState<{
    autoGenerate: boolean;
    sendToEmail: boolean;
    companyName: string;
    companyAddress: string;
    vatNumber: string;
    invoicePrefix: string;
  } | null>(null);

  // Fetch platform settings
  const { data: settingsData, isLoading, refetch } = useQuery({
    queryKey: ["platformSettings"],
    queryFn: async () => {
      const response = await adminApi.getPlatformSettings();
      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to fetch settings");
      }
      return response.data;
    },
  });

  // Update tier settings mutation
  const updateTiersMutation = useMutation({
    mutationFn: async (tiers: typeof editedTiers) => {
      if (!tiers) return;
      return adminApi.updateTierSettings({
        tiers: {
          bronze: {
            royaltyRate: tiers.bronze.royaltyRatePercent / 100,
            minSales: tiers.bronze.minSales,
            maxSales: tiers.bronze.maxSales,
          },
          silver: {
            royaltyRate: tiers.silver.royaltyRatePercent / 100,
            minSales: tiers.silver.minSales,
            maxSales: tiers.silver.maxSales,
          },
          gold: {
            royaltyRate: tiers.gold.royaltyRatePercent / 100,
            minSales: tiers.gold.minSales,
            maxSales: tiers.gold.maxSales,
          },
        },
      });
    },
    onSuccess: () => {
      customToast.success("Tier settings updated successfully");
      queryClient.invalidateQueries({ queryKey: ["platformSettings"] });
      setTierModalOpen(false);
      setEditedTiers(null);
    },
    onError: (error: Error) => {
      customToast.error(error.message || "Failed to update tier settings");
    },
  });

  // Update VAT settings mutation
  const updateVatMutation = useMutation({
    mutationFn: async (vat: typeof editedVat) => {
      if (!vat) return;
      return adminApi.updateVatSettings({
        vat: {
          enabled: vat.enabled,
          rate: vat.ratePercent / 100,
          pricingType: vat.pricingType,
          applicableRegions: vat.applicableRegions,
          b2bReverseCharge: vat.b2bReverseCharge,
        },
      });
    },
    onSuccess: () => {
      customToast.success("VAT settings updated successfully");
      queryClient.invalidateQueries({ queryKey: ["platformSettings"] });
      setVatModalOpen(false);
      setEditedVat(null);
    },
    onError: (error: Error) => {
      customToast.error(error.message || "Failed to update VAT settings");
    },
  });

  // Update minimum payout mutation
  const updatePayoutMutation = useMutation({
    mutationFn: async (payout: typeof editedPayout) => {
      if (!payout) return;
      return adminApi.updateMinimumPayout({
        minimumPayout: {
          GBP: payout.GBP,
          USD: payout.USD,
          EUR: payout.EUR,
        },
      });
    },
    onSuccess: () => {
      customToast.success("Minimum payout thresholds updated successfully");
      queryClient.invalidateQueries({ queryKey: ["platformSettings"] });
      setPayoutModalOpen(false);
      setEditedPayout(null);
    },
    onError: (error: Error) => {
      customToast.error(error.message || "Failed to update payout thresholds");
    },
  });

  // Update invoice settings mutation
  const updateInvoiceMutation = useMutation({
    mutationFn: async (invoice: typeof editedInvoice) => {
      if (!invoice) return;
      return adminApi.updateVatSettings({
        vat: {
          invoiceSettings: invoice,
        },
      });
    },
    onSuccess: () => {
      customToast.success("Invoice settings updated successfully");
      queryClient.invalidateQueries({ queryKey: ["platformSettings"] });
      setInvoiceModalOpen(false);
      setEditedInvoice(null);
    },
    onError: (error: Error) => {
      customToast.error(error.message || "Failed to update invoice settings");
    },
  });

  // Open tier modal
  const openTierModal = () => {
    if (settingsData?.tiers) {
      setEditedTiers({
        bronze: {
          royaltyRatePercent: settingsData.tiers.bronze?.royaltyRatePercent ?? 60,
          minSales: settingsData.tiers.bronze?.minSales ?? 0,
          maxSales: settingsData.tiers.bronze?.maxSales ?? 999.99,
        },
        silver: {
          royaltyRatePercent: settingsData.tiers.silver?.royaltyRatePercent ?? 70,
          minSales: settingsData.tiers.silver?.minSales ?? 1000,
          maxSales: settingsData.tiers.silver?.maxSales ?? 5999.99,
        },
        gold: {
          royaltyRatePercent: settingsData.tiers.gold?.royaltyRatePercent ?? 80,
          minSales: settingsData.tiers.gold?.minSales ?? 6000,
          maxSales: Infinity,
        },
      });
      setTierModalOpen(true);
    }
  };

  // Open VAT modal
  const openVatModal = () => {
    if (settingsData?.vat) {
      setEditedVat({
        enabled: settingsData.vat.enabled ?? true,
        ratePercent: settingsData.vat.ratePercent ?? 20,
        pricingType: settingsData.vat.pricingType ?? "inclusive",
        applicableRegions: settingsData.vat.applicableRegions ?? ["UK", "EU"],
        b2bReverseCharge: settingsData.vat.b2bReverseCharge ?? {
          enabled: true,
          requireVatNumber: true,
        },
      });
      setVatModalOpen(true);
    }
  };

  // Open payout modal
  const openPayoutModal = () => {
    if (settingsData?.minimumPayout) {
      setEditedPayout({
        GBP: settingsData.minimumPayout.GBP ?? 5000,
        USD: settingsData.minimumPayout.USD ?? 6500,
        EUR: settingsData.minimumPayout.EUR ?? 6000,
      });
      setPayoutModalOpen(true);
    }
  };

  // Open invoice modal
  const openInvoiceModal = () => {
    if (settingsData?.vat?.invoiceSettings) {
      setEditedInvoice({
        autoGenerate: settingsData.vat.invoiceSettings.autoGenerate ?? true,
        sendToEmail: settingsData.vat.invoiceSettings.sendToEmail ?? true,
        companyName: settingsData.vat.invoiceSettings.companyName ?? "Educate Link Ltd",
        companyAddress: settingsData.vat.invoiceSettings.companyAddress ?? "",
        vatNumber: settingsData.vat.invoiceSettings.vatNumber ?? "",
        invoicePrefix: settingsData.vat.invoiceSettings.invoicePrefix ?? "INV",
      });
      setInvoiceModalOpen(true);
    }
  };

  // Save handlers
  const handleSaveTiers = () => {
    if (editedTiers) {
      if (
        editedTiers.bronze.royaltyRatePercent < 0 ||
        editedTiers.bronze.royaltyRatePercent > 100 ||
        editedTiers.silver.royaltyRatePercent < 0 ||
        editedTiers.silver.royaltyRatePercent > 100 ||
        editedTiers.gold.royaltyRatePercent < 0 ||
        editedTiers.gold.royaltyRatePercent > 100
      ) {
        customToast.error("Royalty rates must be between 0% and 100%");
        return;
      }

      if (editedTiers.bronze.maxSales >= editedTiers.silver.minSales) {
        customToast.error("Bronze max sales must be less than Silver min sales");
        return;
      }
      if (editedTiers.silver.maxSales >= editedTiers.gold.minSales) {
        customToast.error("Silver max sales must be less than Gold min sales");
        return;
      }

      updateTiersMutation.mutate(editedTiers);
    }
  };

  const handleSaveVat = () => {
    if (editedVat) {
      if (editedVat.ratePercent < 0 || editedVat.ratePercent > 100) {
        customToast.error("VAT rate must be between 0% and 100%");
        return;
      }
      updateVatMutation.mutate(editedVat);
    }
  };

  const handleSavePayout = () => {
    if (editedPayout) {
      if (editedPayout.GBP < 0 || editedPayout.USD < 0 || editedPayout.EUR < 0) {
        customToast.error("Payout thresholds must be positive");
        return;
      }
      updatePayoutMutation.mutate(editedPayout);
    }
  };

  const handleSaveInvoice = () => {
    if (editedInvoice) {
      updateInvoiceMutation.mutate(editedInvoice);
    }
  };

  const getTierBadgeColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case "bronze":
        return "bg-amber-600";
      case "silver":
        return "bg-gray-400";
      case "gold":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tier/Royalty Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              <div>
                <CardTitle>Seller Tier & Royalty Rates</CardTitle>
                <CardDescription>
                  Configure royalty rates and sales thresholds for each seller tier
                </CardDescription>
              </div>
            </div>
            <Button onClick={openTierModal}>
              <Pencil className="w-4 h-4 mr-2" />
              Edit Tiers
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tier</TableHead>
                <TableHead className="text-center">Seller Royalty</TableHead>
                <TableHead className="text-center">Platform Fee</TableHead>
                <TableHead className="text-center">Min Sales (GBP)</TableHead>
                <TableHead className="text-center">Max Sales (GBP)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {settingsData?.tiers &&
                (["bronze", "silver", "gold"] as const).map((tierKey) => {
                  const tier = settingsData.tiers[tierKey];
                  return (
                    <TableRow key={tierKey}>
                      <TableCell>
                        <Badge className={`${getTierBadgeColor(tierKey)} text-white`}>
                          {tier?.name || tierKey}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-semibold text-green-600">
                          {tier?.royaltyRatePercent}%
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-orange-600">{tier?.platformFeePercent}%</span>
                      </TableCell>
                      <TableCell className="text-center">{tier?.minSalesFormatted}</TableCell>
                      <TableCell className="text-center">{tier?.maxSalesFormatted}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* VAT Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-primary" />
              <div>
                <CardTitle>VAT Settings</CardTitle>
                <CardDescription>
                  Configure VAT collection, rates, and B2B reverse charge
                </CardDescription>
              </div>
            </div>
            <Button onClick={openVatModal}>
              <Pencil className="w-4 h-4 mr-2" />
              Edit VAT
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label className="text-muted-foreground">VAT Collection</Label>
              <div className="flex items-center gap-2">
                {settingsData?.vat?.enabled ? (
                  <Badge className="bg-green-600 text-white">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Enabled
                  </Badge>
                ) : (
                  <Badge variant="secondary">Disabled</Badge>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Default UK VAT Rate</Label>
              <p className="text-2xl font-bold">{settingsData?.vat?.ratePercent ?? 0}%</p>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Pricing Type</Label>
              <Badge variant="outline" className="capitalize">
                {settingsData?.vat?.pricingType || "inclusive"}
              </Badge>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">B2B Reverse Charge</Label>
              <div className="flex items-center gap-2">
                {settingsData?.vat?.b2bReverseCharge?.enabled ? (
                  <Badge className="bg-blue-600 text-white">
                    <Building2 className="w-3 h-3 mr-1" />
                    Enabled for Schools
                  </Badge>
                ) : (
                  <Badge variant="secondary">Disabled</Badge>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <Label className="text-muted-foreground">Applicable Regions</Label>
            <div className="flex flex-wrap gap-1">
              {settingsData?.vat?.applicableRegions?.map((region) => (
                <Badge key={region} variant="outline">
                  <Globe className="w-3 h-3 mr-1" />
                  {region}
                </Badge>
              ))}
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-800 dark:text-blue-200 mb-1">VAT Logic</p>
                <ul className="list-disc list-inside space-y-1 text-blue-700 dark:text-blue-300">
                  <li><strong>B2C (Teachers):</strong> VAT charged based on buyer country</li>
                  <li><strong>B2B (Schools):</strong> Reverse charge applies with valid VAT number</li>
                  <li><strong>Outside UK/EU:</strong> No VAT applied</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <div>
                <CardTitle>Invoice Settings</CardTitle>
                <CardDescription>
                  Configure automatic invoice generation and company details
                </CardDescription>
              </div>
            </div>
            <Button onClick={openInvoiceModal}>
              <Pencil className="w-4 h-4 mr-2" />
              Edit Invoice
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Auto-Generate Invoices</Label>
              <div className="flex items-center gap-2">
                {settingsData?.vat?.invoiceSettings?.autoGenerate ? (
                  <Badge className="bg-green-600 text-white">Yes</Badge>
                ) : (
                  <Badge variant="secondary">No</Badge>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Send to Email</Label>
              <div className="flex items-center gap-2">
                {settingsData?.vat?.invoiceSettings?.sendToEmail ? (
                  <Badge className="bg-green-600 text-white">Yes</Badge>
                ) : (
                  <Badge variant="secondary">No</Badge>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Invoice Prefix</Label>
              <p className="font-semibold">{settingsData?.vat?.invoiceSettings?.invoicePrefix || "INV"}</p>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Company Name</Label>
              <p className="font-semibold">{settingsData?.vat?.invoiceSettings?.companyName || "Not set"}</p>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">VAT Number</Label>
              <p className="font-semibold">{settingsData?.vat?.invoiceSettings?.vatNumber || "Not set"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Minimum Payout Thresholds */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              <div>
                <CardTitle>Minimum Payout Thresholds</CardTitle>
                <CardDescription>
                  Minimum balance required before sellers can request withdrawals
                </CardDescription>
              </div>
            </div>
            <Button onClick={openPayoutModal}>
              <Pencil className="w-4 h-4 mr-2" />
              Edit Thresholds
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10">
              <div className="flex items-center gap-2 mb-2">
                <PoundSterling className="w-5 h-5 text-blue-600" />
                <Label className="text-lg">GBP</Label>
              </div>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {settingsData?.minimumPayout?.GBPFormatted ?? "£0.00"}
              </p>
            </div>

            <div className="p-4 border rounded-lg bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/10">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <Label className="text-lg">USD</Label>
              </div>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                {settingsData?.minimumPayout?.USDFormatted ?? "$0.00"}
              </p>
            </div>

            <div className="p-4 border rounded-lg bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/10">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-5 h-5 text-purple-600 text-lg font-bold">€</span>
                <Label className="text-lg">EUR</Label>
              </div>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                {settingsData?.minimumPayout?.EURFormatted ?? "€0.00"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Last Updated Info */}
      {settingsData?.lastUpdatedAt && (
        <div className="text-sm text-muted-foreground text-right">
          Last updated: {new Date(settingsData.lastUpdatedAt).toLocaleString()}
        </div>
      )}

      {/* ===== MODALS ===== */}

      {/* Tier Edit Modal */}
      <Dialog open={tierModalOpen} onOpenChange={setTierModalOpen}>
        <DialogContent className="w-[95vw] sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Edit Seller Tier Settings
            </DialogTitle>
            <DialogDescription>
              Configure royalty rates and sales thresholds for each seller tier.
            </DialogDescription>
          </DialogHeader>

          {editedTiers && (
            <div className="space-y-6 py-4">
              {(["bronze", "silver", "gold"] as const).map((tierKey) => (
                <div key={tierKey} className="space-y-3 p-4 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Badge className={`${getTierBadgeColor(tierKey)} text-white`}>
                      {tierKey.charAt(0).toUpperCase() + tierKey.slice(1)}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Royalty Rate (%)</Label>
                      <Input
                        type="number"
                        value={editedTiers[tierKey].royaltyRatePercent}
                        onChange={(e) =>
                          setEditedTiers((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  [tierKey]: {
                                    ...prev[tierKey],
                                    royaltyRatePercent: Number(e.target.value),
                                  },
                                }
                              : null
                          )
                        }
                        min={0}
                        max={100}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Min Sales (£)</Label>
                      <Input
                        type="number"
                        value={editedTiers[tierKey].minSales}
                        onChange={(e) =>
                          setEditedTiers((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  [tierKey]: {
                                    ...prev[tierKey],
                                    minSales: Number(e.target.value),
                                  },
                                }
                              : null
                          )
                        }
                        min={0}
                      />
                    </div>

                    {tierKey !== "gold" && (
                      <div className="space-y-2">
                        <Label>Max Sales (£)</Label>
                        <Input
                          type="number"
                          value={editedTiers[tierKey].maxSales}
                          onChange={(e) =>
                            setEditedTiers((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    [tierKey]: {
                                      ...prev[tierKey],
                                      maxSales: Number(e.target.value),
                                    },
                                  }
                                : null
                            )
                          }
                          min={0}
                        />
                      </div>
                    )}

                    {tierKey === "gold" && (
                      <div className="space-y-2">
                        <Label>Max Sales</Label>
                        <p className="text-sm text-muted-foreground mt-2">Unlimited</p>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Platform Fee: {100 - editedTiers[tierKey].royaltyRatePercent}%
                  </p>
                </div>
              ))}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setTierModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTiers} disabled={updateTiersMutation.isPending}>
              {updateTiersMutation.isPending ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* VAT Edit Modal */}
      <Dialog open={vatModalOpen} onOpenChange={setVatModalOpen}>
        <DialogContent className="w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="w-5 h-5" />
              Edit VAT Settings
            </DialogTitle>
            <DialogDescription>
              Configure VAT collection and B2B reverse charge settings.
            </DialogDescription>
          </DialogHeader>

          {editedVat && (
            <div className="space-y-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable VAT Collection</Label>
                  <p className="text-sm text-muted-foreground">
                    Apply VAT to purchases from UK/EU buyers
                  </p>
                </div>
                <Switch
                  checked={editedVat.enabled}
                  onCheckedChange={(checked) =>
                    setEditedVat((prev) => (prev ? { ...prev, enabled: checked } : null))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Default UK VAT Rate (%)</Label>
                <Input
                  type="number"
                  value={editedVat.ratePercent}
                  onChange={(e) =>
                    setEditedVat((prev) =>
                      prev ? { ...prev, ratePercent: Number(e.target.value) } : null
                    )
                  }
                  min={0}
                  max={100}
                  disabled={!editedVat.enabled}
                />
              </div>

              <div className="space-y-2">
                <Label>Pricing Type</Label>
                <Select
                  value={editedVat.pricingType}
                  onValueChange={(value: "inclusive" | "exclusive") =>
                    setEditedVat((prev) =>
                      prev ? { ...prev, pricingType: value } : null
                    )
                  }
                  disabled={!editedVat.enabled}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inclusive">VAT Inclusive (prices include VAT)</SelectItem>
                    <SelectItem value="exclusive">VAT Exclusive (VAT added at checkout)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Applicable Regions</Label>
                <div className="flex flex-wrap gap-2">
                  {["UK", "EU"].map((region) => (
                    <Badge
                      key={region}
                      variant={editedVat.applicableRegions.includes(region) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() =>
                        setEditedVat((prev) => {
                          if (!prev) return null;
                          const regions = prev.applicableRegions.includes(region)
                            ? prev.applicableRegions.filter((r) => r !== region)
                            : [...prev.applicableRegions, region];
                          return { ...prev, applicableRegions: regions };
                        })
                      }
                    >
                      {region}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>B2B Reverse Charge (Schools)</Label>
                    <p className="text-sm text-muted-foreground">
                      No VAT charged to Schools with valid VAT number
                    </p>
                  </div>
                  <Switch
                    checked={editedVat.b2bReverseCharge.enabled}
                    onCheckedChange={(checked) =>
                      setEditedVat((prev) =>
                        prev
                          ? {
                              ...prev,
                              b2bReverseCharge: { ...prev.b2bReverseCharge, enabled: checked },
                            }
                          : null
                      )
                    }
                    disabled={!editedVat.enabled}
                  />
                </div>

                {editedVat.b2bReverseCharge.enabled && (
                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <Label>Require VAT Number</Label>
                      <p className="text-sm text-muted-foreground">
                        Schools must provide VAT number for reverse charge
                      </p>
                    </div>
                    <Switch
                      checked={editedVat.b2bReverseCharge.requireVatNumber}
                      onCheckedChange={(checked) =>
                        setEditedVat((prev) =>
                          prev
                            ? {
                                ...prev,
                                b2bReverseCharge: {
                                  ...prev.b2bReverseCharge,
                                  requireVatNumber: checked,
                                },
                              }
                            : null
                        )
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setVatModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveVat} disabled={updateVatMutation.isPending}>
              {updateVatMutation.isPending ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payout Edit Modal */}
      <Dialog open={payoutModalOpen} onOpenChange={setPayoutModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Edit Minimum Payout Thresholds
            </DialogTitle>
            <DialogDescription>
              Set the minimum balance required before sellers can withdraw funds.
            </DialogDescription>
          </DialogHeader>

          {editedPayout && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <PoundSterling className="w-4 h-4" />
                  GBP Minimum (in pounds)
                </Label>
                <Input
                  type="number"
                  value={editedPayout.GBP / 100}
                  onChange={(e) =>
                    setEditedPayout((prev) =>
                      prev ? { ...prev, GBP: Number(e.target.value) * 100 } : null
                    )
                  }
                  min={0}
                  step={0.01}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  USD Minimum (in dollars)
                </Label>
                <Input
                  type="number"
                  value={editedPayout.USD / 100}
                  onChange={(e) =>
                    setEditedPayout((prev) =>
                      prev ? { ...prev, USD: Number(e.target.value) * 100 } : null
                    )
                  }
                  min={0}
                  step={0.01}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <span className="text-lg">€</span>
                  EUR Minimum (in euros)
                </Label>
                <Input
                  type="number"
                  value={editedPayout.EUR / 100}
                  onChange={(e) =>
                    setEditedPayout((prev) =>
                      prev ? { ...prev, EUR: Number(e.target.value) * 100 } : null
                    )
                  }
                  min={0}
                  step={0.01}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setPayoutModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePayout} disabled={updatePayoutMutation.isPending}>
              {updatePayoutMutation.isPending ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invoice Settings Modal */}
      <Dialog open={invoiceModalOpen} onOpenChange={setInvoiceModalOpen}>
        <DialogContent className="w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Edit Invoice Settings
            </DialogTitle>
            <DialogDescription>
              Configure automatic invoice generation and company details for invoices.
            </DialogDescription>
          </DialogHeader>

          {editedInvoice && (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-Generate Invoices</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically create invoice after each purchase
                  </p>
                </div>
                <Switch
                  checked={editedInvoice.autoGenerate}
                  onCheckedChange={(checked) =>
                    setEditedInvoice((prev) =>
                      prev ? { ...prev, autoGenerate: checked } : null
                    )
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Send Invoice to Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Email invoice to buyer after purchase
                  </p>
                </div>
                <Switch
                  checked={editedInvoice.sendToEmail}
                  onCheckedChange={(checked) =>
                    setEditedInvoice((prev) =>
                      prev ? { ...prev, sendToEmail: checked } : null
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Invoice Number Prefix</Label>
                <Input
                  value={editedInvoice.invoicePrefix}
                  onChange={(e) =>
                    setEditedInvoice((prev) =>
                      prev ? { ...prev, invoicePrefix: e.target.value } : null
                    )
                  }
                  placeholder="INV"
                />
              </div>

              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input
                  value={editedInvoice.companyName}
                  onChange={(e) =>
                    setEditedInvoice((prev) =>
                      prev ? { ...prev, companyName: e.target.value } : null
                    )
                  }
                  placeholder="Educate Link Ltd"
                />
              </div>

              <div className="space-y-2">
                <Label>Company Address</Label>
                <Textarea
                  value={editedInvoice.companyAddress}
                  onChange={(e) =>
                    setEditedInvoice((prev) =>
                      prev ? { ...prev, companyAddress: e.target.value } : null
                    )
                  }
                  placeholder="123 Business Street, City, Postcode"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>VAT Registration Number</Label>
                <Input
                  value={editedInvoice.vatNumber}
                  onChange={(e) =>
                    setEditedInvoice((prev) =>
                      prev ? { ...prev, vatNumber: e.target.value } : null
                    )
                  }
                  placeholder="GB123456789"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setInvoiceModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveInvoice} disabled={updateInvoiceMutation.isPending}>
              {updateInvoiceMutation.isPending ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const PlatformSettings = () => {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
            Subscription & Financial Settings
          </h1>
          <p className="text-muted-foreground">
            Manage subscription plans, royalty rates, VAT, and payment configurations
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="financial" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="subscription">
              <Crown className="w-4 h-4 mr-2" />
              Subscription
            </TabsTrigger>
            <TabsTrigger value="financial">
              <CreditCard className="w-4 h-4 mr-2" />
              Tier, VAT & Payout
            </TabsTrigger>
          </TabsList>

          <TabsContent value="subscription" className="mt-6">
            <SubscriptionTab />
          </TabsContent>

          <TabsContent value="financial" className="mt-6">
            <FinancialSettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default PlatformSettings;
