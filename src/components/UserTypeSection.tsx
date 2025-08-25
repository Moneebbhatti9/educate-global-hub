import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  GraduationCap,
  School,
  UserCheck,
  Truck,
} from "lucide-react";
import teachersIcon from "@/assets/icon-teachers.jpg";
import schoolsIcon from "@/assets/icon-schools.jpg";
import recruitersIcon from "@/assets/icon-recruiters.jpg";
import suppliersIcon from "@/assets/icon-suppliers.jpg";

const UserTypeSection = () => {
  const userTypes = [
    {
      title: "Teachers",
      description:
        "Find your dream teaching position worldwide. Access thousands of opportunities across all continents.",
      image: teachersIcon,
      icon: GraduationCap,
      variant: "teachers" as const,
      features: [
        "Global job opportunities",
        "Professional development resources",
        "Community networking",
        "Career advancement tools",
      ],
      cta: "Find Teaching Jobs",
      link: "/jobs",
    },
    {
      title: "Schools",
      description:
        "Connect with qualified educators and build your ideal teaching team. Access recruitment tools and resources.",
      image: schoolsIcon,
      icon: School,
      variant: "schools" as const,
      features: [
        "Post job openings",
        "Access qualified candidates",
        "Educational resources",
        "School management tools",
      ],
      cta: "Post a Job",
      link: "/register",
    },
    {
      title: "Recruiters",
      description:
        "Bridge the gap between talented educators and leading institutions. Streamline your recruitment process.",
      image: recruitersIcon,
      icon: UserCheck,
      variant: "recruiters" as const,
      features: [
        "Advanced candidate matching",
        "Recruitment analytics",
        "Global reach",
        "Professional network",
      ],
      cta: "Start Recruiting",
      link: "/register",
    },
    {
      title: "Suppliers",
      description:
        "Connect with educational institutions seeking quality resources, materials, and infrastructure solutions.",
      image: suppliersIcon,
      icon: Truck,
      variant: "suppliers" as const,
      features: [
        "Educational marketplace",
        "Direct school connections",
        "Bulk order opportunities",
        "Partnership programs",
      ],
      cta: "Join Marketplace",
      link: "/register",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground">
            Built for Every{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Education Professional
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Whether you're seeking opportunities, building teams, or providing
            solutions, our platform connects you with the global education
            community.
          </p>
        </div>

        {/* User Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {userTypes.map((type, index) => {
            const IconComponent = type.icon;
            return (
              <Card
                key={type.title}
                className="group relative overflow-hidden border-2 hover:border-brand-primary/20 transition-all duration-300 hover:shadow-card-hover transform hover:scale-105"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="space-y-4">
                  <div className="relative">
                    <img
                      src={type.image}
                      alt={`${type.title} illustration`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="absolute -bottom-4 left-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-brand-primary" />
                    </div>
                  </div>
                  <CardTitle className="font-heading text-xl text-foreground">
                    {type.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {type.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Features List */}
                  <ul className="space-y-2">
                    {type.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-center text-sm text-muted-foreground"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-primary mr-3 flex-shrink-0"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Button
                    variant={type.variant}
                    className="w-full group-hover:shadow-lg transition-all duration-300"
                    asChild
                  >
                    <Link to={type.link} className="group">
                      {type.cta}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-lg text-muted-foreground mb-6">
            Not sure which option is right for you?
          </p>
          <Button variant="hero-outline" size="lg" asChild>
            <Link to="/about">Learn More About Our Platform</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default UserTypeSection;
