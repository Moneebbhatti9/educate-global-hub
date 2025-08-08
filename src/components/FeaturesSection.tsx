import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Search, 
  BookOpen, 
  MessageCircle, 
  ShoppingCart, 
  Users, 
  Globe,
  ArrowRight,
  Briefcase
} from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      title: "Global Job Search",
      description: "Find teaching opportunities across all continents with advanced filtering by location, subject, and experience level.",
      icon: Search,
      color: "bg-brand-primary/10 text-brand-primary",
      stats: "50+ Countries",
      link: "/jobs"
    },
    {
      title: "Educational Resources",
      description: "Access and share high-quality teaching materials, lesson plans, and educational content from educators worldwide.",
      icon: BookOpen,
      color: "bg-brand-accent-green/10 text-brand-accent-green",
      stats: "10K+ Resources",
      link: "/resources"
    },
    {
      title: "Professional Forum",
      description: "Connect with fellow educators, share experiences, ask questions, and participate in meaningful discussions.",
      icon: MessageCircle,
      color: "bg-brand-secondary/10 text-brand-secondary",
      stats: "Active Community",
      link: "/forum"
    },
    {
      title: "Supplier Marketplace",
      description: "Discover and connect with trusted suppliers for educational materials, technology, and infrastructure needs.",
      icon: ShoppingCart,
      color: "bg-brand-accent-orange/10 text-brand-accent-orange",
      stats: "Verified Suppliers",
      link: "/suppliers"
    }
  ];

  const benefits = [
    {
      icon: Globe,
      title: "Global Reach",
      description: "Connect with opportunities and professionals across 6 continents"
    },
    {
      icon: Users,
      title: "Trusted Community",
      description: "Join thousands of verified educators and institutions"
    },
    {
      icon: Briefcase,
      title: "Career Growth",
      description: "Access professional development and advancement opportunities"
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground">
            Everything You Need in{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              One Platform
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From finding your dream job to accessing quality resources and connecting with professionals, 
            we've built the complete ecosystem for global education.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card 
                key={feature.title}
                className="group relative overflow-hidden border hover:border-brand-primary/20 transition-all duration-300 hover:shadow-card-hover transform hover:scale-105 bg-gradient-card"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="space-y-4">
                  <div className={`w-14 h-14 rounded-lg ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-7 h-7" />
                  </div>
                  <div>
                    <CardTitle className="font-heading text-xl text-foreground mb-2">
                      {feature.title}
                    </CardTitle>
                    <div className="text-sm font-medium text-brand-primary mb-3">
                      {feature.stats}
                    </div>
                    <CardDescription className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-between group-hover:bg-brand-primary/5 transition-colors"
                    asChild
                  >
                    <Link to={feature.link} className="group">
                      Explore
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>

                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </Card>
            );
          })}
        </div>

        {/* Benefits Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <div 
                key={benefit.title}
                className="flex items-start space-x-4 p-6 rounded-xl bg-background border border-border/50 hover:border-brand-primary/20 transition-all duration-300 hover:shadow-card group"
                style={{ animationDelay: `${(index + 4) * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-lg bg-brand-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="w-6 h-6 text-brand-primary" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <h3 className="font-heading font-bold text-2xl text-foreground mb-4">
            Ready to Transform Your Educational Journey?
          </h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of educators, schools, and education professionals who are already part of our global community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" asChild>
              <Link to="/register">Join Our Community</Link>
            </Button>
            <Button variant="hero-outline" size="lg" asChild>
              <Link to="/demo">Request a Demo</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;