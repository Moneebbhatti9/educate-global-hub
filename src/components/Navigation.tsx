import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Globe, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading font-bold text-xl text-foreground">
              Educate Link
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/jobs"
              className="text-foreground hover:text-brand-primary font-medium transition-colors"
            >
              Find Jobs
            </Link>
            <Link
              to="/resources"
              className="text-foreground hover:text-brand-primary font-medium transition-colors"
            >
              Resources
            </Link>
            <Link
              to="/forum"
              className="text-foreground hover:text-brand-primary font-medium transition-colors"
            >
              Forum
            </Link>
            <Link
              to="/suppliers"
              className="text-foreground hover:text-brand-primary font-medium transition-colors"
            >
              Suppliers
            </Link>
            <div className="flex items-center space-x-3">
              {isAuthenticated && user ? (
                <>
                  <Button variant="ghost" asChild>
                    <Link to={`/dashboard/${user.role}`}>
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <Button variant="hero" asChild>
                    <Link to="/register">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background border-t">
              <Link
                to="/jobs"
                className="block px-3 py-2 text-foreground hover:text-brand-primary font-medium transition-colors"
                onClick={toggleMenu}
              >
                Find Jobs
              </Link>
              <Link
                to="/resources"
                className="block px-3 py-2 text-foreground hover:text-brand-primary font-medium transition-colors"
                onClick={toggleMenu}
              >
                Resources
              </Link>
              <Link
                to="/forum"
                className="block px-3 py-2 text-foreground hover:text-brand-primary font-medium transition-colors"
                onClick={toggleMenu}
              >
                Forum
              </Link>
              {/* <Link
                to="/suppliers"
                className="block px-3 py-2 text-foreground hover:text-brand-primary font-medium transition-colors"
                onClick={toggleMenu}
              >
                Suppliers
              </Link> */}
              <div className="pt-4 pb-3 border-t border-border">
                <div className="flex flex-col space-y-3 px-3">
                  {isAuthenticated && user ? (
                    <>
                      <Button variant="ghost" asChild className="justify-start">
                        <Link
                          to={`/dashboard/${user.role}`}
                          onClick={toggleMenu}
                        >
                          <LayoutDashboard className="w-4 h-4 mr-2" />
                          Dashboard
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" asChild className="justify-start">
                        <Link to="/login" onClick={toggleMenu}>
                          Sign In
                        </Link>
                      </Button>
                      <Button variant="hero" asChild>
                        <Link to="/register" onClick={toggleMenu}>
                          Get Started
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
