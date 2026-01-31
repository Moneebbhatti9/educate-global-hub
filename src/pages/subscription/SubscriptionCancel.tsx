import { useNavigate, useSearchParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  XCircle,
  ArrowLeft,
  Crown,
  HelpCircle,
  MessageCircle,
  RefreshCw,
  Home,
  CheckCircle,
  Shield,
  Zap,
  Users,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const SubscriptionCancel = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, user } = useAuth();

  const planSlug = searchParams.get("plan");

  const getDashboardPath = () => {
    switch (user?.role) {
      case "teacher":
        return "/dashboard/teacher";
      case "school":
        return "/dashboard/school";
      case "admin":
        return "/dashboard/admin";
      default:
        return "/";
    }
  };

  const benefits = [
    {
      icon: <Crown className="w-5 h-5 text-primary" />,
      title: "Premium Features",
      description: "Access all premium tools and capabilities",
    },
    {
      icon: <Shield className="w-5 h-5 text-green-600" />,
      title: "Priority Support",
      description: "Get help faster with dedicated support",
    },
    {
      icon: <Zap className="w-5 h-5 text-amber-500" />,
      title: "Advanced Tools",
      description: "Use professional-grade features",
    },
    {
      icon: <Users className="w-5 h-5 text-blue-500" />,
      title: "Unlimited Access",
      description: "No restrictions on usage limits",
    },
  ];

  const faqs = [
    {
      question: "Can I try before I buy?",
      answer: "Yes! Most of our plans come with a free trial period so you can explore all features risk-free.",
    },
    {
      question: "Can I cancel anytime?",
      answer: "Absolutely. You can cancel your subscription at any time, and you'll retain access until the end of your billing period.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, and PayPal through our secure payment processor, Stripe.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/30 via-background to-background dark:from-amber-950/10">
      <Navigation />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-lg"></div>
              <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/50 dark:to-amber-800/50 border-2 border-amber-300 dark:border-amber-700">
                <XCircle className="w-10 h-10 text-amber-600 dark:text-amber-400" />
              </div>
            </div>

            <h1 className="font-heading font-bold text-3xl sm:text-4xl text-foreground mb-4">
              Checkout Cancelled
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto">
              No worries! Your checkout was cancelled and you haven't been charged.
              You can always come back when you're ready.
            </p>
          </div>

          {/* Main Card */}
          <Card className="mb-8 border-2 border-amber-200/50 dark:border-amber-800/50 shadow-lg">
            <CardHeader className="text-center pb-4">
              <Badge variant="outline" className="w-fit mx-auto mb-3 text-amber-600 border-amber-300">
                <RefreshCw className="w-3 h-3 mr-1" />
                No Charge Made
              </Badge>
              <CardTitle className="text-xl">Changed Your Mind?</CardTitle>
              <CardDescription>
                Here's what you're missing out on with our premium plans
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl border hover:bg-muted/70 transition-colors"
                  >
                    <div className="flex-shrink-0 p-2 bg-background rounded-lg shadow-sm border">
                      {benefit.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground text-sm">
                        {benefit.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  className="flex-1 h-12 bg-gradient-to-r from-primary to-primary/90 shadow-md hover:shadow-lg transition-shadow"
                  onClick={() => navigate("/pricing")}
                >
                  <Crown className="w-5 h-5 mr-2" />
                  View Plans Again
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1 h-12 border-2"
                  onClick={() => navigate(getDashboardPath())}
                >
                  <Home className="w-5 h-5 mr-2" />
                  {isAuthenticated ? "Go to Dashboard" : "Go Home"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <HelpCircle className="w-5 h-5 text-primary" />
                Common Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="p-4 bg-muted/30 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <h4 className="font-medium text-foreground mb-1 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {faq.question}
                  </h4>
                  <p className="text-sm text-muted-foreground pl-6">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Help Section */}
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                <div className="flex-shrink-0 p-3 bg-primary/10 rounded-full">
                  <MessageCircle className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">
                    Need Help Deciding?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Our team is here to answer any questions about our plans and help you choose the right one.
                  </p>
                </div>
                <Button variant="outline" onClick={() => navigate("/contact")}>
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Back Link */}
          <div className="text-center mt-8">
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SubscriptionCancel;
