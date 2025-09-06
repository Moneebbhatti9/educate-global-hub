import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Globe,
  Users,
  BookOpen,
  Award,
  Heart,
  Target,
  Lightbulb,
  TrendingUp,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Star
} from "lucide-react";

const AboutUs = () => {
  const stats = [
    { label: "Teachers Connected", value: "10,000+", icon: Users },
    { label: "Schools Partnered", value: "2,500+", icon: BookOpen },
    { label: "Countries Served", value: "85+", icon: Globe },
    { label: "Successful Placements", value: "15,000+", icon: Award }
  ];

  const values = [
    {
      icon: Heart,
      title: "Passion for Education",
      description: "We believe in the transformative power of quality education and dedicated educators who shape the future."
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Connecting educators worldwide to create a diverse, inclusive, and enriching educational ecosystem."
    },
    {
      icon: Target,
      title: "Excellence First",
      description: "Committed to maintaining the highest standards in teacher recruitment and educational partnerships."
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Leveraging technology and modern approaches to revolutionize how educators find opportunities."
    }
  ];

  const team = [
    {
      name: "Dr. Sarah Mitchell",
      role: "Chief Executive Officer",
      bio: "Former international school principal with 20+ years in global education leadership.",
      avatar: "/api/placeholder/120/120",
      education: "PhD Education Leadership, Harvard"
    },
    {
      name: "James Rodriguez",
      role: "Chief Technology Officer",
      bio: "EdTech innovator passionate about connecting educators through cutting-edge technology.",
      avatar: "/api/placeholder/120/120",
      education: "MS Computer Science, MIT"
    },
    {
      name: "Dr. Amara Okafor",
      role: "Head of Global Partnerships",
      bio: "International education consultant specializing in cross-cultural teacher placement.",
      avatar: "/api/placeholder/120/120",
      education: "PhD International Education, Oxford"
    },
    {
      name: "Michael Thompson",
      role: "Director of Teacher Success",
      bio: "Former teacher trainer focused on supporting educators throughout their career journey.",
      avatar: "/api/placeholder/120/120",
      education: "MEd Curriculum & Instruction, Stanford"
    }
  ];

  const milestones = [
    {
      year: "2018",
      title: "Company Founded",
      description: "Started with a vision to connect teachers with international opportunities"
    },
    {
      year: "2019",
      title: "1,000 Teachers",
      description: "Reached our first major milestone of registered educators"
    },
    {
      year: "2020",
      title: "Global Expansion",
      description: "Expanded to serve schools and teachers across 25 countries"
    },
    {
      year: "2021",
      title: "Technology Innovation",
      description: "Launched AI-powered matching system for better teacher-school fits"
    },
    {
      year: "2022",
      title: "Community Growth",
      description: "Built thriving forum with 50,000+ active education professionals"
    },
    {
      year: "2023",
      title: "Industry Leadership",
      description: "Recognized as leading platform for international teacher recruitment"
    },
    {
      year: "2024",
      title: "Future Forward",
      description: "Continuing to innovate and serve the global education community"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main>
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                About TeachConnect Global
              </Badge>
              <h1 className="font-heading font-bold text-4xl sm:text-6xl text-foreground mb-6">
                Connecting Educators
                <span className="text-primary block">Worldwide</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                We're on a mission to transform global education by connecting passionate teachers 
                with schools that value excellence, creating opportunities that enrich lives and 
                shape futures across the world.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Join Our Community
                </Button>
                <Button size="lg" variant="outline">
                  Partner With Us
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <stat.icon className="w-8 h-8 mx-auto mb-4 text-primary" />
                    <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground mb-6">
                Our Mission & Values
              </h2>
              <p className="text-lg text-muted-foreground">
                We believe that great education starts with great educators. Our platform is designed 
                to support teachers in finding meaningful opportunities while helping schools build 
                exceptional educational communities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <value.icon className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="font-heading text-xl">{value.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground mb-6">
                Meet Our Team
              </h2>
              <p className="text-lg text-muted-foreground">
                Led by education professionals and technology innovators who understand the 
                challenges and opportunities in global education.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <Avatar className="w-24 h-24 mx-auto mb-4">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="font-heading text-lg">{member.name}</CardTitle>
                    <CardDescription className="text-primary font-medium">{member.role}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{member.bio}</p>
                    <Badge variant="outline" className="text-xs">
                      {member.education}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground mb-6">
                Our Journey
              </h2>
              <p className="text-lg text-muted-foreground">
                From a simple idea to a global platform that's transforming education careers worldwide.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 md:left-1/2 transform md:-translate-x-0.5 w-0.5 h-full bg-primary/20"></div>
                
                {milestones.map((milestone, index) => (
                  <div key={index} className={`relative flex items-center mb-8 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}>
                    {/* Timeline dot */}
                    <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-3 h-3 bg-primary rounded-full border-4 border-background z-10"></div>
                    
                    {/* Content */}
                    <Card className={`ml-12 md:ml-0 flex-1 ${
                      index % 2 === 0 ? 'md:mr-8 md:ml-0' : 'md:ml-8 md:mr-0'
                    }`}>
                      <CardHeader>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="bg-primary/10 text-primary">
                            {milestone.year}
                          </Badge>
                        </div>
                        <CardTitle className="font-heading text-lg">{milestone.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-20 bg-gradient-to-r from-primary to-secondary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center text-white">
              <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-6">
                Ready to Join Our Mission?
              </h2>
              <p className="text-xl opacity-90 mb-8">
                Whether you're an educator seeking new opportunities or a school looking for 
                exceptional teachers, we're here to make meaningful connections happen.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="outline" className="bg-white text-primary hover:bg-white/90">
                  Get Started Today
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Contact Our Team
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutUs;