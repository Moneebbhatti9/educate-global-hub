import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
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
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  Crown,
  Sparkles,
  Settings,
  Home,
  Rocket,
  Calendar,
  CreditCard,
  Shield,
  Star,
  Loader2,
  PartyPopper,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { subscriptionApi } from "@/apis/subscriptions";

const SubscriptionSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const { refetch: refetchSubscription } = useSubscription();

  const sessionId = searchParams.get("session_id");

  // Fetch subscription details
  const { data: subscriptionData, isLoading } = useQuery({
    queryKey: ["my-subscription"],
    queryFn: subscriptionApi.getMySubscription,
    enabled: isAuthenticated,
    refetchInterval: (data) => {
      // Keep polling until we have subscription data
      if (!data?.hasSubscription) {
        return 2000;
      }
      return false;
    },
  });

  // Refresh subscription context when data is loaded
  useEffect(() => {
    if (subscriptionData?.hasSubscription) {
      refetchSubscription();
    }
  }, [subscriptionData, refetchSubscription]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/subscription/success" } });
    }
  }, [isAuthenticated, navigate]);

  const subscription = subscriptionData?.subscription;
  const isTrialing = subscription?.isInTrial || subscription?.status === "trial";

  const getDashboardPath = () => {
    switch (user?.role) {
      case "teacher":
        return "/dashboard/teacher";
      case "school":
        return "/dashboard/school";
      case "admin":
        return "/dashboard/admin";
      default:
        return "/dashboard";
    }
  };

  const getSettingsPath = () => {
    switch (user?.role) {
      case "teacher":
        return "/teacher/settings";
      case "school":
        return "/school/settings";
      default:
        return "/settings";
    }
  };

  const features = [
    {
      icon: <Rocket className="w-5 h-5 text-primary" />,
      title: "Full Access Activated",
      description: "All premium features are now unlocked for your account",
    },
    {
      icon: <Shield className="w-5 h-5 text-green-600" />,
      title: "Secure Subscription",
      description: "Your subscription is protected with automatic renewal",
    },
    {
      icon: <Star className="w-5 h-5 text-amber-500" />,
      title: "Priority Support",
      description: "Get faster responses from our support team",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/50 via-background to-background dark:from-green-950/20">
      <Navigation />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-10">
            <div className="relative inline-block mb-6">
              {/* Animated celebration circles */}
              <div className="absolute inset-0 animate-ping bg-green-400/30 rounded-full"></div>
              <div className="absolute inset-2 animate-pulse bg-green-400/20 rounded-full"></div>
              <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-2xl shadow-green-500/30">
                <CheckCircle className="w-14 h-14 text-white" />
              </div>
              {/* Decorative sparkles */}
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-amber-400 animate-bounce" />
              <PartyPopper className="absolute -bottom-1 -left-3 w-5 h-5 text-primary animate-bounce" style={{ animationDelay: "0.2s" }} />
            </div>

            <h1 className="font-heading font-bold text-4xl sm:text-5xl text-foreground mb-4">
              Welcome to Premium!
            </h1>
            <p className="text-xl text-muted-foreground max-w-xl mx-auto">
              {isTrialing
                ? "Your free trial has started. Enjoy all premium features!"
                : "Your subscription is now active. Let's make the most of it!"}
            </p>
          </div>

          {/* Subscription Details Card */}
          <Card className="mb-8 border-2 border-green-200 dark:border-green-800 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-primary via-primary to-primary/80 p-6 text-white">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Crown className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Loading...
                        </span>
                      ) : (
                        subscription?.plan?.name || "Premium Plan"
                      )}
                    </h2>
                    <p className="text-white/80">
                      {isTrialing ? "Trial Period" : "Active Subscription"}
                    </p>
                  </div>
                </div>
                {isTrialing && (
                  <Badge className="bg-white/20 text-white border-white/30 text-sm px-4 py-1.5">
                    <Sparkles className="w-4 h-4 mr-1" />
                    Free Trial
                  </Badge>
                )}
              </div>
            </div>

            <CardContent className="p-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <span className="ml-3 text-muted-foreground">
                    Loading subscription details...
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl border">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {isTrialing ? "Trial Ends" : "Next Billing Date"}
                      </p>
                      <p className="font-semibold">
                        {subscription?.currentPeriodEnd
                          ? new Date(subscription.currentPeriodEnd).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl border">
                    <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                      <CreditCard className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className="font-semibold flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                        {isTrialing ? "Trial Active" : "Subscription Active"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {subscription?.daysRemaining && subscription.daysRemaining > 0 && (
                <div className="mt-4 p-4 bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-xl">
                  <p className="text-center text-sm">
                    <span className="font-bold text-primary text-lg">
                      {subscription.daysRemaining} days
                    </span>{" "}
                    <span className="text-muted-foreground">
                      remaining in your {isTrialing ? "trial period" : "current billing cycle"}
                    </span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Features Unlocked */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                What You've Unlocked
              </CardTitle>
              <CardDescription>
                Your premium benefits are now active
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 bg-gradient-to-r from-muted/50 to-muted/30 rounded-xl hover:from-muted/70 hover:to-muted/50 transition-all duration-300 border"
                  >
                    <div className="flex-shrink-0 p-3 bg-background rounded-xl shadow-sm border">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {feature.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* What's Next Card */}
          <Card className="mb-8 bg-gradient-to-br from-background to-muted/30">
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
              <CardDescription>
                Make the most of your subscription
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 text-white flex items-center justify-center font-bold shadow-lg">
                  1
                </div>
                <div className="pt-1">
                  <p className="font-semibold">Explore your dashboard</p>
                  <p className="text-sm text-muted-foreground">
                    Access all your new premium features from your personalized dashboard
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 text-white flex items-center justify-center font-bold shadow-lg">
                  2
                </div>
                <div className="pt-1">
                  <p className="font-semibold">Set up your preferences</p>
                  <p className="text-sm text-muted-foreground">
                    Customize your notification and privacy settings
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 text-white flex items-center justify-center font-bold shadow-lg">
                  3
                </div>
                <div className="pt-1">
                  <p className="font-semibold">Start using premium features</p>
                  <p className="text-sm text-muted-foreground">
                    {user?.role === "teacher"
                      ? "Upload and sell your teaching resources"
                      : "Post featured jobs and search for candidates"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="flex-1 h-14 text-base shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-r from-primary to-primary/90"
              onClick={() => navigate(getDashboardPath())}
            >
              <Home className="w-5 h-5 mr-2" />
              Go to Dashboard
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="flex-1 h-14 text-base border-2"
              onClick={() => navigate(getSettingsPath())}
            >
              <Settings className="w-5 h-5 mr-2" />
              Manage Subscription
            </Button>
          </div>

          {/* Help Text */}
          <p className="text-center text-sm text-muted-foreground mt-10">
            Need help? Contact our{" "}
            <a href="/contact" className="text-primary font-medium hover:underline">
              support team
            </a>{" "}
            anytime.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SubscriptionSuccess;
