import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Calendar,
  Clock,
  XCircle,
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
  ArrowRight,
  Briefcase,
  CreditCard,
  MoreHorizontal,
  Pencil,
  ImageIcon,
  Upload,
} from "lucide-react";
import { adApi } from "@/apis/ads";
import type { AdRequest, AdRequestStatus } from "@/apis/ads";
import { customToast } from "@/components/ui/sonner";

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
    icon: <AlertCircle className="w-3 h-3" />,
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
    icon: <Calendar className="w-3 h-3" />,
  },
  CANCELLED: {
    label: "Cancelled",
    color: "text-gray-500",
    bgColor: "bg-gray-50",
    icon: <XCircle className="w-3 h-3" />,
  },
};

const MyAdvertisements = () => {
  const navigate = useNavigate();
  const [adRequests, setAdRequests] = useState<AdRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Cancel dialog
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  // Detail modal
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<AdRequest | null>(null);

  // Resubmit modal
  const [resubmitModalOpen, setResubmitModalOpen] = useState(false);
  const [resubmitRequest, setResubmitRequest] = useState<AdRequest | null>(null);
  const [resubmitHeadline, setResubmitHeadline] = useState("");
  const [resubmitDescription, setResubmitDescription] = useState("");
  const [resubmitBanner, setResubmitBanner] = useState<File | null>(null);
  const [resubmitBannerPreview, setResubmitBannerPreview] = useState<string | null>(null);
  const [resubmitting, setResubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchAdRequests();
  }, []);

  const fetchAdRequests = async () => {
    try {
      const requests = await adApi.getMyAdRequests();
      setAdRequests(requests);
    } catch (error) {
      console.error("Failed to fetch ad requests:", error);
      customToast.error("Failed to load advertisements");
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = async (requestId: string) => {
    try {
      const { checkoutUrl } = await adApi.createAdCheckout(requestId);
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      console.error("Failed to create checkout:", error);
      customToast.error("Failed to start payment", "Please try again.");
    }
  };

  const handleCancelClick = (requestId: string) => {
    setCancellingId(requestId);
    setCancelDialogOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!cancellingId) return;

    setCancelling(true);
    try {
      await adApi.cancelAdRequest(cancellingId);
      customToast.success("Ad request cancelled successfully");
      fetchAdRequests();
    } catch (error) {
      console.error("Failed to cancel ad request:", error);
      customToast.error("Failed to cancel ad request");
    } finally {
      setCancelling(false);
      setCancelDialogOpen(false);
      setCancellingId(null);
    }
  };

  const handleViewDetail = (request: AdRequest) => {
    setSelectedRequest(request);
    setDetailModalOpen(true);
  };

  const handleResubmitClick = (request: AdRequest) => {
    setResubmitRequest(request);
    setResubmitHeadline(request.headline || "");
    setResubmitDescription(request.description || "");
    setResubmitBanner(null);
    setResubmitBannerPreview(null);
    setResubmitModalOpen(true);
  };

  const handleBannerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResubmitBanner(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setResubmitBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResubmit = async () => {
    if (!resubmitRequest) return;

    setResubmitting(true);
    try {
      await adApi.resubmitAdRequest(resubmitRequest._id, {
        banner: resubmitBanner || undefined,
        headline: resubmitHeadline,
        description: resubmitDescription,
      });
      customToast.success("Ad request resubmitted successfully");
      setResubmitModalOpen(false);
      setResubmitRequest(null);
      fetchAdRequests();
    } catch (error) {
      console.error("Failed to resubmit ad request:", error);
      customToast.error("Failed to resubmit ad request");
    } finally {
      setResubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <DashboardLayout role="school">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="school">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading font-bold text-2xl text-foreground flex items-center space-x-2">
              <Megaphone className="w-6 h-6 text-brand-primary" />
              <span>My Advertisements</span>
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your job advertisement requests and track their status.
            </p>
          </div>
          <Button
            variant="hero"
            onClick={() => navigate("/dashboard/school/post-job")}
          >
            <Briefcase className="w-4 h-4 mr-2" />
            Post a Job
          </Button>
        </div>

        {/* Ad Requests Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                Ad Requests ({adRequests.length})
              </CardTitle>
            </div>
            <CardDescription>
              Track and manage all your advertisement requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            {adRequests.length === 0 ? (
              <div className="text-center py-16">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center">
                    <Megaphone className="w-8 h-8 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">
                  No Advertisements Yet
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  After posting a job, you can promote it with a banner
                  advertisement to reach more qualified candidates.
                </p>
                <Button
                  variant="outline"
                  onClick={() => navigate("/dashboard/school/post-job")}
                >
                  Post a Job to Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Banner</TableHead>
                    <TableHead>Job</TableHead>
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
                        className="group hover:bg-muted/50 transition-all duration-300"
                      >
                        {/* Banner thumbnail */}
                        <TableCell>
                          <div className="w-24 h-8 rounded overflow-hidden border bg-muted">
                            {request.bannerImageUrl ? (
                              <img
                                src={request.bannerImageUrl}
                                alt="Banner"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon className="w-4 h-4 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                        </TableCell>

                        {/* Job title */}
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm truncate max-w-[200px]">
                              {request.jobId?.title || "Job Advertisement"}
                            </p>
                            {request.headline && (
                              <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                {request.headline}
                              </p>
                            )}
                          </div>
                        </TableCell>

                        {/* Tier */}
                        <TableCell>
                          <span className="text-sm">
                            {request.tierId?.name || "—"}
                          </span>
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                          <Badge
                            className={`${status.bgColor} ${status.color} border-0 flex items-center gap-1 w-fit`}
                          >
                            {status.icon}
                            <span>{status.label}</span>
                          </Badge>
                        </TableCell>

                        {/* Submitted date */}
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(request.createdAt)}
                          </span>
                        </TableCell>

                        {/* Actions dropdown */}
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="group-hover:bg-brand-primary/10 transition-all duration-300"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleViewDetail(request)}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>

                              {request.status === "PENDING_PAYMENT" && (
                                <DropdownMenuItem
                                  onClick={() => handlePayNow(request._id)}
                                >
                                  <CreditCard className="w-4 h-4 mr-2" />
                                  Pay Now
                                </DropdownMenuItem>
                              )}

                              {request.status === "PENDING_REVIEW" && (
                                <DropdownMenuItem
                                  onClick={() => handleCancelClick(request._id)}
                                  className="text-red-600"
                                >
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Cancel
                                </DropdownMenuItem>
                              )}

                              {request.status === "CHANGES_REQUESTED" && (
                                <DropdownMenuItem
                                  onClick={() => handleResubmitClick(request)}
                                >
                                  <Pencil className="w-4 h-4 mr-2" />
                                  Edit & Resubmit
                                </DropdownMenuItem>
                              )}

                              {request.status === "ACTIVE" && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    navigate(`/jobs/${request.jobId?._id}`)
                                  }
                                >
                                  <Briefcase className="w-4 h-4 mr-2" />
                                  View Job
                                </DropdownMenuItem>
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
      </div>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cancel Ad Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this ad request? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
              disabled={cancelling}
            >
              Keep Request
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmCancel}
              disabled={cancelling}
            >
              {cancelling ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Yes, Cancel"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Modal */}
      <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Advertisement Details</DialogTitle>
            <DialogDescription>
              {selectedRequest?.jobId?.title || "Job Advertisement"}
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              {/* Banner preview */}
              {selectedRequest.bannerImageUrl && (
                <div className="rounded-lg overflow-hidden border">
                  <img
                    src={selectedRequest.bannerImageUrl}
                    alt="Ad Banner"
                    className="w-full h-auto object-cover"
                    style={{ aspectRatio: "3/1" }}
                  />
                </div>
              )}

              {/* Status */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">Status:</span>
                <Badge
                  className={`${statusConfig[selectedRequest.status].bgColor} ${statusConfig[selectedRequest.status].color} border-0 flex items-center gap-1 w-fit`}
                >
                  {statusConfig[selectedRequest.status].icon}
                  <span>{statusConfig[selectedRequest.status].label}</span>
                </Badge>
              </div>

              {/* Headline & description */}
              {selectedRequest.headline && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Headline</p>
                  <p className="text-sm">{selectedRequest.headline}</p>
                </div>
              )}
              {selectedRequest.description && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Description</p>
                  <p className="text-sm">{selectedRequest.description}</p>
                </div>
              )}

              {/* Tier info */}
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tier</p>
                <p className="text-sm">
                  {selectedRequest.tierId?.name} — {selectedRequest.tierId?.durationLabel}
                </p>
              </div>

              {/* Admin feedback */}
              {selectedRequest.adminComment &&
                (selectedRequest.status === "REJECTED" ||
                  selectedRequest.status === "CHANGES_REQUESTED") && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-xs font-semibold text-amber-800 mb-1">
                      Admin Feedback
                    </p>
                    <p className="text-sm text-amber-900">
                      {selectedRequest.adminComment}
                    </p>
                  </div>
                )}

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="font-medium text-muted-foreground">Submitted</p>
                  <p>{formatDate(selectedRequest.createdAt)}</p>
                </div>
                {selectedRequest.activatedAt && (
                  <div>
                    <p className="font-medium text-muted-foreground">Activated</p>
                    <p>{formatDate(selectedRequest.activatedAt)}</p>
                  </div>
                )}
                {selectedRequest.expiresAt && (
                  <div>
                    <p className="font-medium text-muted-foreground">Expires</p>
                    <p>{formatDate(selectedRequest.expiresAt)}</p>
                  </div>
                )}
                {selectedRequest.status === "ACTIVE" &&
                  selectedRequest.daysRemaining !== null && (
                    <div>
                      <p className="font-medium text-muted-foreground">Days Remaining</p>
                      <p>
                        {selectedRequest.daysRemaining > 0
                          ? `${selectedRequest.daysRemaining} days`
                          : "Expiring soon"}
                      </p>
                    </div>
                  )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Resubmit Modal */}
      <Dialog open={resubmitModalOpen} onOpenChange={setResubmitModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit & Resubmit Advertisement</DialogTitle>
            <DialogDescription>
              Update your ad and resubmit for review.
            </DialogDescription>
          </DialogHeader>
          {resubmitRequest && (
            <div className="space-y-4">
              {/* Admin feedback prominently at top */}
              {resubmitRequest.adminComment && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-xs font-semibold text-amber-800 mb-1">
                    Admin Feedback — Please address this before resubmitting
                  </p>
                  <p className="text-sm text-amber-900">
                    {resubmitRequest.adminComment}
                  </p>
                </div>
              )}

              {/* Banner upload */}
              <div className="space-y-2">
                <Label>Banner Image</Label>
                <div className="rounded-lg overflow-hidden border mb-2">
                  <img
                    src={resubmitBannerPreview || resubmitRequest.bannerImageUrl}
                    alt="Current banner"
                    className="w-full h-auto object-cover"
                    style={{ aspectRatio: "3/1" }}
                  />
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleBannerFileChange}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {resubmitBanner ? "Change Image" : "Upload New Banner"}
                </Button>
                {resubmitBanner && (
                  <p className="text-xs text-muted-foreground">
                    New file: {resubmitBanner.name}
                  </p>
                )}
              </div>

              {/* Headline */}
              <div className="space-y-2">
                <Label htmlFor="resubmit-headline">Headline</Label>
                <Input
                  id="resubmit-headline"
                  value={resubmitHeadline}
                  onChange={(e) => setResubmitHeadline(e.target.value)}
                  placeholder="Ad headline (optional)"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="resubmit-description">Description</Label>
                <Textarea
                  id="resubmit-description"
                  value={resubmitDescription}
                  onChange={(e) => setResubmitDescription(e.target.value)}
                  placeholder="Ad description (optional)"
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setResubmitModalOpen(false)}
              disabled={resubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="hero"
              onClick={handleResubmit}
              disabled={resubmitting}
            >
              {resubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Resubmitting...
                </>
              ) : (
                "Resubmit for Review"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default MyAdvertisements;
