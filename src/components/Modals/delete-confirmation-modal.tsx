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
import { Trash2, AlertTriangle, MapPin, Calendar, Users } from "lucide-react";
import type { Job } from "@/types/job";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  job: Job | null;
  isLoading?: boolean;
}

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  job,
  isLoading = false,
}: DeleteConfirmationModalProps) => {
  if (!job) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
                Delete Job Posting
              </DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete the
                job posting and all associated data.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Job Details */}
          <div className="bg-muted/30 rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <h4 className="font-medium text-foreground">{job.title}</h4>
              <Badge variant="outline" className="text-xs">
                {job.status}
              </Badge>
            </div>

            <div className="grid grid-cols-1 gap-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>
                  {job.city}, {job.country}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>
                  Posted: {new Date(job.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>
                  {job.applicantsCount || 0} applicants • {job.viewsCount || 0}{" "}
                  views
                </span>
              </div>
            </div>

            {job.subjects && job.subjects.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {job.subjects.slice(0, 3).map((subject, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {subject}
                  </Badge>
                ))}
                {job.subjects.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{job.subjects.length - 3} more
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Warning Message */}
          <div className="flex items-start space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-red-700">
              <p className="font-medium">Warning:</p>
              <ul className="mt-1 space-y-1 list-disc list-inside">
                <li>All applications for this position will be lost</li>
                <li>Job will be removed from search results immediately</li>
                <li>This action cannot be undone</li>
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
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Job
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationModal;
