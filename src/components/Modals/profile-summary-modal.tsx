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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { FileText, AlertCircle } from "lucide-react";

interface ProfileSummaryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: {
    bio: string;
    professionalSummary: string;
    careerObjectives: string;
  }) => Promise<void>;
  initialData?: {
    bio?: string;
    professionalSummary?: string;
    careerObjectives?: string;
  };
  isLoading?: boolean;
  error?: string | null;
}

export const ProfileSummaryModal = ({
  open,
  onOpenChange,
  onSave,
  initialData,
  isLoading = false,
  error = null,
}: ProfileSummaryModalProps) => {
  const [formData, setFormData] = useState({
    bio: initialData?.bio || "",
    professionalSummary: initialData?.professionalSummary || "",
    careerObjectives: initialData?.careerObjectives || "",
  });

  const handleSave = async () => {
    try {
      await onSave(formData);
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getWordCount = (text: string) => {
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Edit Profile Summary
          </DialogTitle>
          <DialogDescription>
            Create a compelling profile summary that showcases your expertise
            and career goals.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700">
                <AlertCircle className="w-4 h-4 inline mr-2" />
                {error}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="bio">Professional Bio</Label>
            <Textarea
              id="bio"
              placeholder="Write a brief professional bio that highlights your background, expertise, and passion for education..."
              value={formData.bio}
              onChange={(e) => updateField("bio", e.target.value)}
              rows={4}
              className="resize-none"
              disabled={isLoading}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>A concise overview of your professional background</span>
              <span>{getWordCount(formData.bio)} words</span>
            </div>
          </div>

          {/* <div className="space-y-2">
            <Label htmlFor="professionalSummary">Professional Summary</Label>
            <Textarea
              id="professionalSummary"
              placeholder="Provide a detailed summary of your professional experience, key achievements, teaching philosophy, and what makes you unique as an educator..."
              value={formData.professionalSummary}
              onChange={(e) => updateField('professionalSummary', e.target.value)}
              rows={6}
              className="resize-none"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Detailed overview of your experience and achievements</span>
              <span>{getWordCount(formData.professionalSummary)} words</span>
            </div>
          </div> */}

          {/* <div className="space-y-2">
            <Label htmlFor="careerObjectives">Career Objectives</Label>
            <Textarea
              id="careerObjectives"
              placeholder="Describe your career goals, the type of teaching position you're seeking, your preferred work environment, and how you plan to contribute to student success..."
              value={formData.careerObjectives}
              onChange={(e) => updateField('careerObjectives', e.target.value)}
              rows={4}
              className="resize-none"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Your career aspirations and teaching goals</span>
              <span>{getWordCount(formData.careerObjectives)} words</span>
            </div>
          </div> */}

          <div className="p-4 bg-muted/30 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">
              Tips for a Great Profile Summary:
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Keep your bio concise (50-100 words) and engaging</li>
              <li>
                • Include specific achievements and quantifiable results in your
                summary
              </li>
              <li>• Be specific about your teaching philosophy and methods</li>
              <li>
                • Mention your preferred grade levels, subjects, and school
                types
              </li>
              <li>• Use action words and avoid jargon</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Summary"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
