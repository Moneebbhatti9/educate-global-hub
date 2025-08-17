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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { GraduationCap } from "lucide-react";

interface Education {
  id: string;
  degree: string;
  institution: string;
  field: string;
  gpa?: string;
  startDate: string;
  endDate: string;
  thesis?: string;
  honors?: string;
  type: "University" | "School" | "Professional";
}

interface AddEducationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (education: Education) => void;
  editingEducation?: Education;
}

export const AddEducationModal = ({
  open,
  onOpenChange,
  onSave,
  editingEducation,
}: AddEducationModalProps) => {
  const [formData, setFormData] = useState<Omit<Education, "id">>({
    degree: editingEducation?.degree || "",
    institution: editingEducation?.institution || "",
    field: editingEducation?.field || "",
    gpa: editingEducation?.gpa || "",
    startDate: editingEducation?.startDate || "",
    endDate: editingEducation?.endDate || "",
    thesis: editingEducation?.thesis || "",
    honors: editingEducation?.honors || "",
    type: editingEducation?.type || "University",
  });

  const handleSave = () => {
    if (!formData.degree.trim() || !formData.institution.trim()) return;

    const newEducation: Education = {
      id: editingEducation?.id || Date.now().toString(),
      ...formData,
    };

    onSave(newEducation);
    onOpenChange(false);

    // Reset form if not editing
    if (!editingEducation) {
      setFormData({
        degree: "",
        institution: "",
        field: "",
        gpa: "",
        startDate: "",
        endDate: "",
        thesis: "",
        honors: "",
        type: "University",
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
            <GraduationCap className="w-5 h-5" />
            {editingEducation ? "Edit Education" : "Add Education"}
          </DialogTitle>
          <DialogDescription>
            {editingEducation
              ? "Update your educational background details."
              : "Add your educational qualifications and academic achievements."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="type">Education Type *</Label>
            <Select
              value={formData.type}
              onValueChange={(value: Education["type"]) =>
                updateField("type", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select education type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="University">University Education</SelectItem>
                <SelectItem value="School">School Education</SelectItem>
                <SelectItem value="Professional">
                  Professional Certification
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="degree">Degree/Qualification *</Label>
              <Input
                id="degree"
                placeholder="e.g., Bachelor of Science"
                value={formData.degree}
                onChange={(e) => updateField("degree", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="institution">Institution *</Label>
              <Input
                id="institution"
                placeholder="e.g., Harvard University"
                value={formData.institution}
                onChange={(e) => updateField("institution", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="field">Field of Study</Label>
              <Input
                id="field"
                placeholder="e.g., Mathematics Education"
                value={formData.field}
                onChange={(e) => updateField("field", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gpa">GPA/Grade</Label>
              <Input
                id="gpa"
                placeholder="e.g., 3.8/4.0 or First Class"
                value={formData.gpa}
                onChange={(e) => updateField("gpa", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
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
                min={
                  formData.startDate ? new Date(formData.startDate) : undefined
                }
                max={new Date()}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="thesis">Thesis/Project Title</Label>
            <Input
              id="thesis"
              placeholder="e.g., Impact of Technology on Math Education"
              value={formData.thesis}
              onChange={(e) => updateField("thesis", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="honors">Honors & Awards</Label>
            <Textarea
              id="honors"
              placeholder="e.g., Magna Cum Laude, Dean's List, Outstanding Graduate Award"
              value={formData.honors}
              onChange={(e) => updateField("honors", e.target.value)}
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
            disabled={!formData.degree.trim() || !formData.institution.trim()}
          >
            {editingEducation ? "Update" : "Add"} Education
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
