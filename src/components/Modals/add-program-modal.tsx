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
    name: "",
    level: "Elementary",
    curriculum: "",
    ageRange: "",
    duration: "",
    subjects: [],
    description: "",
    requirements: [],
    capacity: 25,
    fees: "",
  });

  // Update form data when editing program changes
  useEffect(() => {
    if (editingProgram) {
      setFormData({
        name: editingProgram.name || "",
        level: editingProgram.level || "Elementary",
        curriculum: editingProgram.curriculum || "",
        ageRange: editingProgram.ageRange || "",
        duration: editingProgram.duration || "",
        subjects: editingProgram.subjects || [],
        description: editingProgram.description || "",
        requirements: editingProgram.requirements || [],
        capacity: editingProgram.capacity || 25,
        fees: editingProgram.fees || "",
      });
    } else {
      // Reset form when not editing
      setFormData({
        name: "",
        level: "Elementary",
        curriculum: "",
        ageRange: "",
        duration: "",
        subjects: [],
        description: "",
        requirements: [],
        capacity: 25,
        fees: "",
      });
    }
  }, [editingProgram]);

  const handleSave = () => {
    if (!formData.name.trim() || !formData.curriculum.trim()) return;

    const newProgram: Program = {
      ...formData,
    };

    onSave(newProgram);
    onOpenChange(false);

    // Reset form if not editing
    if (!editingProgram) {
      setFormData({
        name: "",
        level: "Elementary",
        curriculum: "",
        ageRange: "",
        duration: "",
        subjects: [],
        description: "",
        requirements: [],
        capacity: 25,
        fees: "",
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
              <Label htmlFor="name">Program Name *</Label>
              <Input
                id="name"
                placeholder="e.g., International Baccalaureate Diploma"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Education Level</Label>
              <Select value={formData.level} onValueChange={(value: Program["level"]) => updateField("level", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select education level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pre-K">Pre-K</SelectItem>
                  <SelectItem value="Elementary">Elementary</SelectItem>
                  <SelectItem value="Middle School">Middle School</SelectItem>
                  <SelectItem value="High School">High School</SelectItem>
                  <SelectItem value="Sixth Form">Sixth Form</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Program Duration</Label>
              <Input
                id="duration"
                placeholder="e.g., 2 years, 1 academic year"
                value={formData.duration}
                onChange={(e) => updateField("duration", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">Class Capacity</Label>
              <Input
                id="capacity"
                type="number"
                min="1"
                max="50"
                placeholder="e.g., 25"
                value={formData.capacity}
                onChange={(e) => updateField("capacity", parseInt(e.target.value) || 25)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subjects">Core Subjects</Label>
            <Input
              id="subjects"
              placeholder="e.g., Mathematics, English, Science, History (comma separated)"
              value={formData.subjects.join(", ")}
              onChange={(e) =>
                updateField(
                  "subjects",
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
            <Label htmlFor="requirements">Admission Requirements</Label>
            <Input
              id="requirements"
              placeholder="e.g., Minimum GPA 3.5, Language Proficiency, Interview (comma separated)"
              value={formData.requirements.join(", ")}
              onChange={(e) =>
                updateField(
                  "requirements",
                  e.target.value.split(",").map((s) => s.trim()).filter(s => s)
                )
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fees">Program Fees (Optional)</Label>
            <Input
              id="fees"
              placeholder="e.g., $15,000/year, €12,000/year"
              value={formData.fees}
              onChange={(e) => updateField("fees", e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!formData.name.trim() || !formData.curriculum.trim()}
          >
            {editingProgram ? "Update" : "Add"} Program
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};