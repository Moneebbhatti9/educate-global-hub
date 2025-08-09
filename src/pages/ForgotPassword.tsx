import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, Mail, Shield, KeyRound, CheckCircle } from "lucide-react";
import OTPVerification from "@/components/signup/OTPVerification";
import { useToast } from "@/hooks/use-toast";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<'email' | 'otp' | 'reset'>('email');
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate sending OTP
    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep('otp');
      toast({
        title: "OTP Sent",
        description: "Check your email for the verification code.",
      });
    }, 2000);
  };

  const handleOTPVerify = () => {
    setCurrentStep('reset');
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure both password fields match.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate password reset
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Password Updated",
        description: "Your password has been successfully updated.",
      });
      
      // Redirect to sign in
      setTimeout(() => {
        navigate('/signin');
      }, 1500);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md mx-auto">
          {/* Step 1: Email Input */}
          {currentStep === 'email' && (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-hero flex items-center justify-center">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
                  Reset Your Password
                </h1>
                <p className="text-muted-foreground">
                  Enter your email address and we'll send you a verification code to reset your password.
                </p>
              </div>

              {/* Email Form */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="font-heading text-xl text-center">Enter Your Email</CardTitle>
                  <CardDescription className="text-center">
                    We'll send you a verification code
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleEmailSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      variant="hero"
                      size="lg"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Sending Code...
                        </>
                      ) : (
                        <>
                          Send Verification Code
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>

                  <div className="mt-6 text-center">
                    <Link
                      to="/signin"
                      className="inline-flex items-center text-sm text-brand-primary hover:underline"
                    >
                      <ArrowLeft className="w-4 h-4 mr-1" />
                      Back to Sign In
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Step 2: OTP Verification */}
          {currentStep === 'otp' && (
            <div>
              <OTPVerification onVerify={handleOTPVerify} />
              <div className="mt-6 text-center">
                <button
                  onClick={() => setCurrentStep('email')}
                  className="inline-flex items-center text-sm text-brand-primary hover:underline"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Change Email Address
                </button>
              </div>
            </div>
          )}

          {/* Step 3: New Password */}
          {currentStep === 'reset' && (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-hero flex items-center justify-center">
                    <KeyRound className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
                  Create New Password
                </h1>
                <p className="text-muted-foreground">
                  Choose a strong password to secure your account.
                </p>
              </div>

              {/* Password Form */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="font-heading text-xl text-center">Set New Password</CardTitle>
                  <CardDescription className="text-center">
                    Make sure it's at least 8 characters long
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordReset} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        minLength={8}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        minLength={8}
                        required
                      />
                    </div>

                    {/* Password Requirements */}
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p className="font-medium">Password requirements:</p>
                      <ul className="space-y-1">
                        <li className="flex items-center">
                          <CheckCircle className={`w-3 h-3 mr-2 ${newPassword.length >= 8 ? 'text-brand-accent-green' : 'text-muted'}`} />
                          At least 8 characters long
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className={`w-3 h-3 mr-2 ${newPassword === confirmPassword && newPassword.length > 0 ? 'text-brand-accent-green' : 'text-muted'}`} />
                          Passwords match
                        </li>
                      </ul>
                    </div>

                    <Button
                      type="submit"
                      variant="hero"
                      size="lg"
                      className="w-full"
                      disabled={isLoading || newPassword.length < 8 || newPassword !== confirmPassword}
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Updating Password...
                        </>
                      ) : (
                        <>
                          Update Password
                          <CheckCircle className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ForgotPassword;