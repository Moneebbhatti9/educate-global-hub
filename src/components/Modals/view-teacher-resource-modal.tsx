import React, { useState } from "react";
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
  Edit,
  Check,
} from "lucide-react";
import { resourcesAPI } from "@/apis/resources";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import type { TeacherResource } from "@/types/resource";

interface ViewTeacherResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: TeacherResource | null;
  onResourceUpdated?: () => void; // Callback to refresh parent component
}

const ViewTeacherResourceModal = ({ isOpen, onClose, resource, onResourceUpdated }: ViewTeacherResourceModalProps) => {
  const { handleError, showSuccess, showError } = useErrorHandler();
  
  // State for API operations
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Confirmation dialog states
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  if (!resource) return null;

  const getStatusInfo = (status: string) => {
    switch (status.toLowerCase()) {
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
  const handleSubmitResource = async () => {
    if (!resource) return;
    
    try {
      setIsSubmitting(true);
      const response = await resourcesAPI.updateResourceStatus(resource._id, {
        status: "pending"
      });
      
      if (response.success) {
        showSuccess("Resource submitted", "Your resource has been submitted for review.");
        onResourceUpdated?.(); // Refresh parent component
        onClose(); // Close modal
      } else {
        showError("Failed to submit resource", response.message || "Unknown error");
      }
    } catch (error) {
      handleError(error, "Failed to submit resource");
    } finally {
      setIsSubmitting(false);
      setIsSubmitDialogOpen(false);
    }
  };

  const handleDeleteResource = async () => {
    if (!resource) return;
    
    try {
      setIsDeleting(true);
      const response = await resourcesAPI.deleteResource(resource._id);
      
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

  const handleViewFullResource = () => {
    // Navigate to full resource page
    window.open(`/resources/${resource._id}`, '_blank');
  };

  const handleEditResource = () => {
    // Navigate to edit page
    window.location.href = `/dashboard/teacher/upload-resource?edit=${resource._id}`;
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
              </DialogTitle>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <User className="w-4 h-4" />
                <span className="font-medium">by {resource.createdBy?.role || "Teacher"}</span>
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
              src={resource.coverPhoto?.url || "/api/placeholder/200/120"}
              alt={resource.title}
              className="w-32 h-20 object-cover rounded-lg border shadow-sm"
            />
            <div className="flex-1 space-y-2">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Created {formatDate(resource.createdAt)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>0 views</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Resource ID:</span>
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  {resource._id}
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
                  {resource.isFree ? (
                    <Badge className="bg-green-100 text-green-800">Free</Badge>
                  ) : (
                    `${resource.currency} ${resource.price.toFixed(2)}`
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Subject</p>
                <p className="font-medium">{resource.subject}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
              <Calendar className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Created Date</p>
                <p className="font-medium">{formatDate(resource.createdAt)}</p>
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
                    <span className="text-sm text-muted-foreground">Type:</span>
                    <span className="font-medium">{resource.type}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Subject:</span>
                    <span className="font-medium">{resource.subject}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Age Range:</span>
                    <span className="font-medium">{resource.ageRange}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Curriculum:</span>
                    <span className="font-medium">{resource.curriculum}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <Badge className={statusInfo.color}>
                      <span className="flex items-center space-x-1">
                        {statusInfo.icon}
                        <span>{statusInfo.label}</span>
                      </span>
                    </Badge>
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
                    <span className="font-medium">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Created Date:</span>
                    <span className="font-medium">{formatDate(resource.createdAt)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Last Updated:</span>
                    <span className="font-medium">{formatDate(resource.updatedAt)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Days Active:</span>
                    <span className="font-medium">
                      {Math.floor((new Date().getTime() - new Date(resource.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Resource ID:</span>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {resource._id}
                    </code>
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
                        Last updated: {formatDate(resource.updatedAt)}
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
                  <Button variant="outline" size="sm" onClick={handleViewFullResource}>
                    <Eye className="w-4 h-4 mr-2" />
                    View Full Resource
                  </Button>
                  {(resource.status === "draft" || resource.status === "pending") && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-blue-600 border-blue-600 hover:bg-blue-50"
                      onClick={handleEditResource}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Resource
                    </Button>
                  )}
                  {resource.status === "draft" && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-green-600 border-green-600 hover:bg-green-50"
                      onClick={() => setIsSubmitDialogOpen(true)}
                      disabled={isSubmitting}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      {isSubmitting ? "Submitting..." : "Submit for Review"}
                    </Button>
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

        {/* Submit Confirmation Dialog */}
        <AlertDialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Submit Resource for Review</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to submit "{resource.title}" for review? 
                Once submitted, your resource will be reviewed by our team and you won't be able to edit it until it's approved or rejected.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isSubmitting}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleSubmitResource}
                disabled={isSubmitting}
                className="bg-green-600 text-white hover:bg-green-700"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  "Submit for Review"
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
                The resource will be permanently removed from your library and will no longer be available for purchase.
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

export default ViewTeacherResourceModal;
