import { useState, useEffect } from "react";
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
import { useCreateTeacherQualification, useUpdateTeacherQualification, Qualification, QualificationRequest } from "@/apis/profiles";
import { toast } from "sonner";

interface AddQualificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (qualification: Qualification) => void;
  editingQualification?: Qualification;
}

export const AddQualificationModal = ({
  open,
  onOpenChange,
  onSave,
  editingQualification,
}: AddQualificationModalProps) => {
  const createQualification = useCreateTeacherQualification();
  const updateQualification = useUpdateTeacherQualification();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<QualificationRequest>({
    title: editingQualification?.title || "",
    institution: editingQualification?.institution || "",
    subject: editingQualification?.subject || "",
    certificationId: editingQualification?.certificationId || "",
    issueDate: editingQualification?.issueDate || "",
    expiryDate: editingQualification?.expiryDate || "",
    ageRanges: editingQualification?.ageRanges || [],
    description: editingQualification?.description || "",
  });

  // Update form data when editingQualification changes
  useEffect(() => {
    if (editingQualification) {
      setFormData({
        title: editingQualification.title || "",
        institution: editingQualification.institution || "",
        subject: editingQualification.subject || "",
        certificationId: editingQualification.certificationId || "",
        issueDate: editingQualification.issueDate || "",
        expiryDate: editingQualification.expiryDate || "",
        ageRanges: editingQualification.ageRanges || [],
        description: editingQualification.description || "",
      });
    }
  }, [editingQualification]);

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.institution.trim()) return;

    setIsLoading(true);
    try {
      let response;
      
      if (editingQualification && editingQualification._id) {
        // Update existing qualification
        response = await updateQualification.mutateAsync({
          qualificationId: editingQualification._id,
          data: formData
        });
      } else {
        // Create new qualification
        response = await createQualification.mutateAsync(formData);
      }

      if (response.success && response.data) {
        toast.success(
          editingQualification 
            ? "Qualification updated successfully!" 
            : "Qualification added successfully!"
        );
        
        // Call the onSave callback with the response data
        onSave(response.data);
        onOpenChange(false);

        // Reset form if not editing
        if (!editingQualification) {
          setFormData({
            title: "",
            institution: "",
            subject: "",
            certificationId: "",
            issueDate: "",
            expiryDate: "",
            ageRanges: [],
            description: "",
          });
        }
      }
    } catch (error) {
      console.error("Failed to save qualification:", error);
      toast.error(
        editingQualification 
          ? "Failed to update qualification. Please try again." 
          : "Failed to add qualification. Please try again."
      );
    } finally {
      setIsLoading(false);
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
            <Award className="w-5 h-5" />
            {editingQualification ? "Edit Qualification" : "Add Qualification"}
          </DialogTitle>
          <DialogDescription>
            {editingQualification
              ? "Update your certification or qualification details."
              : "Add your teaching certifications, licenses, or qualifications."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Qualification Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Teaching License"
                value={formData.title}
                onChange={(e) => updateField("title", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="institution">Issuing Institution *</Label>
              <Input
                id="institution"
                placeholder="e.g., Department of Education"
                value={formData.institution}
                onChange={(e) => updateField("institution", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject Area</Label>
              <Input
                id="subject"
                placeholder="e.g., Mathematics"
                value={formData.subject}
                onChange={(e) => updateField("subject", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="certificationId">Certification ID</Label>
              <Input
                id="certificationId"
                placeholder="e.g., TL-123456"
                value={formData.certificationId}
                onChange={(e) => updateField("certificationId", e.target.value)}
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

          <div className="space-y-2">
            <Label htmlFor="ageRanges">Age Ranges Qualified to Teach</Label>
            <Input
              id="ageRanges"
              placeholder="e.g., 6-11, 12-16 (comma separated)"
              value={formData.ageRanges.join(", ")}
              onChange={(e) =>
                updateField(
                  "ageRanges",
                  e.target.value.split(",").map((s) => s.trim())
                )
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Additional details about this qualification..."
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
            disabled={!formData.title.trim() || !formData.institution.trim() || isLoading}
          >
            {isLoading ? "Saving..." : editingQualification ? "Update" : "Add"} Qualification
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
