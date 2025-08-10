import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Check, Star, Crown, Zap, Building2, User, UserCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SubscriptionPlans = () => {
  const { role } = useParams<{ role: string }>();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const roleConfig = {
    teacher: {
      name: "Teacher",
      icon: User,
      color: "text-blue-600",
      plans: [
        {
          id: "teacher-basic",
          name: "Basic",
          price: "Free",
          period: "Forever",
          description: "Perfect for getting started",
          features: [
            "Create basic profile",
            "Apply to 5 jobs per month",
            "Basic job search filters",
            "Community forum access",
            "Email notifications"
          ],
          buttonText: "Get Started",
          popular: false
        },
        {
          id: "teacher-premium",
          name: "Premium",
          price: "$19",
          period: "/month",
          description: "For serious job seekers",
          features: [
            "Everything in Basic",
            "Unlimited job applications",
            "Advanced search filters",
            "Priority application review",
            "CV builder and templates",
            "Interview preparation resources",
            "Direct messaging with schools"
          ],
          buttonText: "Start Premium",
          popular: true
        },
        {
          id: "teacher-professional",
          name: "Professional",
          price: "$39",
          period: "/month",
          description: "Complete career management",
          features: [
            "Everything in Premium",
            "Career coaching sessions",
            "Professional development courses",
            "Salary negotiation guidance",
            "Job market insights",
            "Exclusive job opportunities",
            "Priority customer support"
          ],
          buttonText: "Go Professional",
          popular: false
        }
      ]
    },
    school: {
      name: "School",
      icon: Building2,
      color: "text-green-600",
      plans: [
        {
          id: "school-starter",
          name: "Starter",
          price: "$49",
          period: "/month",
          description: "For small schools",
          features: [
            "Post up to 3 jobs",
            "Basic candidate filtering",
            "Standard job visibility",
            "Email support",
            "Application management"
          ],
          buttonText: "Start Now",
          popular: false
        },
        {
          id: "school-professional",
          name: "Professional",
          price: "$99",
          period: "/month",
          description: "Most popular for growing schools",
          features: [
            "Post up to 15 jobs",
            "Advanced candidate filtering",
            "Priority job visibility",
            "Bulk messaging to candidates",
            "Interview scheduling tools",
            "Analytics dashboard",
            "Phone support"
          ],
          buttonText: "Choose Professional",
          popular: true
        },
        {
          id: "school-enterprise",
          name: "Enterprise",
          price: "$199",
          period: "/month",
          description: "For large institutions",
          features: [
            "Unlimited job postings",
            "AI-powered candidate matching",
            "Premium job visibility",
            "Custom branding",
            "Dedicated account manager",
            "Advanced analytics",
            "API integration",
            "24/7 priority support"
          ],
          buttonText: "Contact Sales",
          popular: false
        }
      ]
    },
    recruiter: {
      name: "Recruiter",
      icon: UserCheck,
      color: "text-purple-600",
      plans: [
        {
          id: "recruiter-basic",
          name: "Basic",
          price: "$79",
          period: "/month",
          description: "Individual recruiters",
          features: [
            "Manage up to 50 candidates",
            "Basic search and filtering",
            "Email communications",
            "Standard reporting",
            "Mobile app access"
          ],
          buttonText: "Get Started",
          popular: false
        },
        {
          id: "recruiter-professional",
          name: "Professional",
          price: "$149",
          period: "/month",
          description: "Professional recruitment",
          features: [
            "Manage up to 200 candidates",
            "Advanced search algorithms",
            "Automated workflows",
            "Client portal access",
            "Pipeline management",
            "Performance analytics",
            "Integration tools"
          ],
          buttonText: "Choose Professional",
          popular: true
        },
        {
          id: "recruiter-enterprise",
          name: "Enterprise",
          price: "$299",
          period: "/month",
          description: "Large recruitment agencies",
          features: [
            "Unlimited candidate management",
            "AI-powered matching",
            "White-label solution",
            "Multi-user accounts",
            "Custom integrations",
            "Dedicated support",
            "Advanced reporting"
          ],
          buttonText: "Contact Sales",
          popular: false
        }
      ]
    },
    supplier: {
      name: "Supplier",
      icon: Truck,
      color: "text-orange-600",
      plans: [
        {
          id: "supplier-basic",
          name: "Basic",
          price: "$59",
          period: "/month",
          description: "Small suppliers",
          features: [
            "List up to 50 products",
            "Basic storefront",
            "Order management",
            "Payment processing",
            "Email support"
          ],
          buttonText: "Start Selling",
          popular: false
        },
        {
          id: "supplier-business",
          name: "Business",
          price: "$119",
          period: "/month",
          description: "Growing businesses",
          features: [
            "List up to 500 products",
            "Enhanced storefront",
            "Inventory management",
            "Bulk order tools",
            "Customer analytics",
            "Marketing tools",
            "Priority support"
          ],
          buttonText: "Choose Business",
          popular: true
        },
        {
          id: "supplier-enterprise",
          name: "Enterprise",
          price: "$249",
          period: "/month",
          description: "Large suppliers",
          features: [
            "Unlimited products",
            "Custom storefront design",
            "Advanced analytics",
            "Multi-location support",
            "API access",
            "Dedicated manager",
            "White-glove onboarding"
          ],
          buttonText: "Contact Sales",
          popular: false
        }
      ]
    }
  };

  const currentRole = roleConfig[role as keyof typeof roleConfig];
  
  if (!currentRole) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Role</h1>
          <Link to="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const RoleIcon = currentRole.icon;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
              <div className="flex items-center space-x-2">
                <RoleIcon className={`w-6 h-6 ${currentRole.color}`} />
                <h1 className="text-2xl font-bold">{currentRole.name} Plans</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Choose the Perfect Plan for Your {currentRole.name} Journey
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
          Unlock powerful features and take your educational career to the next level with our flexible subscription plans.
        </p>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {currentRole.plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative transition-all hover:shadow-xl ${
                plan.popular ? 'border-brand-primary shadow-lg scale-105' : 'hover:border-brand-primary/50'
              } ${selectedPlan === plan.id ? 'ring-2 ring-brand-primary' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-brand-primary text-white px-3 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-2">
                <div className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary flex items-center justify-center mb-4`}>
                  {plan.name === 'Enterprise' || plan.name === 'Professional' ? 
                    <Crown className="w-6 h-6 text-white" /> : 
                    <Zap className="w-6 h-6 text-white" />
                  }
                </div>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="text-3xl font-bold text-brand-primary">
                  {plan.price}
                  {plan.period && <span className="text-lg text-gray-600">{plan.period}</span>}
                </div>
                <p className="text-gray-600 mt-2">{plan.description}</p>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-24 text-left max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-12">Frequently Asked Questions</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Can I change plans anytime?</h4>
              <p className="text-gray-600 text-sm">Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the next billing cycle.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Is there a free trial?</h4>
              <p className="text-gray-600 text-sm">We offer a 14-day free trial for all premium plans. No credit card required to start.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h4>
              <p className="text-gray-600 text-sm">We accept all major credit cards, PayPal, and bank transfers for enterprise customers.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Do you offer discounts?</h4>
              <p className="text-gray-600 text-sm">Yes, we offer annual billing discounts and special rates for educational institutions.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;