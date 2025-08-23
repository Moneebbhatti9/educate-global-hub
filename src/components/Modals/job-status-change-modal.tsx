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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import {
  Briefcase,
  MapPin,
  Calendar,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Archive,
} from "lucide-react";
import type { Job } from "@/types/job";

interface JobStatusChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (jobId: string, newStatus: string, reason?: string) => void;
  job: Job | null;
  isLoading?: boolean;
}

const JobStatusChangeModal = ({
  isOpen,
  onClose,
  onConfirm,
  job,
  isLoading = false,
}: JobStatusChangeModalProps) => {
  const [newStatus, setNewStatus] = useState<string>("");
  const [reason, setReason] = useState("");

  if (!job) return null;

  const handleSubmit = () => {
    if (!newStatus || newStatus === job.status) return;
    onConfirm(job._id, newStatus, reason);
    onClose();
    setNewStatus("");
    setReason("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
      case "active":
        return "bg-brand-accent-green text-white";
      case "draft":
      case "pending":
        return "bg-brand-accent-orange text-white";
      case "closed":
      case "archived":
        return "bg-gray-500 text-white";
      case "expired":
        return "bg-red-500 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "published":
      case "active":
        return <CheckCircle className="w-4 h-4" />;
      case "draft":
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "closed":
      case "archived":
        return <Archive className="w-4 h-4" />;
      case "expired":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const statusOptions = [
    {
      value: "published",
      label: "Published",
      description: "Job is active and visible to candidates",
    },
    {
      value: "draft",
      label: "Draft",
      description: "Job is saved but not published",
    },
    {
      value: "closed",
      label: "Closed",
      description: "Job is closed and no longer accepting applications",
    },
    {
      value: "expired",
      label: "Expired",
      description: "Job has passed its deadline",
    },
    {
      value: "archived",
      label: "Archived",
      description: "Job is archived for record keeping",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Change Job Status</DialogTitle>
          <DialogDescription>
            Update the status for this job posting.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Job Info */}
          <div className="flex items-start space-x-3 p-4 bg-muted/50 rounded-lg">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-brand-primary/10 rounded-full flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-brand-primary" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-foreground">{job.title}</div>
              <div className="text-sm text-muted-foreground">
                {job.organization}
              </div>
              <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3 h-3" />
                  <span>
                    {job.city}, {job.country}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-3 h-3" />
                  <span>
                    Posted: {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-3 h-3" />
                  <span>
                    {job.applicantsCount || 0} applicants •{" "}
                    {job.viewsCount || 0} views
                  </span>
                </div>
              </div>
              <div className="mt-2">
                <Badge className={getStatusColor(job.status)}>
                  <span className="flex items-center space-x-1">
                    {getStatusIcon(job.status)}
                    <span className="capitalize">
                      {job.status === "published" ? "Active" : job.status}
                    </span>
                  </span>
                </Badge>
              </div>
            </div>
          </div>

          {/* Status Selection */}
          <div className="space-y-2">
            <Label htmlFor="status">New Status</Label>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    disabled={option.value === job.status}
                  >
                    <div className="flex flex-col">
                      <span>{option.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {option.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reason (optional but recommended for status changes) */}
          {newStatus && newStatus !== job.status && (
            <div className="space-y-2">
              <Label htmlFor="reason">
                Reason for Status Change
                <span className="text-muted-foreground text-sm ml-1">
                  (Optional)
                </span>
              </Label>
              <Textarea
                id="reason"
                placeholder="Please provide a reason for this status change..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
              />
            </div>
          )}

          {/* Status Change Preview */}
          {newStatus && newStatus !== job.status && (
            <div className="p-3 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="text-sm">
                <strong>Status Change Preview:</strong>
                <div className="mt-2 flex items-center space-x-2">
                  <Badge className={getStatusColor(job.status)}>
                    <span className="flex items-center space-x-1">
                      {getStatusIcon(job.status)}
                      <span className="capitalize">
                        {job.status === "published" ? "Active" : job.status}
                      </span>
                    </span>
                  </Badge>
                  <span className="text-blue-600">→</span>
                  <Badge className={getStatusColor(newStatus)}>
                    <span className="flex items-center space-x-1">
                      {getStatusIcon(newStatus)}
                      <span className="capitalize">
                        {newStatus === "published" ? "Active" : newStatus}
                      </span>
                    </span>
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!newStatus || newStatus === job.status || isLoading}
            className="bg-brand-primary hover:bg-brand-primary/90 text-white"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Updating...
              </>
            ) : (
              "Update Status"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JobStatusChangeModal;
