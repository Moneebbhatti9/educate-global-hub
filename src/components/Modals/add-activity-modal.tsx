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
import { Trophy } from "lucide-react";

interface Activity {
  id: string;
  name: string;
  type: "Club" | "Sport" | "Community Service" | "Leadership" | "Hobby" | "Volunteer Work" | "Other";
  role: string;
  organization?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
  skillsDeveloped: string[];
  timeCommitment: string;
}

interface AddActivityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (activity: Activity) => void;
  editingActivity?: Activity;
}

export const AddActivityModal = ({
  open,
  onOpenChange,
  onSave,
  editingActivity,
}: AddActivityModalProps) => {
  const [formData, setFormData] = useState<Omit<Activity, "id">>({
    name: editingActivity?.name || "",
    type: editingActivity?.type || "Club",
    role: editingActivity?.role || "",
    organization: editingActivity?.organization || "",
    startDate: editingActivity?.startDate || "",
    endDate: editingActivity?.endDate || "",
    current: editingActivity?.current || false,
    description: editingActivity?.description || "",
    achievements: editingActivity?.achievements || [],
    skillsDeveloped: editingActivity?.skillsDeveloped || [],
    timeCommitment: editingActivity?.timeCommitment || "",
  });

  const handleSave = () => {
    if (!formData.name.trim() || !formData.role.trim()) return;

    const newActivity: Activity = {
      id: editingActivity?.id || Date.now().toString(),
      ...formData,
    };

    onSave(newActivity);
    onOpenChange(false);

    // Reset form if not editing
    if (!editingActivity) {
      setFormData({
        name: "",
        type: "Club",
        role: "",
        organization: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
        achievements: [],
        skillsDeveloped: [],
        timeCommitment: "",
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
            <Trophy className="w-5 h-5" />
            {editingActivity ? "Edit Extracurricular Activity" : "Add Extracurricular Activity"}
          </DialogTitle>
          <DialogDescription>
            {editingActivity
              ? "Update your extracurricular activity details."
              : "Add clubs, sports, community activities, awards, or leadership roles."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Activity Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Drama Club, Basketball Team"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Activity Type</Label>
              <Select value={formData.type} onValueChange={(value: Activity["type"]) => updateField("type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select activity type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Club">Club</SelectItem>
                  <SelectItem value="Sport">Sport</SelectItem>
                  <SelectItem value="Community Service">Community Service</SelectItem>
                  <SelectItem value="Leadership">Leadership</SelectItem>
                  <SelectItem value="Hobby">Hobby</SelectItem>
                  <SelectItem value="Volunteer Work">Volunteer Work</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Your Role *</Label>
              <Input
                id="role"
                placeholder="e.g., President, Team Captain, Member"
                value={formData.role}
                onChange={(e) => updateField("role", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="organization">Organization (Optional)</Label>
              <Input
                id="organization"
                placeholder="e.g., Local Community Center"
                value={formData.organization}
                onChange={(e) => updateField("organization", e.target.value)}
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
                  formData.endDate && !formData.current
                    ? new Date(formData.endDate)
                    : undefined
                }
                onValueChange={(date) => {
                  if (date) {
                    updateField("endDate", date.toISOString().split("T")[0]);
                  }
                }}
                placeholder="Select end date"
                disabled={formData.current}
                min={
                  formData.startDate ? new Date(formData.startDate) : undefined
                }
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="current"
              checked={formData.current}
              onChange={(e) => {
                updateField("current", e.target.checked);
                if (e.target.checked) {
                  updateField("endDate", "");
                }
              }}
              className="rounded border-gray-300"
            />
            <Label htmlFor="current">Currently participating</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeCommitment">Time Commitment</Label>
            <Input
              id="timeCommitment"
              placeholder="e.g., 5 hours/week, Weekends"
              value={formData.timeCommitment}
              onChange={(e) => updateField("timeCommitment", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe your activities, responsibilities, and contributions..."
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="achievements">Achievements & Awards</Label>
            <Input
              id="achievements"
              placeholder="e.g., First Place Regional Championship, Leadership Award (comma separated)"
              value={formData.achievements.join(", ")}
              onChange={(e) =>
                updateField(
                  "achievements",
                  e.target.value.split(",").map((s) => s.trim()).filter(s => s)
                )
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="skillsDeveloped">Skills Developed</Label>
            <Input
              id="skillsDeveloped"
              placeholder="e.g., Leadership, Teamwork, Public Speaking (comma separated)"
              value={formData.skillsDeveloped.join(", ")}
              onChange={(e) =>
                updateField(
                  "skillsDeveloped",
                  e.target.value.split(",").map((s) => s.trim()).filter(s => s)
                )
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!formData.name.trim() || !formData.role.trim() || !formData.description.trim()}
          >
            {editingActivity ? "Update" : "Add"} Activity
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};