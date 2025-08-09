import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import RoleSelection from "@/components/signup/RoleSelection";
import OTPVerification from "@/components/signup/OTPVerification";
import ProfileCompletion from "@/components/signup/ProfileCompletion";

export type UserRole = "teacher" | "school" | "recruiter" | "supplier";

const SignUpFlow = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<'role' | 'otp' | 'profile'>('role');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setCurrentStep('otp');
  };

  const handleOTPVerify = () => {
    setCurrentStep('profile');
  };

  const handleProfileComplete = () => {
    // Redirect to appropriate dashboard based on role
    if (selectedRole) {
      navigate(`/dashboard/${selectedRole}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {currentStep === 'role' && (
          <RoleSelection onRoleSelect={handleRoleSelect} />
        )}
        
        {currentStep === 'otp' && (
          <OTPVerification onVerify={handleOTPVerify} />
        )}
        
        {currentStep === 'profile' && selectedRole && (
          <ProfileCompletion 
            role={selectedRole} 
            onComplete={handleProfileComplete} 
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default SignUpFlow;