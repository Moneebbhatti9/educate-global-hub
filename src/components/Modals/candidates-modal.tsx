import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Mail,
  Phone,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  MessageSquare,
  Calendar,
  MapPin,
  GraduationCap,
  Briefcase,
  FileText,
} from "lucide-react";

interface CandidatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  jobId: string;
}

export const CandidatesModal = ({ isOpen, onClose, jobTitle, jobId }: CandidatesModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");

  // Mock candidates data
  const candidates = [
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "+971-50-123-4567",
      avatar: "/api/placeholder/40/40",
      location: "Dubai, UAE",
      experience: 8,
      education: "Master's in Mathematics Education",
      currentRole: "Senior Mathematics Teacher",
      status: "pending",
      rating: 4.8,
      appliedDate: "2024-03-15",
      resume: "sarah_johnson_resume.pdf",
      coverLetter: "I am excited to apply for this position...",
      skills: ["Mathematics", "Curriculum Development", "Student Assessment"],
      languages: ["English (Native)", "Arabic (Conversational)"],
      availability: "Immediate",
      expectedSalary: "$4,500",
      screeningAnswers: [
        "I have 8 years of experience teaching mathematics at secondary level.",
        "I am available to start immediately and can relocate to Dubai.",
        "My teaching philosophy focuses on making mathematics accessible and engaging for all students."
      ]
    },
    {
      id: "2",
      name: "Michael Chen",
      email: "michael.chen@email.com",
      phone: "+65-91234567",
      avatar: "/api/placeholder/40/40",
      location: "Singapore",
      experience: 12,
      education: "PhD in Educational Psychology",
      currentRole: "Head of Mathematics Department",
      status: "reviewed",
      rating: 4.9,
      appliedDate: "2024-03-14",
      resume: "michael_chen_resume.pdf",
      coverLetter: "With over 12 years of experience...",
      skills: ["Mathematics", "Department Leadership", "Curriculum Design", "Teacher Training"],
      languages: ["English (Native)", "Mandarin (Native)", "Malay (Intermediate)"],
      availability: "3 months notice",
      expectedSalary: "$5,200",
      screeningAnswers: [
        "I have 12 years of progressive experience in mathematics education, including 5 years in leadership roles.",
        "I would need 3 months notice period to transition my current responsibilities.",
        "I believe in differentiated instruction and using technology to enhance mathematical understanding."
      ]
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      email: "emily.rodriguez@email.com",
      phone: "+1-555-123-4567",
      avatar: "/api/placeholder/40/40",
      location: "Toronto, Canada",
      experience: 6,
      education: "Bachelor's in Mathematics, PGCE",
      currentRole: "Mathematics Teacher",
      status: "shortlisted",
      rating: 4.6,
      appliedDate: "2024-03-13",
      resume: "emily_rodriguez_resume.pdf",
      coverLetter: "I am passionate about mathematics education...",
      skills: ["Mathematics", "Technology Integration", "Differentiated Learning"],
      languages: ["English (Native)", "Spanish (Native)", "French (Intermediate)"],
      availability: "2 months notice",
      expectedSalary: "$4,200",
      screeningAnswers: [
        "I have 6 years of experience teaching mathematics across different age groups.",
        "I am excited about the opportunity to work internationally and can start in 2 months.",
        "I focus on hands-on learning and real-world applications to make math relevant."
      ]
    },
    {
      id: "4",
      name: "David Kim",
      email: "david.kim@email.com",
      phone: "+82-10-1234-5678",
      avatar: "/api/placeholder/40/40",
      location: "Seoul, South Korea",
      experience: 10,
      education: "Master's in Applied Mathematics",
      currentRole: "Senior Teacher & Curriculum Coordinator",
      status: "rejected",
      rating: 4.4,
      appliedDate: "2024-03-12",
      resume: "david_kim_resume.pdf",
      coverLetter: "I bring a unique perspective...",
      skills: ["Mathematics", "Curriculum Development", "Educational Technology", "Assessment Design"],
      languages: ["English (Fluent)", "Korean (Native)", "Japanese (Intermediate)"],
      availability: "Immediate",
      expectedSalary: "$4,800",
      screeningAnswers: [
        "I have 10 years of comprehensive experience in mathematics education and curriculum development.",
        "I am available to start immediately and am excited about working in the UAE.",
        "I integrate technology and collaborative learning to create engaging mathematics experiences."
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-brand-accent-orange text-white";
      case "reviewed":
        return "bg-blue-500 text-white";
      case "shortlisted":
        return "bg-brand-accent-green text-white";
      case "rejected":
        return "bg-red-500 text-white";
      case "hired":
        return "bg-purple-600 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-3 h-3" />;
      case "reviewed":
        return <Eye className="w-3 h-3" />;
      case "shortlisted":
        return <Star className="w-3 h-3" />;
      case "rejected":
        return <XCircle className="w-3 h-3" />;
      case "hired":
        return <CheckCircle className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || candidate.status === statusFilter;
    const matchesRating = ratingFilter === "all" || 
                         (ratingFilter === "high" && candidate.rating >= 4.5) ||
                         (ratingFilter === "medium" && candidate.rating >= 4.0 && candidate.rating < 4.5) ||
                         (ratingFilter === "low" && candidate.rating < 4.0);
    
    return matchesSearch && matchesStatus && matchesRating;
  });

  const candidateStats = {
    total: candidates.length,
    pending: candidates.filter(c => c.status === "pending").length,
    reviewed: candidates.filter(c => c.status === "reviewed").length,
    shortlisted: candidates.filter(c => c.status === "shortlisted").length,
    rejected: candidates.filter(c => c.status === "rejected").length,
    hired: candidates.filter(c => c.status === "hired").length,
  };

  const renderCandidateRow = (candidate: any) => (
    <TableRow key={candidate.id}>
      <TableCell>
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={candidate.avatar} />
            <AvatarFallback>
              {candidate.name.split(' ').map((n: string) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{candidate.name}</div>
            <div className="text-sm text-muted-foreground">{candidate.currentRole}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="text-sm">
          <div className="flex items-center mb-1">
            <Mail className="w-3 h-3 mr-1" />
            {candidate.email}
          </div>
          <div className="flex items-center">
            <MapPin className="w-3 h-3 mr-1" />
            {candidate.location}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="text-sm">
          <div className="flex items-center mb-1">
            <Briefcase className="w-3 h-3 mr-1" />
            {candidate.experience} years
          </div>
          <div className="flex items-center">
            <GraduationCap className="w-3 h-3 mr-1" />
            {candidate.education.substring(0, 20)}...
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge className={`${getStatusColor(candidate.status)} flex items-center space-x-1 w-fit`}>
          {getStatusIcon(candidate.status)}
          <span className="capitalize">{candidate.status}</span>
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          <Star className="w-4 h-4 text-yellow-500 mr-1" />
          {candidate.rating}
        </div>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        <div className="flex items-center">
          <Calendar className="w-3 h-3 mr-1" />
          {new Date(candidate.appliedDate).toLocaleDateString()}
        </div>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="w-4 h-4 mr-2" />
              View Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FileText className="w-4 h-4 mr-2" />
              View Application
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className="w-4 h-4 mr-2" />
              Download Resume
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <MessageSquare className="w-4 h-4 mr-2" />
              Send Message
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Mail className="w-4 h-4 mr-2" />
              Send Email
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {candidate.status === "pending" && (
              <>
                <DropdownMenuItem className="text-green-600">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Shortlist
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </DropdownMenuItem>
              </>
            )}
            {candidate.status === "shortlisted" && (
              <DropdownMenuItem className="text-purple-600">
                <Star className="w-4 h-4 mr-2" />
                Mark as Hired
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">Candidates</DialogTitle>
          <DialogDescription>
            Applications for: <strong>{jobTitle}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="font-bold text-lg text-brand-primary">{candidateStats.total}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="font-bold text-lg text-brand-accent-orange">{candidateStats.pending}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="font-bold text-lg text-blue-500">{candidateStats.reviewed}</div>
              <div className="text-sm text-muted-foreground">Reviewed</div>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="font-bold text-lg text-brand-accent-green">{candidateStats.shortlisted}</div>
              <div className="text-sm text-muted-foreground">Shortlisted</div>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="font-bold text-lg text-purple-600">{candidateStats.hired}</div>
              <div className="text-sm text-muted-foreground">Hired</div>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="font-bold text-lg text-red-500">{candidateStats.rejected}</div>
              <div className="text-sm text-muted-foreground">Rejected</div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search candidates by name, email, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="shortlisted">Shortlisted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="hired">Hired</SelectItem>
              </SelectContent>
            </Select>
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="high">High (4.5+)</SelectItem>
                <SelectItem value="medium">Medium (4.0-4.4)</SelectItem>
                <SelectItem value="low">Low (&lt;4.0)</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Candidates Table */}
          <Tabs defaultValue="list" className="w-full">
            <TabsList>
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="cards">Card View</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="mt-4">
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Candidate</TableHead>
                      <TableHead>Contact & Location</TableHead>
                      <TableHead>Experience & Education</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Applied Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCandidates.map(renderCandidateRow)}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="cards" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCandidates.map((candidate) => (
                  <div key={candidate.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={candidate.avatar} />
                          <AvatarFallback>
                            {candidate.name.split(' ').map((n: string) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{candidate.name}</div>
                          <div className="text-sm text-muted-foreground">{candidate.currentRole}</div>
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(candidate.status)} flex items-center space-x-1`}>
                        {getStatusIcon(candidate.status)}
                        <span className="capitalize">{candidate.status}</span>
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-2" />
                        {candidate.location}
                      </div>
                      <div className="flex items-center">
                        <Briefcase className="w-3 h-3 mr-2" />
                        {candidate.experience} years experience
                      </div>
                      <div className="flex items-center">
                        <Star className="w-3 h-3 mr-2" />
                        {candidate.rating} rating
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-2" />
                        Applied {new Date(candidate.appliedDate).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <MessageSquare className="w-3 h-3 mr-1" />
                        Message
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="w-3 h-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Download className="w-4 h-4 mr-2" />
                            Download Resume
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="w-4 h-4 mr-2" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {candidate.status === "pending" && (
                            <>
                              <DropdownMenuItem className="text-green-600">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Shortlist
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <XCircle className="w-4 h-4 mr-2" />
                                Reject
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};