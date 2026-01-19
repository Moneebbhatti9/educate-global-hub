import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Cookie, Settings, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useConsentRecording } from "@/apis/gdpr";

// Cookie preference types
export interface CookiePreferences {
  essential: boolean; // Always true, cannot be disabled
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

const COOKIE_CONSENT_KEY = "gdpr_cookie_consent";
const COOKIE_PREFERENCES_KEY = "gdpr_cookie_preferences";

// Default preferences
const defaultPreferences: CookiePreferences = {
  essential: true,
  functional: false,
  analytics: false,
  marketing: false,
};

// Get stored preferences
export const getCookiePreferences = (): CookiePreferences | null => {
  try {
    const stored = localStorage.getItem(COOKIE_PREFERENCES_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Error reading cookie preferences:", e);
  }
  return null;
};

// Check if consent was given
export const hasGivenConsent = (): boolean => {
  return localStorage.getItem(COOKIE_CONSENT_KEY) === "true";
};

// Save preferences (local storage only - exported for use by other components)
const savePreferencesLocal = (preferences: CookiePreferences) => {
  localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(preferences));
  localStorage.setItem(COOKIE_CONSENT_KEY, "true");
  localStorage.setItem("gdpr_consent_timestamp", new Date().toISOString());

  // Dispatch event for other components to react
  window.dispatchEvent(new CustomEvent("cookieConsentChanged", { detail: preferences }));
};

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);

  // Use consent recording hook (will silently fail if not authenticated)
  const { recordConsent } = useConsentRecording();

  // Save preferences and optionally record to server
  const savePreferences = async (prefs: CookiePreferences) => {
    // Always save locally first
    savePreferencesLocal(prefs);

    // Try to record consent to server (fire and forget - don't block UI)
    try {
      recordConsent.mutate({
        consentType: "cookies_all",
        granted: true,
        preferences: prefs,
      });
    } catch (error) {
      // Silent fail - consent is already saved locally
      console.debug("Could not record consent to server:", error);
    }
  };

  useEffect(() => {
    // Check if user has already given consent
    const hasConsent = hasGivenConsent();
    if (!hasConsent) {
      // Small delay to prevent flash on page load
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    } else {
      // Load existing preferences
      const stored = getCookiePreferences();
      if (stored) {
        setPreferences(stored);
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      essential: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    savePreferences(allAccepted);
    setPreferences(allAccepted);
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    const onlyEssential: CookiePreferences = {
      essential: true,
      functional: false,
      analytics: false,
      marketing: false,
    };
    savePreferences(onlyEssential);
    setPreferences(onlyEssential);
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    savePreferences(preferences);
    setShowPreferences(false);
    setIsVisible(false);
  };

  const handlePreferenceChange = (key: keyof CookiePreferences, value: boolean) => {
    if (key === "essential") return; // Cannot disable essential cookies
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur-sm border-t shadow-lg animate-in slide-in-from-bottom duration-300">
        <div className="container mx-auto max-w-6xl">
          <Card className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* Icon and Text */}
              <div className="flex items-start gap-4 flex-1">
                <div className="p-2 rounded-full bg-primary/10 shrink-0">
                  <Cookie className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Cookie Consent
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    We use cookies to enhance your browsing experience, serve personalized content,
                    and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
                    You can customize your preferences or learn more in our{" "}
                    <Link to="/cookies" className="text-primary hover:underline">
                      Cookie Policy
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 lg:shrink-0">
                <Button
                  variant="outline"
                  onClick={handleRejectAll}
                  className="order-3 sm:order-1"
                >
                  Reject All
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowPreferences(true)}
                  className="order-2"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Customize
                </Button>
                <Button
                  onClick={handleAcceptAll}
                  className="order-1 sm:order-3"
                >
                  Accept All
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Preferences Modal */}
      <Dialog open={showPreferences} onOpenChange={setShowPreferences}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Cookie Preferences
            </DialogTitle>
            <DialogDescription>
              Manage your cookie preferences. Essential cookies are always enabled as they are
              necessary for the website to function properly.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Essential Cookies */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-semibold">Essential Cookies</Label>
                  <p className="text-sm text-muted-foreground">
                    Required for the website to function. Cannot be disabled.
                  </p>
                </div>
                <Switch checked={true} disabled className="data-[state=checked]:bg-primary" />
              </div>
              <div className="text-xs text-muted-foreground bg-muted p-3 rounded-md">
                <strong>Examples:</strong> Authentication, security, preferences storage, load balancing
              </div>
            </div>

            <Separator />

            {/* Functional Cookies */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-semibold">Functional Cookies</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable enhanced functionality and personalization.
                  </p>
                </div>
                <Switch
                  checked={preferences.functional}
                  onCheckedChange={(checked) => handlePreferenceChange("functional", checked)}
                />
              </div>
              <div className="text-xs text-muted-foreground bg-muted p-3 rounded-md">
                <strong>Examples:</strong> Language preferences, region settings, chat support, embedded content
              </div>
            </div>

            <Separator />

            {/* Analytics Cookies */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-semibold">Analytics Cookies</Label>
                  <p className="text-sm text-muted-foreground">
                    Help us understand how visitors interact with our website.
                  </p>
                </div>
                <Switch
                  checked={preferences.analytics}
                  onCheckedChange={(checked) => handlePreferenceChange("analytics", checked)}
                />
              </div>
              <div className="text-xs text-muted-foreground bg-muted p-3 rounded-md">
                <strong>Examples:</strong> Page views, traffic sources, user behavior, performance metrics
              </div>
            </div>

            <Separator />

            {/* Marketing Cookies */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-semibold">Marketing Cookies</Label>
                  <p className="text-sm text-muted-foreground">
                    Used to deliver relevant advertisements and track campaign effectiveness.
                  </p>
                </div>
                <Switch
                  checked={preferences.marketing}
                  onCheckedChange={(checked) => handlePreferenceChange("marketing", checked)}
                />
              </div>
              <div className="text-xs text-muted-foreground bg-muted p-3 rounded-md">
                <strong>Examples:</strong> Ad targeting, social media integration, retargeting pixels
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setShowPreferences(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePreferences}>
              Save Preferences
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CookieConsent;
