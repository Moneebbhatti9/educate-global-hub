import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Users,
  BookOpen,
  MessageSquare,
  Package,
  LayoutDashboard,
} from "lucide-react";
import heroImage from "@/assets/hero-education.jpg";
import { useAuth } from "@/contexts/AuthContext";

const HeroSection = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background to-muted py-16 sm:py-24 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-slide-up">
            <div className="space-y-4">
              <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl text-foreground leading-tight">
                Connect{" "}
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  Global Education
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-muted-foreground font-medium">
                Where teachers, schools, recruiters, and suppliers unite to
                build the future of education worldwide.
              </p>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Find teaching opportunities across continents, discover
                educational resources, connect with professionals, and access
                everything you need for educational excellence.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {isAuthenticated && user ? (
                <>
                  <Button variant="hero" size="xl" asChild>
                    <Link to={`/dashboard/${user.role}`} className="group">
                      <LayoutDashboard className="mr-2 h-5 w-5" />
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  <Button variant="hero-outline" size="xl" asChild>
                    <Link to="/jobs">Browse Jobs</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="hero" size="xl" asChild>
                    <Link to="/register" className="group">
                      Get Started Today
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  <Button variant="hero-outline" size="xl" asChild>
                    <Link to="/jobs">Browse Jobs</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-border/50">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-lg bg-brand-primary/10">
                  <Users className="w-6 h-6 text-brand-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground">10K+</div>
                <div className="text-sm text-muted-foreground">Teachers</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-lg bg-brand-accent-green/10">
                  <BookOpen className="w-6 h-6 text-brand-accent-green" />
                </div>
                <div className="text-2xl font-bold text-foreground">5K+</div>
                <div className="text-sm text-muted-foreground">Schools</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-lg bg-brand-secondary/10">
                  <MessageSquare className="w-6 h-6 text-brand-secondary" />
                </div>
                <div className="text-2xl font-bold text-foreground">1K+</div>
                <div className="text-sm text-muted-foreground">Discussions</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-lg bg-brand-accent-orange/10">
                  <Package className="w-6 h-6 text-brand-accent-orange" />
                </div>
                <div className="text-2xl font-bold text-foreground">500+</div>
                <div className="text-sm text-muted-foreground">Suppliers</div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative lg:pl-8 animate-fade-in">
            <div className="relative">
              <img
                src={heroImage}
                alt="Global education community connecting teachers, schools, and education professionals"
                className="w-full h-auto rounded-2xl shadow-hero transform hover:scale-105 transition-transform duration-500"
              />
              {/* Floating elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-brand-primary/20 rounded-full animate-float"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-brand-secondary/20 rounded-full animate-float delay-1000"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
