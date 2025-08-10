import { useLocation, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import OTPVerification from "@/components/custom/OTPVerification";
import { UserRole } from "@/pages/SignUp";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useErrorHandler } from "@/hooks/useErrorHandler";

interface LocationState {
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
}

const OTPVerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOTP, sendOTP } = useAuth();
  const { toast } = useToast();
  const { handleError, showSuccess } = useErrorHandler();
  const state = location.state as LocationState;

  // Redirect if no state data (user came directly to this route)
  if (!state?.email) {
    navigate("/signup");
    return null;
  }

  const handleVerify = async (otp: string) => {
    try {
      await verifyOTP({
        email: state.email,
        otp,
      });

      // Show success toast
      showSuccess(
        "Email verified successfully!",
        "Your account has been verified. Please complete your profile."
      );

      // Add a small delay to allow toast to be visible before navigation
      setTimeout(() => {
        // Navigate to profile completion with state
        navigate("/profile-completion", {
          state: {
            email: state.email,
            role: state.role,
            firstName: state.firstName,
            lastName: state.lastName,
          },
        });
      }, 1500);
    } catch (error) {
      handleError(error, "Verification failed");
      throw error;
    }
  };

  const handleResendOTP = async () => {
    try {
      await sendOTP(state.email);
      showSuccess(
        "OTP sent",
        "A new verification code has been sent to your email."
      );
    } catch (error) {
      handleError(error, "Failed to send OTP");
      throw error;
    }
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
          onResend={handleResendOTP}
          onBack={handleBack}
          email={state.email}
        />
      </main>

      <Footer />
    </div>
  );
};

export default OTPVerificationPage;
