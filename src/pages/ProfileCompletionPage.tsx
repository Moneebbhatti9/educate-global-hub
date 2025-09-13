import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ProfileCompletion from "@/components/custom/ProfileCompletion";
import { UserRole } from "@/pages/SignUp";
import { useAuth } from "@/contexts/AuthContext";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { ProfileCompletionData } from "@/types/auth";
import { customToast } from "@/components/ui/sonner";
import { authDebug } from "@/utils/authDebug";

interface LocationState {
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
}

const ProfileCompletionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { completeProfile, logout } = useAuth();
  const { handleError, showSuccess } = useErrorHandler();
  const state = location.state as LocationState;

  // Check authentication state on component mount
  useEffect(() => {
    // Debug authentication state in development
    if (import.meta.env.DEV) {
      authDebug.checkProfileCompletionReadiness();
    }
  }, []);

  // Redirect if no state data (user came directly to this route)
  if (!state || !state.role) {
    navigate("/signup");
    return null;
  }

  const handleComplete = async (profileData: unknown) => {
    try {
      // Check authentication state before proceeding
      if (import.meta.env.DEV) {
        const isReady = authDebug.checkProfileCompletionReadiness();
        if (!isReady) {
          console.warn(
            "⚠️ User may not be properly authenticated for profile completion"
          );
        }
      }

      // Call the completeProfile function from AuthContext to update the user data
      await completeProfile(profileData as ProfileCompletionData);

      // Show success toast
      customToast.success(
        "Profile completed successfully!",
        "Welcome to Educate Global Hub. Please log in again to access your dashboard."
      );

      // Logout the user and redirect to login
      setTimeout(() => {

        // Redirect to login page
        navigate(`/dashboard/${state.role}`, {
          state: {
            message: "Profile completed successfully!",
            email: state.email,
            role: state.role,
          },
        });
      }, 1500);
    } catch (error) {
      handleError(error, "Profile completion failed");
      throw error;
    }
  };

  const handleBack = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProfileCompletion
          role={state.role}
          onComplete={handleComplete}
          onBack={handleBack}
          initialUserData={{
            firstName: state.firstName,
            lastName: state.lastName,
            email: state.email,
            role: state.role,
          }}
        />
      </main>

      <Footer />
    </div>
  );
};

export default ProfileCompletionPage;
