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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertCircle,
  CheckCircle,
  Settings,
  Percent,
  PoundSterling,
  DollarSign,
  Save,
  RefreshCw,
  TrendingUp,
  Award,
  Receipt,
  CreditCard,
} from "lucide-react";
import { adminApi, PlatformSettings as PlatformSettingsType } from "@/apis/admin";
import { toast } from "sonner";

const PlatformSettings = () => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTiers, setEditedTiers] = useState<{
    bronze: { royaltyRatePercent: number; minSales: number; maxSales: number };
    silver: { royaltyRatePercent: number; minSales: number; maxSales: number };
    gold: { royaltyRatePercent: number; minSales: number; maxSales: number };
  } | null>(null);
  const [editedVat, setEditedVat] = useState<{
    enabled: boolean;
    ratePercent: number;
  } | null>(null);
  const [editedPayout, setEditedPayout] = useState<{
    GBP: number;
    USD: number;
    EUR: number;
  } | null>(null);

  // Fetch platform settings
  const {
    data: settingsData,
    isLoading,
    refetch,
  } = useQuery({
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
      toast.success("Tier settings updated successfully");
      queryClient.invalidateQueries({ queryKey: ["platformSettings"] });
      setIsEditing(false);
      setEditedTiers(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update tier settings");
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
        },
      });
    },
    onSuccess: () => {
      toast.success("VAT settings updated successfully");
      queryClient.invalidateQueries({ queryKey: ["platformSettings"] });
      setEditedVat(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update VAT settings");
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
      toast.success("Minimum payout thresholds updated successfully");
      queryClient.invalidateQueries({ queryKey: ["platformSettings"] });
      setEditedPayout(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update payout thresholds");
    },
  });

  // Initialize edit mode
  const startEditing = () => {
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
          maxSales: settingsData.tiers.gold?.maxSales ?? Infinity,
        },
      });
      setIsEditing(true);
    }
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditedTiers(null);
  };

  const handleSaveTiers = () => {
    if (editedTiers) {
      // Validation
      if (
        editedTiers.bronze.royaltyRatePercent < 0 ||
        editedTiers.bronze.royaltyRatePercent > 100 ||
        editedTiers.silver.royaltyRatePercent < 0 ||
        editedTiers.silver.royaltyRatePercent > 100 ||
        editedTiers.gold.royaltyRatePercent < 0 ||
        editedTiers.gold.royaltyRatePercent > 100
      ) {
        toast.error("Royalty rates must be between 0% and 100%");
        return;
      }

      // Validate tier thresholds are logical
      if (editedTiers.bronze.maxSales >= editedTiers.silver.minSales) {
        toast.error("Bronze max sales must be less than Silver min sales");
        return;
      }
      if (editedTiers.silver.maxSales >= editedTiers.gold.minSales) {
        toast.error("Silver max sales must be less than Gold min sales");
        return;
      }

      updateTiersMutation.mutate(editedTiers);
    }
  };

  // VAT editing
  const startEditingVat = () => {
    if (settingsData?.vat) {
      setEditedVat({
        enabled: settingsData.vat.enabled ?? true,
        ratePercent: settingsData.vat.ratePercent ?? 20,
      });
    }
  };

  const handleSaveVat = () => {
    if (editedVat) {
      if (editedVat.ratePercent < 0 || editedVat.ratePercent > 100) {
        toast.error("VAT rate must be between 0% and 100%");
        return;
      }
      updateVatMutation.mutate(editedVat);
    }
  };

  // Payout editing
  const startEditingPayout = () => {
    if (settingsData?.minimumPayout) {
      setEditedPayout({
        GBP: settingsData.minimumPayout.GBP ?? 5000,
        USD: settingsData.minimumPayout.USD ?? 6500,
        EUR: settingsData.minimumPayout.EUR ?? 6000,
      });
    }
  };

  const handleSavePayout = () => {
    if (editedPayout) {
      if (editedPayout.GBP < 0 || editedPayout.USD < 0 || editedPayout.EUR < 0) {
        toast.error("Payout thresholds must be positive");
        return;
      }
      updatePayoutMutation.mutate(editedPayout);
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
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
              Platform Settings
            </h1>
            <p className="text-muted-foreground">
              Manage royalty rates, tier thresholds, and platform fees.
            </p>
          </div>
          <Button variant="outline" onClick={() => refetch()} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

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
              {!isEditing ? (
                <Button onClick={startEditing}>
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Tiers
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={cancelEditing}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveTiers}
                    disabled={updateTiersMutation.isPending}
                  >
                    {updateTiersMutation.isPending ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Save Changes
                  </Button>
                </div>
              )}
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
                {!settingsData?.tiers && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      {isLoading ? "Loading tier settings..." : "No tier settings available"}
                    </TableCell>
                  </TableRow>
                )}
                {settingsData?.tiers && (["bronze", "silver", "gold"] as const).map((tierKey) => {
                  const tier = settingsData.tiers[tierKey];
                  const editedTier = editedTiers?.[tierKey];

                  return (
                    <TableRow key={tierKey}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge className={`${getTierBadgeColor(tierKey)} text-white`}>
                            {tier?.name || tierKey}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {isEditing && editedTier ? (
                          <div className="flex items-center justify-center gap-1">
                            <Input
                              type="number"
                              value={editedTier.royaltyRatePercent}
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
                              className="w-20 text-center"
                              min={0}
                              max={100}
                            />
                            <span className="text-muted-foreground">%</span>
                          </div>
                        ) : (
                          <span className="font-semibold text-green-600">
                            {tier?.royaltyRatePercent}%
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {isEditing && editedTier ? (
                          <span className="text-muted-foreground">
                            {100 - editedTier.royaltyRatePercent}%
                          </span>
                        ) : (
                          <span className="text-orange-600">
                            {tier?.platformFeePercent}%
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {isEditing && editedTier ? (
                          <div className="flex items-center justify-center gap-1">
                            <span className="text-muted-foreground">£</span>
                            <Input
                              type="number"
                              value={editedTier.minSales}
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
                              className="w-24 text-center"
                              min={0}
                            />
                          </div>
                        ) : (
                          <span>{tier?.minSalesFormatted}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {isEditing && editedTier && tierKey !== "gold" ? (
                          <div className="flex items-center justify-center gap-1">
                            <span className="text-muted-foreground">£</span>
                            <Input
                              type="number"
                              value={editedTier.maxSales}
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
                              className="w-24 text-center"
                              min={0}
                            />
                          </div>
                        ) : (
                          <span>{tier?.maxSalesFormatted}</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">How Tiers Work:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      <strong>Seller Royalty:</strong> The percentage sellers receive from
                      each sale
                    </li>
                    <li>
                      <strong>Platform Fee:</strong> Automatically calculated as (100% -
                      Royalty Rate)
                    </li>
                    <li>
                      <strong>Sales Thresholds:</strong> Rolling 12-month sales in GBP
                      determine tier level
                    </li>
                    <li>Tiers are recalculated monthly for each seller</li>
                  </ul>
                </div>
              </div>
            </div>
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
                  <CardDescription>Configure VAT collection for applicable regions</CardDescription>
                </div>
              </div>
              {!editedVat ? (
                <Button variant="outline" onClick={startEditingVat}>
                  <Settings className="w-4 h-4 mr-2" />
                  Edit VAT
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setEditedVat(null)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveVat}
                    disabled={updateVatMutation.isPending}
                  >
                    {updateVatMutation.isPending ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Save
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>VAT Collection</Label>
                {editedVat ? (
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={editedVat.enabled}
                      onCheckedChange={(checked) =>
                        setEditedVat((prev) => (prev ? { ...prev, enabled: checked } : null))
                      }
                    />
                    <span className="text-sm">
                      {editedVat.enabled ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                ) : (
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
                )}
              </div>

              <div className="space-y-2">
                <Label>VAT Rate</Label>
                {editedVat ? (
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      value={editedVat.ratePercent}
                      onChange={(e) =>
                        setEditedVat((prev) =>
                          prev ? { ...prev, ratePercent: Number(e.target.value) } : null
                        )
                      }
                      className="w-24"
                      min={0}
                      max={100}
                    />
                    <span className="text-muted-foreground">%</span>
                  </div>
                ) : (
                  <p className="text-2xl font-bold">{settingsData?.vat?.ratePercent ?? 0}%</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Applicable Countries</Label>
                <div className="flex flex-wrap gap-1">
                  {settingsData?.vat?.applicableCountries?.map((country) => (
                    <Badge key={country} variant="outline">
                      {country}
                    </Badge>
                  ))}
                </div>
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
              {!editedPayout ? (
                <Button variant="outline" onClick={startEditingPayout}>
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Thresholds
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setEditedPayout(null)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSavePayout}
                    disabled={updatePayoutMutation.isPending}
                  >
                    {updatePayoutMutation.isPending ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Save
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <PoundSterling className="w-5 h-5 text-muted-foreground" />
                  <Label className="text-lg">GBP</Label>
                </div>
                {editedPayout ? (
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">£</span>
                    <Input
                      type="number"
                      value={editedPayout.GBP / 100}
                      onChange={(e) =>
                        setEditedPayout((prev) =>
                          prev ? { ...prev, GBP: Number(e.target.value) * 100 } : null
                        )
                      }
                      className="w-32"
                      min={0}
                      step={0.01}
                    />
                  </div>
                ) : (
                  <p className="text-2xl font-bold">
                    {settingsData?.minimumPayout?.GBPFormatted ?? "£0.00"}
                  </p>
                )}
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-muted-foreground" />
                  <Label className="text-lg">USD</Label>
                </div>
                {editedPayout ? (
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">$</span>
                    <Input
                      type="number"
                      value={editedPayout.USD / 100}
                      onChange={(e) =>
                        setEditedPayout((prev) =>
                          prev ? { ...prev, USD: Number(e.target.value) * 100 } : null
                        )
                      }
                      className="w-32"
                      min={0}
                      step={0.01}
                    />
                  </div>
                ) : (
                  <p className="text-2xl font-bold">
                    {settingsData?.minimumPayout?.USDFormatted ?? "$0.00"}
                  </p>
                )}
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-5 h-5 text-muted-foreground text-lg">€</span>
                  <Label className="text-lg">EUR</Label>
                </div>
                {editedPayout ? (
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">€</span>
                    <Input
                      type="number"
                      value={editedPayout.EUR / 100}
                      onChange={(e) =>
                        setEditedPayout((prev) =>
                          prev ? { ...prev, EUR: Number(e.target.value) * 100 } : null
                        )
                      }
                      className="w-32"
                      min={0}
                      step={0.01}
                    />
                  </div>
                ) : (
                  <p className="text-2xl font-bold">
                    {settingsData?.minimumPayout?.EURFormatted ?? "€0.00"}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  Sellers must reach this minimum balance in the respective currency
                  before they can request a withdrawal. Amounts are stored internally in
                  pence/cents.
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
      </div>
    </DashboardLayout>
  );
};

export default PlatformSettings;
