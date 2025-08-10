import { Link } from "react-router-dom";
import { ArrowLeft, FileText, CheckCircle, AlertTriangle, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
              <FileText className="w-6 h-6 text-brand-primary" />
              <h1 className="text-2xl font-bold">Terms of Service</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="prose prose-gray max-w-none">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-amber-900 mb-2">Effective Date: January 2024</h3>
                <p className="text-amber-800">
                  By using Educate Link, you agree to be bound by these Terms of Service. Please read them carefully.
                </p>
              </div>
            </div>
          </div>

          <section className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <CheckCircle className="w-5 h-5 text-brand-primary" />
              <h2 className="text-xl font-semibold">Acceptance of Terms</h2>
            </div>
            <div className="bg-white rounded-lg border p-6">
              <p className="text-gray-700 mb-4">
                These Terms of Service ("Terms") govern your use of Educate Link ("Service") operated by Educate Link Ltd ("us", "we", or "our").
              </p>
              <p className="text-gray-700">
                Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. By accessing or using our Service, you agree to be bound by these Terms.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">User Accounts</h2>
            <div className="bg-white rounded-lg border p-6 space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Account Registration</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>You must provide accurate and complete information</li>
                  <li>You are responsible for maintaining account security</li>
                  <li>One account per person is permitted</li>
                  <li>You must be 18 years or older to create an account</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Account Responsibilities</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Keep your login credentials confidential</li>
                  <li>Notify us immediately of unauthorized access</li>
                  <li>Update your information when necessary</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Service Usage</h2>
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-medium text-green-900 mb-2">Permitted Uses</h3>
                <ul className="text-green-800 space-y-1 text-sm">
                  <li>• Search and apply for educational positions</li>
                  <li>• Post legitimate job opportunities</li>
                  <li>• Communicate with other users professionally</li>
                  <li>• Access educational resources and forums</li>
                </ul>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-medium text-red-900 mb-2">Prohibited Uses</h3>
                <ul className="text-red-800 space-y-1 text-sm">
                  <li>• Post false or misleading information</li>
                  <li>• Harass or discriminate against other users</li>
                  <li>• Spam or send unsolicited messages</li>
                  <li>• Violate any applicable laws or regulations</li>
                  <li>• Attempt to breach system security</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Scale className="w-5 h-5 text-brand-primary" />
              <h2 className="text-xl font-semibold">Intellectual Property</h2>
            </div>
            <div className="bg-white rounded-lg border p-6">
              <p className="text-gray-700 mb-4">
                The Service and its original content, features, and functionality are owned by Educate Link and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">Our Rights</h3>
                  <p className="text-blue-800 text-sm">Platform design, logos, and proprietary technology</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-medium text-purple-900 mb-2">Your Rights</h3>
                  <p className="text-purple-800 text-sm">Content you create and personal information you provide</p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Payment Terms</h2>
            <div className="bg-white rounded-lg border p-6 space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Subscription Services</h3>
                <p className="text-gray-700">
                  Some features require a paid subscription. Subscription fees are billed in advance and are non-refundable except as required by law.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Advertising Services</h3>
                <p className="text-gray-700">
                  Job advertising services are subject to separate pricing and terms. Payment is required before service activation.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Limitation of Liability</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                To the maximum extent permitted by law, Educate Link shall not be liable for any indirect, incidental, special, consequential, or punitive damages.
              </p>
              <p className="text-gray-700">
                We do not guarantee job placement or hiring outcomes. The platform serves as a connection service between educators and institutions.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="bg-brand-primary/5 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                Questions about these Terms of Service? Contact our legal team:
              </p>
              <div className="space-y-2">
                <p className="text-gray-700"><strong>Email:</strong> legal@educatelink.com</p>
                <p className="text-gray-700"><strong>Address:</strong> 123 Education Street, Learning City, LC 12345</p>
                <p className="text-gray-700"><strong>Phone:</strong> +1 (555) 123-4567</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;