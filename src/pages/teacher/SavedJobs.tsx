import { useState } from "react";
import DashboardLayout from "@/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Search,
  Filter,
  Trash2,
  ExternalLink,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  AlertTriangle,
  Heart,
  Eye,
  Bookmark,
  Building2,
} from "lucide-react";

const SavedJobs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedJobs, setSelectedJobs] = useState<Set<string>>(new Set());

  // Mock saved jobs data
  const savedJobs = [
    {
      id: "1",
      job: {
        _id: "job1",
        title: "Mathematics Teacher",
        school: "International School Dubai",
        location: "Dubai, UAE",
        salaryMin: 3500,
        salaryMax: 4500,
        currency: "USD",
        jobType: "Full-time",
        applicationDeadline: "2024-04-15",
        status: "active"
      },
      savedDate: "2024-03-10",
      priority: "high",
      notes: "Great opportunity, matches my experience perfectly",
      reminderDate: "2024-04-10",
      tags: ["mathematics", "international", "dubai"],
      hasApplied: false,
      isExpired: false
    },
    {
      id: "2",
      job: {
        _id: "job2",
        title: "Science Lab Coordinator",
        school: "British School Singapore",
        location: "Singapore",
        salaryMin: 4000,
        salaryMax: 5000,
        currency: "SGD",
        jobType: "Full-time",
        applicationDeadline: "2024-03-20",
        status: "active"
      },
      savedDate: "2024-03-08",
      priority: "medium",
      notes: "Interesting role, need to research more about the school",
      reminderDate: null,
      tags: ["science", "laboratory", "singapore"],
      hasApplied: true,
      appliedDate: "2024-03-12",
      isExpired: true
    },
    {
      id: "3",
      job: {
        _id: "job3",
        title: "Primary School Teacher",
        school: "American Academy Kuwait",
        location: "Kuwait City, Kuwait",
        salaryMin: 3200,
        salaryMax: 3800,
        currency: "USD",
        jobType: "Full-time",
        applicationDeadline: "2024-04-25",
        status: "active"
      },
      savedDate: "2024-03-05",
      priority: "low",
      notes: "Backup option, lower salary than expected",
      reminderDate: "2024-04-20",
      tags: ["primary", "kuwait", "backup"],
      hasApplied: false,
      isExpired: false
    },
    {
      id: "4",
      job: {
        _id: "job4",
        title: "English Language Teacher",
        school: "International School Qatar",
        location: "Doha, Qatar",
        salaryMin: 3800,
        salaryMax: 4200,
        currency: "QAR",
        jobType: "Part-time",
        applicationDeadline: "2024-03-15",
        status: "expired"
      },
      savedDate: "2024-02-28",
      priority: "high",
      notes: "Perfect location and salary range",
      reminderDate: null,
      tags: ["english", "qatar", "part-time"],
      hasApplied: false,
      isExpired: true
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return "🔴";
      case "medium":
        return "🟡";
      case "low":
        return "🟢";
      default:
        return "⚪";
    }
  };

  const isJobExpired = (job: any) => {
    return new Date(job.job.applicationDeadline) < new Date() || job.job.status === "expired";
  };

  const getRemainingDays = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredJobs = savedJobs.filter((savedJob) => {
    const matchesSearch = savedJob.job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         savedJob.job.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         savedJob.job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === "all" || savedJob.priority === priorityFilter;
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "applied" && savedJob.hasApplied) ||
                         (statusFilter === "not-applied" && !savedJob.hasApplied) ||
                         (statusFilter === "expired" && isJobExpired(savedJob)) ||
                         (statusFilter === "active" && !isJobExpired(savedJob));
    
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const handleSelectJob = (jobId: string) => {
    const newSelected = new Set(selectedJobs);
    if (newSelected.has(jobId)) {
      newSelected.delete(jobId);
    } else {
      newSelected.add(jobId);
    }
    setSelectedJobs(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedJobs.size === filteredJobs.length) {
      setSelectedJobs(new Set());
    } else {
      setSelectedJobs(new Set(filteredJobs.map(job => job.id)));
    }
  };

  const handleBulkDelete = () => {
    // Handle bulk delete logic
    console.log("Bulk delete jobs:", Array.from(selectedJobs));
    setSelectedJobs(new Set());
  };

  const handleDeleteJob = (jobId: string) => {
    // Handle single job delete logic
    console.log("Delete job:", jobId);
  };

  const stats = {
    total: savedJobs.length,
    applied: savedJobs.filter(job => job.hasApplied).length,
    expired: savedJobs.filter(job => isJobExpired(job)).length,
    highPriority: savedJobs.filter(job => job.priority === "high").length,
    withReminders: savedJobs.filter(job => job.reminderDate).length
  };

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
            Saved Jobs
          </h1>
          <p className="text-muted-foreground">
            Manage your saved job opportunities and track application status.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Saved</p>
                  <p className="text-2xl font-bold text-brand-primary">{stats.total}</p>
                </div>
                <Bookmark className="w-8 h-8 text-brand-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Applied</p>
                  <p className="text-2xl font-bold text-brand-accent-green">{stats.applied}</p>
                </div>
                <ExternalLink className="w-8 h-8 text-brand-accent-green" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Expired</p>
                  <p className="text-2xl font-bold text-red-500">{stats.expired}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">High Priority</p>
                  <p className="text-2xl font-bold text-brand-accent-orange">{stats.highPriority}</p>
                </div>
                <Heart className="w-8 h-8 text-brand-accent-orange" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">With Reminders</p>
                  <p className="text-2xl font-bold text-brand-secondary">{stats.withReminders}</p>
                </div>
                <Clock className="w-8 h-8 text-brand-secondary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Search & Filter</CardTitle>
              {selectedJobs.size > 0 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Selected ({selectedJobs.size})
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Selected Jobs</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete {selectedJobs.size} selected job(s) from your saved list? 
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleBulkDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by job title, school, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="not-applied">Not Applied</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Jobs List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                Saved Jobs ({filteredJobs.length})
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedJobs.size === filteredJobs.length && filteredJobs.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm text-muted-foreground">Select All</span>
              </div>
            </div>
            <CardDescription>
              Your saved job opportunities with application tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredJobs.map((savedJob) => {
                const expired = isJobExpired(savedJob);
                const remainingDays = getRemainingDays(savedJob.job.applicationDeadline);
                
                return (
                  <div
                    key={savedJob.id}
                    className={`border rounded-lg p-4 transition-all hover:shadow-card-hover ${
                      expired ? 'bg-muted/30 border-red-200' : 'hover:border-brand-primary/20'
                    } ${selectedJobs.has(savedJob.id) ? 'ring-2 ring-brand-primary/20' : ''}`}
                  >
                    <div className="flex items-start space-x-4">
                      <Checkbox
                        checked={selectedJobs.has(savedJob.id)}
                        onCheckedChange={() => handleSelectJob(savedJob.id)}
                      />
                      
                      <div className="flex-1 space-y-3">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-lg">{getPriorityIcon(savedJob.priority)}</span>
                              <Badge className={getPriorityColor(savedJob.priority)}>
                                {savedJob.priority} priority
                              </Badge>
                              {savedJob.hasApplied && (
                                <Badge className="bg-brand-accent-green text-white">
                                  Applied
                                </Badge>
                              )}
                              {expired && (
                                <Badge className="bg-red-100 text-red-800 border-red-200">
                                  <AlertTriangle className="w-3 h-3 mr-1" />
                                  Expired
                                </Badge>
                              )}
                            </div>
                            <h3 className="font-heading font-bold text-lg text-foreground mb-1">
                              {savedJob.job.title}
                            </h3>
                            <div className="flex items-center text-muted-foreground mb-2">
                              <Building2 className="w-4 h-4 mr-1" />
                              <span className="mr-4">{savedJob.job.school}</span>
                              <MapPin className="w-4 h-4 mr-1" />
                              <span>{savedJob.job.location}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-2" />
                              View Job
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Remove from Saved Jobs</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to remove "{savedJob.job.title}" from your saved jobs? 
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteJob(savedJob.id)}>
                                    Remove
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>

                        {/* Job Details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-2 text-muted-foreground" />
                            <span>
                              {savedJob.job.currency} {savedJob.job.salaryMin.toLocaleString()} - {savedJob.job.salaryMax.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                            <span className={expired ? "text-red-600 font-medium" : ""}>
                              {expired ? "Expired" : `${remainingDays} days left`}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                            <span>Saved {new Date(savedJob.savedDate).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {/* Notes and Tags */}
                        {savedJob.notes && (
                          <div className="bg-muted/30 rounded-lg p-3">
                            <p className="text-sm text-muted-foreground">
                              <strong>Notes:</strong> {savedJob.notes}
                            </p>
                          </div>
                        )}

                        {savedJob.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {savedJob.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* Reminder */}
                        {savedJob.reminderDate && (
                          <div className="flex items-center text-sm text-brand-accent-orange">
                            <Clock className="w-4 h-4 mr-2" />
                            Reminder set for {new Date(savedJob.reminderDate).toLocaleDateString()}
                          </div>
                        )}

                        {/* Applied Info */}
                        {savedJob.hasApplied && savedJob.appliedDate && (
                          <div className="flex items-center text-sm text-brand-accent-green">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Applied on {new Date(savedJob.appliedDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredJobs.length === 0 && (
                <div className="text-center py-12">
                  <Bookmark className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-heading font-bold text-lg text-foreground mb-2">
                    No saved jobs found
                  </h3>
                  <p className="text-muted-foreground">
                    {searchTerm || priorityFilter !== "all" || statusFilter !== "all"
                      ? "Try adjusting your search criteria or filters."
                      : "Start saving jobs you're interested in to track them here."}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SavedJobs;