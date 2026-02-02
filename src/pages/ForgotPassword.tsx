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
  KeyRound,
  CheckCircle,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import OTPVerification from "@/components/custom/OTPVerification";
import { customToast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { passwordResetSchema } from "@/helpers/validation";
import { useFormValidation } from "@/hooks/useFormValidation";
import { z } from "zod";

interface EmailFormData {
  email: string;
}

interface PasswordResetFormData {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

// Simple password validation schema for the reset form
const passwordOnlySchema = z
  .object({
    newPassword: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const ForgotPassword = () => {
  const navigate = useNavigate();

  const { handleError, showSuccess } = useErrorHandler();
  const { sendOTP, passwordResetConfirm } = useAuth();
  const [currentStep, setCurrentStep] = useState<"email" | "otp" | "reset">(
    "email"
  );
  const [emailForOTP, setEmailForOTP] = useState("");
  const [verifiedOTP, setVerifiedOTP] = useState("");

  // Loading states
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  // Password visibility states
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const emailForm = useFormValidation<{ email?: string }>({
    schema: passwordResetSchema,
    mode: "onTouched",
    defaultValues: {
      email: "",
    },
  });

  const passwordForm = useFormValidation<{
    newPassword?: string;
    confirmPassword?: string;
  }>({
    schema: passwordOnlySchema,
    mode: "onTouched",
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleEmailSubmit = async (data: EmailFormData) => {
    setIsSendingOTP(true);
    try {
      // Send OTP with type "reset" for password reset flow
      await sendOTP(data.email, "reset");
      setEmailForOTP(data.email);
      setCurrentStep("otp");
      showSuccess("OTP Sent", "Check your email for the verification code.");
    } catch (error) {
      handleError(error, "Failed to send OTP");
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleOTPVerify = async (otp: string) => {
    // For password reset flow, we don't call verifyOTP here
    // because passwordResetConfirm will verify the OTP
    // Calling verifyOTP here would mark the OTP as used,
    // causing passwordResetConfirm to fail

    // Just validate the OTP format (6 digits)
    if (!/^\d{6}$/.test(otp)) {
      customToast.error("Invalid OTP", "Please enter a valid 6-digit code.");
      throw new Error("Invalid OTP format");
    }

    // Store the OTP for password reset
    setVerifiedOTP(otp);
    setCurrentStep("reset");
    showSuccess("OTP Received", "Please enter your new password.");
  };

  const handlePasswordReset = async (data: PasswordResetFormData) => {
    setIsResettingPassword(true);
    try {
      // Call the API with the stored OTP and new password
      await passwordResetConfirm({
        email: emailForOTP,
        otp: verifiedOTP,
        newPassword: data.newPassword,
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
    } finally {
      setIsResettingPassword(false);
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
                          disabled={isSendingOTP}
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
                      disabled={isSendingOTP}
                    >
                      {isSendingOTP ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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
              <OTPVerification
                onVerify={handleOTPVerify}
                onResend={async () => {
                  try {
                    await sendOTP(emailForOTP, "reset");
                    showSuccess(
                      "OTP Sent",
                      "A new verification code has been sent to your email."
                    );
                  } catch (error) {
                    handleError(error, "Failed to resend OTP");
                  }
                }}
                email={emailForOTP}
              />
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
                      <div className="relative flex items-center">
                        <Input
                          id="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Enter new password"
                          className={`pr-10 ${
                            passwordForm.formState.errors.newPassword
                              ? "border-destructive"
                              : ""
                          }`}
                          {...passwordForm.register("newPassword")}
                          disabled={isResettingPassword}
                        />
                        <button
                          type="button"
                          className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          tabIndex={-1}
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {passwordForm.getFieldError("newPassword") && (
                        <p className="text-sm text-destructive">
                          {passwordForm.getFieldError("newPassword")}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative flex items-center">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm new password"
                          className={`pr-10 ${
                            passwordForm.formState.errors.confirmPassword
                              ? "border-destructive"
                              : ""
                          }`}
                          {...passwordForm.register("confirmPassword")}
                          disabled={isResettingPassword}
                        />
                        <button
                          type="button"
                          className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          tabIndex={-1}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
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
                        isResettingPassword ||
                        !passwordFormData.newPassword ||
                        passwordFormData.newPassword.length < 8 ||
                        passwordFormData.newPassword !==
                          passwordFormData.confirmPassword
                      }
                    >
                      {isResettingPassword ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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
