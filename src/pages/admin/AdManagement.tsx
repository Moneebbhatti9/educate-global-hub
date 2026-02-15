import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Megaphone,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  Eye,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Loader2,
  ImageIcon,
  MoreHorizontal,
  Plus,
  Pencil,
  Trash2,
  Tag,
  PoundSterling,
  Calendar,
  Star,
  Zap,
  AlertTriangle,
} from "lucide-react";
import { adminAdApi } from "@/apis/ads";
import type { AdRequest, AdRequestStatus, AdStats, AdminAdTier, AdTierFormData } from "@/apis/ads";
import { customToast } from "@/components/ui/sonner";
import DashboardLayout from "@/layout/DashboardLayout";

const statusConfig: Record<
  AdRequestStatus,
  { label: string; color: string; bgColor: string; icon: React.ReactNode }
> = {
  PENDING_REVIEW: {
    label: "Pending Review",
    color: "text-amber-700",
    bgColor: "bg-amber-100",
    icon: <Clock className="w-3 h-3" />,
  },
  APPROVED: {
    label: "Approved",
    color: "text-blue-700",
    bgColor: "bg-blue-100",
    icon: <CheckCircle className="w-3 h-3" />,
  },
  PENDING_PAYMENT: {
    label: "Pending Payment",
    color: "text-orange-700",
    bgColor: "bg-orange-100",
    icon: <CreditCard className="w-3 h-3" />,
  },
  REJECTED: {
    label: "Rejected",
    color: "text-red-700",
    bgColor: "bg-red-100",
    icon: <XCircle className="w-3 h-3" />,
  },
  CHANGES_REQUESTED: {
    label: "Changes Requested",
    color: "text-purple-700",
    bgColor: "bg-purple-100",
    icon: <MessageSquare className="w-3 h-3" />,
  },
  ACTIVE: {
    label: "Active",
    color: "text-green-700",
    bgColor: "bg-green-100",
    icon: <CheckCircle className="w-3 h-3" />,
  },
  EXPIRED: {
    label: "Expired",
    color: "text-gray-700",
    bgColor: "bg-gray-100",
    icon: <XCircle className="w-3 h-3" />,
  },
  CANCELLED: {
    label: "Cancelled",
    color: "text-gray-500",
    bgColor: "bg-gray-50",
    icon: <XCircle className="w-3 h-3" />,
  },
};

const defaultTierForm: AdTierFormData = {
  name: "",
  slug: "",
  description: "",
  normalPrice: 0,
  launchPrice: 0,
  currency: "GBP",
  durationDays: 30,
  durationLabel: "",
  features: [],
  isActive: true,
  sortOrder: 0,
  highlight: null,
  isLaunchPricing: true,
  launchPricingExpiresAt: null,
};

