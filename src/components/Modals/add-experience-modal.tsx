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
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import { Briefcase } from "lucide-react";
import { useCreateTeacherExperience, useUpdateTeacherExperience } from "@/apis/profiles";
import { Experience, ExperienceRequest } from "@/apis/profiles";
import { toast } from "sonner";

interface AddExperienceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (experience: Experience) => void;
  editingExperience?: Experience;
}

export const AddExperienceModal = ({
  open,
  onOpenChange,
  onSave,
  editingExperience,
}: AddExperienceModalProps) => {
  const [formData, setFormData] = useState<ExperienceRequest>({
    title: editingExperience?.title || "",
    employer: editingExperience?.employer || "",
    location: editingExperience?.location || "",
    startDate: editingExperience?.startDate || "",
    endDate: editingExperience?.endDate || "",
    current: editingExperience?.current || false,
    responsibilities: editingExperience?.responsibilities || "",
    contactPerson: editingExperience?.contactPerson || "",
  });

  const createExperienceMutation = useCreateTeacherExperience();
  const updateExperienceMutation = useUpdateTeacherExperience();

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.employer.trim()) return;

    try {
      if (editingExperience) {
        // Update existing experience
        const response = await updateExperienceMutation.mutateAsync({
          experienceId: editingExperience.id,
          data: formData,
        });
        
        if (response.success && response.data) {
          onSave(response.data);
          onOpenChange(false);
          toast.success("Experience updated successfully");
        } else {
          toast.error(response.message || "Failed to update experience");
        }
      } else {
        // Create new experience
        const response = await createExperienceMutation.mutateAsync(formData);
        
        if (response.success && response.data) {
          onSave(response.data);
          onOpenChange(false);
          toast.success("Experience added successfully");
          
          // Reset form
          setFormData({
            title: "",
            employer: "",
            location: "",
            startDate: "",
            endDate: "",
            current: false,
            responsibilities: "",
            contactPerson: "",
          });
        } else {
          toast.error(response.message || "Failed to add experience");
        }
      }
    } catch (error) {
      console.error("Error saving experience:", error);
      toast.error("An error occurred while saving the experience");
    }
  };

  const updateField = (field: keyof ExperienceRequest, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isLoading = createExperienceMutation.isPending || updateExperienceMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            {editingExperience ? "Edit Experience" : "Add Experience"}
          </DialogTitle>
          <DialogDescription>
            {editingExperience
              ? "Update your employment history details."
              : "Add your employment or teaching experience."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Mathematics Teacher"
                value={formData.title}
                onChange={(e) => updateField("title", e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="employer">Employer/School *</Label>
              <Input
                id="employer"
                placeholder="e.g., Lincoln High School"
                value={formData.employer}
                onChange={(e) => updateField("employer", e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="e.g., Boston, MA, USA"
              value={formData.location}
              onChange={(e) => updateField("location", e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <DatePicker
                id="startDate"
                value={
                  formData.startDate ? new Date(formData.startDate) : undefined
                }
                onValueChange={(date) => {
                  if (date) {
                    updateField("startDate", date.toISOString().split("T")[0]);
                  }
                }}
                placeholder="Select start date"
                max={new Date()}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <DatePicker
                id="endDate"
                value={
                  formData.endDate ? new Date(formData.endDate) : undefined
                }
                onValueChange={(date) => {
                  if (date) {
                    updateField("endDate", date.toISOString().split("T")[0]);
                  }
                }}
                placeholder="Select end date"
                disabled={formData.current || isLoading}
                min={
                  formData.startDate ? new Date(formData.startDate) : undefined
                }
                max={new Date()}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="current"
              checked={formData.current}
              onCheckedChange={(checked) => updateField("current", checked)}
              disabled={isLoading}
            />
            <Label htmlFor="current">I currently work here</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsibilities">Key Responsibilities</Label>
            <Textarea
              id="responsibilities"
              placeholder="Describe your key responsibilities and achievements..."
              value={formData.responsibilities}
              onChange={(e) => updateField("responsibilities", e.target.value)}
              rows={4}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactPerson">Contact Person</Label>
            <Input
              id="contactPerson"
              placeholder="e.g., John Smith - Principal"
              value={formData.contactPerson}
              onChange={(e) => updateField("contactPerson", e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!formData.title.trim() || !formData.employer.trim() || isLoading}
          >
            {isLoading ? "Saving..." : editingExperience ? "Update" : "Add"} Experience
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};