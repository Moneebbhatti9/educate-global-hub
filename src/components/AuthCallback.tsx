import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { authAPI } from "@/apis/auth";
import { customToast } from "@/components/ui/sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

const AuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleSocialLoginWithTokens } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const accessToken = searchParams.get("access_token");
        const refreshToken = searchParams.get("refresh_token");
        const userId = searchParams.get("user_id");
        const error = searchParams.get("error");
        const errorDescription = searchParams.get("error_description");

        // Handle OAuth errors
        if (error) {
          let errorMessage = "Authentication failed";

          switch (error) {
            case "access_denied":
              errorMessage = "You denied access to the application";
              break;
            case "invalid_request":
              errorMessage = "Invalid request. Please try again.";
              break;
            case "server_error":
              errorMessage = "Server error. Please try again later.";
              break;
            default:
              errorMessage =
                errorDescription || "Authentication failed. Please try again.";
          }

          setError(errorMessage);
          setStatus("error");
          customToast.error("Authentication Failed", errorMessage);
          return;
        }

        // Handle missing tokens
        if (!accessToken || !refreshToken || !userId) {
          setError("Missing authentication data");
          setStatus("error");
          customToast.error(
            "Authentication Failed",
            "Missing authentication data"
          );
          return;
        }

        // Use the AuthContext method to handle the social login
        await handleSocialLoginWithTokens(accessToken, refreshToken, userId);

        setStatus("success");
        customToast.success(
          "Welcome!",
          "Successfully signed in with social login"
        );
      } catch (error) {
        console.error("OAuth callback error:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Authentication failed";
        setError(errorMessage);
        setStatus("error");
        customToast.error("Authentication Failed", errorMessage);
      }
    };

    handleCallback();
  }, [searchParams, navigate, handleSocialLoginWithTokens]);

  const handleRetry = () => {
    navigate("/login");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {status === "loading" && "Completing Authentication"}
            {status === "success" && "Authentication Successful"}
            {status === "error" && "Authentication Failed"}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {status === "loading" && (
            <>
              <div className="flex justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
              <p className="text-muted-foreground">
                Please wait while we complete your authentication...
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="flex justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-muted-foreground">
                Successfully authenticated! Redirecting you to your dashboard...
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <div className="flex justify-center">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <p className="text-muted-foreground">{error}</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={handleRetry} className="flex-1">
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  onClick={handleGoHome}
                  className="flex-1"
                >
                  Go Home
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthCallback;
