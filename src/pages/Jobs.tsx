import { useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Clock, Building, Users, DollarSign, Filter } from "lucide-react";

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContinent, setSelectedContinent] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("");

  const jobs = [
    {
      id: 1,
      title: "Mathematics Teacher",
      school: "International School of London",
      location: "London, United Kingdom",
      continent: "Europe",
      type: "Full-time",
      salary: "$45,000 - $55,000",
      experience: "2-3 years",
      posted: "2 days ago",
      description: "Seeking an enthusiastic Mathematics teacher for Key Stage 3 & 4 students.",
      subjects: ["Mathematics", "Statistics"],
      benefits: ["Health Insurance", "Professional Development", "Housing Allowance"]
    },
    {
      id: 2,
      title: "English Language Arts Coordinator",
      school: "Dubai International Academy",
      location: "Dubai, UAE",
      continent: "Asia",
      type: "Full-time",
      salary: "$50,000 - $65,000",
      experience: "5+ years",
      posted: "1 week ago",
      description: "Lead the English department and develop curriculum for grades 6-12.",
      subjects: ["English", "Literature", "Creative Writing"],
      benefits: ["Tax-free Salary", "Flights", "Accommodation", "Medical Insurance"]
    },
    {
      id: 3,
      title: "Science Teacher",
      school: "International School of Kenya",
      location: "Nairobi, Kenya",
      continent: "Africa",
      type: "Full-time",
      salary: "$30,000 - $40,000",
      experience: "1-2 years",
      posted: "3 days ago",
      description: "Teach Biology and Chemistry to high school students in a diverse environment.",
      subjects: ["Biology", "Chemistry", "Environmental Science"],
      benefits: ["Professional Development", "Local Transport", "Medical Cover"]
    },
    {
      id: 4,
      title: "Primary School Teacher",
      school: "American School of São Paulo",
      location: "São Paulo, Brazil",
      continent: "South America",
      type: "Full-time",
      salary: "$35,000 - $45,000",
      experience: "2+ years",
      posted: "5 days ago",
      description: "Teach Grade 3 students with focus on bilingual education.",
      subjects: ["Primary Education", "ESL", "Portuguese"],
      benefits: ["Bilingual Environment", "Cultural Immersion", "Health Insurance"]
    },
    {
      id: 5,
      title: "IB Physics Teacher",
      school: "Singapore International School",
      location: "Singapore",
      continent: "Asia",
      type: "Full-time",
      salary: "$55,000 - $70,000",
      experience: "3+ years",
      posted: "1 day ago",
      description: "Experienced IB Physics teacher for DP program.",
      subjects: ["Physics", "IB Program", "STEM"],
      benefits: ["Excellent Package", "Professional Development", "Relocation Support"]
    },
    {
      id: 6,
      title: "Head of Music Department",
      school: "Toronto Global Academy",
      location: "Toronto, Canada",
      continent: "North America",
      type: "Full-time",
      salary: "$60,000 - $75,000",
      experience: "7+ years",
      posted: "1 week ago",
      description: "Lead our innovative music program and inspire young musicians.",
      subjects: ["Music", "Performance", "Music Theory"],
      benefits: ["Leadership Role", "Creative Freedom", "Comprehensive Benefits"]
    }
  ];

  const continents = ["Europe", "Asia", "Africa", "North America", "South America", "Oceania"];
  const jobTypes = ["Full-time", "Part-time", "Contract", "Substitute"];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesContinent = !selectedContinent || job.continent === selectedContinent;
    const matchesJobType = !selectedJobType || job.type === selectedJobType;
    
    return matchesSearch && matchesContinent && matchesJobType;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-foreground mb-4">
            Find Your Dream Teaching Job
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Explore thousands of teaching opportunities across the globe. From elementary to university level, 
            find positions that match your expertise and passion for education.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-card rounded-xl border p-6 mb-8 shadow-card">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs, schools, locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedContinent} onValueChange={setSelectedContinent}>
              <SelectTrigger>
                <SelectValue placeholder="Select Continent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Continents</SelectItem>
                {continents.map(continent => (
                  <SelectItem key={continent} value={continent}>{continent}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger>
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Countries</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="uae">United Arab Emirates</SelectItem>
                <SelectItem value="kenya">Kenya</SelectItem>
                <SelectItem value="brazil">Brazil</SelectItem>
                <SelectItem value="singapore">Singapore</SelectItem>
                <SelectItem value="canada">Canada</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedJobType} onValueChange={setSelectedJobType}>
              <SelectTrigger>
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                {jobTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Showing {filteredJobs.length} of {jobs.length} jobs
            </p>
            <Button variant="hero-outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Job Listings */}
        <div className="grid gap-6">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="group hover:shadow-card-hover transition-all duration-300 hover:border-brand-primary/20">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <CardTitle className="font-heading text-xl group-hover:text-brand-primary transition-colors">
                      <Link to={`/jobs/${job.id}`}>{job.title}</Link>
                    </CardTitle>
                    <div className="flex items-center space-x-4 text-muted-foreground">
                      <div className="flex items-center">
                        <Building className="w-4 h-4 mr-1" />
                        {job.school}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {job.posted}
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary">{job.type}</Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <CardDescription className="text-base">
                  {job.description}
                </CardDescription>

                <div className="flex flex-wrap gap-2">
                  {job.subjects.map((subject, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {subject}
                    </Badge>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t">
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-2 text-brand-accent-green" />
                    <span className="text-sm font-medium">{job.salary}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2 text-brand-secondary" />
                    <span className="text-sm font-medium">{job.experience}</span>
                  </div>
                  <div className="flex justify-end">
                    <Button variant="teachers" size="sm" asChild>
                      <Link to={`/jobs/${job.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="hero-outline" size="lg">
            Load More Jobs
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Jobs;