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
import { Users } from "lucide-react";

interface Referee {
  id: string;
  name: string;
  position: string;
  organization: string;
  email: string;
  phone: string;
  relationship: string;
  yearsKnown: number;
  notes?: string;
}

interface AddRefereeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (referee: Referee) => void;
  editingReferee?: Referee;
}

export const AddRefereeModal = ({
  open,
  onOpenChange,
  onSave,
  editingReferee,
}: AddRefereeModalProps) => {
  const [formData, setFormData] = useState<Omit<Referee, 'id'>>({
    name: editingReferee?.name || "",
    position: editingReferee?.position || "",
    organization: editingReferee?.organization || "",
    email: editingReferee?.email || "",
    phone: editingReferee?.phone || "",
    relationship: editingReferee?.relationship || "",
    yearsKnown: editingReferee?.yearsKnown || 1,
    notes: editingReferee?.notes || "",
  });

  const handleSave = () => {
    if (!formData.name.trim() || !formData.email.trim()) return;

    const newReferee: Referee = {
      id: editingReferee?.id || Date.now().toString(),
      ...formData,
    };

    onSave(newReferee);
    onOpenChange(false);
    
    // Reset form if not editing
    if (!editingReferee) {
      setFormData({
        name: "",
        position: "",
        organization: "",
        email: "",
        phone: "",
        relationship: "",
        yearsKnown: 1,
        notes: "",
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
            <Users className="w-5 h-5" />
            {editingReferee ? "Edit Referee" : "Add Professional Referee"}
          </DialogTitle>
          <DialogDescription>
            {editingReferee 
              ? "Update your professional reference details."
              : "Add a professional reference who can vouch for your work and character."
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Dr. John Smith"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="position">Position/Title</Label>
              <Input
                id="position"
                placeholder="e.g., Principal, Head of Department"
                value={formData.position}
                onChange={(e) => updateField('position', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="organization">Organization/School</Label>
            <Input
              id="organization"
              placeholder="e.g., Lincoln High School"
              value={formData.organization}
              onChange={(e) => updateField('organization', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="e.g., john.smith@school.edu"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="e.g., +1 (555) 123-4567"
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="relationship">Professional Relationship</Label>
              <Select value={formData.relationship} onValueChange={(value) => updateField('relationship', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="supervisor">Direct Supervisor</SelectItem>
                  <SelectItem value="colleague">Colleague</SelectItem>
                  <SelectItem value="principal">Principal/Head Teacher</SelectItem>
                  <SelectItem value="mentor">Mentor</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="yearsKnown">Years Known</Label>
              <Input
                id="yearsKnown"
                type="number"
                min="1"
                max="50"
                value={formData.yearsKnown}
                onChange={(e) => updateField('yearsKnown', parseInt(e.target.value) || 1)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional context about your professional relationship..."
              value={formData.notes}
              onChange={(e) => updateField('notes', e.target.value)}
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
            disabled={!formData.name.trim() || !formData.email.trim()}
          >
            {editingReferee ? "Update" : "Add"} Referee
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};