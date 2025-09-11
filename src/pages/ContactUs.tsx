import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  HeadphonesIcon,
  Users,
  BookOpen,
  Send,
  CheckCircle,
  Globe,
} from "lucide-react";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Get in touch via email for detailed inquiries",
      contact: "support@teachconnect.global",
      note: "Response within 24 hours",
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our support team",
      contact: "+1 (555) 123-4567",
      note: "Mon-Fri, 9AM-6PM EST",
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Instant support for urgent questions",
      contact: "Available on platform",
      note: "Mon-Fri, 9AM-6PM EST",
    },
    {
      icon: HeadphonesIcon,
      title: "Technical Support",
      description: "Platform issues and technical assistance",
      contact: "tech@teachconnect.global",
      note: "Response within 12 hours",
    },
  ];

  const offices = [
    {
      location: "Global Headquarters",
      address: "123 Education Plaza, Suite 400",
      city: "New York, NY 10001, USA",
      phone: "+1 (555) 123-4567",
      email: "hq@teachconnect.global",
    },
    {
      location: "European Office",
      address: "45 Education Square",
      city: "London, UK EC1A 1BB",
      phone: "+44 20 7123 4567",
      email: "europe@teachconnect.global",
    },
    {
      location: "Asia-Pacific Office",
      address: "88 Learning Tower, Level 20",
      city: "Singapore 018956",
      phone: "+65 6123 4567",
      email: "apac@teachconnect.global",
    },
  ];

  const departments = [
    {
      icon: Users,
      title: "Teacher Support",
      description:
        "Career guidance, application assistance, and placement support",
      email: "teachers@teachconnect.global",
    },
    {
      icon: BookOpen,
      title: "School Partnerships",
      description: "Recruitment solutions and partnership opportunities",
      email: "schools@teachconnect.global",
    },
    {
      icon: Globe,
      title: "International Relations",
      description: "Global expansion and regional partnerships",
      email: "international@teachconnect.global",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                Contact TeachConnect Global
              </Badge>
              <h1 className="font-heading font-bold text-4xl sm:text-6xl text-foreground mb-6">
                We're Here to
                <span className="text-primary block">Help You</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Have questions about our platform, need support with your
                application, or want to explore partnership opportunities? Our
                global team is ready to assist you.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactMethods.map((method, index) => (
                <Card
                  key={index}
                  className="text-center hover:shadow-lg transition-all duration-300 group"
                >
                  <CardHeader>
                    <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors mx-auto w-fit">
                      <method.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="font-heading text-lg">
                      {method.title}
                    </CardTitle>
                    <CardDescription>{method.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="font-semibold text-foreground mb-2">
                      {method.contact}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {method.note}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form and Info */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading text-2xl">
                    Send us a Message
                  </CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as
                    possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          placeholder="Your full name"
                          value={formData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        onValueChange={(value) =>
                          handleInputChange("category", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select inquiry type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="teacher-support">
                            Teacher Support
                          </SelectItem>
                          <SelectItem value="school-partnership">
                            School Partnership
                          </SelectItem>
                          <SelectItem value="technical-issue">
                            Technical Issue
                          </SelectItem>
                          <SelectItem value="billing">
                            Billing & Payments
                          </SelectItem>
                          <SelectItem value="general">
                            General Inquiry
                          </SelectItem>
                          <SelectItem value="feedback">
                            Feedback & Suggestions
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        placeholder="Brief description of your inquiry"
                        value={formData.subject}
                        onChange={(e) =>
                          handleInputChange("subject", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        placeholder="Please provide details about your inquiry. The more information you provide, the better we can assist you."
                        rows={6}
                        value={formData.message}
                        onChange={(e) =>
                          handleInputChange("message", e.target.value)
                        }
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>

                    <div className="flex items-start space-x-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 mt-0.5 text-green-500" />
                      <p>
                        We typically respond within 24 hours during business
                        days. For urgent matters, please use our live chat or
                        phone support.
                      </p>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <div className="space-y-8">
                {/* Departments */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading text-xl">
                      Contact by Department
                    </CardTitle>
                    <CardDescription>
                      Reach out to the right team for faster assistance
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {departments.map((dept, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="p-2 rounded-lg bg-primary/10">
                          <dept.icon className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">
                            {dept.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mb-1">
                            {dept.description}
                          </p>
                          <p className="text-sm font-medium text-primary">
                            {dept.email}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Business Hours */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading text-xl flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-primary" />
                      Business Hours
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Monday - Friday
                      </span>
                      <span className="font-medium">9:00 AM - 6:00 PM EST</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Saturday</span>
                      <span className="font-medium">
                        10:00 AM - 2:00 PM EST
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sunday</span>
                      <span className="font-medium">Closed</span>
                    </div>
                    <div className="pt-2 border-t">
                      <p className="text-sm text-muted-foreground">
                        Emergency technical support available 24/7 for platform
                        downtime issues.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Global Offices */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground mb-6">
                Our Global Offices
              </h2>
              <p className="text-lg text-muted-foreground">
                With teams around the world, we provide local support for our
                global community of educators and schools.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {offices.map((office, index) => (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-all duration-300"
                >
                  <CardHeader>
                    <CardTitle className="font-heading text-lg flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-primary" />
                      {office.location}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-medium">{office.address}</p>
                      <p className="font-medium">{office.city}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium text-primary">{office.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium text-primary">{office.email}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ CTA */}
        <section className="py-20 bg-gradient-to-r from-primary to-secondary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center text-white">
              <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-6">
                Looking for Quick Answers?
              </h2>
              <p className="text-xl opacity-90 mb-8">
                Check out our comprehensive FAQ section for immediate answers to
                common questions about our platform, services, and processes.
              </p>
              <Button
                size="lg"
                variant="outline"
                className="bg-white text-primary hover:bg-white/90"
              >
                Visit FAQ Center
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ContactUs;
