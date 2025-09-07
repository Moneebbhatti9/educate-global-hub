import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import SocialLoginButton from "./SocialLoginButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Test component to verify social login integration
 * This can be used for testing purposes and can be removed in production
 */
const SocialLoginTest: React.FC = () => {
  const { initiateGoogleAuth, initiateFacebookAuth } = useAuth();

  const handleGoogleTest = () => {
    console.log("Testing Google Auth...");
    initiateGoogleAuth();
  };

  const handleFacebookTest = () => {
    console.log("Testing Facebook Auth...");
    initiateFacebookAuth();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Social Login Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Test the social login integration. Check browser console for logs.
        </p>

        <div className="space-y-2">
          <SocialLoginButton provider="google" onClick={handleGoogleTest}>
            Test Google Login
          </SocialLoginButton>

          <SocialLoginButton provider="facebook" onClick={handleFacebookTest}>
            Test Facebook Login
          </SocialLoginButton>
        </div>

        <div className="text-xs text-muted-foreground">
          <p>Environment Variables:</p>
          <ul className="list-disc list-inside mt-1">
            <li>
              API Base URL: {import.meta.env.VITE_API_BASE_URL || "Not set"}
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialLoginTest;
