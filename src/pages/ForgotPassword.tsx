import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  ArrowRight,
  Mail,
  Shield,
  KeyRound,
  CheckCircle,
} from "lucide-react";
import OTPVerification from "@/components/custom/OTPVerification";
import { customToast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import {
  passwordResetSchema,
  passwordResetConfirmSchema,
} from "@/helpers/validation";
import { useFormValidation } from "@/hooks/useFormValidation";

interface EmailFormData {
  email: string;
}

interface PasswordResetFormData {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

const ForgotPassword = () => {
  const navigate = useNavigate();

  const { handleError, showSuccess } = useErrorHandler();
  const { passwordReset, passwordResetConfirm, isLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState<"email" | "otp" | "reset">(
    "email"
  );
  const [emailForOTP, setEmailForOTP] = useState("");

  const emailForm = useFormValidation<{ email?: string }>({
    schema: passwordResetSchema,
    mode: "onTouched",
    defaultValues: {
      email: "",
    },
  });

  const passwordForm = useFormValidation<{
    email?: string;
    otp?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({
    schema: passwordResetConfirmSchema,
    mode: "onTouched",
    defaultValues: {
      email: "",
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleEmailSubmit = async (data: EmailFormData) => {
    try {
      await passwordReset({ email: data.email });
      setEmailForOTP(data.email);
      setCurrentStep("otp");
      showSuccess("OTP Sent", "Check your email for the verification code.");
    } catch (error) {
      handleError(error, "Failed to send OTP");
    }
  };

  const handleOTPVerify = async (otp: string) => {
    try {
      await passwordResetConfirm({
        email: emailForOTP,
        otp,
        newPassword: passwordForm.getValues("newPassword") ?? "",
        confirmPassword: passwordForm.getValues("confirmPassword") ?? "",
      });
      setCurrentStep("reset");
    } catch (error) {
      handleError(error, "OTP verification failed");
      throw error;
    }
  };

  const handlePasswordReset = async (data: PasswordResetFormData) => {
    try {
      await passwordResetConfirm({
        email: emailForOTP,
        otp: "", // This should be handled by OTP step
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });

      showSuccess(
        "Password Updated",
        "Your password has been successfully updated."
      );

      // Redirect to sign in
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      handleError(error, "Password update failed");
    }
  };

  const passwordFormData = passwordForm.watch();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md mx-auto">
          {/* Step 1: Email Input */}
          {currentStep === "email" && (
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
                  Enter your email address and we'll send you a verification
                  code to reset your password.
                </p>
              </div>

              {/* Email Form */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="font-heading text-xl text-center">
                    Enter Your Email
                  </CardTitle>
                  <CardDescription className="text-center">
                    We'll send you a verification code
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={emailForm.handleSubmit((data) =>
                      handleEmailSubmit({
                        email: data.email ?? "",
                      })
                    )}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          className={`pl-10 ${
                            emailForm.formState.errors.email
                              ? "border-destructive"
                              : ""
                          }`}
                          {...emailForm.register("email")}
                        />
                      </div>
                      {emailForm.getFieldError("email") && (
                        <p className="text-sm text-destructive">
                          {emailForm.getFieldError("email")}
                        </p>
                      )}
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
                      to="/login"
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
          {currentStep === "otp" && (
            <div>
              <OTPVerification onVerify={handleOTPVerify} />
              <div className="mt-6 text-center">
                <button
                  onClick={() => setCurrentStep("email")}
                  className="inline-flex items-center text-sm text-brand-primary hover:underline"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Change Email Address
                </button>
              </div>
            </div>
          )}

          {/* Step 3: New Password */}
          {currentStep === "reset" && (
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
                  <CardTitle className="font-heading text-xl text-center">
                    Set New Password
                  </CardTitle>
                  <CardDescription className="text-center">
                    Make sure it's at least 8 characters long
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={passwordForm.handleSubmit((data) =>
                      handlePasswordReset(data as PasswordResetFormData)
                    )}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="Enter new password"
                        className={`${
                          passwordForm.formState.errors.newPassword
                            ? "border-destructive"
                            : ""
                        }`}
                        {...passwordForm.register("newPassword")}
                        minLength={8}
                      />
                      {passwordForm.getFieldError("newPassword") && (
                        <p className="text-sm text-destructive">
                          {passwordForm.getFieldError("newPassword")}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm new password"
                        className={`${
                          passwordForm.formState.errors.confirmPassword
                            ? "border-destructive"
                            : ""
                        }`}
                        {...passwordForm.register("confirmPassword")}
                        minLength={8}
                      />
                      {passwordForm.getFieldError("confirmPassword") && (
                        <p className="text-sm text-destructive">
                          {passwordForm.getFieldError("confirmPassword")}
                        </p>
                      )}
                    </div>

                    {/* Password Requirements */}
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p className="font-medium">Password requirements:</p>
                      <ul className="space-y-1">
                        <li className="flex items-center">
                          <CheckCircle
                            className={`w-3 h-3 mr-2 ${
                              passwordFormData.newPassword &&
                              passwordFormData.newPassword.length >= 8
                                ? "text-brand-accent-green"
                                : "text-muted"
                            }`}
                          />
                          At least 8 characters long
                        </li>
                        <li className="flex items-center">
                          <CheckCircle
                            className={`w-3 h-3 mr-2 ${
                              passwordFormData.newPassword ===
                                passwordFormData.confirmPassword &&
                              (passwordFormData.newPassword?.length ?? 0) > 0
                                ? "text-brand-accent-green"
                                : "text-muted"
                            }`}
                          />
                          Passwords match
                        </li>
                      </ul>
                    </div>

                    <Button
                      type="submit"
                      variant="hero"
                      size="lg"
                      className="w-full"
                      disabled={
                        isLoading ||
                        !passwordFormData.newPassword ||
                        passwordFormData.newPassword.length < 8 ||
                        passwordFormData.newPassword !==
                          passwordFormData.confirmPassword
                      }
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
