import { useState } from "react";
import { UserRole } from "@/pages/SignUp";
import TeacherProfileForm from "./TeacherProfileForm";
import SchoolProfileForm from "./SchoolProfileForm";
import { TeacherProfileRequest } from "@/types/profiles";
import { SchoolProfileRequest } from "@/types/profiles";

interface ProfileCompletionProps {
  role: UserRole;
  onComplete: (profileData: unknown) => void;
  onBack?: () => void;
  useNewForms?: boolean; // Flag to enable new forms
  initialUserData?: {
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
  };
}

const ProfileCompletion = ({
  role,
  onComplete,
  onBack,
  useNewForms = true, // Default to new forms
  initialUserData,
}: ProfileCompletionProps) => {
  const [isNewFormEnabled] = useState(useNewForms);

  // Handle teacher profile completion
  const handleTeacherComplete = (profileData: TeacherProfileRequest) => {
    onComplete(profileData);
  };

  // Handle school profile completion
  const handleSchoolComplete = (profileData: SchoolProfileRequest) => {
    onComplete(profileData);
  };

  // Render new forms for teacher and school roles
  if (isNewFormEnabled && (role === "teacher" || role === "school")) {
    if (role === "teacher") {
      return (
        <TeacherProfileForm
          onComplete={handleTeacherComplete}
          onBack={onBack}
          initialData={{
            fullName: initialUserData ? `${initialUserData.firstName} ${initialUserData.lastName}` : "",
            // Pre-fill email-related fields if available
            // Add other fields that can be intelligently pre-filled
            // For example, if you have location data from signup, you could pre-fill country/city
          }}
        />
      );
    }

    if (role === "school") {
      return (
        <SchoolProfileForm 
          onComplete={handleSchoolComplete} 
          onBack={onBack}
          initialData={{
            schoolEmail: initialUserData?.email || "",
            // Pre-fill school name if it can be derived from user data
            schoolName: initialUserData ? `${initialUserData.firstName} ${initialUserData.lastName}'s School` : "",
            // Add other fields that can be intelligently pre-filled
            // For example, if you have location data from signup, you could pre-fill country/city
          }}
        />
      );
    }
  }

  // For other roles, show a placeholder
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Profile Completion</h3>
        <p className="text-muted-foreground">
          Profile completion for {role} role is not yet implemented.
        </p>
      </div>
    </div>
  );
};

export default ProfileCompletion;
