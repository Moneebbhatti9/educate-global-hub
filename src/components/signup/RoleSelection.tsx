import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Globe,
  GraduationCap,
  School,
  UserCheck,
  Truck,
  Check,
} from "lucide-react";
import { UserRole } from "@/pages/SignUp";

interface RoleSelectionProps {
  onRoleSelect: (role: UserRole) => void;
}

const RoleSelection = ({ onRoleSelect }: RoleSelectionProps) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const roles = [
    {
      id: "teacher" as UserRole,
      name: "Teacher",
      description:
        "Find teaching opportunities worldwide and connect with schools",
      icon: GraduationCap,
      color:
        "border-brand-primary bg-brand-primary/5 hover:bg-brand-primary/10",
      features: [
        "Access to global job postings",
        "Professional networking",
        "Resource sharing",
      ],
    },
    {
      id: "school" as UserRole,
      name: "School",
      description:
        "Recruit qualified educators and manage your institutional needs",
      icon: School,
      color:
        "border-brand-accent-green bg-brand-accent-green/5 hover:bg-brand-accent-green/10",
      features: [
        "Post job opportunities",
        "Browse teacher profiles",
        "Connect with suppliers",
      ],
    },
    {
      id: "recruiter" as UserRole,
      name: "Recruiter",
      description: "Connect talented educators with the right institutions",
      icon: UserCheck,
      color:
        "border-brand-secondary bg-brand-secondary/5 hover:bg-brand-secondary/10",
      features: [
        "Advanced matching tools",
        "Candidate management",
        "Commission tracking",
      ],
    },
    {
      id: "supplier" as UserRole,
      name: "Supplier",
      description:
        "Provide educational resources, infrastructure, and services",
      icon: Truck,
      color:
        "border-brand-accent-orange bg-brand-accent-orange/5 hover:bg-brand-accent-orange/10",
      features: [
        "Showcase your products",
        "Connect with schools",
        "Manage orders",
      ],
    },
  ];

  const handleSubmit = () => {
    if (selectedRole) {
      onRoleSelect(selectedRole);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-hero flex items-center justify-center">
            <Globe className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
          Welcome to Educate Link
        </h1>
        <p className="text-muted-foreground text-lg">
          Choose your role to customize your experience and connect with the
          right community.
        </p>
      </div>

      {/* Role Selection */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="font-heading text-xl text-center">
            Select Your Role
          </CardTitle>
          <CardDescription className="text-center">
            Choose the option that best describes your role in the education
            sector
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {roles.map((role) => {
              const IconComponent = role.icon;
              const isSelected = selectedRole === role.id;

              return (
                <div
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`relative p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? `${role.color} border-current shadow-lg`
                      : "border-border hover:border-muted-foreground hover:shadow-md"
                  }`}
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                        isSelected ? "bg-current/10" : "bg-muted"
                      }`}
                    >
                      <IconComponent className="w-8 h-8" />
                    </div>

                    <div>
                      <h3 className="font-heading text-xl font-semibold mb-2">
                        {role.name}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        {role.description}
                      </p>

                      <ul className="text-xs text-muted-foreground space-y-1">
                        {role.features.map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-center justify-center"
                          >
                            <Check className="w-3 h-3 mr-2 text-brand-accent-green" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="absolute top-4 right-4">
                      <div className="w-6 h-6 rounded-full bg-current flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <Button
              onClick={handleSubmit}
              variant="hero"
              size="lg"
              disabled={!selectedRole}
              className="min-w-[200px]"
            >
              Continue to Verification
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleSelection;
