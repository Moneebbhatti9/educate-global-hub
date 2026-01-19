import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Cookie, Save, RefreshCw, Info } from "lucide-react";
import { customToast } from "@/components/ui/sonner";
import {
  getCookiePreferences,
  hasGivenConsent,
  type CookiePreferences,
} from "./CookieConsent";
import { useConsentRecording } from "@/apis/gdpr";

const COOKIE_CONSENT_KEY = "gdpr_cookie_consent";
const COOKIE_PREFERENCES_KEY = "gdpr_cookie_preferences";

// Default preferences
const defaultPreferences: CookiePreferences = {
  essential: true,
  functional: false,
  analytics: false,
  marketing: false,
};

const CookiePreferenceManager = () => {
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);
  const [hasConsent, setHasConsent] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Use consent recording hook
  const { recordConsent } = useConsentRecording();

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = () => {
    const consent = hasGivenConsent();
    setHasConsent(consent);

    if (consent) {
      const stored = getCookiePreferences();
      if (stored) {
        setPreferences(stored);
      }
      // Get last updated time
      const consentTime = localStorage.getItem("gdpr_consent_timestamp");
      if (consentTime) {
        setLastUpdated(new Date(consentTime));
      }
    }
  };

  const handlePreferenceChange = (key: keyof CookiePreferences, value: boolean) => {
    if (key === "essential") return; // Cannot disable essential cookies
    setPreferences((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const handleSavePreferences = () => {
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(preferences));
    localStorage.setItem(COOKIE_CONSENT_KEY, "true");
    localStorage.setItem("gdpr_consent_timestamp", new Date().toISOString());

    setIsDirty(false);
    setHasConsent(true);
    setLastUpdated(new Date());

    // Dispatch event for other components to react
    window.dispatchEvent(new CustomEvent("cookieConsentChanged", { detail: preferences }));

    // Record consent to server (fire and forget)
    try {
      recordConsent.mutate({
        consentType: "cookies_all",
        granted: true,
        preferences,
      });
    } catch (error) {
      console.debug("Could not record consent to server:", error);
    }

    customToast.success("Cookie preferences saved successfully!");
  };

  const handleResetPreferences = () => {
    setPreferences(defaultPreferences);
    setIsDirty(true);
  };

  const handleWithdrawConsent = () => {
    // Clear all cookie-related storage
    localStorage.removeItem(COOKIE_PREFERENCES_KEY);
    localStorage.removeItem(COOKIE_CONSENT_KEY);
    localStorage.removeItem("gdpr_consent_timestamp");

    // Record consent withdrawal to server
    try {
      recordConsent.mutate({
        consentType: "cookies_all",
        granted: false,
        preferences: defaultPreferences,
      });
    } catch (error) {
      console.debug("Could not record consent withdrawal to server:", error);
    }

    // Reset to defaults
    setPreferences(defaultPreferences);
    setHasConsent(false);
    setLastUpdated(null);
    setIsDirty(false);

    // Dispatch event
    window.dispatchEvent(new CustomEvent("cookieConsentWithdrawn"));

    customToast.success("Cookie consent withdrawn. Non-essential cookies have been disabled.");

    // Reload page to clear any stored cookies
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cookie className="h-5 w-5" />
          Cookie Preferences
        </CardTitle>
        <CardDescription>
          Manage how we use cookies on this website. Your preferences are stored locally
          and can be changed at any time.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Consent Status */}
        {hasConsent ? (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              You provided cookie consent
              {lastUpdated && ` on ${lastUpdated.toLocaleDateString()} at ${lastUpdated.toLocaleTimeString()}`}.
              You can update your preferences below.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant="destructive">
            <Info className="h-4 w-4" />
            <AlertDescription>
              You haven't provided cookie consent yet. Please configure your preferences and save.
            </AlertDescription>
          </Alert>
        )}

        {/* Essential Cookies */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-semibold">Essential Cookies</Label>
              <p className="text-sm text-muted-foreground">
                Required for basic website functionality. These cannot be disabled.
              </p>
            </div>
            <Switch checked={true} disabled />
          </div>
          <ul className="text-xs text-muted-foreground list-disc list-inside ml-2">
            <li>User authentication and session management</li>
            <li>Security features and CSRF protection</li>
            <li>Load balancing and performance</li>
          </ul>
        </div>

        <Separator />

        {/* Functional Cookies */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-semibold">Functional Cookies</Label>
              <p className="text-sm text-muted-foreground">
                Enable enhanced functionality like remembering your preferences.
              </p>
            </div>
            <Switch
              checked={preferences.functional}
              onCheckedChange={(checked) => handlePreferenceChange("functional", checked)}
            />
          </div>
          <ul className="text-xs text-muted-foreground list-disc list-inside ml-2">
            <li>Language and region preferences</li>
            <li>UI customization settings</li>
            <li>Chat support functionality</li>
          </ul>
        </div>

        <Separator />

        {/* Analytics Cookies */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-semibold">Analytics Cookies</Label>
              <p className="text-sm text-muted-foreground">
                Help us understand how you use our website to improve it.
              </p>
            </div>
            <Switch
              checked={preferences.analytics}
              onCheckedChange={(checked) => handlePreferenceChange("analytics", checked)}
            />
          </div>
          <ul className="text-xs text-muted-foreground list-disc list-inside ml-2">
            <li>Page view tracking</li>
            <li>Usage patterns and behavior</li>
            <li>Performance monitoring</li>
          </ul>
        </div>

        <Separator />

        {/* Marketing Cookies */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-semibold">Marketing Cookies</Label>
              <p className="text-sm text-muted-foreground">
                Used to deliver relevant advertisements and measure their effectiveness.
              </p>
            </div>
            <Switch
              checked={preferences.marketing}
              onCheckedChange={(checked) => handlePreferenceChange("marketing", checked)}
            />
          </div>
          <ul className="text-xs text-muted-foreground list-disc list-inside ml-2">
            <li>Personalized advertising</li>
            <li>Social media integration</li>
            <li>Campaign tracking</li>
          </ul>
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            onClick={handleSavePreferences}
            disabled={!isDirty}
            className="flex-1 sm:flex-none"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Preferences
          </Button>
          <Button
            variant="outline"
            onClick={handleResetPreferences}
            className="flex-1 sm:flex-none"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
          {hasConsent && (
            <Button
              variant="destructive"
              onClick={handleWithdrawConsent}
              className="flex-1 sm:flex-none"
            >
              Withdraw Consent
            </Button>
          )}
        </div>

        {/* Legal Links */}
        <div className="text-xs text-muted-foreground pt-4">
          <p>
            For more information about how we use cookies, please read our{" "}
            <a href="/cookies" className="text-primary hover:underline">
              Cookie Policy
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </a>.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CookiePreferenceManager;
