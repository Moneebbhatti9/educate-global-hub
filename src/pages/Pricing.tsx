import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { subscriptionApi } from "@/apis/subscriptions";
import type { SubscriptionPlan, PlansGroupedByRole } from "@/types/subscription";
import {
  Check,
  Star,
  Phone,
  Loader2,
  Crown,
  Sparkles,
  Shield,
  Zap,
  ArrowRight,
  Building2,
  GraduationCap,
  Users,
  BookOpen,
  Award,
  TrendingUp,
  Clock,
  Headphones,
  ChevronRight,
  Play,
  Quote,
} from "lucide-react";

const Pricing = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [isAnnual, setIsAnnual] = useState(true);
  const [selectedRole, setSelectedRole] = useState<"teacher" | "school">("teacher");

  const { data: plansData, isLoading: plansLoading } = useQuery({
    queryKey: ["subscription-plans-all"],
    queryFn: subscriptionApi.getAllPlans,
  });

  const checkoutMutation = useMutation({
    mutationFn: (planId: string) => subscriptionApi.createCheckout(planId),
    onSuccess: (data) => {
      window.location.href = data.checkoutUrl;
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to start checkout.");
    },
  });

  const getCurrentPlans = (): SubscriptionPlan[] => {
    if (!plansData) return [];
    const rolePlans = plansData[selectedRole as keyof PlansGroupedByRole] || [];
    return rolePlans
      .filter(plan => plan.isActive)
      .filter(plan => isAnnual ? plan.billingPeriod === 'annual' : plan.billingPeriod === 'monthly')
      .sort((a, b) => a.sortOrder - b.sortOrder);
  };

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    if (plan.price === 0) {
      if (!isAuthenticated) navigate("/register");
      else toast.success("You're on the free plan!");
      return;
    }
    if (!isAuthenticated) {
      toast.info("Please sign in to subscribe");
      navigate("/login", { state: { from: "/pricing" } });
      return;
    }
    if (user?.role !== plan.targetRole) {
      toast.error(`This plan is for ${plan.targetRole}s.`);
      return;
    }
    checkoutMutation.mutate(plan._id);
  };

  const isPopularPlan = (plan: SubscriptionPlan, plans: SubscriptionPlan[]) => {
    if (plan.highlight === 'popular' || plan.highlight === 'Most Popular') return true;
    if (plans.length >= 2) return plans[Math.min(1, plans.length - 1)]._id === plan._id;
    return false;
  };

  const currentPlans = getCurrentPlans();

  const stats = [
    { value: "50K+", label: "Active Teachers", icon: Users },
    { value: "2,500+", label: "Partner Schools", icon: Building2 },
    { value: "100+", label: "Countries", icon: TrendingUp },
    { value: "4.9/5", label: "User Rating", icon: Star },
  ];

  const testimonials = [
    {
      quote: "Educate Link helped me find my dream teaching position in Dubai within weeks. The premium features made all the difference.",
      author: "Sarah Mitchell",
      role: "International Teacher",
      avatar: "SM",
    },
    {
      quote: "We've hired 15 exceptional teachers through the platform. The candidate search feature saves us countless hours.",
      author: "James Chen",
      role: "HR Director, British School",
      avatar: "JC",
    },
  ];

  const features = {
    teacher: [
      { icon: BookOpen, title: "Resource Marketplace", desc: "Upload and sell your teaching materials globally" },
      { icon: Zap, title: "Priority Applications", desc: "Stand out to recruiters with highlighted profiles" },
      { icon: Award, title: "Verified Badge", desc: "Build trust with a verified creator status" },
      { icon: Headphones, title: "Priority Support", desc: "Get help faster with dedicated support" },
    ],
    school: [
      { icon: Users, title: "Candidate Search", desc: "Access our database of qualified teachers" },
      { icon: Star, title: "Featured Listings", desc: "Get 3x more visibility for your job posts" },
      { icon: TrendingUp, title: "Analytics Dashboard", desc: "Track applications and hiring metrics" },
      { icon: Clock, title: "Faster Hiring", desc: "Reduce time-to-hire by up to 60%" },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-primary/90 text-white">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }} />
          </div>

          <div className="container relative mx-auto px-4 py-16 lg:py-20">
            <div className="max-w-3xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-medium">Trusted by 50,000+ educators worldwide</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                Invest in Your
                <span className="block bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">
                  Teaching Career
                </span>
              </h1>

              <p className="text-lg text-white/70 mb-8 max-w-xl mx-auto">
                Unlock premium features to accelerate your career or find the perfect teaching talent for your school.
              </p>

              {/* Role Toggle */}
              <div className="inline-flex p-1.5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <button
                  onClick={() => setSelectedRole("teacher")}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all ${
                    selectedRole === "teacher"
                      ? "bg-white text-slate-900 shadow-lg"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <GraduationCap className="w-5 h-5" />
                  For Teachers
                </button>
                <button
                  onClick={() => setSelectedRole("school")}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all ${
                    selectedRole === "school"
                      ? "bg-white text-slate-900 shadow-lg"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Building2 className="w-5 h-5" />
                  For Schools
                </button>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <stat.icon className="w-5 h-5 mx-auto mb-2 text-amber-400" />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-white/60">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Wave Divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
              <path d="M0 60V30C240 50 480 10 720 30C960 50 1200 10 1440 30V60H0Z" fill="hsl(var(--background))" />
            </svg>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4">
            {/* Billing Toggle */}
            <div className="flex justify-center mb-10">
              <div className="inline-flex items-center gap-3 p-1 bg-muted rounded-full">
                <button
                  onClick={() => setIsAnnual(false)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                    !isAnnual ? "bg-background shadow-md text-foreground" : "text-muted-foreground"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setIsAnnual(true)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                    isAnnual ? "bg-background shadow-md text-foreground" : "text-muted-foreground"
                  }`}
                >
                  Annual
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 text-xs">
                    Save 20%
                  </Badge>
                </button>
              </div>
            </div>

            {/* Pricing Cards */}
            {plansLoading ? (
              <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="p-6">
                    <Skeleton className="h-6 w-24 mb-4" />
                    <Skeleton className="h-12 w-32 mb-6" />
                    <Skeleton className="h-10 w-full mb-4" />
                    <div className="space-y-3">
                      {[1, 2, 3, 4].map((j) => <Skeleton key={j} className="h-4 w-full" />)}
                    </div>
                  </Card>
                ))}
              </div>
            ) : currentPlans.length === 0 ? (
              <div className="text-center py-16">
                <Crown className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No plans available</h3>
                <p className="text-muted-foreground mb-4">
                  {isAnnual ? "Try monthly billing" : "Check back soon"}
                </p>
                {isAnnual && (
                  <Button variant="outline" onClick={() => setIsAnnual(false)}>View Monthly</Button>
                )}
              </div>
            ) : (
              <div className={`grid gap-6 max-w-5xl mx-auto ${
                currentPlans.length === 1 ? "md:grid-cols-1 max-w-md" :
                currentPlans.length === 2 ? "md:grid-cols-2 max-w-3xl" :
                "md:grid-cols-3"
              }`}>
                {currentPlans.map((plan) => {
                  const popular = isPopularPlan(plan, currentPlans);
                  const monthlyEquiv = plan.billingPeriod === 'annual' && plan.price > 0
                    ? Math.round(plan.price / 12 / 100) : null;

                  return (
                    <Card
                      key={plan._id}
                      className={`relative overflow-hidden transition-all duration-300 ${
                        popular
                          ? "border-2 border-primary shadow-2xl shadow-primary/20 scale-[1.02]"
                          : "hover:shadow-xl hover:border-primary/30"
                      }`}
                    >
                      {/* Popular Banner */}
                      {popular && (
                        <div className="bg-gradient-to-r from-primary via-primary to-secondary text-white text-center py-2 text-sm font-semibold flex items-center justify-center gap-2">
                          <Crown className="w-4 h-4" />
                          RECOMMENDED
                        </div>
                      )}

                      <div className={`p-6 ${popular ? '' : 'pt-8'}`}>
                        {/* Plan Header */}
                        <div className="mb-6">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-xl">{plan.name}</h3>
                            {plan.trialDays > 0 && plan.price > 0 && (
                              <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                {plan.trialDays} days free
                              </Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground text-sm">{plan.description}</p>
                        </div>

                        {/* Price */}
                        <div className="mb-6">
                          {plan.price === 0 ? (
                            <div className="flex items-baseline gap-1">
                              <span className="text-4xl font-bold">Free</span>
                              <span className="text-muted-foreground">forever</span>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-baseline gap-1">
                                <span className="text-lg text-muted-foreground">£</span>
                                <span className="text-4xl font-bold">{(plan.price / 100).toFixed(0)}</span>
                                <span className="text-muted-foreground">
                                  /{plan.billingPeriod === 'annual' ? 'year' : 'month'}
                                </span>
                              </div>
                              {monthlyEquiv && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  That's just £{monthlyEquiv}/month
                                </p>
                              )}
                            </>
                          )}
                        </div>

                        {/* CTA Button */}
                        <Button
                          className={`w-full h-12 text-base font-semibold mb-6 ${
                            popular
                              ? "bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg shadow-primary/30"
                              : ""
                          }`}
                          variant={popular ? "default" : "outline"}
                          onClick={() => handleSelectPlan(plan)}
                          disabled={checkoutMutation.isPending}
                        >
                          {checkoutMutation.isPending ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : plan.price === 0 ? (
                            <>Get Started Free</>
                          ) : plan.trialDays > 0 ? (
                            <>Start Free Trial</>
                          ) : (
                            <>Subscribe Now</>
                          )}
                          {!checkoutMutation.isPending && <ArrowRight className="w-5 h-5 ml-2" />}
                        </Button>

                        {/* Features */}
                        <div className="space-y-3">
                          <p className="text-sm font-semibold text-foreground">What's included:</p>
                          {plan.features.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                              <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0 mt-0.5">
                                <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                              </div>
                              <span className="text-sm text-muted-foreground">{feature}</span>
                            </div>
                          ))}
                        </div>

                        {/* Usage Limits */}
                        {plan.limits && Object.values(plan.limits).some(v => v !== null && v !== undefined) && (
                          <div className="mt-6 pt-6 border-t space-y-2">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Usage Limits</p>
                            <div className="flex flex-wrap gap-2">
                              {plan.limits.featuredListings != null && (
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted rounded-full text-xs">
                                  <Zap className="w-3 h-3 text-primary" />
                                  {plan.limits.featuredListings === -1 ? 'Unlimited' : plan.limits.featuredListings} featured
                                </div>
                              )}
                              {plan.limits.candidateSearches != null && (
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted rounded-full text-xs">
                                  <Users className="w-3 h-3 text-primary" />
                                  {plan.limits.candidateSearches === -1 ? 'Unlimited' : plan.limits.candidateSearches} searches
                                </div>
                              )}
                              {plan.limits.resourceUploads != null && (
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted rounded-full text-xs">
                                  <BookOpen className="w-3 h-3 text-primary" />
                                  {plan.limits.resourceUploads === -1 ? 'Unlimited' : plan.limits.resourceUploads} uploads
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-8 mt-10 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">256-bit SSL Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" />
                </svg>
                <span className="text-sm font-medium">Powered by Stripe</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium">Cancel Anytime</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 lg:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                Why Upgrade to Premium?
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                {selectedRole === "teacher"
                  ? "Unlock powerful tools to grow your teaching career and income"
                  : "Find and hire the best teaching talent faster than ever"
                }
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {features[selectedRole].map((feature, idx) => (
                <Card key={idx} className="p-5 hover:shadow-lg transition-shadow group">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                Loved by Educators Worldwide
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {testimonials.map((testimonial, idx) => (
                <Card key={idx} className="p-6 relative">
                  <Quote className="absolute top-4 right-4 w-8 h-8 text-muted/20" />
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold shrink-0">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-3 italic">"{testimonial.quote}"</p>
                      <p className="font-semibold">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 lg:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">
                Frequently Asked Questions
              </h2>

              <div className="grid gap-4">
                {[
                  { q: "Can I cancel anytime?", a: "Yes, you can cancel your subscription at any time. You'll retain access until the end of your billing period." },
                  { q: "Is there a free trial?", a: "Most paid plans include a free trial period. You won't be charged until the trial ends." },
                  { q: "Can I change plans later?", a: "Absolutely! Upgrade or downgrade anytime. Upgrades are immediate with prorated billing." },
                  { q: "What payment methods do you accept?", a: "We accept all major credit/debit cards and PayPal via our secure Stripe integration." },
                ].map((faq, idx) => (
                  <Card key={idx} className="p-5">
                    <h4 className="font-semibold flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <ChevronRight className="w-4 h-4 text-primary" />
                      </div>
                      {faq.q}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-2 pl-8">{faq.a}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Enterprise CTA */}
        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <Card className="max-w-4xl mx-auto overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                  <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 mb-4">Enterprise</Badge>
                  <h3 className="text-2xl font-bold mb-3">Need a Custom Solution?</h3>
                  <p className="text-white/70 mb-6">
                    Large organizations get custom pricing, dedicated support, and advanced features.
                  </p>
                  <ul className="space-y-2 text-sm">
                    {["Custom pricing", "Dedicated account manager", "API access", "SSO integration", "Priority support"].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-white/80">
                        <Check className="w-4 h-4 text-amber-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <p className="text-muted-foreground mb-6">
                    Let's discuss how Educate Link can help your organization achieve its goals.
                  </p>
                  <div className="space-y-3">
                    <Button className="w-full" onClick={() => navigate("/contact")}>
                      <Phone className="w-4 h-4 mr-2" />
                      Schedule a Demo
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => navigate("/contact")}>
                      Contact Sales
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 bg-gradient-to-r from-primary via-primary/95 to-secondary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              Ready to Take the Next Step?
            </h2>
            <p className="text-white/80 mb-8 max-w-lg mx-auto">
              Join thousands of educators already growing their careers with Educate Link.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 shadow-lg"
                onClick={() => navigate(isAuthenticated ? "/dashboard/teacher" : "/register")}
              >
                {isAuthenticated ? "Go to Dashboard" : "Start Free Today"}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
                onClick={() => navigate("/contact")}
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
