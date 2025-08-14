import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Search,
  MapPin,
  Building2,
  DollarSign,
  Calendar,
  Clock,
  Heart,
  Bookmark,
  Filter,
  GraduationCap,
  Users,
  Globe,
  Star,
  Eye,
} from "lucide-react";

const JobSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    location: "any",
    educationLevel: "any",
    subject: "any",
    salaryRange: [0, 10000],
    jobType: "",
    visaSponsorship: false,
    quickApply: false,
  });
  const [savedJobs, setSavedJobs] = useState<number[]>([]);

  const jobs = [
    {
      id: 1,
      title: "Mathematics Teacher - Secondary",
      school: "Dubai International School",
      location: "Dubai, UAE",
      educationLevel: "Secondary (Grades 9-12)",
      subjects: ["Mathematics", "Statistics"],
      salaryRange: "$4,000 - $6,000",
      currency: "USD",
      type: "Full-time",
      postedDate: "2024-03-15",
      deadline: "2024-04-15",
      quickApply: true,
      visaSponsorship: true,
      benefits: ["Health Insurance", "Housing Allowance", "Annual Flight"],
      description:
        "We are seeking an experienced Mathematics teacher to join our Secondary department. The ideal candidate will have strong classroom management skills and experience with international curricula.",
      requirements: [
        "Bachelor's degree in Mathematics or related field",
        "3+ years teaching experience",
        "International curriculum experience preferred",
      ],
      rating: 4.8,
      reviews: 156,
      views: 1234,
      applicants: 23,
    },
    {
      id: 2,
      title: "English Language Teacher - Primary",
      school: "American School of Kuwait",
      location: "Kuwait City, Kuwait",
      educationLevel: "Primary (Grades 1-6)",
      subjects: ["English Language", "Literature"],
      salaryRange: "$3,500 - $5,500",
      currency: "USD",
      type: "Full-time",
      postedDate: "2024-03-12",
      deadline: "2024-04-12",
      quickApply: true,
      visaSponsorship: true,
      benefits: [
        "Health Insurance",
        "Housing Allowance",
        "Professional Development",
      ],
      description:
        "Join our vibrant primary team as an English Language teacher. We're looking for a passionate educator who can inspire young learners and implement innovative teaching strategies.",
      requirements: [
        "Bachelor's degree in English or Education",
        "Teaching certification",
        "2+ years primary teaching experience",
      ],
      rating: 4.6,
      reviews: 89,
      views: 987,
      applicants: 31,
    },
    {
      id: 3,
      title: "Science Lab Coordinator",
      school: "Qatar International School",
      location: "Doha, Qatar",
      educationLevel: "Secondary (Grades 7-12)",
      subjects: ["Physics", "Chemistry", "Biology"],
      salaryRange: "$3,000 - $4,500",
      currency: "USD",
      type: "Full-time",
      postedDate: "2024-03-10",
      deadline: "2024-04-20",
      quickApply: false,
      visaSponsorship: true,
      benefits: ["Health Insurance", "End of Service Gratuity"],
      description:
        "We are seeking a qualified Science Lab Coordinator to manage our state-of-the-art laboratory facilities and support our science teachers in delivering exceptional education.",
      requirements: [
        "Bachelor's degree in Science",
        "Lab management experience",
        "Safety certification preferred",
      ],
      rating: 4.7,
      reviews: 67,
      views: 743,
      applicants: 12,
    },
    {
      id: 4,
      title: "IB Mathematics Teacher",
      school: "International School of Riyadh",
      location: "Riyadh, Saudi Arabia",
      educationLevel: "High School (IB Programme)",
      subjects: ["IB Mathematics", "Statistics"],
      salaryRange: "$4,500 - $7,000",
      currency: "USD",
      type: "Full-time",
      postedDate: "2024-03-08",
      deadline: "2024-04-08",
      quickApply: true,
      visaSponsorship: true,
      benefits: [
        "Health Insurance",
        "Housing Allowance",
        "Annual Flight",
        "Performance Bonus",
      ],
      description:
        "Seeking an experienced IB Mathematics teacher to join our high-performing team. Must have IB experience and be committed to student-centered learning.",
      requirements: [
        "IB Mathematics teaching experience",
        "IB workshop attendance",
        "Master's degree preferred",
      ],
      rating: 4.9,
      reviews: 234,
      views: 1876,
      applicants: 45,
    },
    {
      id: 5,
      title: "Art & Design Teacher",
      school: "British School of Bahrain",
      location: "Manama, Bahrain",
      educationLevel: "Primary & Secondary",
      subjects: ["Visual Arts", "Design Technology"],
      salaryRange: "$3,200 - $4,800",
      currency: "USD",
      type: "Full-time",
      postedDate: "2024-03-05",
      deadline: "2024-04-25",
      quickApply: true,
      visaSponsorship: false,
      benefits: [
        "Health Insurance",
        "Professional Development",
        "Art Supplies Budget",
      ],
      description:
        "Join our creative arts team and inspire students through innovative art and design education. We're looking for a teacher who can work across age groups.",
      requirements: [
        "Art/Design qualification",
        "Portfolio of student work",
        "Technology integration experience",
      ],
      rating: 4.5,
      reviews: 123,
      views: 654,
      applicants: 18,
    },
  ];

  const educationLevels = [
    "Early Years (Ages 3-5)",
    "Primary (Grades 1-6)",
    "Secondary (Grades 7-9)",
    "High School (Grades 10-12)",
    "All Levels",
  ];

  const subjects = [
    "Mathematics",
    "English Language",
    "Science",
    "Physics",
    "Chemistry",
    "Biology",
    "History",
    "Geography",
    "Art & Design",
    "Physical Education",
    "Music",
    "Computer Science",
  ];

  const locations = [
    "Dubai, UAE",
    "Abu Dhabi, UAE",
    "Kuwait City, Kuwait",
    "Doha, Qatar",
    "Riyadh, Saudi Arabia",
    "Manama, Bahrain",
    "Muscat, Oman",
  ];

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.subjects.some((subject) =>
        subject.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesLocation =
      !filters.location ||
      filters.location === "any" ||
      job.location === filters.location;
    const matchesEducationLevel =
      !filters.educationLevel ||
      filters.educationLevel === "any" ||
      job.educationLevel.includes(filters.educationLevel);
    const matchesSubject =
      !filters.subject ||
      filters.subject === "any" ||
      job.subjects.includes(filters.subject);
    const matchesVisaSponsorship =
      !filters.visaSponsorship || job.visaSponsorship;
    const matchesQuickApply = !filters.quickApply || job.quickApply;

    // Simple salary filtering (extracting min from range)
    const jobMinSalary = parseInt(
      job.salaryRange.split(" - ")[0].replace("$", "").replace(",", "")
    );
    const matchesSalary =
      jobMinSalary >= filters.salaryRange[0] &&
      jobMinSalary <= filters.salaryRange[1];

    return (
      matchesSearch &&
      matchesLocation &&
      matchesEducationLevel &&
      matchesSubject &&
      matchesVisaSponsorship &&
      matchesQuickApply &&
      matchesSalary
    );
  });

  const toggleSaveJob = (jobId: number) => {
    setSavedJobs((prev) =>
      prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId]
    );
  };

  const getDaysAgo = (dateString: string) => {
    const posted = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - posted.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
  };

  return (
    <DashboardLayout role="teacher">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="w-5 h-5" />
                <span>Filters</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Location Filter */}
              <div className="space-y-2">
                <Label>Location</Label>
                <Select
                  value={filters.location}
                  onValueChange={(value) =>
                    setFilters({ ...filters, location: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any location</SelectItem>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Education Level Filter */}
              <div className="space-y-2">
                <Label>Education Level</Label>
                <Select
                  value={filters.educationLevel}
                  onValueChange={(value) =>
                    setFilters({ ...filters, educationLevel: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any level</SelectItem>
                    {educationLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Subject Filter */}
              <div className="space-y-2">
                <Label>Subject</Label>
                <Select
                  value={filters.subject}
                  onValueChange={(value) =>
                    setFilters({ ...filters, subject: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any subject</SelectItem>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Salary Range */}
              <div className="space-y-3">
                <Label>Salary Range (USD)</Label>
                <div className="px-2">
                  <Slider
                    value={filters.salaryRange}
                    onValueChange={(value) =>
                      setFilters({ ...filters, salaryRange: value })
                    }
                    max={10000}
                    min={0}
                    step={500}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>${filters.salaryRange[0].toLocaleString()}</span>
                  <span>${filters.salaryRange[1].toLocaleString()}</span>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="visaSponsorship"
                    checked={filters.visaSponsorship}
                    onCheckedChange={(checked) =>
                      setFilters({ ...filters, visaSponsorship: !!checked })
                    }
                  />
                  <Label htmlFor="visaSponsorship" className="text-sm">
                    Visa Sponsorship
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="quickApply"
                    checked={filters.quickApply}
                    onCheckedChange={(checked) =>
                      setFilters({ ...filters, quickApply: !!checked })
                    }
                  />
                  <Label htmlFor="quickApply" className="text-sm">
                    Quick Apply Only
                  </Label>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  setFilters({
                    location: "",
                    educationLevel: "",
                    subject: "",
                    salaryRange: [0, 10000],
                    jobType: "",
                    visaSponsorship: false,
                    quickApply: false,
                  })
                }
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Job Listings */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search Header */}
          <div className="space-y-4">
            <div>
              <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
                Find Your Dream Teaching Job
              </h1>
              <p className="text-muted-foreground">
                Discover exciting opportunities at top international schools
                worldwide
              </p>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs, schools, or subjects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Results Header */}
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              Showing {filteredJobs.length} of {jobs.length} jobs
            </p>
            <Select defaultValue="recent">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="salary-high">Highest Salary</SelectItem>
                <SelectItem value="salary-low">Lowest Salary</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Job Cards */}
          <div className="space-y-6">
            {filteredJobs.length === 0 ? (
              <Card className="p-8 text-center">
                <div className="text-muted-foreground">
                  <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-lg font-medium mb-2">No jobs found</p>
                  <p>Try adjusting your filters or search terms</p>
                </div>
              </Card>
            ) : (
              filteredJobs.map((job) => (
                <Card
                  key={job.id}
                  className="group hover:shadow-card-hover transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-heading font-semibold text-xl group-hover:text-brand-primary transition-colors">
                            {job.title}
                          </h3>
                          {job.quickApply && (
                            <Badge className="bg-brand-accent-green text-white">
                              Quick Apply
                            </Badge>
                          )}
                          {job.visaSponsorship && (
                            <Badge
                              variant="outline"
                              className="border-brand-secondary text-brand-secondary"
                            >
                              Visa Sponsorship
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center space-x-4 text-muted-foreground mb-3">
                          <div className="flex items-center space-x-1">
                            <Building2 className="w-4 h-4" />
                            <span className="font-medium">{job.school}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span>{job.rating}</span>
                            <span className="text-xs">
                              ({job.reviews} reviews)
                            </span>
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSaveJob(job.id)}
                        className={
                          savedJobs.includes(job.id) ? "text-brand-primary" : ""
                        }
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            savedJobs.includes(job.id) ? "fill-current" : ""
                          }`}
                        />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <GraduationCap className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{job.educationLevel}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {job.salaryRange} {job.currency}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{job.type}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.subjects.map((subject, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {subject}
                        </Badge>
                      ))}
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.benefits.slice(0, 3).map((benefit, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {benefit}
                        </Badge>
                      ))}
                      {job.benefits.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{job.benefits.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>Posted {getDaysAgo(job.postedDate)}</span>
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{job.views} views</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{job.applicants} applicants</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Deadline:{" "}
                            {new Date(job.deadline).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        <Link to={`/dashboard/teacher/apply/${job.id}`}>
                          <Button variant="default" size="sm">
                            {job.quickApply ? "Quick Apply" : "Apply Now"}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Load More */}
          {filteredJobs.length > 0 && (
            <div className="text-center">
              <Button variant="outline" className="w-full sm:w-auto">
                Load More Jobs
              </Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default JobSearch;
