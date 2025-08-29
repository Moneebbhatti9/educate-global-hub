import { useState } from "react";
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
import { Award } from "lucide-react";
import { Certification, CertificationRequest } from "@/apis/profiles";
import React from "react";

interface AddCertificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (certification: Certification) => void;
  editingCertification?: Certification;
}

export const AddCertificationModal = ({
  open,
  onOpenChange,
  onSave,
  editingCertification,
}: AddCertificationModalProps) => {
  const [formData, setFormData] = useState<CertificationRequest>({
    certificationName: editingCertification?.certificationName || "",
    issuingOrganization: editingCertification?.issuingOrganization || "",
    issueDate: editingCertification?.issueDate || "",
    expiryDate: editingCertification?.expiryDate || "",
    credentialId: editingCertification?.credentialId || "",
    credentialUrl: editingCertification?.credentialUrl || "",
    description: editingCertification?.description || "",
  });

  const handleSave = () => {
    if (!formData.certificationName.trim() || !formData.issuingOrganization.trim()) return;

    const newCertification: Certification = {
      id: editingCertification?.id || Date.now().toString(),
      _id: editingCertification?._id,
      ...formData,
    };

    onSave(newCertification);
    onOpenChange(false);

    // Reset form if not editing
    if (!editingCertification) {
      setFormData({
        certificationName: "",
        issuingOrganization: "",
        issueDate: "",
        expiryDate: "",
        credentialId: "",
        credentialUrl: "",
        description: "",
      });
    }
  };

  // Update form data when editingCertification changes
  React.useEffect(() => {
    if (editingCertification) {
      setFormData({
        certificationName: editingCertification.certificationName || "",
        issuingOrganization: editingCertification.issuingOrganization || "",
        issueDate: editingCertification.issueDate || "",
        expiryDate: editingCertification.expiryDate || "",
        credentialId: editingCertification.credentialId || "",
        credentialUrl: editingCertification.credentialUrl || "",
        description: editingCertification.description || "",
      });
    }
  }, [editingCertification]);

  const updateField = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            {editingCertification ? "Edit Certification" : "Add Professional Certification"}
          </DialogTitle>
          <DialogDescription>
            {editingCertification
              ? "Update your professional certification details."
              : "Add your professional certifications and credentials."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="certificationName">Certification Name *</Label>
              <Input
                id="certificationName"
                placeholder="e.g., Certified Teacher"
                value={formData.certificationName}
                onChange={(e) => updateField("certificationName", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="issuingOrganization">Issuing Organization *</Label>
              <Input
                id="issuingOrganization"
                placeholder="e.g., National Board for Teaching"
                value={formData.issuingOrganization}
                onChange={(e) => updateField("issuingOrganization", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issueDate">Issue Date</Label>
              <DatePicker
                id="issueDate"
                value={
                  formData.issueDate ? new Date(formData.issueDate) : undefined
                }
                onValueChange={(date) => {
                  if (date) {
                    updateField("issueDate", date.toISOString().split("T")[0]);
                  }
                }}
                placeholder="Select issue date"
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
                  formData.issueDate ? new Date(formData.issueDate) : undefined
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="credentialId">Credential ID</Label>
              <Input
                id="credentialId"
                placeholder="e.g., CT-2023-456789"
                value={formData.credentialId}
                onChange={(e) => updateField("credentialId", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="credentialUrl">Credential URL</Label>
              <Input
                id="credentialUrl"
                placeholder="e.g., https://verify.credential.org/..."
                value={formData.credentialUrl}
                onChange={(e) => updateField("credentialUrl", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Additional details about this certification..."
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
            disabled={!formData.certificationName.trim() || !formData.issuingOrganization.trim()}
          >
            {editingCertification ? "Update" : "Add"} Certification
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};