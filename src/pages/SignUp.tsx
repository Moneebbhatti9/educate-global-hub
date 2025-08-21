import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { Badge } from "@/components/ui/badge";
import {
  Globe,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowRight,
  GraduationCap,
  School,
  UserCheck,
  Truck,
  Check,
} from "lucide-react";
import { customToast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { signupSchema } from "@/helpers/validation";
import { useFormValidation } from "@/hooks/useFormValidation";

export type UserRole = "teacher" | "school" | "recruiter" | "supplier";

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  agreeToTerms: boolean;
  receiveUpdates: boolean;
}

const SignUp = () => {
  const navigate = useNavigate();

  const { handleError, showSuccess } = useErrorHandler();
  const { signup, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    getFieldError,
  } = useFormValidation({
    schema: signupSchema,
    mode: "onTouched",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "teacher" as UserRole,
      agreeToTerms: false,
      receiveUpdates: false,
    },
  });

  const formData = watch();

  const roles = [
    {
      id: "teacher" as UserRole,
      name: "Teacher",
      description: "Find teaching opportunities worldwide",
      icon: GraduationCap,
      color:
        "border-brand-primary bg-brand-primary/5 hover:bg-brand-primary/10",
      available: true,
    },
    {
      id: "school" as UserRole,
      name: "School",
      description: "Recruit qualified educators",
      icon: School,
      color:
        "border-brand-accent-green bg-brand-accent-green/5 hover:bg-brand-accent-green/10",
      available: true,
    },
    {
      id: "recruiter" as UserRole,
      name: "Recruiter",
      description: "Coming Soon",
      icon: UserCheck,
      color: "border-muted bg-muted/5 hover:bg-muted/10",
      available: false,
    },
    {
      id: "supplier" as UserRole,
      name: "Supplier",
      description: "Coming Soon",
      icon: Truck,
      color: "border-muted bg-muted/5 hover:bg-muted/10",
      available: false,
    },
  ];

  const handleFormSubmit = async (data: {
    role: "teacher" | "school" | "recruiter" | "supplier" | "admin";
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    agreeToTerms: boolean;
    receiveUpdates?: boolean;
  }) => {
    // Check if selected role is available
    const selectedRole = roles.find((r) => r.id === data.role);
    if (!selectedRole?.available) {
      handleError(
        new Error("Selected role is not available"),
        "Invalid role selection"
      );
      return;
    }

    try {
      await signup({
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        agreeToTerms: data.agreeToTerms,
      });

      showSuccess(
        "Account created successfully!",
        "Please check your email for verification."
      );

      // Navigate to OTP verification with user data
      navigate("/otp-verification", {
        state: {
          email: data.email,
          role: data.role,
          firstName: data.firstName,
          lastName: data.lastName,
        },
      });
    } catch (error) {
      handleError(error, "Signup failed");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-hero flex items-center justify-center">
                <Globe className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
              Join Educate Link
            </h1>
            <p className="text-muted-foreground">
              Create your account and become part of the global education
              community.
            </p>
          </div>

          {/* Sign Up Form */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="font-heading text-xl text-center">
                Create Your Account
              </CardTitle>
              <CardDescription className="text-center">
                Fill in your details to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleSubmit(handleFormSubmit)}
                className="space-y-6"
              >
                {/* Name Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="Enter your first name"
                        className={`pl-10 ${
                          errors.firstName ? "border-destructive" : ""
                        }`}
                        {...register("firstName")}
                      />
                    </div>
                    {getFieldError("firstName") && (
                      <p className="text-sm text-destructive">
                        {getFieldError("firstName")}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Enter your last name"
                        className={`pl-10 ${
                          errors.lastName ? "border-destructive" : ""
                        }`}
                        {...register("lastName")}
                      />
                    </div>
                    {getFieldError("lastName") && (
                      <p className="text-sm text-destructive">
                        {getFieldError("lastName")}
                      </p>
                    )}
                  </div>
                </div>

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
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
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
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        className={`pl-10 pr-10 ${
                          errors.confirmPassword ? "border-destructive" : ""
                        }`}
                        {...register("confirmPassword")}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {getFieldError("confirmPassword") && (
                      <p className="text-sm text-destructive">
                        {getFieldError("confirmPassword")}
                      </p>
                    )}
                  </div>
                </div>

                {/* Role Selection */}
                <div className="space-y-3">
                  <Label htmlFor="role">Choose Your Role</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {roles.map((role) => {
                      const IconComponent = role.icon;
                      return (
                        <div
                          key={role.id}
                          onClick={() =>
                            role.available && setValue("role", role.id)
                          }
                          className={`relative p-4 border-2 rounded-lg transition-all duration-200 ${
                            !role.available
                              ? "border-muted bg-muted/20 cursor-not-allowed opacity-60"
                              : formData.role === role.id
                              ? `${role.color} border-current cursor-pointer`
                              : "border-border hover:border-muted-foreground cursor-pointer"
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                formData.role === role.id
                                  ? "bg-current/10"
                                  : "bg-muted"
                              }`}
                            >
                              <IconComponent className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-sm">
                                {role.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {role.description}
                              </div>
                            </div>
                            {formData.role === role.id && role.available && (
                              <div className="absolute top-2 right-2">
                                <div className="w-5 h-5 rounded-full bg-current flex items-center justify-center">
                                  <Check className="w-3 h-3 text-white" />
                                </div>
                              </div>
                            )}
                            {!role.available && (
                              <div className="absolute top-2 right-2">
                                <Badge variant="secondary" className="text-xs">
                                  Coming Soon
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {getFieldError("role") && (
                    <p className="text-sm text-destructive">
                      {getFieldError("role")}
                    </p>
                  )}
                </div>

                {/* Checkboxes */}
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) =>
                        setValue("agreeToTerms", checked as boolean)
                      }
                      className="mt-1"
                    />
                    <Label htmlFor="terms" className="text-sm leading-relaxed">
                      I agree to the{" "}
                      <Link
                        to="/terms"
                        className="text-brand-primary hover:underline"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        to="/privacy"
                        className="text-brand-primary hover:underline"
                      >
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                  {getFieldError("agreeToTerms") && (
                    <p className="text-sm text-destructive ml-6">
                      {getFieldError("agreeToTerms")}
                    </p>
                  )}
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="updates"
                      checked={formData.receiveUpdates}
                      onCheckedChange={(checked) =>
                        setValue("receiveUpdates", checked as boolean)
                      }
                      className="mt-1"
                    />
                    <Label
                      htmlFor="updates"
                      className="text-sm leading-relaxed"
                    >
                      I would like to receive updates about new features, job
                      opportunities, and educational resources
                    </Label>
                  </div>
                </div>

                {/* Sign Up Button */}
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
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
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
                    Or sign up with
                  </span>
                </div>
              </div>

              {/* Social Sign Up */}
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="w-full">
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </Button>
                <Button variant="outline" className="w-full">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </Button>
              </div>

              {/* Sign In Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-brand-primary hover:underline font-medium"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SignUp;
