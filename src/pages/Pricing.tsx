import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Check,
  X,
  Star,
  Users,
  BookOpen,
  Globe,
  Headphones,
  Shield,
  Zap,
  TrendingUp,
  Award,
  Phone,
  Mail,
  HelpCircle
} from "lucide-react";

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedRole, setSelectedRole] = useState("teacher");

  const teacherPlans = [
    {
      name: "Basic",
      description: "Perfect for individual teachers starting their international career",
      price: { monthly: 0, annual: 0 },
      badge: "Free Forever",
      badgeColor: "bg-green-100 text-green-700 border-green-200",
      features: [
        "Access to job listings",
        "Basic profile creation",
        "Apply to up to 5 jobs/month",
        "Forum participation",
        "Email support",
        "Mobile app access"
      ],
      limitations: [
        "Limited job applications",
        "Basic profile features",
        "Standard support response"
      ],
      cta: "Get Started Free",
      popular: false
    },
    {
      name: "Professional",
      description: "Enhanced features for serious job seekers",
      price: { monthly: 29, annual: 290 },
      badge: "Most Popular",
      badgeColor: "bg-primary text-white",
      features: [
        "Unlimited job applications",
        "Premium profile with video intro",
        "Priority application processing",
        "Advanced search filters",
        "Career coaching resources",
        "Priority email support",
        "Interview preparation materials",
        "Salary negotiation guidance"
      ],
      limitations: [],
      cta: "Start Professional",
      popular: true
    },
    {
      name: "Premium",
      description: "Complete package for ambitious educators",
      price: { monthly: 59, annual: 590 },
      badge: "Best Value",
      badgeColor: "bg-secondary text-white",
      features: [
        "All Professional features",
        "Dedicated career advisor",
        "Resume/CV professional review",
        "LinkedIn optimization",
        "Mock interview sessions",
        "Phone support",
        "Job match recommendations",
        "Relocation assistance guide",
        "Visa guidance resources"
      ],
      limitations: [],
      cta: "Go Premium",
      popular: false
    }
  ];

  const schoolPlans = [
    {
      name: "Starter",
      description: "Ideal for small schools with basic hiring needs",
      price: { monthly: 99, annual: 990 },
      badge: "Great for Small Schools",
      badgeColor: "bg-blue-100 text-blue-700 border-blue-200",
      features: [
        "Post up to 5 jobs/month",
        "Access to teacher database",
        "Basic filtering and search",
        "Standard application management",
        "Email support",
        "Basic analytics dashboard"
      ],
      limitations: [
        "Limited job postings",
        "Basic search capabilities",
        "Standard support"
      ],
      cta: "Start Recruiting",
      popular: false
    },
    {
      name: "Professional",
      description: "Comprehensive solution for growing institutions",
      price: { monthly: 299, annual: 2990 },
      badge: "Most Popular",
      badgeColor: "bg-primary text-white",
      features: [
        "Unlimited job postings",
        "Advanced candidate filtering",
        "AI-powered teacher matching",
        "Interview scheduling tools",
        "Priority listing placement",
        "Dedicated support manager",
        "Advanced analytics & reporting",
        "Custom employer branding"
      ],
      limitations: [],
      cta: "Start Professional",
      popular: true
    },
    {
      name: "Enterprise",
      description: "Complete recruitment solution for large organizations",
      price: { monthly: 599, annual: 5990 },
      badge: "Enterprise Solution",
      badgeColor: "bg-secondary text-white",
      features: [
        "All Professional features",
        "Multiple campus management",
        "API access & integrations",
        "Custom onboarding workflows",
        "White-label solutions",
        "24/7 phone support",
        "Custom training sessions",
        "International compliance assistance",
        "Bulk hiring tools"
      ],
      limitations: [],
      cta: "Contact Sales",
      popular: false
    }
  ];

  const supplierPlans = [
    {
      name: "Partner",
      description: "For education service providers and agencies",
      price: { monthly: 199, annual: 1990 },
      badge: "Agency Solution",
      badgeColor: "bg-purple-100 text-purple-700 border-purple-200",
      features: [
        "List education services",
        "Connect with schools & teachers",
        "Service marketplace access",
        "Lead generation tools",
        "Basic analytics",
        "Email support"
      ],
      limitations: [
        "Limited service listings",
        "Basic lead tools"
      ],
      cta: "Become Partner",
      popular: false
    },
    {
      name: "Professional",
      description: "Enhanced features for established service providers",
      price: { monthly: 399, annual: 3990 },
      badge: "Recommended",
      badgeColor: "bg-primary text-white",
      features: [
        "Unlimited service listings",
        "Advanced targeting options",
        "Priority placement",
        "Custom service pages",
        "Lead management system",
        "Priority support",
        "Performance analytics"
      ],
      limitations: [],
      cta: "Start Professional",
      popular: true
    },
    {
      name: "Enterprise",
      description: "Complete solution for large service organizations",
      price: { monthly: 799, annual: 7990 },
      badge: "Full Solution",
      badgeColor: "bg-secondary text-white",
      features: [
        "All Professional features",
        "API access",
        "Custom integrations",
        "White-label options",
        "Dedicated account manager",
        "24/7 support",
        "Custom reporting"
      ],
      limitations: [],
      cta: "Contact Sales",
      popular: false
    }
  ];

  const getCurrentPlans = () => {
    switch (selectedRole) {
      case "teacher": return teacherPlans;
      case "school": return schoolPlans;
      case "supplier": return supplierPlans;
      default: return teacherPlans;
    }
  };

  const formatPrice = (price: { monthly: number; annual: number }) => {
    const currentPrice = isAnnual ? price.annual : price.monthly;
    if (currentPrice === 0) return "Free";
    
    if (isAnnual) {
      return `$${currentPrice}/year`;
    }
    return `$${currentPrice}/month`;
  };

  const getMonthlyEquivalent = (price: { monthly: number; annual: number }) => {
    if (isAnnual && price.annual > 0) {
      const monthlyEquivalent = Math.round(price.annual / 12);
      return `($${monthlyEquivalent}/month)`;
    }
    return "";
  };

  const enterprise = {
    title: "Need Something Custom?",
    description: "Large organizations with specific requirements can benefit from our enterprise solutions.",
    features: [
      "Custom pricing based on your needs",
      "Dedicated implementation team",
      "Advanced security and compliance",
      "Custom integrations and API access",
      "White-label solutions available",
      "24/7 priority support",
      "Training and onboarding",
      "International compliance assistance"
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                Transparent Pricing
              </Badge>
              <h1 className="font-heading font-bold text-4xl sm:text-6xl text-foreground mb-6">
                Plans That Grow
                <span className="text-primary block">With You</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Choose the perfect plan for your needs. Whether you're a teacher seeking opportunities, 
                a school looking for talent, or a service provider, we have solutions tailored for you.
              </p>
              
              {/* Billing Toggle */}
              <div className="flex items-center justify-center space-x-4 mb-8">
                <Label htmlFor="billing-toggle" className={!isAnnual ? "font-semibold" : ""}>
                  Monthly
                </Label>
                <Switch
                  id="billing-toggle"
                  checked={isAnnual}
                  onCheckedChange={setIsAnnual}
                />
                <Label htmlFor="billing-toggle" className={isAnnual ? "font-semibold" : ""}>
                  Annual
                </Label>
                {isAnnual && (
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    Save up to 20%
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Role-based Pricing */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Tabs value={selectedRole} onValueChange={setSelectedRole} className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-12">
                <TabsTrigger value="teacher" className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Teachers</span>
                </TabsTrigger>
                <TabsTrigger value="school" className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Schools</span>
                </TabsTrigger>
                <TabsTrigger value="supplier" className="flex items-center space-x-2">
                  <Globe className="w-4 h-4" />
                  <span>Suppliers</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value={selectedRole}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                  {getCurrentPlans().map((plan, index) => (
                    <Card
                      key={index}
                      className={`relative hover:shadow-xl transition-all duration-300 ${
                        plan.popular ? "border-primary shadow-lg scale-105" : ""
                      }`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <Badge className={plan.badgeColor}>
                            <Star className="w-3 h-3 mr-1" />
                            {plan.badge}
                          </Badge>
                        </div>
                      )}
                      
                      <CardHeader className="text-center">
                        {!plan.popular && (
                          <Badge className={`w-fit mx-auto mb-2 ${plan.badgeColor}`}>
                            {plan.badge}
                          </Badge>
                        )}
                        <CardTitle className="font-heading text-2xl">{plan.name}</CardTitle>
                        <CardDescription className="text-base">{plan.description}</CardDescription>
                        
                        <div className="mt-4">
                          <div className="text-4xl font-bold text-foreground">
                            {formatPrice(plan.price)}
                          </div>
                          {getMonthlyEquivalent(plan.price) && (
                            <div className="text-sm text-muted-foreground">
                              {getMonthlyEquivalent(plan.price)}
                            </div>
                          )}
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-6">
                        <Button
                          className={`w-full ${
                            plan.popular
                              ? "bg-primary hover:bg-primary/90"
                              : "variant-outline"
                          }`}
                          variant={plan.popular ? "default" : "outline"}
                        >
                          {plan.cta}
                        </Button>

                        <div className="space-y-3">
                          <h4 className="font-semibold text-foreground">What's included:</h4>
                          <ul className="space-y-2">
                            {plan.features.map((feature, featureIndex) => (
                              <li key={featureIndex} className="flex items-start space-x-2">
                                <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-muted-foreground">{feature}</span>
                              </li>
                            ))}
                          </ul>

                          {plan.limitations.length > 0 && (
                            <>
                              <h4 className="font-semibold text-foreground mt-4">Limitations:</h4>
                              <ul className="space-y-2">
                                {plan.limitations.map((limitation, limitIndex) => (
                                  <li key={limitIndex} className="flex items-start space-x-2">
                                    <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm text-muted-foreground">{limitation}</span>
                                  </li>
                                ))}
                              </ul>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Enterprise Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="max-w-4xl mx-auto">
              <CardHeader className="text-center">
                <Badge className="w-fit mx-auto mb-4 bg-gradient-to-r from-primary to-secondary text-white">
                  Enterprise Solution
                </Badge>
                <CardTitle className="font-heading text-3xl">{enterprise.title}</CardTitle>
                <CardDescription className="text-lg">{enterprise.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-foreground mb-4">Enterprise includes:</h4>
                    <ul className="space-y-2">
                      {enterprise.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-foreground mb-2">Custom Pricing</div>
                      <p className="text-muted-foreground">Tailored to your organization's needs</p>
                    </div>
                    <div className="space-y-3">
                      <Button className="w-full bg-primary hover:bg-primary/90">
                        <Phone className="w-4 h-4 mr-2" />
                        Schedule a Call
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Mail className="w-4 h-4 mr-2" />
                        Contact Sales Team
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground mb-6">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-muted-foreground">
                Have questions about our pricing? We're here to help.
              </p>
            </div>

            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="p-6">
                  <h4 className="font-semibold text-foreground mb-2">Can I change my plan anytime?</h4>
                  <p className="text-muted-foreground text-sm">
                    Yes, you can upgrade or downgrade your plan at any time. Changes take effect 
                    immediately for upgrades or at the next billing cycle for downgrades.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h4 className="font-semibold text-foreground mb-2">Do you offer refunds?</h4>
                  <p className="text-muted-foreground text-sm">
                    We offer a 30-day money-back guarantee for annual plans. Monthly plans can be 
                    cancelled at any time with no refund for the current month.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h4 className="font-semibold text-foreground mb-2">Is there a free trial?</h4>
                  <p className="text-muted-foreground text-sm">
                    Teachers can use our Basic plan forever for free. Schools and suppliers get 
                    a 14-day free trial of any paid plan.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h4 className="font-semibold text-foreground mb-2">What payment methods do you accept?</h4>
                  <p className="text-muted-foreground text-sm">
                    We accept all major credit cards, PayPal, and bank transfers for enterprise plans. 
                    All payments are processed securely.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                <HelpCircle className="w-4 h-4 mr-2" />
                View All FAQs
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary to-secondary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center text-white">
              <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl opacity-90 mb-8">
                Join thousands of educators and schools already using TeachConnect Global 
                to build amazing educational communities worldwide.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="outline" className="bg-white text-primary hover:bg-white/90">
                  Start Free Trial
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Talk to Sales
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Pricing;