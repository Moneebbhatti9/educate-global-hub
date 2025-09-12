import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search, Home, ArrowLeft, Compass } from "lucide-react";
import Navigation from "@/components/Navigation";

const NotFound: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl mx-auto text-center">
          {/* Large 404 Display */}
          <div className="relative mb-8">
            <div className="text-[12rem] sm:text-[16rem] font-black text-primary/10 leading-none select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center backdrop-blur-sm border border-border/50">
                <Search className="w-12 h-12 sm:w-16 sm:h-16 text-primary" />
              </div>
            </div>
          </div>

          {/* Error Card */}
          <Card className="shadow-card border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="space-y-4">
              <CardTitle className="font-heading font-bold text-3xl sm:text-4xl text-foreground">
                Page Not Found
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground max-w-md mx-auto">
                The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Attempted Path */}
              <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Attempted to access:
                </p>
                <code className="text-primary font-mono text-sm break-all">
                  {location.pathname}
                </code>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => navigate(-1)}
                  variant="outline"
                  size="lg"
                  className="flex-1 sm:flex-initial"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </Button>
                <Button
                  onClick={() => navigate("/")}
                  variant="default"
                  size="lg"
                  className="flex-1 sm:flex-initial"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Return Home
                </Button>
                <Button
                  onClick={() => navigate("/jobs")}
                  variant="secondary"
                  size="lg"
                  className="flex-1 sm:flex-initial"
                >
                  <Compass className="w-4 h-4 mr-2" />
                  Explore Jobs
                </Button>
              </div>

              {/* Quick Links */}
              <div className="pt-6 border-t border-border/30">
                <p className="text-sm font-medium text-muted-foreground mb-3">
                  Popular pages:
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/about")}
                    className="text-xs"
                  >
                    About Us
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/contact")}
                    className="text-xs"
                  >
                    Contact
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/pricing")}
                    className="text-xs"
                  >
                    Pricing
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/forum")}
                    className="text-xs"
                  >
                    Forum
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
