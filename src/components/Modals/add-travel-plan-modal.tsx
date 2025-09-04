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
import { Plane } from "lucide-react";
import { Dependent, DependentRequest } from "@/apis/profiles";

interface AddTravelPlanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (dependent: Dependent) => void;
  editingTravelPlan?: Dependent | null;
}

export const AddTravelPlanModal: React.FC<AddTravelPlanModalProps> = ({
  open,
  onOpenChange,
  onSave,
  editingTravelPlan,
}: AddTravelPlanModalProps) => {
  const [formData, setFormData] = useState<DependentRequest>({
    dependentName: editingTravelPlan?.dependentName || "",
    relationship: editingTravelPlan?.relationship || "Spouse",
    age: editingTravelPlan?.age || undefined,
    nationality: editingTravelPlan?.nationality || "",
    passportNumber: editingTravelPlan?.passportNumber || "",
    passportExpiry: editingTravelPlan?.passportExpiry || "",
    visaRequired: editingTravelPlan?.visaRequired || false,
    visaStatus: editingTravelPlan?.visaStatus || "Not Applied",
    accommodationNeeds: editingTravelPlan?.accommodationNeeds || "",
    medicalNeeds: editingTravelPlan?.medicalNeeds || "",
    educationNeeds: editingTravelPlan?.educationNeeds || "",
    notes: editingTravelPlan?.notes || "",
  });

  React.useEffect(() => {
    if (editingTravelPlan) {
      setFormData({
        dependentName: editingTravelPlan.dependentName || "",
        relationship: editingTravelPlan.relationship || "Spouse",
        age: editingTravelPlan.age || undefined,
        nationality: editingTravelPlan.nationality || "",
        passportNumber: editingTravelPlan.passportNumber || "",
        passportExpiry: editingTravelPlan.passportExpiry || "",
        visaRequired: editingTravelPlan.visaRequired || false,
        visaStatus: editingTravelPlan.visaStatus || "Not Applied",
        accommodationNeeds: editingTravelPlan.accommodationNeeds || "",
        medicalNeeds: editingTravelPlan.medicalNeeds || "",
        educationNeeds: editingTravelPlan.educationNeeds || "",
        notes: editingTravelPlan.notes || "",
      });
    }
  }, [editingTravelPlan]);

  const handleSave = () => {
    if (!formData.dependentName.trim()) return;

    const newTravelPlan: Dependent = {
      id: editingTravelPlan?.id || Date.now().toString(),
      _id: editingTravelPlan?._id, // Added _id for API compatibility
      ...formData,
    };

    onSave(newTravelPlan);
    onOpenChange(false);

    // Reset form if not editing
    if (!editingTravelPlan) {
      setFormData({
        dependentName: "",
        relationship: "Spouse",
        age: undefined,
        nationality: "",
        passportNumber: "",
        passportExpiry: "",
        visaRequired: false,
        visaStatus: "Not Applied",
        accommodationNeeds: "",
        medicalNeeds: "",
        educationNeeds: "",
        notes: "",
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
            <Plane className="w-5 h-5" />
            {editingTravelPlan ? "Edit Travel Plan" : "Add Family Member/Dependent"}
          </DialogTitle>
          <DialogDescription>
            {editingTravelPlan
              ? "Update family member or dependent travel information."
              : "Add information about family members or dependents who will be traveling with you for visa and accommodation purposes."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dependentName">Full Name *</Label>
              <Input
                id="dependentName"
                placeholder="e.g., Jane Smith"
                value={formData.dependentName}
                onChange={(e) => updateField("dependentName", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="relationship">Relationship</Label>
              <Select value={formData.relationship} onValueChange={(value: Dependent["relationship"]) => updateField("relationship", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Spouse">Spouse</SelectItem>
                  <SelectItem value="Child">Child</SelectItem>
                  <SelectItem value="Parent">Parent</SelectItem>
                  <SelectItem value="Sibling">Sibling</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                min="0"
                max="120"
                placeholder="e.g., 25"
                value={formData.age || ""}
                onChange={(e) => updateField("age", e.target.value ? parseInt(e.target.value) : undefined)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nationality">Nationality</Label>
              <Input
                id="nationality"
                placeholder="e.g., American"
                value={formData.nationality}
                onChange={(e) => updateField("nationality", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="passportNumber">Passport Number</Label>
              <Input
                id="passportNumber"
                placeholder="e.g., 123456789"
                value={formData.passportNumber}
                onChange={(e) => updateField("passportNumber", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="passportExpiry">Passport Expiry</Label>
              <DatePicker
                id="passportExpiry"
                value={
                  formData.passportExpiry ? new Date(formData.passportExpiry) : undefined
                }
                onValueChange={(date) => {
                  if (date) {
                    updateField("passportExpiry", date.toISOString().split("T")[0]);
                  }
                }}
                placeholder="Select expiry date"
                min={new Date()}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="visaRequired">Visa Required</Label>
              <Select value={formData.visaRequired ? "yes" : "no"} onValueChange={(value) => updateField("visaRequired", value === "yes")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select visa requirement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.visaRequired && (
              <div className="space-y-2">
                <Label htmlFor="visaStatus">Visa Status</Label>
                <Select value={formData.visaStatus} onValueChange={(value) => updateField("visaStatus", value as Dependent["visaStatus"])}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select visa status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Not Applied">Not Applied</SelectItem>
                    <SelectItem value="Applied">Applied</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Denied">Denied</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="accommodationNeeds">Accommodation Needs</Label>
            <Textarea
              id="accommodationNeeds"
              placeholder="Describe accommodation requirements (bedrooms, proximity to school, etc.)"
              value={formData.accommodationNeeds}
              onChange={(e) => updateField("accommodationNeeds", e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="medicalNeeds">Medical Needs (Optional)</Label>
            <Textarea
              id="medicalNeeds"
              placeholder="Any medical conditions, medications, or special healthcare needs"
              value={formData.medicalNeeds}
              onChange={(e) => updateField("medicalNeeds", e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="educationNeeds">Education Needs (Optional)</Label>
            <Textarea
              id="educationNeeds"
              placeholder="School requirements, grade level, special educational needs"
              value={formData.educationNeeds}
              onChange={(e) => updateField("educationNeeds", e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any other relevant information..."
              value={formData.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!formData.dependentName.trim()}
          >
            {editingTravelPlan ? "Update" : "Add"} Family Member
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};