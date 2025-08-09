import { useLocation, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ProfileCompletion from "@/components/custom/ProfileCompletion";
import { UserRole } from "@/pages/SignUp";

interface LocationState {
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
}

const ProfileCompletionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  // Redirect if no state data (user came directly to this route)
  if (!state?.role) {
    navigate("/register");
    return null;
  }

  const handleComplete = () => {
    // Redirect to appropriate dashboard based on role
    navigate(`/dashboard/${state.role}`);
  };

  const handleBack = () => {
    navigate("/otp-verification", {
      state: {
        email: state.email,
        role: state.role,
        firstName: state.firstName,
        lastName: state.lastName,
      },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProfileCompletion
          role={state.role}
          onComplete={handleComplete}
          onBack={handleBack}
        />
      </main>

      <Footer />
    </div>
  );
};

export default ProfileCompletionPage;
