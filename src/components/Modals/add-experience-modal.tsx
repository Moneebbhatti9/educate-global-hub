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

interface Experience {
  id: string;
  title: string;
  employer: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  responsibilities: string;
  contactPerson?: string;
}

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
  const [formData, setFormData] = useState<Omit<Experience, 'id'>>({
    title: editingExperience?.title || "",
    employer: editingExperience?.employer || "",
    location: editingExperience?.location || "",
    startDate: editingExperience?.startDate || "",
    endDate: editingExperience?.endDate || "",
    current: editingExperience?.current || false,
    responsibilities: editingExperience?.responsibilities || "",
    contactPerson: editingExperience?.contactPerson || "",
  });

  const handleSave = () => {
    if (!formData.title.trim() || !formData.employer.trim()) return;

    const newExperience: Experience = {
      id: editingExperience?.id || Date.now().toString(),
      ...formData,
    };

    onSave(newExperience);
    onOpenChange(false);
    
    // Reset form if not editing
    if (!editingExperience) {
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
    }
  };

  const updateField = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
              : "Add your employment or teaching experience."
            }
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
                onChange={(e) => updateField('title', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="employer">Employer/School *</Label>
              <Input
                id="employer"
                placeholder="e.g., Lincoln High School"
                value={formData.employer}
                onChange={(e) => updateField('employer', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="e.g., Boston, MA, USA"
              value={formData.location}
              onChange={(e) => updateField('location', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => updateField('startDate', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => updateField('endDate', e.target.value)}
                disabled={formData.current}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="current"
              checked={formData.current}
              onCheckedChange={(checked) => updateField('current', checked)}
            />
            <Label htmlFor="current">I currently work here</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsibilities">Key Responsibilities</Label>
            <Textarea
              id="responsibilities"
              placeholder="Describe your key responsibilities and achievements..."
              value={formData.responsibilities}
              onChange={(e) => updateField('responsibilities', e.target.value)}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactPerson">Contact Person</Label>
            <Input
              id="contactPerson"
              placeholder="e.g., John Smith - Principal"
              value={formData.contactPerson}
              onChange={(e) => updateField('contactPerson', e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!formData.title.trim() || !formData.employer.trim()}
          >
            {editingExperience ? "Update" : "Add"} Experience
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};