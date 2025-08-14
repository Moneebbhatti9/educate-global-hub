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
  Trash2,
  AlertTriangle,
  MapPin,
  Users,
  AlertCircle,
} from "lucide-react";
import type { Job } from "@/types/job";

interface BulkDeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  jobs: Job[];
  isLoading?: boolean;
}

const BulkDeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  jobs,
  isLoading = false,
}: BulkDeleteConfirmationModalProps) => {
  if (!jobs || jobs.length === 0) return null;

  const totalApplicants = jobs.reduce(
    (sum, job) => sum + (job.applicantsCount || 0),
    0
  );
  const totalViews = jobs.reduce((sum, job) => sum + (job.viewsCount || 0), 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-red-600">
                Delete Multiple Job Postings
              </DialogTitle>
              <DialogDescription>
                You are about to delete {jobs.length} job posting
                {jobs.length > 1 ? "s" : ""}. This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Summary Stats */}
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-foreground">
                  {jobs.length}
                </div>
                <div className="text-muted-foreground">Jobs</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-foreground">
                  {totalApplicants}
                </div>
                <div className="text-muted-foreground">Total Applicants</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-foreground">
                  {totalViews}
                </div>
                <div className="text-muted-foreground">Total Views</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-foreground">
                  {jobs.filter((job) => job.status === "published").length}
                </div>
                <div className="text-muted-foreground">Published Jobs</div>
              </div>
            </div>
          </div>

          {/* Job List */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Jobs to be deleted:</h4>
            <div className="max-h-40 overflow-y-auto space-y-2">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="flex items-center justify-between p-3 bg-muted/20 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h5 className="font-medium text-sm truncate">
                        {job.title}
                      </h5>
                      <Badge variant="outline" className="text-xs">
                        {job.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>
                          {job.city}, {job.country}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>{job.applicantsCount || 0} applicants</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Warning Message */}
          <div className="flex items-start space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-red-700">
              <p className="font-medium">Warning:</p>
              <ul className="mt-1 space-y-1 list-disc list-inside">
                <li>All applications for these positions will be lost</li>
                <li>Jobs will be removed from search results immediately</li>
                <li>This action cannot be undone</li>
                <li>Total of {totalApplicants} applications will be deleted</li>
              </ul>
            </div>
          </div>
        </div>

        <DialogFooter className="flex space-x-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Deleting {jobs.length} Jobs...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete {jobs.length} Jobs
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkDeleteConfirmationModal;
