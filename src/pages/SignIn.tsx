import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Globe,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { customToast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { loginSchema } from "@/helpers/validation";
import { useFormValidation } from "@/hooks/useFormValidation";
import SocialLoginButton from "@/components/SocialLoginButton";

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleError, showSuccess } = useErrorHandler();
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isFromProfileCompletion, setIsFromProfileCompletion] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    getFieldError,
  } = useFormValidation({
    schema: loginSchema,
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const formData = watch();

  // Check if user is coming from profile completion
  useEffect(() => {
    if (location.state?.message && location.state?.email) {
      setIsFromProfileCompletion(true);
      setValue("email", location.state.email);

      // Show success message
      customToast.success("Profile Completed!", location.state.message);
    }
  }, [location.state, setValue]);

  const handleFormSubmit = async (data: {
    email: string;
    password: string;
    rememberMe?: boolean;
  }) => {
    try {
      await login({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
      });

      if (isFromProfileCompletion) {
        showSuccess(
          "Welcome to your dashboard!",
          "Your profile is now complete and you have full access."
        );
      } else {
        showSuccess("Welcome back!", "Successfully signed in to your account.");
      }
    } catch (error) {
      handleError(error, "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-hero flex items-center justify-center">
                <Globe className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
              Welcome Back
            </h1>
            <p className="text-muted-foreground">
              Sign in to your Educate Link account and continue connecting with
              the global education community.
            </p>
          </div>

          {/* Profile Completion Success Banner */}
          {isFromProfileCompletion && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <h3 className="font-medium text-green-800">
                    🎉 Profile Completed Successfully!
                  </h3>
                  <p className="text-sm text-green-700 mt-1">
                    Your profile is now complete. Please sign in to access your
                    dashboard.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Sign In Form */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="font-heading text-xl text-center">
                Sign In
              </CardTitle>
              <CardDescription className="text-center">
                {isFromProfileCompletion
                  ? "Your email has been pre-filled. Enter your password to access your dashboard."
                  : "Enter your credentials to access your account"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleSubmit(handleFormSubmit)}
                className="space-y-4"
              >
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className={`pl-10 ${
                        errors.email ? "border-destructive" : ""
                      }`}
                      {...register("email")}
                    />
                  </div>
                  {getFieldError("email") && (
                    <p className="text-sm text-destructive">
                      {getFieldError("email")}
                    </p>
                  )}
                  {isFromProfileCompletion && (
                    <p className="text-sm text-green-600">
                      ✓ Email pre-filled from your completed profile
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className={`pl-10 pr-10 ${
                        errors.password ? "border-destructive" : ""
                      }`}
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {getFieldError("password") && (
                    <p className="text-sm text-destructive">
                      {getFieldError("password")}
                    </p>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="rememberMe"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) =>
                        setValue("rememberMe", checked as boolean)
                      }
                    />
                    <Label htmlFor="rememberMe" className="text-sm">
                      Remember me
                    </Label>
                  </div>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-brand-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Sign In Button */}
                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="my-6">
                <Separator />
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-4">
                <SocialLoginButton provider="google">Google</SocialLoginButton>
                <SocialLoginButton provider="facebook">
                  Facebook
                </SocialLoginButton>
              </div>

              {/* Sign Up Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-brand-primary hover:underline font-medium"
                  >
                    Sign up for free
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Additional Links */}
          <div className="mt-8 text-center space-y-2">
            <div className="text-sm text-muted-foreground">
              By signing in, you agree to our{" "}
              <Link to="/terms" className="text-brand-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                className="text-brand-primary hover:underline"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SignIn;
