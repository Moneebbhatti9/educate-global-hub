import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Eye, Lock, Database, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const PrivacyPolicy = () => {
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
              <Shield className="w-6 h-6 text-brand-primary" />
              <h1 className="text-2xl font-bold">Privacy Policy</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="prose prose-gray max-w-none">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-start space-x-3">
              <Eye className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Last Updated: January 2024</h3>
                <p className="text-blue-800">
                  This Privacy Policy describes how Educate Link ("we," "our," or "us") collects, uses, and protects your personal information.
                </p>
              </div>
            </div>
          </div>

          <section className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Database className="w-5 h-5 text-brand-primary" />
              <h2 className="text-xl font-semibold">Information We Collect</h2>
            </div>
            <div className="bg-white rounded-lg border p-6 space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Personal Information</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Name, email address, and contact information</li>
                  <li>Professional qualifications and experience</li>
                  <li>Location and educational background</li>
                  <li>Profile photos and documents</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Usage Information</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>How you interact with our platform</li>
                  <li>Pages visited and features used</li>
                  <li>Search queries and application history</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Lock className="w-5 h-5 text-brand-primary" />
              <h2 className="text-xl font-semibold">How We Use Your Information</h2>
            </div>
            <div className="bg-white rounded-lg border p-6">
              <ul className="space-y-3">
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-brand-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Provide and improve our educational services</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-brand-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Match teachers with suitable job opportunities</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-brand-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Facilitate communication between schools and candidates</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-brand-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Send relevant notifications and updates</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-brand-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Analyze usage patterns to enhance user experience</span>
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Globe className="w-5 h-5 text-brand-primary" />
              <h2 className="text-xl font-semibold">Information Sharing</h2>
            </div>
            <div className="bg-white rounded-lg border p-6">
              <p className="text-gray-700 mb-4">
                We do not sell your personal information. We may share your information in the following circumstances:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">With schools when you apply for positions</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">With your explicit consent</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">To comply with legal requirements</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">With trusted service providers under strict confidentiality</span>
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Your Rights</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg border p-4">
                <h3 className="font-medium text-gray-900 mb-2">Access & Portability</h3>
                <p className="text-gray-700 text-sm">Request a copy of your personal data</p>
              </div>
              <div className="bg-white rounded-lg border p-4">
                <h3 className="font-medium text-gray-900 mb-2">Correction</h3>
                <p className="text-gray-700 text-sm">Update or correct inaccurate information</p>
              </div>
              <div className="bg-white rounded-lg border p-4">
                <h3 className="font-medium text-gray-900 mb-2">Deletion</h3>
                <p className="text-gray-700 text-sm">Request deletion of your personal data</p>
              </div>
              <div className="bg-white rounded-lg border p-4">
                <h3 className="font-medium text-gray-900 mb-2">Opt-out</h3>
                <p className="text-gray-700 text-sm">Unsubscribe from marketing communications</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                If you have any questions about this Privacy Policy or your personal data, please contact us:
              </p>
              <div className="space-y-2">
                <p className="text-gray-700"><strong>Email:</strong> privacy@educatelink.com</p>
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

export default PrivacyPolicy;