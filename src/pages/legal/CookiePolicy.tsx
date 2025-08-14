import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Cookie, Settings, BarChart3, Shield } from "lucide-react";

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-white sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Cookie className="w-6 h-6 text-brand-primary" />
              <span className="font-heading font-bold text-xl">Educate Link</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="space-y-8">
          {/* Title Section */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-12 h-12 bg-brand-accent-orange/10 rounded-full flex items-center justify-center">
                <Cookie className="w-6 h-6 text-brand-accent-orange" />
              </div>
              <h1 className="font-heading font-bold text-4xl text-foreground">
                Cookie Policy
              </h1>
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Learn about how we use cookies and similar technologies to improve your experience on our platform.
            </p>
            <p className="text-sm text-muted-foreground">
              Last updated: March 15, 2024
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-brand-primary/10 rounded-lg flex items-center justify-center">
                    <Cookie className="w-4 h-4 text-brand-primary" />
                  </div>
                  <span>What Are Cookies?</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p className="text-muted-foreground mb-4">
                  Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Remembering your preferences and settings</li>
                  <li>Keeping you signed in to your account</li>
                  <li>Understanding how you use our platform</li>
                  <li>Improving our services and user experience</li>
                  <li>Providing relevant content and recommendations</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Types of Cookies We Use</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {/* Essential Cookies */}
                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Shield className="w-5 h-5 text-red-500" />
                        <h3 className="font-semibold">Essential Cookies</h3>
                      </div>
                      <Badge variant="destructive">Required</Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mb-2">
                      These cookies are necessary for the website to function properly and cannot be disabled.
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Authentication and security</li>
                      <li>Form submission and data processing</li>
                      <li>Load balancing and performance</li>
                    </ul>
                  </div>

                  {/* Functional Cookies */}
                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Settings className="w-5 h-5 text-brand-primary" />
                        <h3 className="font-semibold">Functional Cookies</h3>
                      </div>
                      <Badge variant="outline">Optional</Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mb-2">
                      These cookies enable enhanced functionality and personalization.
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Language and region preferences</li>
                      <li>User interface customization</li>
                      <li>Saved search filters and preferences</li>
                    </ul>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <BarChart3 className="w-5 h-5 text-brand-accent-green" />
                        <h3 className="font-semibold">Analytics Cookies</h3>
                      </div>
                      <Badge variant="outline">Optional</Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mb-2">
                      These cookies help us understand how visitors interact with our website.
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Page views and user journeys</li>
                      <li>Performance metrics and optimization</li>
                      <li>A/B testing and feature analysis</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Third-Party Cookies</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p className="text-muted-foreground mb-4">
                  We may also use cookies from trusted third-party services to enhance your experience:
                </p>
                <div className="space-y-3">
                  <div className="p-3 border border-border rounded-lg">
                    <h4 className="font-semibold mb-1">Google Analytics</h4>
                    <p className="text-sm text-muted-foreground">
                      Helps us understand user behavior and improve our platform performance.
                    </p>
                  </div>
                  <div className="p-3 border border-border rounded-lg">
                    <h4 className="font-semibold mb-1">Social Media Platforms</h4>
                    <p className="text-sm text-muted-foreground">
                      Enables social sharing features and login integrations.
                    </p>
                  </div>
                  <div className="p-3 border border-border rounded-lg">
                    <h4 className="font-semibold mb-1">Content Delivery Networks</h4>
                    <p className="text-sm text-muted-foreground">
                      Improves website loading speed and performance globally.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Managing Your Cookie Preferences</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p className="text-muted-foreground mb-4">
                  You have control over the cookies we use. Here's how you can manage them:
                </p>
                
                <div className="space-y-4">
                  <div className="p-4 bg-brand-primary/5 rounded-lg border border-brand-primary/20">
                    <h4 className="font-semibold mb-2 text-brand-primary">Platform Settings</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Manage cookie preferences directly through our platform settings.
                    </p>
                    <Button size="sm" className="bg-brand-primary hover:bg-brand-primary/90">
                      Manage Preferences
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold">Browser Settings</h4>
                    <p className="text-muted-foreground text-sm mb-2">
                      You can also control cookies through your browser settings:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Block all cookies or specific types</li>
                      <li>Delete existing cookies</li>
                      <li>Set preferences for future cookies</li>
                      <li>Receive notifications when cookies are set</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Impact of Disabling Cookies</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Please note that disabling certain cookies may affect your experience on our platform:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>You may need to log in more frequently</li>
                  <li>Your preferences and settings may not be saved</li>
                  <li>Some features may not work as expected</li>
                  <li>Content may not be as personalized</li>
                  <li>We may not be able to remember your consent choices</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  If you have questions about our cookie policy or need assistance with cookie settings:
                </p>
                <div className="space-y-2 text-muted-foreground">
                  <p><strong>Email:</strong> cookies@educatelink.com</p>
                  <p><strong>Address:</strong> 123 Education Street, Knowledge City, KC 12345</p>
                  <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer Links */}
          <div className="border-t border-border pt-8">
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link to="/legal/privacy" className="text-brand-primary hover:underline">
                Privacy Policy
              </Link>
              <Link to="/legal/terms" className="text-brand-primary hover:underline">
                Terms & Conditions
              </Link>
              <Link to="/legal/gdpr" className="text-brand-primary hover:underline">
                GDPR Compliance
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CookiePolicy;