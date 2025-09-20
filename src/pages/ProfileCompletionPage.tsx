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

  // Don't render if no state data
  if (!state || !state.role) {
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
        "Welcome to Educate Global Hub. Please sign in to access your dashboard."
      );

      // Handle different flows based on user role
      setTimeout(() => {
        if (import.meta.env.DEV) {
          console.log("🎯 Profile completion - User role:", state.role);
        }

        if (state.role === "school") {
          // For school users, logout first then redirect to school approval page
          if (import.meta.env.DEV) {
            console.log(
              "🏫 School user profile completed - logging out first, then redirecting to school approval"
            );
          }
          // Logout first (skip navigation), then redirect
          logout(true).then(() => {
            navigate("/school-approval", {
              state: {
                message: "Profile completed successfully!",
                email: state.email,
                role: state.role,
                firstName: state.firstName,
                lastName: state.lastName,
              },
            });
          });
        } else if (state.role === "teacher") {
          // For teacher users, logout first then redirect to login
          if (import.meta.env.DEV) {
            console.log(
              "👨‍🏫 Teacher user profile completed - logging out first, then redirecting to login"
            );
          }
          // Logout first (skip navigation), then redirect
          logout(true).then(() => {
            navigate("/login", {
              state: {
                message: "Profile completed successfully!",
                email: state.email,
                role: state.role,
              },
            });
          });
        } else {
          // For other users, logout first then redirect to login
          if (import.meta.env.DEV) {
            console.log(
              "👤 Logging out non-school/teacher user first, then redirecting to login page"
            );
          }
          // Logout first (skip navigation), then redirect
          logout(true).then(() => {
            navigate("/login", {
              state: {
                message: "Profile completed successfully!",
                email: state.email,
                role: state.role,
              },
            });
          });
        }
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
