import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ShieldCheck,
  ShieldOff,
  Smartphone,
  Mail,
  Loader2,
  Info,
} from "lucide-react";
import { useUserSettings } from "@/apis/userSettings";
import { customToast } from "@/components/ui/sonner";

interface TwoFactorSettingsResponse {
  success: boolean;
  message: string;
  data: {
    is2FAEnabled: boolean;
    twoFactorMethod: "email" | "sms";
  };
}

const TwoFactorSettings = () => {
  const { get2FASettings, update2FASettings } = useUserSettings();
  const [is2FAEnabled, setIs2FAEnabled] = useState<boolean | null>(null);
  const [twoFactorMethod, setTwoFactorMethod] = useState<"email" | "sms">("email");
  const [isUpdating, setIsUpdating] = useState(false);

  // Track if we're in the middle of an update to prevent useEffect from overwriting
  const isUpdatingRef = useRef(false);

  // Load 2FA settings when component mounts or data changes
  useEffect(() => {
    // Don't update state from server while we're updating
    if (isUpdatingRef.current) return;

    if ((get2FASettings?.data as TwoFactorSettingsResponse)?.data) {
      const settings = (get2FASettings?.data as TwoFactorSettingsResponse)?.data;
      setIs2FAEnabled(settings.is2FAEnabled);
      setTwoFactorMethod(settings.twoFactorMethod ?? "email");
    }
  }, [get2FASettings.data]);

  // Show loading until we have the actual data
  const isLoading = get2FASettings.isLoading || is2FAEnabled === null;

  // Handle 2FA toggle
  const handle2FAToggle = async (enabled: boolean) => {
    // Set updating flag to prevent useEffect from overwriting
    isUpdatingRef.current = true;
    setIsUpdating(true);

    // Optimistically update the UI immediately
    const previousValue = is2FAEnabled;
    setIs2FAEnabled(enabled);

    try {
      const result = await update2FASettings.mutateAsync({
        is2FAEnabled: enabled,
        twoFactorMethod: twoFactorMethod,
      });

      if (result.success) {
        customToast.success(
          enabled
            ? "Two-Factor Authentication enabled"
            : "Two-Factor Authentication disabled",
          enabled
            ? "Your account is now more secure with 2FA."
            : "2FA has been disabled. Consider re-enabling for better security."
        );
      } else {
        // Revert on failure
        setIs2FAEnabled(previousValue);
      }
    } catch (error: any) {
      // Revert on error
      setIs2FAEnabled(previousValue);
      // Error is transformed by errorHandler to AppError with: message, code, status, details
      const errorMessage = error?.message || "Failed to update 2FA settings";
      customToast.error("Update Failed", errorMessage);
      console.error("2FA update error:", error);
    } finally {
      setIsUpdating(false);
      // Allow useEffect to sync again after a short delay
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 500);
    }
  };

  // Handle 2FA method change
  const handleMethodChange = async (method: "email" | "sms") => {
    if (!is2FAEnabled) {
      setTwoFactorMethod(method);
      return;
    }

    isUpdatingRef.current = true;
    setIsUpdating(true);

    const previousMethod = twoFactorMethod;
    setTwoFactorMethod(method);

    try {
      const result = await update2FASettings.mutateAsync({
        is2FAEnabled: true,
        twoFactorMethod: method,
      });

      if (result.success) {
        customToast.success(
          "2FA Method Updated",
          `Verification codes will now be sent via ${method === "email" ? "email" : "SMS"}.`
        );
      } else {
        setTwoFactorMethod(previousMethod);
      }
    } catch (error: any) {
      setTwoFactorMethod(previousMethod);
      // Error is transformed by errorHandler to AppError with: message, code, status, details
      const errorMessage = error?.message || "Failed to update 2FA method";
      customToast.error("Update Failed", errorMessage);
      console.error("2FA method update error:", error);
    } finally {
      setIsUpdating(false);
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 500);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            {is2FAEnabled === true ? (
              <ShieldCheck className="w-5 h-5 mr-2 text-green-500" />
            ) : (
              <ShieldOff className="w-5 h-5 mr-2 text-muted-foreground" />
            )}
            Two-Factor Authentication
          </div>
          {!isLoading && (
            <Badge
              variant={is2FAEnabled ? "default" : "secondary"}
              className={
                is2FAEnabled
                  ? "bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20"
                  : ""
              }
            >
              {is2FAEnabled ? "Enabled" : "Disabled"}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Add an extra layer of security to your account by requiring a
          verification code during sign-in
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading settings...</span>
          </div>
        ) : (
          <>
            {/* 2FA Toggle */}
            <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-full ${
                    is2FAEnabled
                      ? "bg-green-500/10 text-green-600"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">Enable Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">
                    Require a verification code when signing in
                  </p>
                </div>
              </div>
              <Switch
                checked={!!is2FAEnabled}
                onCheckedChange={handle2FAToggle}
                disabled={isUpdating}
              />
            </div>

            {/* 2FA Method Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Verification Method</Label>
              <Select
                value={twoFactorMethod}
                onValueChange={(value) =>
                  handleMethodChange(value as "email" | "sms")
                }
                disabled={isUpdating}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select verification method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      Email Verification
                    </div>
                  </SelectItem>
                  <SelectItem value="sms">
                    <div className="flex items-center">
                      <Smartphone className="w-4 h-4 mr-2" />
                      SMS Verification
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {twoFactorMethod === "email"
                  ? "A verification code will be sent to your registered email address"
                  : "A verification code will be sent to your registered phone number"}
              </p>
            </div>

            {/* Security Info */}
            {is2FAEnabled === false && (
              <Alert className="border-amber-500/20 bg-amber-500/5">
                <Info className="h-4 w-4 text-amber-500" />
                <AlertDescription className="text-amber-700 dark:text-amber-400">
                  <strong>Security Recommendation:</strong> Enabling two-factor
                  authentication significantly reduces the risk of unauthorized
                  access to your account. We strongly recommend keeping 2FA
                  enabled.
                </AlertDescription>
              </Alert>
            )}

            {is2FAEnabled === true && (
              <Alert className="border-green-500/20 bg-green-500/5">
                <ShieldCheck className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-green-700 dark:text-green-400">
                  <strong>Account Protected:</strong> Your account is secured
                  with two-factor authentication. A verification code will be
                  required each time you sign in.
                </AlertDescription>
              </Alert>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TwoFactorSettings;
