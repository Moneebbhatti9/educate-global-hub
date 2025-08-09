import { useLocation, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import OTPVerification from "@/components/custom/OTPVerification";
import { UserRole } from "@/pages/SignUp";

interface LocationState {
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
}

const OTPVerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  // Redirect if no state data (user came directly to this route)
  if (!state?.email) {
    navigate("/register");
    return null;
  }

  const handleVerify = () => {
    // Navigate to profile completion with user data
    navigate("/profile-completion", {
      state: {
        email: state.email,
        role: state.role,
        firstName: state.firstName,
        lastName: state.lastName,
      },
    });
  };

  const handleBack = () => {
    navigate("/register");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <OTPVerification
          onVerify={handleVerify}
          onBack={handleBack}
          email={state.email}
        />
      </main>

      <Footer />
    </div>
  );
};

export default OTPVerificationPage;
