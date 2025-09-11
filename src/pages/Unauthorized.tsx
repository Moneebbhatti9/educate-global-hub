import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShieldX, Home, ArrowLeft, Lock, User, Settings } from "lucide-react";
import Navigation from "@/components/Navigation";

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl mx-auto text-center">
          {/* Large Access Denied Display */}
          <div className="relative mb-8">
            <div className="text-[8rem] sm:text-[12rem] font-black text-destructive/10 leading-none select-none">
              403
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-destructive/20 to-orange-500/20 flex items-center justify-center backdrop-blur-sm border border-border/50">
                <Lock className="w-12 h-12 sm:w-16 sm:h-16 text-destructive" />
              </div>
            </div>
          </div>

          {/* Error Card */}
          <Card className="shadow-card border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center space-y-4">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-destructive/10 to-destructive/5 flex items-center justify-center border border-destructive/20">
                  <ShieldX className="w-10 h-10 text-destructive" />
                </div>
              </div>
              <CardTitle className="font-heading font-bold text-3xl sm:text-4xl text-foreground">
                Access Denied
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground max-w-md mx-auto">
                You don't have the required permissions to access this page. Please contact your administrator if you believe this is an error.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Info Section */}
              <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                <div className="flex items-center gap-3 mb-3">
                  <User className="w-5 h-5 text-primary" />
                  <p className="text-sm font-medium text-foreground">
                    Permission Required
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  This page requires special access privileges. If you need access, please contact your system administrator or check your account permissions.
                </p>
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
                  onClick={() => navigate("/login")}
                  variant="secondary"
                  size="lg"
                  className="flex-1 sm:flex-initial"
                >
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </div>

              {/* Help Section */}
              <div className="pt-6 border-t border-border/30">
                <p className="text-sm font-medium text-muted-foreground mb-3">
                  Need help?
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/contact")}
                    className="text-xs"
                  >
                    <Settings className="w-3 h-3 mr-1" />
                    Contact Support
                  </Button>
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
                    onClick={() => navigate("/help")}
                    className="text-xs"
                  >
                    Help Center
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

export default Unauthorized;
