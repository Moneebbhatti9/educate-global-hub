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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertTriangle } from "lucide-react";

interface UserData {
  id?: string;
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status?: string;
  avatar?: string;
  createdAt: string;
}

interface DeleteUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userData: UserData | null;
  onDelete: (userId: string) => void;
}

export const DeleteUserModal = ({
  open,
  onOpenChange,
  userData,
  onDelete,
}: DeleteUserModalProps) => {
  if (!userData) return null;

  const handleDelete = () => {
    const userId = userData.id || userData._id;
    console.log("DeleteUserModal - userData:", userData);
    console.log("DeleteUserModal - extracted userId:", userId);
    if (userId) {
      onDelete(userId);
      onOpenChange(false);
    } else {
      console.error("DeleteUserModal - No valid userId found:", userData);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "teacher":
        return "bg-brand-primary text-white";
      case "school":
        return "bg-brand-accent-green text-white";
      case "recruiter":
        return "bg-brand-secondary text-white";
      case "supplier":
        return "bg-brand-accent-orange text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-brand-accent-green text-white";
      case "pending":
        return "bg-brand-accent-orange text-white";
      case "suspended":
        return "bg-red-500 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            <span>Delete User Account</span>
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the user
            account and remove all associated data.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* User Info */}
          <div className="flex items-center space-x-3 p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
            <Avatar className="w-12 h-12">
              <AvatarImage src={userData.avatar} />
              <AvatarFallback>
                {`${userData.firstName} ${userData.lastName}`
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="font-medium">{`${userData.firstName} ${userData.lastName}`}</div>
              <div className="text-sm text-muted-foreground">
                {userData.email}
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className={getRoleColor(userData.role)}>
                  {userData.role.charAt(0).toUpperCase() +
                    userData.role.slice(1)}
                </Badge>
                <Badge className={getStatusColor(userData.status || "pending")}>
                  {(userData.status || "pending").charAt(0).toUpperCase() +
                    (userData.status || "pending").slice(1)}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Member since:{" "}
                {new Date(userData.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800 dark:text-yellow-200">
                  Warning: This action is permanent
                </p>
                <p className="text-yellow-700 dark:text-yellow-300 mt-1">
                  Deleting this user will:
                </p>
                <ul className="list-disc list-inside text-yellow-700 dark:text-yellow-300 mt-1 space-y-1">
                  <li>Remove their account and profile information</li>
                  <li>Delete all associated applications and job postings</li>
                  <li>Remove access to all platform features</li>
                  <li>Cannot be recovered or undone</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Confirmation Text */}
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm">
              To confirm deletion, please verify that you want to permanently
              delete the account for{" "}
              <strong>{`${userData.firstName} ${userData.lastName}`}</strong> (
              {userData.email}).
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white border-red-600"
          >
            Delete User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
