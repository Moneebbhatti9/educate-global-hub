import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert"; // Used for Security Tip
import { Progress } from "@/components/ui/progress";
import {
  KeyRound,
  Eye,
  EyeOff,
  Loader2,
  Check,
  X,
  ShieldAlert,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { changePasswordSchema } from "@/helpers/validation";
import { useUserSettings } from "@/apis/userSettings";
import { customToast } from "@/components/ui/sonner";

type PasswordFormData = z.infer<typeof changePasswordSchema>;

interface PasswordRequirement {
  label: string;
  validator: (password: string) => boolean;
}

const passwordRequirements: PasswordRequirement[] = [
  {
    label: "At least 8 characters",
    validator: (password) => password.length >= 8,
  },
  {
    label: "One uppercase letter",
    validator: (password) => /[A-Z]/.test(password),
  },
  {
    label: "One lowercase letter",
    validator: (password) => /[a-z]/.test(password),
  },
  {
    label: "One number",
    validator: (password) => /[0-9]/.test(password),
  },
  {
    label: "One special character (!@#$%^&*)",
    validator: (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
  },
];

const ChangePasswordForm = () => {
  const { changePassword } = useUserSettings();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = passwordForm.watch("newPassword");
  const confirmPassword = passwordForm.watch("confirmPassword");

  // Calculate password strength
  const passwordStrength = useMemo(() => {
    if (!newPassword) return 0;
    const metRequirements = passwordRequirements.filter((req) =>
      req.validator(newPassword)
    ).length;
    return (metRequirements / passwordRequirements.length) * 100;
  }, [newPassword]);

  // Get strength label and color
  const getStrengthInfo = (strength: number) => {
    if (strength === 0) return { label: "", color: "bg-muted" };
    if (strength <= 20) return { label: "Very Weak", color: "bg-red-500" };
    if (strength <= 40) return { label: "Weak", color: "bg-orange-500" };
    if (strength <= 60) return { label: "Fair", color: "bg-yellow-500" };
    if (strength <= 80) return { label: "Good", color: "bg-blue-500" };
    return { label: "Strong", color: "bg-green-500" };
  };

  const strengthInfo = getStrengthInfo(passwordStrength);

  // Check if passwords match
  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;
  const passwordsMismatch = newPassword && confirmPassword && newPassword !== confirmPassword;

  // Handle password change
  const handlePasswordChange = async (data: PasswordFormData) => {
    try {
      const result = await changePassword.mutateAsync(data);
      if (result.success) {
        customToast.success(
          "Password Updated",
          "Your password has been changed successfully."
        );
        passwordForm.reset();
      }
    } catch (error: any) {
      // Error is transformed by errorHandler to AppError with: message, code, status, details
      // error.message contains the extracted error message
      // error.details contains field-level errors if any
      const errorMessage = error?.message || "Failed to change password. Please try again.";

      // Check if there are field-level errors in details
      let errorDetails = "";
      if (error?.details?.general) {
        errorDetails = error.details.general.join(", ");
      }

      customToast.error("Password Change Failed", errorDetails || errorMessage);
      console.error("Password change error:", error);
    }
  };

  const isLoading = changePassword.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <KeyRound className="w-5 h-5 mr-2" />
          Change Password
        </CardTitle>
        <CardDescription>
          Update your password to keep your account secure. Choose a strong,
          unique password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={passwordForm.handleSubmit(handlePasswordChange)}
          className="space-y-6"
        >
          {/* Current Password */}
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="text-sm font-medium">
              Current Password
            </Label>
            <div className="relative flex items-center">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                placeholder="Enter your current password"
                {...passwordForm.register("currentPassword")}
                className={`pr-10 ${
                  passwordForm.formState.errors.currentPassword
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }`}
              />
              <button
                type="button"
                className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {passwordForm.formState.errors.currentPassword && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <X className="h-3 w-3" />
                {passwordForm.formState.errors.currentPassword.message}
              </p>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-sm font-medium">
              New Password
            </Label>
            <div className="relative flex items-center">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter your new password"
                {...passwordForm.register("newPassword")}
                className={`pr-10 ${
                  passwordForm.formState.errors.newPassword
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }`}
              />
              <button
                type="button"
                className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {passwordForm.formState.errors.newPassword && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <X className="h-3 w-3" />
                {passwordForm.formState.errors.newPassword.message}
              </p>
            )}

            {/* Password Strength Indicator */}
            {newPassword && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Password strength</span>
                  <span
                    className={`font-medium ${
                      passwordStrength <= 40
                        ? "text-red-500"
                        : passwordStrength <= 60
                        ? "text-yellow-500"
                        : passwordStrength <= 80
                        ? "text-blue-500"
                        : "text-green-500"
                    }`}
                  >
                    {strengthInfo.label}
                  </span>
                </div>
                <Progress value={passwordStrength} className="h-2" />
              </div>
            )}
          </div>

          {/* Password Requirements */}
          {newPassword && (
            <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
              <p className="text-sm font-medium text-muted-foreground mb-3">
                Password Requirements
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {passwordRequirements.map((req, index) => {
                  const isMet = req.validator(newPassword);
                  return (
                    <div
                      key={index}
                      className={`flex items-center gap-2 text-sm ${
                        isMet ? "text-green-600" : "text-muted-foreground"
                      }`}
                    >
                      {isMet ? (
                        <Check className="h-4 w-4 shrink-0" />
                      ) : (
                        <X className="h-4 w-4 shrink-0 text-muted-foreground/50" />
                      )}
                      <span>{req.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm New Password
            </Label>
            <div className="relative flex items-center">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your new password"
                {...passwordForm.register("confirmPassword")}
                className={`pr-10 ${
                  passwordForm.formState.errors.confirmPassword || passwordsMismatch
                    ? "border-destructive focus-visible:ring-destructive"
                    : passwordsMatch
                    ? "border-green-500 focus-visible:ring-green-500"
                    : ""
                }`}
              />
              <button
                type="button"
                className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {passwordForm.formState.errors.confirmPassword && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <X className="h-3 w-3" />
                {passwordForm.formState.errors.confirmPassword.message}
              </p>
            )}
            {passwordsMatch && !passwordForm.formState.errors.confirmPassword && (
              <p className="text-sm text-green-600 flex items-center gap-1">
                <Check className="h-3 w-3" />
                Passwords match
              </p>
            )}
            {passwordsMismatch && !passwordForm.formState.errors.confirmPassword && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <X className="h-3 w-3" />
                Passwords do not match
              </p>
            )}
          </div>

          {/* Security Tip */}
          <Alert className="border-primary/20 bg-primary/5">
            <ShieldAlert className="h-4 w-4 text-primary" />
            <AlertDescription className="text-sm text-muted-foreground">
              <strong className="text-foreground">Security Tip:</strong> Use a
              unique password that you don't use on other websites. Consider
              using a password manager.
            </AlertDescription>
          </Alert>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isLoading || !passwordForm.formState.isDirty}
              className="min-w-[160px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4 mr-2" />
                  Update Password
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChangePasswordForm;
