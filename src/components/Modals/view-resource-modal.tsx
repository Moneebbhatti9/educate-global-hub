import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  FileText,
  User,
  Calendar,
  DollarSign,
  Eye,
  Star,
  Tag,
  BookOpen,
  Clock,
  Globe,
  CheckCircle,
  AlertTriangle,
  Archive,
  Clock as ClockIcon,
  GraduationCap,
  MapPin,
  Users,
  Trash2,
  X,
  RefreshCw,
} from "lucide-react";
import { resourcesAPI } from "@/apis/resources";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import type { AdminResource } from "@/types/resource";

// Admin Resource Detail Type based on API response
interface AdminResourceDetail {
  id: string;
  title: string;
  description: string;
  subject: string;
  ageRange: string;
  curriculum: string;
  curriculumType: string;
  price: string;
  status: string;
  thumbnail: string;
  previews: string[];
  file: string;
  author: string;
  createdAt: string;
}

interface ViewResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: AdminResource | null;
  onResourceUpdated?: () => void; // Callback to refresh parent component
}

const ViewResourceModal = ({ isOpen, onClose, resource, onResourceUpdated }: ViewResourceModalProps) => {
  const { handleError, showSuccess, showError } = useErrorHandler();
  
  // State for API operations
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // State for detailed resource data
  const [detailedResource, setDetailedResource] = useState<AdminResourceDetail | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  
  // Confirmation dialog states
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Fetch detailed resource data when modal opens
  useEffect(() => {
    if (isOpen && resource?.id) {
      fetchDetailedResource();
    }
  }, [isOpen, resource?.id]);

  const fetchDetailedResource = async () => {
    if (!resource?.id) return;
    
    setIsLoadingDetails(true);
    try {
      const response = await resourcesAPI.getResourceByIdAdmin(resource.id);
      
      if (response.success && response.data) {
        setDetailedResource(response.data as unknown as AdminResourceDetail);
      } else {
        showError("Failed to load resource details", response.message || "Unknown error");
      }
    } catch (error) {
      handleError(error, "Failed to load resource details");
    } finally {
      setIsLoadingDetails(false);
    }
  };

  if (!resource) return null;

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "approved":
        return {
          color: "bg-green-100 text-green-800",
          icon: <CheckCircle className="w-4 h-4" />,
          label: "Approved",
        };
      case "pending":
        return {
          color: "bg-orange-100 text-orange-800",
          icon: <ClockIcon className="w-4 h-4" />,
          label: "Pending Review",
        };
      case "rejected":
        return {
          color: "bg-red-100 text-red-800",
          icon: <AlertTriangle className="w-4 h-4" />,
          label: "Rejected",
        };
      case "draft":
        return {
          color: "bg-yellow-100 text-yellow-800",
          icon: <Archive className="w-4 h-4" />,
          label: "Draft",
        };
      default:
        return {
          color: "bg-muted text-muted-foreground",
          icon: <ClockIcon className="w-4 h-4" />,
          label: status,
        };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // API Handler Functions
  const handleApproveResource = async () => {
    if (!resource) return;
    
    try {
      setIsApproving(true);
      const response = await resourcesAPI.updateResourceStatus(resource.id, {
        status: "approved"
      });
      
      if (response.success) {
        showSuccess("Resource approved", "The resource has been approved successfully.");
        onResourceUpdated?.(); // Refresh parent component
        onClose(); // Close modal
      } else {
        showError("Failed to approve resource", response.message || "Unknown error");
      }
    } catch (error) {
      handleError(error, "Failed to approve resource");
    } finally {
      setIsApproving(false);
      setIsApproveDialogOpen(false);
    }
  };

  const handleRejectResource = async () => {
    if (!resource) return;
    
    try {
      setIsRejecting(true);
      const response = await resourcesAPI.updateResourceStatus(resource.id, {
        status: "rejected"
      });
      
      if (response.success) {
        showSuccess("Resource rejected", "The resource has been rejected successfully.");
        onResourceUpdated?.(); // Refresh parent component
        onClose(); // Close modal
      } else {
        showError("Failed to reject resource", response.message || "Unknown error");
      }
    } catch (error) {
      handleError(error, "Failed to reject resource");
    } finally {
      setIsRejecting(false);
      setIsRejectDialogOpen(false);
    }
  };

  const handleDeleteResource = async () => {
    if (!resource) return;
    
    try {
      setIsDeleting(true);
      const response = await resourcesAPI.deleteResource(resource.id);
      
      if (response.success) {
        showSuccess("Resource deleted", "The resource has been deleted successfully.");
        onResourceUpdated?.(); // Refresh parent component
        onClose(); // Close modal
      } else {
        showError("Failed to delete resource", response.message || "Unknown error");
      }
    } catch (error) {
      handleError(error, "Failed to delete resource");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const statusInfo = getStatusInfo(resource.status);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-foreground mb-2">
                {resource.title}
                {isLoadingDetails && (
                  <RefreshCw className="w-5 h-5 ml-2 animate-spin inline" />
                )}
              </DialogTitle>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <User className="w-4 h-4" />
                <span className="font-medium">by {resource.author}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={statusInfo.color}>
                <span className="flex items-center space-x-1">
                  {statusInfo.icon}
                  <span>{statusInfo.label}</span>
                </span>
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Resource Header with Thumbnail */}
          <div className="flex items-start space-x-4 p-4 bg-muted/30 rounded-lg">
            <img
              src={resource.thumbnail || "/api/placeholder/200/120"}
              alt={resource.title}
              className="w-32 h-20 object-cover rounded-lg border shadow-sm"
            />
            <div className="flex-1 space-y-2">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Uploaded {formatDate(resource.uploadDate)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{resource.flags} views</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Resource ID:</span>
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  {resource.id}
                </code>
              </div>
            </div>
          </div>

          {/* Key Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Price</p>
                <p className="font-medium">
                  {resource.price === "Free" ? (
                    <Badge className="bg-green-100 text-green-800">Free</Badge>
                  ) : (
                    resource.price
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
              <Eye className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Views</p>
                <p className="font-medium">{resource.flags}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
              <Calendar className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Upload Date</p>
                <p className="font-medium">{formatDate(resource.uploadDate)}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Resource Details */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-brand-primary" />
                    <span>Resource Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Title:</span>
                    <span className="font-medium text-right">{resource.title}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Author:</span>
                    <span className="font-medium">{resource.author}</span>
                  </div>
                  {detailedResource && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Description:</span>
                        <span className="font-medium text-right max-w-xs">
                          {detailedResource.description}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Subject:</span>
                        <span className="font-medium">{detailedResource.subject}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Age Range:</span>
                        <span className="font-medium">{detailedResource.ageRange}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Curriculum:</span>
                        <span className="font-medium">{detailedResource.curriculum}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Curriculum Type:</span>
                        <span className="font-medium">{detailedResource.curriculumType}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Files:</span>
                        <span className="font-medium">
                          {detailedResource.previews.length} preview(s), 1 main file
                        </span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <Badge className={statusInfo.color}>
                      <span className="flex items-center space-x-1">
                        {statusInfo.icon}
                        <span>{statusInfo.label}</span>
                      </span>
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Price:</span>
                    <span className="font-medium">
                      {resource.price === "Free" ? (
                        <Badge className="bg-green-100 text-green-800">Free</Badge>
                      ) : (
                        resource.price
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Views:</span>
                    <span className="font-medium">{resource.flags}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <span>Resource Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Views:</span>
                    <span className="font-medium">{resource.flags}</span>
                  </div>
                  {detailedResource && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Resource ID:</span>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {detailedResource.id}
                        </code>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Thumbnail ID:</span>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {detailedResource.thumbnail}
                        </code>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Preview Images:</span>
                        <span className="font-medium">{detailedResource.previews.length} file(s)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Main File ID:</span>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {detailedResource.file}
                        </code>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Created Date:</span>
                    <span className="font-medium">
                      {detailedResource ? formatDate(detailedResource.createdAt) : formatDate(resource.uploadDate)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Days Active:</span>
                    <span className="font-medium">
                      {Math.floor((new Date().getTime() - new Date(detailedResource?.createdAt || resource.uploadDate).getTime()) / (1000 * 60 * 60 * 24))} days
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Status Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  <span>Status Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                    <Badge className={statusInfo.color}>
                      <span className="flex items-center space-x-1">
                        {statusInfo.icon}
                        <span>{statusInfo.label}</span>
                      </span>
                    </Badge>
                    <div>
                      <p className="text-sm font-medium">
                        {resource.status === "approved" && "This resource has been approved and is live on the platform"}
                        {resource.status === "pending" && "This resource is awaiting admin review and approval"}
                        {resource.status === "rejected" && "This resource has been rejected and is not available"}
                        {resource.status === "draft" && "This resource is saved as a draft and not yet submitted"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Created: {detailedResource ? formatDate(detailedResource.createdAt) : formatDate(resource.uploadDate)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="w-5 h-5 text-blue-600" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {resource.status === "pending" && (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-green-600 border-green-600 hover:bg-green-50"
                        onClick={() => setIsApproveDialogOpen(true)}
                        disabled={isApproving}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {isApproving ? "Approving..." : "Approve Resource"}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 border-red-600 hover:bg-red-50"
                        onClick={() => setIsRejectDialogOpen(true)}
                        disabled={isRejecting}
                      >
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        {isRejecting ? "Rejecting..." : "Reject Resource"}
                      </Button>
                    </>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 border-red-600 hover:bg-red-50"
                    onClick={() => setIsDeleteDialogOpen(true)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {isDeleting ? "Deleting..." : "Delete Resource"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </DialogFooter>

        {/* Approve Confirmation Dialog */}
        <AlertDialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Approve Resource</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to approve "{resource.title}"? 
                Once approved, this resource will be published and available for purchase by users.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isApproving}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleApproveResource}
                disabled={isApproving}
                className="bg-green-600 text-white hover:bg-green-700"
              >
                {isApproving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Approving...
                  </>
                ) : (
                  "Approve Resource"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Reject Confirmation Dialog */}
        <AlertDialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reject Resource</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to reject "{resource.title}"? 
                Once rejected, this resource will not be published and the author will be notified of the rejection.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isRejecting}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleRejectResource}
                disabled={isRejecting}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                {isRejecting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Rejecting...
                  </>
                ) : (
                  "Reject Resource"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Resource</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{resource.title}"? This action cannot be undone.
                The resource will be permanently removed from the platform and will no longer be available for purchase.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteResource}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  "Delete Resource"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  );
};

export default ViewResourceModal;
