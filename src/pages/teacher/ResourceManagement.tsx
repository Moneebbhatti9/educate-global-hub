import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import DashboardLayout from "@/layout/DashboardLayout";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  BarChart3,
  Eye,
  SortAsc,
  SortDesc,
  Check,
  AlertTriangle,
  MapPin,
  Calendar,
  Users,
  Package,
  DollarSign,
  TrendingUp,
  Download,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import ResourceStatsModal from "@/components/Modals/resource-stats-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/StatsCard";
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
  TeacherResource,
  MyResourcesResponse,
  MyResourcesQueryParams,
} from "@/types/resource";

export default function ResourceManagement() {
  const navigate = useNavigate();
  const { handleError, showError, showSuccess } = useErrorHandler();

  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "draft" | "pending" | "approved" | "rejected"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Data state
  const [resources, setResources] = useState<TeacherResource[]>([]);
  const [totalResources, setTotalResources] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedResource, setSelectedResource] =
    useState<TeacherResource | null>(null);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);

  // Delete confirmation state
  const [resourceToDelete, setResourceToDelete] =
    useState<TeacherResource | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Submit confirmation state
  const [resourceToSubmit, setResourceToSubmit] =
    useState<TeacherResource | null>(null);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Stats state
  const [stats, setStats] = useState({
    totalResources: 0,
    totalSales: 0,
    currentBalance: 0,
  });

  // Load resources when component mounts or filters change
  useEffect(() => {
    loadResources();
  }, [searchTerm, statusFilter, currentPage, pageSize]);

  const loadResources = async () => {
    setIsLoading(true);
    try {
      // Safety checks for parameters
      const params: MyResourcesQueryParams = {
        search:
          searchTerm && searchTerm.trim().length > 0
            ? searchTerm.trim()
            : undefined,
        status: statusFilter === "all" ? undefined : statusFilter,
        page: currentPage && currentPage > 0 ? currentPage : 1,
        limit: pageSize && pageSize > 0 && pageSize <= 100 ? pageSize : 10,
      };

      const response = await resourcesAPI.getMyResources(params);

      // Safety checks for response
      if (!response) {
        showError(
          "Failed to load resources",
          "No response received from server"
        );
        return;
      }

      if (response.success && response.data) {
        // Safety checks for data structure
        if (!Array.isArray(response.data.resources)) {
          console.warn("Invalid data structure received:", response.data);
          setResources([]);
          setTotalResources(0);
          return;
        }

        // Safety checks for stats
        const statsData = response.data.stats;
        if (statsData && typeof statsData === "object") {
          setStats({
            totalResources: statsData.totalResources || 0,
            totalSales: statsData.totalSales || 0,
            currentBalance: statsData.currentBalance || 0,
          });
          setTotalResources(statsData.totalResources || 0);
        } else {
          console.warn("Invalid stats data:", statsData);
          setTotalResources(0);
        }

        setResources(response.data.resources);
      } else {
        const errorMessage = response?.message || "Unable to fetch resources";
        showError("Failed to load resources", errorMessage);
        setResources([]);
        setTotalResources(0);
      }
    } catch (error) {
      console.error("Error loading resources:", error);
      handleError(error, "Failed to load resources");
      setResources([]);
      setTotalResources(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteResource = (resource: TeacherResource) => {
    // Safety checks for resource
    if (!resource || typeof resource !== "object") {
      console.error("Invalid resource data:", resource);
      showError("Invalid resource", "Resource data is invalid");
      return;
    }

    if (
      !resource._id ||
      typeof resource._id !== "string" ||
      resource._id.trim().length === 0
    ) {
      console.error("Resource missing valid ID:", resource);
      showError("Invalid resource", "Resource ID is missing");
      return;
    }

    setResourceToDelete(resource);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteResource = async () => {
    if (!resourceToDelete) {
      console.error("No resource selected for deletion");
      showError("Delete error", "No resource selected");
      return;
    }

    if (
      !resourceToDelete._id ||
      typeof resourceToDelete._id !== "string" ||
      resourceToDelete._id.trim().length === 0
    ) {
      console.error("Resource missing valid ID:", resourceToDelete);
      showError("Delete error", "Resource ID is invalid");
      return;
    }

    setIsDeleting(true);
    try {
      const response = await resourcesAPI.deleteResource(
        resourceToDelete._id.trim()
      );

      if (response.success) {
        // Remove the resource from the local state
        setResources((prev) =>
          prev.filter((r) => r._id !== resourceToDelete._id)
        );
        setTotalResources((prev) => prev - 1);

        // Show success message
        showSuccess(
          "Resource deleted successfully",
          "The resource has been permanently removed."
        );
      } else {
        const errorMessage = response?.message || "Unable to delete resource";
        showError("Failed to delete resource", errorMessage);
      }
    } catch (error) {
      console.error("Error deleting resource:", error);
      handleError(error, "Failed to delete resource");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setResourceToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setResourceToDelete(null);
  };

  const handleSubmitResource = async (resourceId: string) => {
    try {
      setIsSubmitting(true);
      const response = await resourcesAPI.updateResourceStatus(resourceId, {
        status: "pending",
      });

      if (response.success) {
        showSuccess(
          "Resource submitted",
          "Your resource has been submitted for review."
        );
        loadResources(); // Reload to update the status
      } else {
        showError(
          "Failed to submit resource",
          response.message || "Unknown error"
        );
      }
    } catch (error) {
      handleError(error, "Failed to submit resource");
    } finally {
      setIsSubmitting(false);
      setIsSubmitDialogOpen(false);
      setResourceToSubmit(null);
    }
  };

  const confirmSubmitResource = (resource: TeacherResource) => {
    setResourceToSubmit(resource);
    setIsSubmitDialogOpen(true);
  };

  const cancelSubmit = () => {
    setIsSubmitDialogOpen(false);
    setResourceToSubmit(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
      case "published":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "flagged":
        return <Badge variant="destructive">Flagged</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Resources</h1>
            <p className="text-muted-foreground">
              Manage your uploaded teaching resources
            </p>
          </div>
          <Button
            onClick={() => navigate("/dashboard/teacher/upload-resource")}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create New Resource
          </Button>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10 border-blue-200/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Total Resources
              </CardTitle>
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                {stats.totalResources}
              </div>
              <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-1">
                Resources uploaded
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/10 border-green-200/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
                Total Sales
              </CardTitle>
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900 dark:text-green-100">
                {stats.totalSales}
              </div>
              <p className="text-xs text-green-600/70 dark:text-green-400/70 mt-1">
                Units sold
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/20 dark:to-amber-900/10 border-amber-200/50 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate("/dashboard/teacher/earnings")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-300 flex items-center gap-1">
                Current Balance
                <ExternalLink className="w-3 h-3" />
              </CardTitle>
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-900 dark:text-amber-100">
                £{stats.currentBalance.toFixed(2)}
              </div>
              <p className="text-xs text-amber-600/70 dark:text-amber-400/70 mt-1">
                Available to withdraw
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/10 border-purple-200/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
                Live on Platform
              </CardTitle>
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                {resources.filter((r) => r.status === "approved").length}
              </div>
              <p className="text-xs text-purple-600/70 dark:text-purple-400/70 mt-1">
                Approved resources
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Status Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <FileText className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <div className="text-lg font-semibold">
                  {resources.filter((r) => r.status === "draft").length}
                </div>
                <div className="text-xs text-muted-foreground">Drafts</div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <Clock className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <div className="text-lg font-semibold">
                  {resources.filter((r) => r.status === "pending").length}
                </div>
                <div className="text-xs text-muted-foreground">Pending Review</div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <div className="text-lg font-semibold">
                  {resources.filter((r) => r.status === "approved").length}
                </div>
                <div className="text-xs text-muted-foreground">Approved</div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                <XCircle className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <div className="text-lg font-semibold">
                  {resources.filter((r) => r.status === "rejected").length}
                </div>
                <div className="text-xs text-muted-foreground">Rejected</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Resource Library</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search resources..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(value) =>
                  setStatusFilter(
                    value as
                      | "all"
                      | "draft"
                      | "pending"
                      | "approved"
                      | "rejected"
                  )
                }
              >
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Resources Table */}
            <div className="border rounded-lg">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <span className="ml-2">Loading resources...</span>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Thumbnail</TableHead>
                      <TableHead>Resource Title</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Sales</TableHead>
                      <TableHead>Upload Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resources.map((resource) => {
                      // Safety checks for resource data
                      if (!resource || typeof resource !== "object") {
                        console.warn("Invalid resource data:", resource);
                        return null;
                      }

                      if (!resource._id || typeof resource._id !== "string") {
                        console.warn("Resource missing valid ID:", resource);
                        return null;
                      }

                      return (
                        <TableRow key={resource._id}>
                          <TableCell>
                            <img
                              src={
                                (typeof resource.coverPhoto === 'string'
                                  ? resource.coverPhoto
                                  : resource.coverPhoto?.url) 
                              }
                              alt={resource.title || "Resource"}
                              className="w-16 h-10 object-cover rounded border"
                              onError={(e) => {
                                // Fallback for broken images
                                const target = e.target as HTMLImageElement;
                                target.src = "";
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              {resource.title || "Untitled Resource"}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {resource.type} • {resource.subject}
                            </div>
                          </TableCell>
                          <TableCell>
                            {resource.isFree ? (
                              <Badge className="bg-green-100 text-green-800">
                                Free
                              </Badge>
                            ) : (
                              <span className="font-medium">
                                {resource.currency} {resource.price.toFixed(2)}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(resource.status || "unknown")}
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">
                              0 {/* Sales count not provided in API response */}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-muted-foreground">
                              {resource.createdAt
                                ? new Date(
                                    resource.createdAt
                                  ).toLocaleDateString()
                                : "Unknown Date"}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <svg
                                    className="h-4 w-4"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                  </svg>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => {
                                    if (resource && resource._id) {
                                      setSelectedResource(resource);
                                      setIsStatsModalOpen(true);
                                    } else {
                                      console.error(
                                        "Invalid resource for stats view:",
                                        resource
                                      );
                                      showError(
                                        "Invalid resource",
                                        "Cannot view stats for this resource"
                                      );
                                    }
                                  }}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Stats
                                </DropdownMenuItem>
                                {(resource.status === "draft" ||
                                  resource.status === "pending") && (
                                  <DropdownMenuItem
                                    onClick={() => {
                                      if (
                                        resource &&
                                        resource._id &&
                                        typeof resource._id === "string"
                                      ) {
                                        navigate(
                                          "/dashboard/teacher/upload-resource",
                                          {
                                            state: {
                                              editMode: true,
                                              resourceData: resource,
                                            },
                                          }
                                        );
                                      } else {
                                        console.error(
                                          "Invalid resource for editing:",
                                          resource
                                        );
                                        showError(
                                          "Invalid resource",
                                          "Cannot edit this resource"
                                        );
                                      }
                                    }}
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Resource
                                  </DropdownMenuItem>
                                )}
                                {resource.status === "draft" && (
                                  <DropdownMenuItem
                                    className="text-green-600"
                                    onClick={() =>
                                      confirmSubmitResource(resource)
                                    }
                                  >
                                    <Check className="mr-2 h-4 w-4" />
                                    Submit for Review
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => handleDeleteResource(resource)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </div>

            {!isLoading && resources.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No resources found matching your criteria.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resource Stats Modal */}
        <ResourceStatsModal
          isOpen={isStatsModalOpen}
          onClose={() => {
            setIsStatsModalOpen(false);
            setSelectedResource(null);
          }}
          resource={
            selectedResource
              ? {
                  id: selectedResource._id,
                  title: selectedResource.title || "Untitled Resource",
                  thumbnail:
                    (typeof selectedResource.coverPhoto === 'string'
                      ? selectedResource.coverPhoto
                      : selectedResource.coverPhoto?.url) ||
                    "/api/placeholder/100/60",
                  price: selectedResource.price || 0,
                  status: selectedResource.status || "unknown",
                  salesCount: 0, // Sales count not provided in API response
                  uploadDate:
                    selectedResource.createdAt || new Date().toISOString(),
                }
              : null
          }
        />

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
                      {resourceToDelete.status === "approved"
                        ? "Active"
                        : resourceToDelete.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {resourceToDelete.subject} • {resourceToDelete.type}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Created:{" "}
                        {resourceToDelete.createdAt
                          ? new Date(
                              resourceToDelete.createdAt
                            ).toLocaleDateString()
                          : "Unknown Date"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>
                        Price:{" "}
                        {resourceToDelete.isFree
                          ? "Free"
                          : `${
                              resourceToDelete.currency
                            } ${resourceToDelete.price.toFixed(2)}`}
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
                    <li>
                      Resource will be removed from your library immediately
                    </li>
                    <li>All sales data and earnings will be lost</li>
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
                onClick={confirmDeleteResource}
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

        {/* Submit Confirmation Dialog */}
        <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
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
                    Submit Resource for Review
                  </DialogTitle>
                  <DialogDescription>
                    Submit your resource for review by our team. Once submitted,
                    you won't be able to edit it until it's approved or
                    rejected.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4">
              {/* Resource Details */}
              {resourceToSubmit && (
                <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-foreground">
                      {resourceToSubmit.title}
                    </h4>
                    <Badge variant="outline" className="text-xs">
                      {resourceToSubmit.status === "draft"
                        ? "Draft"
                        : resourceToSubmit.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {resourceToSubmit.subject} • {resourceToSubmit.type}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Created:{" "}
                        {resourceToSubmit.createdAt
                          ? new Date(
                              resourceToSubmit.createdAt
                            ).toLocaleDateString()
                          : "Unknown Date"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>
                        Price:{" "}
                        {resourceToSubmit.isFree
                          ? "Free"
                          : `${
                              resourceToSubmit.currency
                            } ${resourceToSubmit.price.toFixed(2)}`}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Information Message */}
              <div className="flex items-start space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-green-700">
                  <p className="font-medium">What happens next:</p>
                  <ul className="mt-1 space-y-1 list-disc list-inside">
                    <li>Your resource will be reviewed by our team</li>
                    <li>
                      You'll receive an email notification with the result
                    </li>
                    <li>You can track the status in your resource library</li>
                  </ul>
                </div>
              </div>
            </div>

            <DialogFooter className="flex space-x-2">
              <Button
                variant="outline"
                onClick={cancelSubmit}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() =>
                  resourceToSubmit && handleSubmitResource(resourceToSubmit._id)
                }
                disabled={isSubmitting}
                className="flex-1 bg-green-600 text-white hover:bg-green-700"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Submit for Review
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
