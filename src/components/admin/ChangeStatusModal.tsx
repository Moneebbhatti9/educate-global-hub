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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar: string;
}

interface ChangeStatusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userData: UserData | null;
  onStatusChange: (userId: number, newStatus: string, reason?: string) => void;
}

export const ChangeStatusModal = ({
  open,
  onOpenChange,
  userData,
  onStatusChange,
}: ChangeStatusModalProps) => {
  const [newStatus, setNewStatus] = useState<string>("");
  const [reason, setReason] = useState("");

  if (!userData) return null;

  const handleSubmit = () => {
    if (!newStatus || newStatus === userData.status) return;
    
    onStatusChange(userData.id, newStatus, reason);
    onOpenChange(false);
    setNewStatus("");
    setReason("");
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

  const statusOptions = [
    { value: "active", label: "Active", description: "User can access all features" },
    { value: "pending", label: "Pending", description: "User access is under review" },
    { value: "suspended", label: "Suspended", description: "User access is temporarily disabled" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Change User Status</DialogTitle>
          <DialogDescription>
            Update the account status for this user.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Info */}
          <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
            <Avatar className="w-12 h-12">
              <AvatarImage src={userData.avatar} />
              <AvatarFallback>
                {userData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="font-medium">{userData.name}</div>
              <div className="text-sm text-muted-foreground">{userData.email}</div>
              <div className="mt-1">
                <Badge className={getStatusColor(userData.status)}>
                  Current: {userData.status.charAt(0).toUpperCase() + userData.status.slice(1)}
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
                    disabled={option.value === userData.status}
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

          {/* Reason (optional but recommended for suspensions) */}
          {newStatus === "suspended" && (
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Suspension</Label>
              <Textarea
                id="reason"
                placeholder="Please provide a reason for suspending this user..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
              />
            </div>
          )}

          {newStatus && newStatus !== userData.status && (
            <div className="p-3 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="text-sm">
                <strong>Status Change Preview:</strong>
                <div className="mt-1 flex items-center space-x-2">
                  <Badge className={getStatusColor(userData.status)}>
                    {userData.status.charAt(0).toUpperCase() + userData.status.slice(1)}
                  </Badge>
                  <span>→</span>
                  <Badge className={getStatusColor(newStatus)}>
                    {newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!newStatus || newStatus === userData.status}
          >
            Update Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};