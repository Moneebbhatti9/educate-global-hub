import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layout/DashboardLayout";
import {
  Search,
  Check,
  X,
  Trash2,
  Eye,
  MoreHorizontal,
  AlertTriangle,
  CheckSquare,
  RefreshCw,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/StatsCard";
import { Checkbox } from "@/components/ui/checkbox";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { resourcesAPI } from "@/apis/resources";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import type {
  AdminResource,
  AdminResourcesResponse,
  AdminResourcesQueryParams,
} from "@/types/resource";

export default function AdminResourceManagement() {
  const navigate = useNavigate();
  const { handleError, showSuccess, showError } = useErrorHandler();

  // State management
  const [resources, setResources] = useState<AdminResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [selectedResources, setSelectedResources] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pages: 0,
  });

  // Stats state
  const [stats, setStats] = useState({
    totalResources: 0,
    pendingApprovals: 0,
    publishedResources: 0,
    totalSales: 0,
  });

  // Confirmation modals state
  const [resourceToApprove, setResourceToApprove] =
    useState<AdminResource | null>(null);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  const [resourceToReject, setResourceToReject] =
    useState<AdminResource | null>(null);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const [resourceToDelete, setResourceToDelete] =
    useState<AdminResource | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load resources from API
  const loadResources = async () => {
    setLoading(true);
    try {
      // Map status filter to API expected values
      const getApiStatus = (status: string) => {
        switch (status) {
          case "published":
            return "approved";
          case "flagged":
            return "rejected";
          case "archived":
            return "rejected";
          default:
            return status as "draft" | "pending" | "approved" | "rejected";
        }
      };

      const params = {
        search: searchTerm || undefined,
        status: statusFilter !== "all" ? getApiStatus(statusFilter) : undefined,
        page: pagination.page,
      };

      const response = await resourcesAPI.getAdminResources(params);

      if (response.success && response.data) {
        setResources(response.data.resources);
        setPagination(response.data.pagination);

        // Calculate stats for admin resources
        const totalResources = response.data.pagination.total;
        const pendingApprovals = response.data.resources.filter(
          (r) => r.status === "pending"
        ).length;
        const publishedResources = response.data.resources.filter(
          (r) => r.status === "approved"
        ).length;
        const totalDownloads = response.data.resources.reduce(
          (sum, r) => sum + r.flags,
          0
        );

        setStats({
          totalResources,
          pendingApprovals,
          publishedResources,
          totalSales: totalDownloads,
        });
      } else {
        showError(
          "Failed to load resources",
          response.message || "Unknown error"
        );
      }
    } catch (error) {
      handleError(error, "Failed to load resources");
    } finally {
      setLoading(false);
    }
  };

  // Load resources on component mount and when filters change
  useEffect(() => {
    loadResources();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, statusFilter, pagination.page]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>;
      case "pending":
        return <Badge className="bg-orange-100 text-orange-800">Pending</Badge>;
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedResources(filteredResources.map((r) => r.id));
    } else {
      setSelectedResources([]);
    }
  };

  const handleSelectResource = (resourceId: string, checked: boolean) => {
    if (checked) {
      setSelectedResources((prev) => [...prev, resourceId]);
    } else {
      setSelectedResources((prev) => prev.filter((id) => id !== resourceId));
    }
  };

  // Filter resources based on current filters
  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || resource.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Admin actions
  const handleApproveResource = async (resourceId: string) => {
    try {
      setIsApproving(true);
      const response = await resourcesAPI.updateResourceStatus(resourceId, {
        status: "approved",
      });

      if (response.success) {
        showSuccess(
          "Resource approved",
          "The resource has been approved successfully."
        );
        loadResources();
      } else {
        showError(
          "Failed to approve resource",
          response.message || "Unknown error"
        );
      }
    } catch (error) {
      handleError(error, "Failed to approve resource");
    } finally {
      setIsApproving(false);
      setIsApproveDialogOpen(false);
      setResourceToApprove(null);
    }
  };

  const confirmApproveResource = (resource: AdminResource) => {
    setResourceToApprove(resource);
    setIsApproveDialogOpen(true);
  };

  const cancelApprove = () => {
    setIsApproveDialogOpen(false);
    setResourceToApprove(null);
  };

  const handleRejectResource = async (resourceId: string) => {
    try {
      setIsRejecting(true);
      const response = await resourcesAPI.updateResourceStatus(resourceId, {
        status: "rejected",
      });

      if (response.success) {
        showSuccess(
          "Resource rejected",
          "The resource has been rejected successfully."
        );
        loadResources();
      } else {
        showError(
          "Failed to reject resource",
          response.message || "Unknown error"
        );
      }
    } catch (error) {
      handleError(error, "Failed to reject resource");
    } finally {
      setIsRejecting(false);
      setIsRejectDialogOpen(false);
      setResourceToReject(null);
    }
  };

  const confirmRejectResource = (resource: AdminResource) => {
    setResourceToReject(resource);
    setIsRejectDialogOpen(true);
  };

  const cancelReject = () => {
    setIsRejectDialogOpen(false);
    setResourceToReject(null);
  };

  const handleDeleteResource = async (resourceId: string) => {
    try {
      setIsDeleting(true);
      const response = await resourcesAPI.deleteResource(resourceId);

      if (response.success) {
        showSuccess(
          "Resource deleted",
          "The resource has been deleted successfully."
        );
        loadResources();
      } else {
        showError(
          "Failed to delete resource",
          response.message || "Unknown error"
        );
      }
    } catch (error) {
      handleError(error, "Failed to delete resource");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setResourceToDelete(null);
    }
  };

  const confirmDeleteResource = (resource: AdminResource) => {
    setResourceToDelete(resource);
    setIsDeleteDialogOpen(true);
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setResourceToDelete(null);
  };

  const handleBulkDelete = async () => {
    try {
      // This would be a bulk API call
      for (const resourceId of selectedResources) {
        await handleDeleteResource(resourceId);
      }
      setSelectedResources([]);
    } catch (error) {
      handleError(error, "Failed to delete resources");
    }
  };

  const handleViewResource = (resourceId: string) => {
    navigate(`/resources/${resourceId}`);
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Admin Resource Management
            </h1>
            <p className="text-muted-foreground">
              Manage and moderate all resources on the platform
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadResources}
              disabled={loading}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Resources"
            value={stats.totalResources}
            icon={Eye}
            description="All resources on platform"
          />
          <StatsCard
            title="Pending Approval"
            value={stats.pendingApprovals}
            icon={AlertTriangle}
            description="Resources awaiting review"
            badge={
              stats.pendingApprovals > 0
                ? { text: "Action Required", variant: "destructive" }
                : undefined
            }
          />
          <StatsCard
            title="Published Resources"
            value={stats.publishedResources || 0}
            icon={CheckSquare}
            description="Live on platform"
          />
          <StatsCard
            title="Total Downloads"
            value={stats.totalSales}
            icon={Download}
            description="Platform-wide downloads"
          />
        </div>

        {/* Resource Management */}
        <Card>
          <CardHeader>
            <CardTitle>All Resources</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Filters and Search */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by title, author, or content..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                    <SelectItem value="science">Science</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="history">History</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedResources.length > 0 && (
              <div className="flex items-center gap-4 p-4 bg-muted rounded-lg mb-4">
                <span className="text-sm font-medium">
                  {selectedResources.length} resource(s) selected
                </span>
                <div className="flex gap-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Selected
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete{" "}
                          {selectedResources.length} selected resource(s). This
                          action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleBulkDelete}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            )}

            {/* Resources Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={
                          selectedResources.length ===
                            filteredResources.length &&
                          filteredResources.length > 0
                        }
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="w-[80px]">Thumbnail</TableHead>
                    <TableHead>Resource Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="flex items-center justify-center space-x-2">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Loading resources...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredResources.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <p className="text-muted-foreground">
                          No resources found matching your criteria.
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredResources.map((resource) => (
                      <TableRow key={resource.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedResources.includes(resource.id)}
                            onCheckedChange={(checked) =>
                              handleSelectResource(resource.id, !!checked)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <img
                            src={
                              resource.thumbnail || "/api/placeholder/100/60"
                            }
                            alt={resource.title}
                            className="w-12 h-8 object-cover rounded border"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{resource.title}</div>
                          <div className="text-sm text-muted-foreground">
                            ID: {resource.id}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{resource.author}</div>
                        </TableCell>
                        <TableCell>
                          {resource.price === "Free" ? (
                            <Badge className="bg-green-100 text-green-800">
                              Free
                            </Badge>
                          ) : (
                            <span className="font-medium">
                              {resource.price}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(resource.status)}</TableCell>
                        <TableCell>
                          <span className="text-muted-foreground">
                            {new Date(resource.uploadDate).toLocaleDateString()}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleViewResource(resource.id)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Resource
                              </DropdownMenuItem>
                              {resource.status === "pending" && (
                                <DropdownMenuItem
                                  className="text-green-600"
                                  onClick={() =>
                                    confirmApproveResource(resource)
                                  }
                                >
                                  <Check className="mr-2 h-4 w-4" />
                                  Approve
                                </DropdownMenuItem>
                              )}
                              {resource.status === "pending" && (
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() =>
                                    confirmRejectResource(resource)
                                  }
                                >
                                  <X className="mr-2 h-4 w-4" />
                                  Reject
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => confirmDeleteResource(resource)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {resources.length} of {pagination.total} resources
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: prev.page - 1,
                      }))
                    }
                    disabled={pagination.page === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: prev.page + 1,
                      }))
                    }
                    disabled={pagination.page === pagination.pages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Approve Confirmation Dialog */}
        <Dialog
          open={isApproveDialogOpen}
          onOpenChange={setIsApproveDialogOpen}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <div>
                  <DialogTitle className="text-lg font-semibold text-green-600">
                    Approve Resource
                  </DialogTitle>
                  <DialogDescription>
                    This will publish the resource and make it available for
                    purchase by users.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4">
              {/* Resource Details */}
              {resourceToApprove && (
                <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-foreground">
                      {resourceToApprove.title}
                    </h4>
                    <Badge variant="outline" className="text-xs">
                      {resourceToApprove.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Author:</span>
                      <span>{resourceToApprove.author}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Price:</span>
                      <span>{resourceToApprove.price}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Upload Date:</span>
                      <span>
                        {new Date(
                          resourceToApprove.uploadDate
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Success Message */}
              <div className="flex items-start space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-green-700">
                  <p className="font-medium">What happens next:</p>
                  <ul className="mt-1 space-y-1 list-disc list-inside">
                    <li>Resource will be published and visible to all users</li>
                    <li>Author will be notified of the approval</li>
                    <li>Resource will be available for purchase</li>
                  </ul>
                </div>
              </div>
            </div>

            <DialogFooter className="flex space-x-2">
              <Button
                variant="outline"
                onClick={cancelApprove}
                disabled={isApproving}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() =>
                  resourceToApprove &&
                  handleApproveResource(resourceToApprove.id)
                }
                disabled={isApproving}
                className="flex-1 bg-green-600 text-white hover:bg-green-700"
              >
                {isApproving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Approving...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Approve Resource
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reject Confirmation Dialog */}
        <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <X className="w-5 h-5 text-red-600" />
                  </div>
                </div>
                <div>
                  <DialogTitle className="text-lg font-semibold text-red-600">
                    Reject Resource
                  </DialogTitle>
                  <DialogDescription>
                    This will reject the resource and notify the author of the
                    rejection.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4">
              {/* Resource Details */}
              {resourceToReject && (
                <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-foreground">
                      {resourceToReject.title}
                    </h4>
                    <Badge variant="outline" className="text-xs">
                      {resourceToReject.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Author:</span>
                      <span>{resourceToReject.author}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Price:</span>
                      <span>{resourceToReject.price}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Upload Date:</span>
                      <span>
                        {new Date(
                          resourceToReject.uploadDate
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Warning Message */}
              <div className="flex items-start space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-700">
                  <p className="font-medium">What happens next:</p>
                  <ul className="mt-1 space-y-1 list-disc list-inside">
                    <li>Resource will be marked as rejected</li>
                    <li>Author will be notified of the rejection</li>
                    <li>
                      Resource will not be published or available for purchase
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <DialogFooter className="flex space-x-2">
              <Button
                variant="outline"
                onClick={cancelReject}
                disabled={isRejecting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() =>
                  resourceToReject && handleRejectResource(resourceToReject.id)
                }
                disabled={isRejecting}
                className="flex-1 bg-red-600 text-white hover:bg-red-700"
              >
                {isRejecting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Rejecting...
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    Reject Resource
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </div>
                </div>
                <div>
                  <DialogTitle className="text-lg font-semibold text-red-600">
                    Delete Resource
                  </DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    the resource and all associated data.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4">
              {/* Resource Details */}
              {resourceToDelete && (
                <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-foreground">
                      {resourceToDelete.title}
                    </h4>
                    <Badge variant="outline" className="text-xs">
                      {resourceToDelete.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Author:</span>
                      <span>{resourceToDelete.author}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Price:</span>
                      <span>{resourceToDelete.price}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Upload Date:</span>
                      <span>
                        {new Date(
                          resourceToDelete.uploadDate
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Warning Message */}
              <div className="flex items-start space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-700">
                  <p className="font-medium">Warning:</p>
                  <ul className="mt-1 space-y-1 list-disc list-inside">
                    <li>All downloads and sales data will be lost</li>
                    <li>Resource will be removed from platform immediately</li>
                    <li>This action cannot be undone</li>
                  </ul>
                </div>
              </div>
            </div>

            <DialogFooter className="flex space-x-2">
              <Button
                variant="outline"
                onClick={cancelDelete}
                disabled={isDeleting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() =>
                  resourceToDelete && handleDeleteResource(resourceToDelete.id)
                }
                disabled={isDeleting}
                className="flex-1"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Resource
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
