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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookOpen } from "lucide-react";
import { Program } from "@/apis/profiles";

interface AddProgramModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (program: Program) => void;
  editingProgram?: Program;
}

export const AddProgramModal = ({
  open,
  onOpenChange,
  onSave,
  editingProgram,
}: AddProgramModalProps) => {
  const [formData, setFormData] = useState<Omit<Program, "_id" | "id">>({
    programName: "",
    educationLevel: "Elementary",
    curriculum: "",
    ageRange: "",
    coreSubjects: [],
    description: "",
    admissionRequirements: [],
    isActive: true,
  });

  // Update form data when editing program changes
  useEffect(() => {
    if (editingProgram) {
      setFormData({
        programName: editingProgram.programName || "",
        educationLevel: editingProgram.educationLevel || "Elementary",
        curriculum: editingProgram.curriculum || "",
        ageRange: editingProgram.ageRange || "",
        coreSubjects: editingProgram.coreSubjects || [],
        description: editingProgram.description || "",
        admissionRequirements: editingProgram.admissionRequirements || [],
        isActive: editingProgram.isActive !== undefined ? editingProgram.isActive : true,
      });
    } else {
      // Reset form when not editing
      setFormData({
        programName: "",
        educationLevel: "Elementary",
        curriculum: "",
        ageRange: "",
        coreSubjects: [],
        description: "",
        admissionRequirements: [],
        isActive: true,
      });
    }
  }, [editingProgram]);

  const handleSave = () => {
    if (!formData.programName.trim() || !formData.curriculum.trim()) return;

    const newProgram: Program = {
      ...formData,
    };

    onSave(newProgram);
    onOpenChange(false);

    // Reset form if not editing
    if (!editingProgram) {
      setFormData({
        programName: "",
        educationLevel: "Elementary",
        curriculum: "",
        ageRange: "",
        coreSubjects: [],
        description: "",
        admissionRequirements: [],
        isActive: true,
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
            <BookOpen className="w-5 h-5" />
            {editingProgram ? "Edit Academic Program" : "Add Academic Program"}
          </DialogTitle>
          <DialogDescription>
            {editingProgram
              ? "Update academic program details."
              : "Add a new academic program or course offering."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="programName">Program Name *</Label>
              <Input
                id="programName"
                placeholder="e.g., International Baccalaureate Diploma"
                value={formData.programName}
                onChange={(e) => updateField("programName", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="educationLevel">Education Level</Label>
              <Select value={formData.educationLevel} onValueChange={(value: Program["educationLevel"]) => updateField("educationLevel", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select education level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Early Years">Early Years</SelectItem>
                  <SelectItem value="Elementary">Elementary</SelectItem>
                  <SelectItem value="Primary">Primary</SelectItem>
                  <SelectItem value="Secondary">Secondary</SelectItem>
                  <SelectItem value="High School">High School</SelectItem>
                  <SelectItem value="All Levels">All Levels</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="curriculum">Curriculum *</Label>
              <Input
                id="curriculum"
                placeholder="e.g., International Baccalaureate"
                value={formData.curriculum}
                onChange={(e) => updateField("curriculum", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ageRange">Age Range</Label>
              <Input
                id="ageRange"
                placeholder="e.g., 16-18 years"
                value={formData.ageRange}
                onChange={(e) => updateField("ageRange", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="coreSubjects">Core Subjects</Label>
            <Input
              id="coreSubjects"
              placeholder="e.g., Mathematics, English, Science, History (comma separated)"
              value={formData.coreSubjects.join(", ")}
              onChange={(e) =>
                updateField(
                  "coreSubjects",
                  e.target.value.split(",").map((s) => s.trim()).filter(s => s)
                )
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Program Description</Label>
            <Textarea
              id="description"
              placeholder="Provide a comprehensive description of the program, its objectives, and unique features..."
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="admissionRequirements">Admission Requirements</Label>
            <Input
              id="admissionRequirements"
              placeholder="e.g., Minimum GPA 3.5, Language Proficiency, Interview (comma separated)"
              value={formData.admissionRequirements.join(", ")}
              onChange={(e) =>
                updateField(
                  "admissionRequirements",
                  e.target.value.split(",").map((s) => s.trim()).filter(s => s)
                )
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="isActive">Program Status</Label>
            <Select value={formData.isActive ? "active" : "inactive"} onValueChange={(value) => updateField("isActive", value === "active")}>
              <SelectTrigger>
                <SelectValue placeholder="Select program status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!formData.programName.trim() || !formData.curriculum.trim()}
          >
            {editingProgram ? "Update" : "Add"} Program
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};