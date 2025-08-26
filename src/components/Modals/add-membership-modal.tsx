import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Shield } from "lucide-react";
import { Membership, MembershipRequest } from "@/apis/profiles";

interface AddMembershipModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (membership: Membership) => void;
  editingMembership?: Membership | null;
}

export const AddMembershipModal: React.FC<AddMembershipModalProps> = ({
  open,
  onOpenChange,
  onSave,
  editingMembership,
}) => {
  const [formData, setFormData] = useState<MembershipRequest>({
    organizationName: editingMembership?.organizationName || "",
    membershipType: editingMembership?.membershipType || "Full Member",
    membershipId: editingMembership?.membershipId || "",
    joinDate: editingMembership?.joinDate || "",
    expiryDate: editingMembership?.expiryDate || "",
    status: editingMembership?.status || "Active",
    benefits: editingMembership?.benefits || [],
    description: editingMembership?.description || "",
  });

  React.useEffect(() => {
    if (editingMembership) {
      setFormData({
        organizationName: editingMembership.organizationName || "",
        membershipType: editingMembership.membershipType || "Full Member",
        membershipId: editingMembership.membershipId || "",
        joinDate: editingMembership.joinDate || "",
        expiryDate: editingMembership.expiryDate || "",
        status: editingMembership.status || "Active",
        benefits: editingMembership.benefits || [],
        description: editingMembership.description || "",
      });
    }
  }, [editingMembership]);

  const handleSave = () => {
    if (!formData.organizationName.trim()) return;

    const newMembership: Membership = {
      id: editingMembership?.id || Date.now().toString(),
      _id: editingMembership?._id, // Added _id for API compatibility
      ...formData,
    };

    onSave(newMembership);
    onOpenChange(false);

    // Reset form if not editing
    if (!editingMembership) {
      setFormData({
        organizationName: "",
        membershipType: "Full Member",
        membershipId: "",
        joinDate: "",
        expiryDate: "",
        status: "Active",
        benefits: [],
        description: "",
      });
    }
  };

  const updateField = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            {editingMembership ? "Edit Professional Membership" : "Add Professional Membership"}
          </DialogTitle>
          <DialogDescription>
            {editingMembership
              ? "Update your professional membership details."
              : "Add your membership in teaching associations and professional bodies."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="organizationName">Organization Name *</Label>
            <Input
              id="organizationName"
              placeholder="e.g., National Education Association"
              value={formData.organizationName}
              onChange={(e) => updateField("organizationName", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="membershipType">Membership Type</Label>
              <Select value={formData.membershipType} onValueChange={(value: Membership["membershipType"]) => updateField("membershipType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select membership type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full Member">Full Member</SelectItem>
                  <SelectItem value="Associate Member">Associate Member</SelectItem>
                  <SelectItem value="Student Member">Student Member</SelectItem>
                  <SelectItem value="Honorary Member">Honorary Member</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: Membership["status"]) => updateField("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="membershipId">Membership ID</Label>
            <Input
              id="membershipId"
              placeholder="e.g., NEA-2023-456789"
              value={formData.membershipId}
              onChange={(e) => updateField("membershipId", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="joinDate">Join Date</Label>
              <DatePicker
                id="joinDate"
                value={
                  formData.joinDate ? new Date(formData.joinDate) : undefined
                }
                onValueChange={(date) => {
                  if (date) {
                    updateField("joinDate", date.toISOString().split("T")[0]);
                  }
                }}
                placeholder="Select join date"
                max={new Date()}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <DatePicker
                id="expiryDate"
                value={
                  formData.expiryDate
                    ? new Date(formData.expiryDate)
                    : undefined
                }
                onValueChange={(date) => {
                  if (date) {
                    updateField("expiryDate", date.toISOString().split("T")[0]);
                  }
                }}
                placeholder="Select expiry date"
                min={
                  formData.joinDate ? new Date(formData.joinDate) : undefined
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="benefits">Membership Benefits</Label>
            <Input
              id="benefits"
              placeholder="e.g., Professional Development, Networking, Resources (comma separated)"
              value={formData.benefits.join(", ")}
              onChange={(e) =>
                updateField(
                  "benefits",
                  e.target.value.split(",").map((s) => s.trim()).filter(s => s)
                )
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Additional details about this membership..."
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!formData.organizationName.trim()}
          >
            {editingMembership ? "Update" : "Add"} Membership
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};