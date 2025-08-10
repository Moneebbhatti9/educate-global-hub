import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { 
  Truck, 
  BookOpen, 
  Laptop, 
  Beaker, 
  Palette,
  Shield,
  Award,
  Users,
  ArrowRight,
  CheckCircle,
  Star,
  Package,
  Globe,
  Headphones,
  TrendingUp
} from "lucide-react";

const SupplierLanding = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative bg-gradient-hero text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-white/20 text-white mb-4">
                <Truck className="w-4 h-4 mr-2" />
                Educational Suppliers
              </Badge>
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                Connect Your Products with 
                <span className="text-brand-accent-yellow block">Schools Worldwide</span>
              </h1>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of suppliers providing essential educational resources to schools, universities, and educational institutions globally.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-brand-primary hover:bg-gray-100">
                  <Package className="w-5 h-5 mr-2" />
                  Start Selling
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  View Marketplace
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-white/10 backdrop-blur p-6 rounded-lg">
                    <BookOpen className="w-8 h-8 text-brand-accent-yellow mb-2" />
                    <h3 className="font-semibold">Books & Literature</h3>
                    <p className="text-sm opacity-80">Textbooks, workbooks, reference materials</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur p-6 rounded-lg">
                    <Beaker className="w-8 h-8 text-brand-accent-green mb-2" />
                    <h3 className="font-semibold">Lab Equipment</h3>
                    <p className="text-sm opacity-80">Scientific instruments and supplies</p>
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="bg-white/10 backdrop-blur p-6 rounded-lg">
                    <Laptop className="w-8 h-8 text-brand-secondary mb-2" />
                    <h3 className="font-semibold">Technology</h3>
                    <p className="text-sm opacity-80">Computers, tablets, software</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur p-6 rounded-lg">
                    <Palette className="w-8 h-8 text-brand-accent-orange mb-2" />
                    <h3 className="font-semibold">Art Supplies</h3>
                    <p className="text-sm opacity-80">Creative materials and tools</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-primary mb-2">5,000+</div>
              <p className="text-gray-600">Active Schools</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-primary mb-2">1,200+</div>
              <p className="text-gray-600">Trusted Suppliers</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-primary mb-2">$50M+</div>
              <p className="text-gray-600">Annual Transactions</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-primary mb-2">95%</div>
              <p className="text-gray-600">Customer Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose Our Platform?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join a thriving marketplace designed specifically for educational suppliers and institutions.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Globe className="w-12 h-12 text-brand-primary mb-4" />
                <CardTitle>Global Reach</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Connect with schools and educational institutions across 50+ countries worldwide.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">International shipping support</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Multi-currency transactions</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Regional market insights</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="w-12 h-12 text-brand-primary mb-4" />
                <CardTitle>Trusted Platform</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Secure transactions with verified schools and comprehensive supplier protection.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Verified school accounts</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Secure payment processing</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Dispute resolution system</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <TrendingUp className="w-12 h-12 text-brand-primary mb-4" />
                <CardTitle>Growth Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Comprehensive analytics and marketing tools to grow your educational supply business.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Sales analytics dashboard</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Promotional campaigns</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Customer relationship tools</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Suppliers */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Featured Suppliers</h2>
            <p className="text-gray-600">
              Join these successful suppliers serving educational institutions worldwide.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">EduBooks International</h3>
                    <p className="text-sm text-gray-600">Educational Publishing</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">4.9</span>
                  </div>
                  <Badge variant="outline">Premium Supplier</Badge>
                </div>
                <p className="text-gray-600 text-sm">
                  "Increased our sales by 300% within the first year. The platform's reach is incredible."
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Beaker className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Scientific Solutions Ltd</h3>
                    <p className="text-sm text-gray-600">Laboratory Equipment</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">4.8</span>
                  </div>
                  <Badge variant="outline">Verified Supplier</Badge>
                </div>
                <p className="text-gray-600 text-sm">
                  "The platform connects us directly with schools that need our specialized equipment."
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Laptop className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">TechEd Innovations</h3>
                    <p className="text-sm text-gray-600">Educational Technology</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">4.9</span>
                  </div>
                  <Badge variant="outline">Top Seller</Badge>
                </div>
                <p className="text-gray-600 text-sm">
                  "Easy to manage orders and excellent support team. Highly recommended platform."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Popular Product Categories</h2>
            <p className="text-gray-600">
              Explore the most in-demand educational products and supplies.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg p-6 hover:shadow-lg transition-shadow text-center">
              <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Books & Materials</h3>
              <p className="text-sm text-gray-600">Textbooks, workbooks, reference materials</p>
            </div>

            <div className="bg-white rounded-lg p-6 hover:shadow-lg transition-shadow text-center">
              <Laptop className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Technology</h3>
              <p className="text-sm text-gray-600">Computers, tablets, educational software</p>
            </div>

            <div className="bg-white rounded-lg p-6 hover:shadow-lg transition-shadow text-center">
              <Beaker className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Science Equipment</h3>
              <p className="text-sm text-gray-600">Laboratory instruments and supplies</p>
            </div>

            <div className="bg-white rounded-lg p-6 hover:shadow-lg transition-shadow text-center">
              <Palette className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Arts & Crafts</h3>
              <p className="text-sm text-gray-600">Creative materials and artistic tools</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-brand-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Selling?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of suppliers connecting with educational institutions worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-brand-primary hover:bg-gray-100">
              <Package className="w-5 h-5 mr-2" />
              Create Supplier Account
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Headphones className="w-5 h-5 mr-2" />
              Contact Sales Team
            </Button>
          </div>
          
          <div className="mt-12 grid md:grid-cols-3 gap-8">
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="w-5 h-5 text-brand-accent-green" />
              <span>No setup fees</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="w-5 h-5 text-brand-accent-green" />
              <span>24/7 support</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="w-5 h-5 text-brand-accent-green" />
              <span>Free training included</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SupplierLanding;