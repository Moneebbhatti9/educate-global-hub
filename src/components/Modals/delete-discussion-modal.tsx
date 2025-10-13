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
  MessageCircle,
  ThumbsUp,
  Eye,
  Calendar,
  Pin,
  Lock,
  Flag,
} from "lucide-react";
import type { Discussion } from "@/types/forum";

interface DeleteDiscussionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  discussion: Discussion | null;
  isLoading?: boolean;
}

const DeleteDiscussionModal = ({
  isOpen,
  onClose,
  onConfirm,
  discussion,
  isLoading = false,
}: DeleteDiscussionModalProps) => {
  if (!discussion) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDaysAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

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
                Delete Discussion
              </DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete the
                discussion and all associated replies.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Discussion Details */}
          <div className="p-4 bg-muted/50 rounded-lg space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground truncate">
                  {discussion.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  by {discussion.createdBy?.firstName}{" "}
                  {discussion.createdBy?.lastName}
                </p>
              </div>
              <div className="flex items-center space-x-1 ml-2">
                {discussion.isPinned && (
                  <Pin className="w-4 h-4 text-orange-500" />
                )}
                {discussion.isLocked && (
                  <Lock className="w-4 h-4 text-gray-500" />
                )}
                {discussion.reports && discussion.reports.length > 0 && (
                  <Flag className="w-4 h-4 text-red-500" />
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-3 h-3" />
                <span>{discussion.replyCount || 0} replies</span>
              </div>
              <div className="flex items-center space-x-1">
                <ThumbsUp className="w-3 h-3" />
                <span>{discussion.likes?.length || 0} likes</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-3 h-3" />
                <span>{discussion.views || 0} views</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">
                {discussion.category}
              </Badge>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                <span>{getDaysAgo(discussion.createdAt)}d ago</span>
              </div>
            </div>
          </div>

          {/* Warning Message */}
          <div className="flex items-start space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-red-700">
              <p className="font-medium">Warning:</p>
              <ul className="mt-1 space-y-1 list-disc list-inside">
                <li>All replies to this discussion will be lost</li>
                <li>Discussion will be removed from forum immediately</li>
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
                Delete Discussion
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDiscussionModal;