const AdManagement = () => {
  // Ad Requests state
  const [adRequests, setAdRequests] = useState<AdRequest[]>([]);
  const [stats, setStats] = useState<AdStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<AdRequest | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionType, setActionType] = useState<"reject" | "changes" | null>(null);
  const [actionComment, setActionComment] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [approveConfirmRequest, setApproveConfirmRequest] = useState<AdRequest | null>(null);

  // Ad Tiers state
  const [tiers, setTiers] = useState<AdminAdTier[]>([]);
  const [tiersLoading, setTiersLoading] = useState(true);
  const [tierModalOpen, setTierModalOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<AdminAdTier | null>(null);
  const [tierForm, setTierForm] = useState<AdTierFormData>(defaultTierForm);
  const [tierSaving, setTierSaving] = useState(false);
  const [deleteTier, setDeleteTier] = useState<AdminAdTier | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [featuresInput, setFeaturesInput] = useState("");

  // Fetch ad requests
  useEffect(() => {
    fetchAdRequests();
  }, [statusFilter]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const data = await adminAdApi.getAdStats();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch ad stats:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchAdRequests = async () => {
    setLoading(true);
    try {
      const requests = await adminAdApi.getAdRequests({
        status: statusFilter !== "all" ? statusFilter : undefined,
        search: searchQuery || undefined,
      });
      setAdRequests(requests);
    } catch (error) {
      console.error("Failed to fetch ad requests:", error);
      customToast.error("Failed to load ad requests");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchAdRequests();
  };

  const handleViewDetail = async (id: string) => {
    setDetailLoading(true);
    try {
      const detail = await adminAdApi.getAdRequestDetail(id);
      setSelectedRequest(detail);
    } catch (error) {
      console.error("Failed to fetch ad request detail:", error);
      customToast.error("Failed to load ad request detail");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    setActionLoading(true);
    try {
      await adminAdApi.approveAdRequest(id);
      customToast.success("Ad request approved", "School will be notified to complete payment.");
      setApproveConfirmRequest(null);
      setSelectedRequest(null);
      fetchAdRequests();
      fetchStats();
    } catch (error) {
      console.error("Failed to approve:", error);
      customToast.error("Failed to approve ad request");
    } finally {
      setActionLoading(false);
    }
  };

  const handleActionSubmit = async () => {
    if (!selectedRequest || !actionType) return;
    if (actionComment.trim().length < 10) {
      customToast.warning("Comment required", "Please provide at least 10 characters of feedback.");
      return;
    }

    setActionLoading(true);
    try {
      if (actionType === "reject") {
        await adminAdApi.rejectAdRequest(selectedRequest._id, actionComment.trim());
        customToast.success("Ad request rejected", "School will be notified.");
      } else {
        await adminAdApi.requestChanges(selectedRequest._id, actionComment.trim());
        customToast.success("Changes requested", "School will be notified with your feedback.");
      }
      setActionType(null);
      setActionComment("");
      setSelectedRequest(null);
      fetchAdRequests();
      fetchStats();
    } catch (error) {
      console.error("Failed to perform action:", error);
      customToast.error("Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getSchoolName = (request: AdRequest) => {
    if (typeof request.schoolId === "object" && request.schoolId !== null) {
      const school = request.schoolId as { firstName?: string; lastName?: string; email?: string };
      return `${school.firstName || ""} ${school.lastName || ""}`.trim() || school.email || "Unknown";
    }
    return "Unknown";
  };

  // ==========================================
  // Ad Tier CRUD handlers
  // ==========================================

  const fetchTiers = async () => {
    setTiersLoading(true);
    try {
      const data = await adminAdApi.getAllAdTiers();
      setTiers(data);
    } catch (error) {
      console.error("Failed to fetch ad tiers:", error);
      customToast.error("Failed to load ad tiers");
    } finally {
      setTiersLoading(false);
    }
  };

  const formatPrice = (pence: number) => {
    return `\u00A3${(pence / 100).toFixed(2)}`;
  };

  const openCreateTierModal = () => {
    setEditingTier(null);
    setTierForm(defaultTierForm);
    setFeaturesInput("");
    setTierModalOpen(true);
  };

  const openEditTierModal = (tier: AdminAdTier) => {
    setEditingTier(tier);
    setTierForm({
      name: tier.name,
      slug: tier.slug,
      description: tier.description || "",
      normalPrice: tier.normalPrice,
      launchPrice: tier.launchPrice,
      currency: tier.currency || "GBP",
      durationDays: tier.durationDays,
      durationLabel: tier.durationLabel,
      features: tier.features || [],
      isActive: tier.isActive,
      sortOrder: tier.sortOrder,
      highlight: tier.highlight,
      isLaunchPricing: tier.isLaunchPricing,
      launchPricingExpiresAt: tier.launchPricingExpiresAt
        ? new Date(tier.launchPricingExpiresAt).toISOString().split("T")[0]
        : null,
    });
    setFeaturesInput((tier.features || []).join("\n"));
    setTierModalOpen(true);
  };

  const handleTierFormChange = (field: keyof AdTierFormData, value: unknown) => {
    setTierForm((prev) => ({ ...prev, [field]: value }));
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleTierSubmit = async () => {
    if (!tierForm.name || !tierForm.slug || !tierForm.durationLabel) {
      customToast.warning("Required fields", "Name, slug, and duration label are required.");
      return;
    }

    setTierSaving(true);
    try {
      const payload: AdTierFormData = {
        ...tierForm,
        features: featuresInput.split("\n").map((f) => f.trim()).filter(Boolean),
        launchPricingExpiresAt: tierForm.launchPricingExpiresAt
          ? new Date(tierForm.launchPricingExpiresAt).toISOString()
          : null,
      };

      if (editingTier) {
        await adminAdApi.updateAdTier(editingTier._id, payload);
        customToast.success("Tier updated", `"${tierForm.name}" has been updated.`);
      } else {
        await adminAdApi.createAdTier(payload);
        customToast.success("Tier created", `"${tierForm.name}" has been created.`);
      }

      setTierModalOpen(false);
      fetchTiers();
    } catch (error: unknown) {
      console.error("Failed to save tier:", error);
      const msg = error instanceof Error ? error.message : "Failed to save ad tier";
      customToast.error(msg);
    } finally {
      setTierSaving(false);
    }
  };

  const handleDeleteTier = async () => {
    if (!deleteTier) return;
    setDeleteLoading(true);
    try {
      await adminAdApi.deleteAdTier(deleteTier._id);
      customToast.success("Tier deleted", `"${deleteTier.name}" has been deleted.`);
      setDeleteTier(null);
      fetchTiers();
    } catch (error: unknown) {
      console.error("Failed to delete tier:", error);
      const msg = error instanceof Error ? error.message : "Failed to delete ad tier";
      customToast.error(msg);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
            Ad Management
          </h1>
          <p className="text-muted-foreground">
            Review, approve, and manage ad requests and pricing tiers.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10 border-blue-200/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Total Requests
              </CardTitle>
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Megaphone className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                {statsLoading ? "..." : stats?.totalRequests || 0}
              </div>
              <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-1">
                All ad requests
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/20 dark:to-amber-900/10 border-amber-200/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-300">
                Pending Review
              </CardTitle>
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-900 dark:text-amber-100">
                {statsLoading ? "..." : stats?.pendingReview || 0}
              </div>
              <p className="text-xs text-amber-600/70 dark:text-amber-400/70 mt-1">
                Awaiting admin review
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/10 border-green-200/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
                Active
              </CardTitle>
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900 dark:text-green-100">
                {statsLoading ? "..." : stats?.active || 0}
              </div>
              <p className="text-xs text-green-600/70 dark:text-green-400/70 mt-1">
                Currently live
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/20 dark:to-orange-900/10 border-orange-200/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">
                Pending Payment
              </CardTitle>
              <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-900 dark:text-orange-100">
                {statsLoading ? "..." : stats?.pendingPayment || 0}
              </div>
              <p className="text-xs text-orange-600/70 dark:text-orange-400/70 mt-1">
                Awaiting payment
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/20 dark:to-red-900/10 border-red-200/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-700 dark:text-red-300">
                Rejected / Expired
              </CardTitle>
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-900 dark:text-red-100">
                {statsLoading ? "..." : (stats?.rejected || 0) + (stats?.expired || 0)}
              </div>
              <p className="text-xs text-red-600/70 dark:text-red-400/70 mt-1">
                Rejected or expired
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="requests" onValueChange={(val) => {
          if (val === "tiers" && tiers.length === 0) fetchTiers();
        }}>
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="requests" className="flex items-center gap-2">
              <Megaphone className="w-4 h-4" />
              Ad Requests
            </TabsTrigger>
            <TabsTrigger value="tiers" className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Pricing & Tiers
            </TabsTrigger>
          </TabsList>

          {/* ==========================================
              TAB 1: Ad Requests
              ========================================== */}
          <TabsContent value="requests" className="space-y-6 mt-6">
            {/* Search & Filter */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Search & Filter</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by school or job name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="PENDING_REVIEW">Pending Review</SelectItem>
                      <SelectItem value="APPROVED">Approved</SelectItem>
                      <SelectItem value="PENDING_PAYMENT">Pending Payment</SelectItem>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="REJECTED">Rejected</SelectItem>
                      <SelectItem value="CHANGES_REQUESTED">Changes Requested</SelectItem>
                      <SelectItem value="EXPIRED">Expired</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={handleSearch}>
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Ad Requests Table */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Ad Requests ({adRequests.length})
                  </CardTitle>
                </div>
                <CardDescription>
                  Review and manage all ad requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
                  </div>
                ) : adRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <Megaphone className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No Ad Requests
                    </h3>
                    <p className="text-muted-foreground">
                      {statusFilter !== "all"
                        ? `No ad requests with status "${statusConfig[statusFilter as AdRequestStatus]?.label || statusFilter}".`
                        : "No ad requests have been submitted yet."}
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Banner</TableHead>
                        <TableHead>Job Details</TableHead>
                        <TableHead>School</TableHead>
                        <TableHead>Tier</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {adRequests.map((request) => {
                        const status = statusConfig[request.status];
                        return (
                          <TableRow
                            key={request._id}
                            className="group hover:bg-muted/50 transition-all duration-300 hover:shadow-sm"
                          >
                            <TableCell>
                              <div className="w-[100px] h-[34px] flex-shrink-0 rounded overflow-hidden border">
                                <img
                                  src={request.bannerImageUrl}
                                  alt="Banner"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-0.5">
                                <div className="font-medium group-hover:text-brand-primary transition-colors duration-300">
                                  {request.jobId?.title || "Unknown Job"}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {request.jobId?.organization}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm">{getSchoolName(request)}</span>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-0.5">
                                <div className="text-sm font-medium">{request.tierId?.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {request.tierId?.durationLabel}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={`${status.bgColor} ${status.color} border-0 flex items-center gap-1 w-fit`}
                              >
                                {status.icon}
                                <span>{status.label}</span>
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {formatDate(request.createdAt)}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="group-hover:bg-brand-primary/10 group-hover:scale-110 transition-all duration-300"
                                  >
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => handleViewDetail(request._id)}
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Detail
                                  </DropdownMenuItem>
                                  {request.status === "PENDING_REVIEW" && (
                                    <>
                                      <DropdownMenuItem
                                        onClick={() => setApproveConfirmRequest(request)}
                                      >
                                        <ThumbsUp className="w-4 h-4 mr-2" />
                                        Approve
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => {
                                          setSelectedRequest(request);
                                          setActionType("reject");
                                        }}
                                        className="text-red-600"
                                      >
                                        <ThumbsDown className="w-4 h-4 mr-2" />
                                        Reject
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => {
                                          setSelectedRequest(request);
                                          setActionType("changes");
                                        }}
                                      >
                                        <MessageSquare className="w-4 h-4 mr-2" />
                                        Request Changes
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ==========================================
              TAB 2: Pricing & Tiers
              ========================================== */}
          <TabsContent value="tiers" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Ad Pricing Tiers</CardTitle>
                    <CardDescription>
                      Manage pricing, discounts, and features for ad tiers that schools can purchase.
                    </CardDescription>
                  </div>
                  <Button onClick={openCreateTierModal} className="bg-brand-primary hover:bg-brand-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Tier
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {tiersLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
                  </div>
                ) : tiers.length === 0 ? (
                  <div className="text-center py-8">
                    <Tag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No Ad Tiers
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Create your first ad pricing tier to get started.
                    </p>
                    <Button onClick={openCreateTierModal}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Tier
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tiers.map((tier) => (
                      <Card
                        key={tier._id}
                        className={`relative overflow-hidden transition-all duration-300 hover:shadow-md ${
                          !tier.isActive ? "opacity-60" : ""
                        } ${tier.highlight ? "border-brand-primary/50 ring-1 ring-brand-primary/20" : ""}`}
                      >
                        {tier.highlight && (
                          <div className="absolute top-0 right-0 bg-brand-primary text-white text-xs font-medium px-3 py-1 rounded-bl-lg">
                            <Star className="w-3 h-3 inline mr-1" />
                            {tier.highlight}
                          </div>
                        )}
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">{tier.name}</CardTitle>
                              <CardDescription className="text-xs mt-1">
                                Slug: {tier.slug}
                              </CardDescription>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => openEditTierModal(tier)}
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => setDeleteTier(tier)}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {tier.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {tier.description}
                            </p>
                          )}

                          {/* Pricing */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <PoundSterling className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">Pricing</span>
                            </div>
                            <div className="bg-muted/50 rounded-lg p-3 space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Normal Price</span>
                                <span className="font-semibold">{formatPrice(tier.normalPrice)}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Launch Price</span>
                                <span className="font-semibold text-green-600">{formatPrice(tier.launchPrice)}</span>
                              </div>
                              <div className="flex items-center justify-between border-t pt-1.5">
                                <span className="text-sm font-medium">Effective Price</span>
                                <span className="font-bold text-brand-primary">{formatPrice(tier.effectivePrice)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Duration & Status */}
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                              <span>{tier.durationLabel}</span>
                            </div>
                            <Badge variant={tier.isActive ? "default" : "secondary"} className="text-xs">
                              {tier.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>

                          {/* Launch Pricing Status */}
                          <div className="flex items-center gap-2 text-sm">
                            <Zap className={`w-3.5 h-3.5 ${tier.hasActiveLaunchPricing ? "text-amber-500" : "text-muted-foreground"}`} />
                            <span className={tier.hasActiveLaunchPricing ? "text-amber-600 font-medium" : "text-muted-foreground"}>
                              {tier.hasActiveLaunchPricing ? "Launch pricing active" : "Launch pricing off"}
                            </span>
                            {tier.launchPricingExpiresAt && (
                              <span className="text-xs text-muted-foreground">
                                (expires {formatDate(tier.launchPricingExpiresAt)})
                              </span>
                            )}
                          </div>

                          {/* Features */}
                          {tier.features && tier.features.length > 0 && (
                            <div className="space-y-1.5">
                              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Features</span>
                              <ul className="space-y-1">
                                {tier.features.map((feature, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-sm">
                                    <CheckCircle className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <div className="text-xs text-muted-foreground pt-2 border-t">
                            Sort Order: {tier.sortOrder}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Detail Modal */}
      <Dialog
        open={selectedRequest !== null && actionType === null}
        onOpenChange={(open) => {
          if (!open) setSelectedRequest(null);
        }}
      >
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          {detailLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
            </div>
          ) : selectedRequest && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl">
                  <ImageIcon className="w-5 h-5" />
                  Ad Request Detail
                </DialogTitle>
                <DialogDescription>
                  {selectedRequest.jobId?.title} - {getSchoolName(selectedRequest)}
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
                {/* Banner Preview */}
                <div className="md:col-span-2 space-y-3">
                  <img
                    src={selectedRequest.bannerImageUrl}
                    alt="Ad banner"
                    className="w-full rounded-lg border"
                    style={{ aspectRatio: "3/1", objectFit: "cover" }}
                  />
                  {selectedRequest.headline && (
                    <p className="font-semibold text-lg">{selectedRequest.headline}</p>
                  )}
                  {selectedRequest.description && (
                    <p className="text-muted-foreground">{selectedRequest.description}</p>
                  )}
                </div>

                {/* Request Info */}
                <div className="space-y-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <Badge className={`${statusConfig[selectedRequest.status].bgColor} ${statusConfig[selectedRequest.status].color} border-0 flex items-center gap-1`}>
                        {statusConfig[selectedRequest.status].icon}
                        {statusConfig[selectedRequest.status].label}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Job</span>
                      <span className="font-medium text-right max-w-[60%] truncate">{selectedRequest.jobId?.title}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Organization</span>
                      <span className="text-right max-w-[60%] truncate">{selectedRequest.jobId?.organization}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">School</span>
                      <span className="text-right max-w-[60%] truncate">{getSchoolName(selectedRequest)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Tier</span>
                      <span className="font-medium">{selectedRequest.tierId?.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Duration</span>
                      <span>{selectedRequest.tierId?.durationLabel}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Submitted</span>
                      <span>{formatDate(selectedRequest.createdAt)}</span>
                    </div>
                  </div>

                  {selectedRequest.adminComment && (
                    <div className="rounded-lg bg-muted p-3">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Admin Comment</p>
                      <p className="text-sm">{selectedRequest.adminComment}</p>
                    </div>
                  )}
                </div>
              </div>

              {selectedRequest.status === "PENDING_REVIEW" && (
                <DialogFooter className="gap-2 sm:gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setActionType("changes")}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Request Changes
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => setActionType("reject")}
                  >
                    <ThumbsDown className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      setApproveConfirmRequest(selectedRequest);
                      setSelectedRequest(null);
                    }}
                  >
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                </DialogFooter>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Approve Confirmation Dialog */}
      <Dialog
        open={approveConfirmRequest !== null}
        onOpenChange={(open) => {
          if (!open) setApproveConfirmRequest(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <ThumbsUp className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold text-green-700">
                  Approve Ad Request
                </DialogTitle>
                <DialogDescription>
                  This will allow the school to proceed with payment.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {approveConfirmRequest && (
            <div className="space-y-4">
              <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <h4 className="font-medium text-foreground">
                    {approveConfirmRequest.jobId?.title || "Job Advertisement"}
                  </h4>
                  <Badge className={`${statusConfig[approveConfirmRequest.status].bgColor} ${statusConfig[approveConfirmRequest.status].color} border-0 text-xs`}>
                    {statusConfig[approveConfirmRequest.status].label}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Megaphone className="w-4 h-4" />
                    <span>School: {getSchoolName(approveConfirmRequest)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4" />
                    <span>Tier: {approveConfirmRequest.tierId?.name} — {approveConfirmRequest.tierId?.durationLabel}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Submitted: {formatDate(approveConfirmRequest.createdAt)}</span>
                  </div>
                </div>
                {approveConfirmRequest.bannerImageUrl && (
                  <div className="rounded overflow-hidden border">
                    <img
                      src={approveConfirmRequest.bannerImageUrl}
                      alt="Banner preview"
                      className="w-full h-auto object-cover"
                      style={{ aspectRatio: "3/1" }}
                    />
                  </div>
                )}
              </div>

              <div className="flex items-start space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-green-700">
                  <p className="font-medium">After approval:</p>
                  <ul className="mt-1 space-y-1 list-disc list-inside">
                    <li>Status will change to "Pending Payment"</li>
                    <li>School will be notified via email and in-app notification</li>
                    <li>School can proceed with payment to activate the ad</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setApproveConfirmRequest(null)}
              disabled={actionLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={() => approveConfirmRequest && handleApprove(approveConfirmRequest._id)}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Approving...
                </>
              ) : (
                <>
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  Approve Ad Request
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject / Request Changes Dialog */}
      <Dialog
        open={actionType !== null}
        onOpenChange={(open) => {
          if (!open) {
            setActionType(null);
            setActionComment("");
            setSelectedRequest(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  actionType === "reject" ? "bg-red-100" : "bg-amber-100"
                }`}>
                  {actionType === "reject" ? (
                    <ThumbsDown className="w-5 h-5 text-red-600" />
                  ) : (
                    <MessageSquare className="w-5 h-5 text-amber-600" />
                  )}
                </div>
              </div>
              <div>
                <DialogTitle className={`text-lg font-semibold ${
                  actionType === "reject" ? "text-red-600" : "text-amber-700"
                }`}>
                  {actionType === "reject" ? "Reject Ad Request" : "Request Changes"}
                </DialogTitle>
                <DialogDescription>
                  {actionType === "reject"
                    ? "Provide a reason for rejecting this ad request. The school will be notified."
                    : "Describe what changes are needed. The school will be notified with your feedback."}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {selectedRequest && (
            <div className="bg-muted/30 rounded-lg p-4 space-y-2">
              <div className="flex items-start justify-between">
                <h4 className="font-medium text-sm text-foreground">
                  {selectedRequest.jobId?.title || "Job Advertisement"}
                </h4>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>School: {getSchoolName(selectedRequest)}</p>
                <p>Tier: {selectedRequest.tierId?.name}</p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="comment" className="text-sm font-medium">
              {actionType === "reject" ? "Rejection Reason" : "Feedback"}{" "}
              <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="comment"
              placeholder={
                actionType === "reject"
                  ? "e.g., Banner image quality is too low..."
                  : "e.g., Please update the banner to include your school logo..."
              }
              value={actionComment}
              onChange={(e) => setActionComment(e.target.value)}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Minimum 10 characters required ({actionComment.length}/10+)
            </p>
          </div>

          {actionType === "reject" && (
            <div className="flex items-start space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-700">
                <p className="font-medium">Warning:</p>
                <ul className="mt-1 space-y-1 list-disc list-inside">
                  <li>The school will be notified of the rejection</li>
                  <li>They will need to create a new ad request</li>
                </ul>
              </div>
            </div>
          )}

          <DialogFooter className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setActionType(null);
                setActionComment("");
                setSelectedRequest(null);
              }}
              disabled={actionLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant={actionType === "reject" ? "destructive" : "default"}
              onClick={handleActionSubmit}
              disabled={actionComment.trim().length < 10 || actionLoading}
              className="flex-1"
            >
              {actionLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : actionType === "reject" ? (
                <ThumbsDown className="w-4 h-4 mr-2" />
              ) : (
                <MessageSquare className="w-4 h-4 mr-2" />
              )}
              {actionType === "reject" ? "Reject" : "Send Feedback"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Tier Dialog */}
      <Dialog open={tierModalOpen} onOpenChange={(open) => {
        if (!open) {
          setTierModalOpen(false);
          setEditingTier(null);
        }
      }}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTier ? "Edit Ad Tier" : "Create Ad Tier"}
            </DialogTitle>
            <DialogDescription>
              {editingTier
                ? "Update the pricing and settings for this ad tier."
                : "Configure a new ad pricing tier for schools to purchase."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-4">
            {/* Name & Slug */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tier-name">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="tier-name"
                  placeholder="e.g., Display Ad (Banner)"
                  value={tierForm.name}
                  onChange={(e) => {
                    handleTierFormChange("name", e.target.value);
                    if (!editingTier) {
                      handleTierFormChange("slug", generateSlug(e.target.value));
                    }
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tier-slug">
                  Slug <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="tier-slug"
                  placeholder="e.g., display-ad-banner"
                  value={tierForm.slug}
                  onChange={(e) => handleTierFormChange("slug", e.target.value)}
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="tier-desc">Description</Label>
              <Textarea
                id="tier-desc"
                placeholder="Describe what this tier includes..."
                value={tierForm.description || ""}
                onChange={(e) => handleTierFormChange("description", e.target.value)}
                rows={2}
              />
            </div>

            {/* Pricing */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <PoundSterling className="w-4 h-4" />
                Pricing (in pence)
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tier-normal-price">
                    Normal Price (pence) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="tier-normal-price"
                    type="number"
                    min="0"
                    placeholder="e.g., 20000 = \u00A3200"
                    value={tierForm.normalPrice}
                    onChange={(e) => handleTierFormChange("normalPrice", Number(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground">
                    = {formatPrice(tierForm.normalPrice)}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tier-launch-price">
                    Launch Price (pence) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="tier-launch-price"
                    type="number"
                    min="0"
                    placeholder="e.g., 8000 = \u00A380"
                    value={tierForm.launchPrice}
                    onChange={(e) => handleTierFormChange("launchPrice", Number(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground">
                    = {formatPrice(tierForm.launchPrice)}
                    {tierForm.normalPrice > 0 && (
                      <span className="text-green-600 ml-1">
                        ({Math.round((1 - tierForm.launchPrice / tierForm.normalPrice) * 100)}% off)
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Duration */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tier-duration-days">
                  Duration (days) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="tier-duration-days"
                  type="number"
                  min="0"
                  placeholder="e.g., 30"
                  value={tierForm.durationDays}
                  onChange={(e) => handleTierFormChange("durationDays", Number(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">
                  Use 0 for per-listing pricing
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tier-duration-label">
                  Duration Label <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="tier-duration-label"
                  placeholder="e.g., 30 days, Per listing"
                  value={tierForm.durationLabel}
                  onChange={(e) => handleTierFormChange("durationLabel", e.target.value)}
                />
              </div>
            </div>

            {/* Launch Pricing Toggle */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Launch Pricing
              </h4>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <Label htmlFor="tier-launch-toggle" className="font-medium">
                    Enable Launch Pricing
                  </Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Schools will be charged the launch price instead of the normal price.
                  </p>
                </div>
                <Switch
                  id="tier-launch-toggle"
                  checked={tierForm.isLaunchPricing || false}
                  onCheckedChange={(checked) => handleTierFormChange("isLaunchPricing", checked)}
                />
              </div>
              {tierForm.isLaunchPricing && (
                <div className="space-y-2">
                  <Label htmlFor="tier-launch-expires">Launch Pricing Expiry Date</Label>
                  <Input
                    id="tier-launch-expires"
                    type="date"
                    value={tierForm.launchPricingExpiresAt || ""}
                    onChange={(e) => handleTierFormChange("launchPricingExpiresAt", e.target.value || null)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave empty for indefinite launch pricing.
                  </p>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="space-y-2">
              <Label htmlFor="tier-features">Features (one per line)</Label>
              <Textarea
                id="tier-features"
                placeholder={"Priority placement in search results\nFeatured badge on listing\nHighlighted in job alerts"}
                value={featuresInput}
                onChange={(e) => setFeaturesInput(e.target.value)}
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                {featuresInput.split("\n").filter((f) => f.trim()).length} feature(s)
              </p>
            </div>

            {/* Other Settings */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tier-sort">Sort Order</Label>
                <Input
                  id="tier-sort"
                  type="number"
                  value={tierForm.sortOrder || 0}
                  onChange={(e) => handleTierFormChange("sortOrder", Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tier-highlight">Highlight Text</Label>
                <Input
                  id="tier-highlight"
                  placeholder="e.g., Most Popular"
                  value={tierForm.highlight || ""}
                  onChange={(e) => handleTierFormChange("highlight", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tier-currency">Currency</Label>
                <Input
                  id="tier-currency"
                  placeholder="GBP"
                  value={tierForm.currency || "GBP"}
                  onChange={(e) => handleTierFormChange("currency", e.target.value)}
                />
              </div>
            </div>

            {/* Active Toggle */}
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label htmlFor="tier-active-toggle" className="font-medium">
                  Tier Active
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Inactive tiers won't be visible to schools.
                </p>
              </div>
              <Switch
                id="tier-active-toggle"
                checked={tierForm.isActive !== false}
                onCheckedChange={(checked) => handleTierFormChange("isActive", checked)}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setTierModalOpen(false);
                setEditingTier(null);
              }}
              disabled={tierSaving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleTierSubmit}
              disabled={tierSaving}
              className="bg-brand-primary hover:bg-brand-primary/90"
            >
              {tierSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editingTier ? "Update Tier" : "Create Tier"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Tier Confirmation */}
      <Dialog open={deleteTier !== null} onOpenChange={(open) => {
        if (!open) setDeleteTier(null);
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Ad Tier</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deleteTier?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteTier(null)}
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteTier}
              disabled={deleteLoading}
            >
              {deleteLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdManagement;
