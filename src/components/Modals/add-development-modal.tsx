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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookOpen } from "lucide-react";

interface Development {
  id: string;
  title: string;
  provider: string;
  type: "Course" | "Workshop" | "Conference" | "Seminar" | "Online Training" | "Other";
  duration: string;
  completionDate: string;
  skills: string[];
  impact: string;
  certificateUrl?: string;
}

interface AddDevelopmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (development: Development) => void;
  editingDevelopment?: Development;
}

export const AddDevelopmentModal = ({
  open,
  onOpenChange,
  onSave,
  editingDevelopment,
}: AddDevelopmentModalProps) => {
  const [formData, setFormData] = useState<Omit<Development, "id">>({
    title: editingDevelopment?.title || "",
    provider: editingDevelopment?.provider || "",
    type: editingDevelopment?.type || "Course",
    duration: editingDevelopment?.duration || "",
    completionDate: editingDevelopment?.completionDate || "",
    skills: editingDevelopment?.skills || [],
    impact: editingDevelopment?.impact || "",
    certificateUrl: editingDevelopment?.certificateUrl || "",
  });

  const handleSave = () => {
    if (!formData.title.trim() || !formData.provider.trim()) return;

    const newDevelopment: Development = {
      id: editingDevelopment?.id || Date.now().toString(),
      ...formData,
    };

    onSave(newDevelopment);
    onOpenChange(false);

    // Reset form if not editing
    if (!editingDevelopment) {
      setFormData({
        title: "",
        provider: "",
        type: "Course",
        duration: "",
        completionDate: "",
        skills: [],
        impact: "",
        certificateUrl: "",
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
            {editingDevelopment ? "Edit Professional Development" : "Add Professional Development"}
          </DialogTitle>
          <DialogDescription>
            {editingDevelopment
              ? "Update your professional development activity."
              : "Add courses, workshops, or training that enhanced your teaching practice."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Course/Workshop Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Advanced Mathematics Pedagogy"
                value={formData.title}
                onChange={(e) => updateField("title", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="provider">Provider/Institution *</Label>
              <Input
                id="provider"
                placeholder="e.g., Harvard Graduate School of Education"
                value={formData.provider}
                onChange={(e) => updateField("provider", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={formData.type} onValueChange={(value: Development["type"]) => updateField("type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Course">Course</SelectItem>
                  <SelectItem value="Workshop">Workshop</SelectItem>
                  <SelectItem value="Conference">Conference</SelectItem>
                  <SelectItem value="Seminar">Seminar</SelectItem>
                  <SelectItem value="Online Training">Online Training</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                placeholder="e.g., 40 hours, 2 weeks"
                value={formData.duration}
                onChange={(e) => updateField("duration", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="completionDate">Completion Date</Label>
              <DatePicker
                id="completionDate"
                value={
                  formData.completionDate ? new Date(formData.completionDate) : undefined
                }
                onValueChange={(date) => {
                  if (date) {
                    updateField("completionDate", date.toISOString().split("T")[0]);
                  }
                }}
                placeholder="Select completion date"
                max={new Date()}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="certificateUrl">Certificate URL (Optional)</Label>
              <Input
                id="certificateUrl"
                placeholder="e.g., https://certificates.harvard.edu/..."
                value={formData.certificateUrl}
                onChange={(e) => updateField("certificateUrl", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills">Skills Gained</Label>
            <Input
              id="skills"
              placeholder="e.g., Differentiated Instruction, Assessment Strategies (comma separated)"
              value={formData.skills.join(", ")}
              onChange={(e) =>
                updateField(
                  "skills",
                  e.target.value.split(",").map((s) => s.trim()).filter(s => s)
                )
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="impact">Impact on Teaching Practice</Label>
            <Textarea
              id="impact"
              placeholder="Describe how this professional development impacted your teaching methods, student outcomes, or classroom management..."
              value={formData.impact}
              onChange={(e) => updateField("impact", e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!formData.title.trim() || !formData.provider.trim()}
          >
            {editingDevelopment ? "Update" : "Add"} Development
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};