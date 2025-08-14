import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CountryDropdown } from "@/components/ui/country-dropdown";
import {
  Search,
  MapPin,
  Clock,
  Building,
  Users,
  DollarSign,
  Filter,
  Loader2,
} from "lucide-react";
import { useJobs, useFeaturedJobs, useUrgentJobs } from "@/hooks/useJobs";
import type { JobSearchParams, JobType } from "@/types/job";

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContinent, setSelectedContinent] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedJobType, setSelectedJobType] = useState<JobType | "all">(
    "all"
  );
  const [currentPage, setCurrentPage] = useState(1);

  // API hooks
  const searchParams: JobSearchParams = {
    page: currentPage,
    limit: 10,
    q: searchTerm || undefined,
    country: selectedCountry !== "all" ? selectedCountry : undefined,
    jobType: selectedJobType !== "all" ? selectedJobType : undefined,
  };

  const {
    data: jobsData,
    isLoading: jobsLoading,
    error: jobsError,
  } = useJobs(searchParams);
  const { data: featuredJobs, isLoading: featuredLoading } = useFeaturedJobs();
  const { data: urgentJobs, isLoading: urgentLoading } = useUrgentJobs();

  const jobs = (jobsData?.data as any)?.jobs || [];
  const totalJobs = jobsData?.data?.pagination?.total || 0;
  const totalPages = jobsData?.data?.pagination?.totalPages || 0;

  const continents = [
    "Europe",
    "Asia",
    "Africa",
    "North America",
    "South America",
    "Oceania",
  ];
  const jobTypes: JobType[] = [
    "full_time",
    "part_time",
    "contract",
    "substitute",
  ];

  // Handle search and filter changes
  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, selectedCountry, selectedJobType]);

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
            Explore thousands of teaching opportunities across the globe. From
            elementary to university level, find positions that match your
            expertise and passion for education.
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

            <Select
              value={selectedContinent}
              onValueChange={setSelectedContinent}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Continent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Continents</SelectItem>
                {continents.map((continent) => (
                  <SelectItem key={continent} value={continent}>
                    {continent}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <CountryDropdown
              onChange={(country) => setSelectedCountry(country.name)}
              defaultValue={
                selectedCountry === "all" ? undefined : selectedCountry
              }
              placeholder="Select Country"
            />

            <Select
              value={selectedJobType}
              onValueChange={(value: string) =>
                setSelectedJobType(value as JobType | "all")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {jobTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type === "full_time"
                      ? "Full-time"
                      : type === "part_time"
                      ? "Part-time"
                      : type === "contract"
                      ? "Contract"
                      : "Substitute"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {jobsLoading ? (
                <span className="flex items-center">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading jobs...
                </span>
              ) : (
                `Showing ${jobs.length} of ${totalJobs} jobs`
              )}
            </p>
            <Button variant="hero-outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Job Listings */}
        <div className="grid gap-6">
          {jobsLoading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading jobs...</p>
            </div>
          ) : jobsError ? (
            <div className="text-center py-12">
              <p className="text-destructive">
                Error loading jobs. Please try again.
              </p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No jobs found matching your criteria.
              </p>
            </div>
          ) : (
            jobs.map((job) => (
              <Card
                key={job._id}
                className="group hover:shadow-card-hover transition-all duration-300 hover:border-brand-primary/20"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <CardTitle className="font-heading text-xl group-hover:text-brand-primary transition-colors">
                        <Link to={`/jobs/${job._id}`}>{job.title}</Link>
                      </CardTitle>
                      <div className="flex items-center space-x-4 text-muted-foreground">
                        <div className="flex items-center">
                          <Building className="w-4 h-4 mr-1" />
                          {job.schoolId}{" "}
                          {/* This will need to be updated when we have school data */}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {job.city}, {job.country}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {new Date(job.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      {job.jobType === "full_time"
                        ? "Full-time"
                        : job.jobType === "part_time"
                        ? "Part-time"
                        : job.jobType === "contract"
                        ? "Contract"
                        : "Substitute"}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <CardDescription className="text-base line-clamp-3 text-muted-foreground">
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
                      <span className="text-sm font-medium">
                        {job.salaryDisclose && job.salaryMin && job.salaryMax
                          ? `${
                              job.currency
                            }${job.salaryMin.toLocaleString()} - ${
                              job.currency
                            }${job.salaryMax.toLocaleString()}`
                          : "Salary not disclosed"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-brand-secondary" />
                      <span className="text-sm font-medium">
                        {job.minExperience
                          ? `${job.minExperience}+ years`
                          : "Experience not specified"}
                      </span>
                    </div>
                    <div className="flex justify-end">
                      <Button variant="teachers" size="sm" asChild>
                        <Link to={`/jobs/${job._id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-12">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Jobs;
