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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Languages } from "lucide-react";

interface Language {
  id: string;
  language: string;
  proficiency: "Native" | "Fluent" | "Advanced" | "Intermediate" | "Beginner";
}

interface AddLanguageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (language: Language) => void;
  editingLanguage?: Language;
}

export const AddLanguageModal = ({
  open,
  onOpenChange,
  onSave,
  editingLanguage,
}: AddLanguageModalProps) => {
  const [language, setLanguage] = useState(editingLanguage?.language || "");
  const [proficiency, setProficiency] = useState<Language["proficiency"]>(
    editingLanguage?.proficiency || "Beginner"
  );

  const handleSave = () => {
    if (!language.trim()) return;

    const newLanguage: Language = {
      id: editingLanguage?.id || Date.now().toString(),
      language: language.trim(),
      proficiency,
    };

    onSave(newLanguage);
    onOpenChange(false);
    
    // Reset form if not editing
    if (!editingLanguage) {
      setLanguage("");
      setProficiency("Beginner");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Languages className="w-5 h-5" />
            {editingLanguage ? "Edit Language" : "Add Language"}
          </DialogTitle>
          <DialogDescription>
            {editingLanguage 
              ? "Update your language proficiency details."
              : "Add a new language and specify your proficiency level."
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="language">Language *</Label>
            <Input
              id="language"
              placeholder="e.g., English, Spanish, French"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="proficiency">Proficiency Level *</Label>
            <Select value={proficiency} onValueChange={(value: Language["proficiency"]) => setProficiency(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select proficiency level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Native">Native</SelectItem>
                <SelectItem value="Fluent">Fluent</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Beginner">Beginner</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!language.trim()}>
            {editingLanguage ? "Update" : "Add"} Language
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};