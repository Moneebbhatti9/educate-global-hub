import { Link } from "react-router-dom";
import { ArrowLeft, Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <Cookie className="w-6 h-6 text-brand-primary" />
              <h1 className="text-2xl font-bold">Cookie Policy</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="prose prose-gray max-w-none">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-orange-900 mb-2">Last Updated: January 2024</h3>
            <p className="text-orange-800">
              This Cookie Policy explains how Educate Link uses cookies and similar technologies.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">What Are Cookies?</h2>
            <div className="bg-white rounded-lg border p-6">
              <p className="text-gray-700 mb-4">
                Cookies are small text files stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and analyzing how you use our platform.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Types of Cookies We Use</h2>
            <div className="space-y-4">
              <div className="bg-white rounded-lg border p-4">
                <h3 className="font-medium text-gray-900 mb-2">Essential Cookies</h3>
                <p className="text-gray-700 text-sm">Required for the website to function properly. Cannot be disabled.</p>
              </div>
              <div className="bg-white rounded-lg border p-4">
                <h3 className="font-medium text-gray-900 mb-2">Analytics Cookies</h3>
                <p className="text-gray-700 text-sm">Help us understand how visitors interact with our website.</p>
              </div>
              <div className="bg-white rounded-lg border p-4">
                <h3 className="font-medium text-gray-900 mb-2">Functional Cookies</h3>
                <p className="text-gray-700 text-sm">Remember your preferences and settings.</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Managing Cookies</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700">
                You can control and manage cookies through your browser settings. Please note that disabling certain cookies may affect the functionality of our website.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;