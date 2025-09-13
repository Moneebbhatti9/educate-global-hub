import React, { useState } from "react";
import DashboardLayout from "@/layout/DashboardLayout";
import {
  Search,
  Filter,
  Check,
  X,
  Trash2,
  Eye,
  Flag,
  MoreHorizontal,
  AlertTriangle,
  CheckSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/StatsCard";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

// Mock data for demonstration
const mockResources = [
  {
    id: "1",
    title: "Year 7 Mathematics: Algebra Basics",
    thumbnail: "/api/placeholder/100/60",
    author: "Sarah Johnson",
    authorId: "auth_1",
    price: 4.99,
    status: "Pending" as const,
    flagsCount: 0,
    uploadDate: "2024-01-20",
    subject: "Mathematics",
  },
  {
    id: "2",
    title: "Science Lab Safety Worksheet",
    thumbnail: "/api/placeholder/100/60",
    author: "Mike Chen",
    authorId: "auth_2",
    price: 0,
    status: "Approved" as const,
    flagsCount: 0,
    uploadDate: "2024-01-18",
    subject: "Science",
  },
  {
    id: "3",
    title: "Creative Writing Prompts Bundle",
    thumbnail: "/api/placeholder/100/60",
    author: "Emma Davis",
    authorId: "auth_3",
    price: 7.5,
    status: "Flagged" as const,
    flagsCount: 3,
    uploadDate: "2024-01-15",
    subject: "English",
  },
  {
    id: "4",
    title: "History Timeline Activity",
    thumbnail: "/api/placeholder/100/60",
    author: "James Wilson",
    authorId: "auth_4",
    price: 3.99,
    status: "Approved" as const,
    flagsCount: 0,
    uploadDate: "2024-01-12",
    subject: "History",
  },
  {
    id: "5",
    title: "Controversial Content Example",
    thumbnail: "/api/placeholder/100/60",
    author: "Anonymous User",
    authorId: "auth_5",
    price: 2.99,
    status: "Removed" as const,
    flagsCount: 8,
    uploadDate: "2024-01-10",
    subject: "General",
  },
];

const mockStats = {
  totalResources: 156,
  pendingApprovals: 12,
  flaggedResources: 4,
  totalSales: 5420,
};

export default function AdminResourceManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [selectedResources, setSelectedResources] = useState<string[]>([]);
  const [showFlaggedOnly, setShowFlaggedOnly] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "Approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "Flagged":
        return <Badge variant="destructive">Flagged</Badge>;
      case "Removed":
        return <Badge className="bg-red-100 text-red-800">Removed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedResources(filteredResources.map((r) => r.id));
    } else {
      setSelectedResources([]);
    }
  };

  const handleSelectResource = (resourceId: string, checked: boolean) => {
    if (checked) {
      setSelectedResources((prev) => [...prev, resourceId]);
    } else {
      setSelectedResources((prev) => prev.filter((id) => id !== resourceId));
    }
  };

  const filteredResources = mockResources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || resource.status.toLowerCase() === statusFilter;
    const matchesSubject =
      subjectFilter === "all" ||
      resource.subject.toLowerCase() === subjectFilter;
    const matchesFlagged = !showFlaggedOnly || resource.flagsCount > 0;

    return matchesSearch && matchesStatus && matchesSubject && matchesFlagged;
  });

  const handleBulkApprove = () => {
    console.log("Bulk approving resources:", selectedResources);
    setSelectedResources([]);
  };

  const handleBulkDelete = () => {
    console.log("Bulk deleting resources:", selectedResources);
    setSelectedResources([]);
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Resource Management
            </h1>
            <p className="text-muted-foreground">
              Moderate and manage all platform resources
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Resources"
            value={mockStats.totalResources}
            icon={Eye}
            description="Resources on platform"
          />
          <StatsCard
            title="Pending Approvals"
            value={mockStats.pendingApprovals}
            icon={AlertTriangle}
            description="Awaiting review"
            badge={{ text: "Action Required", variant: "destructive" }}
          />
          <StatsCard
            title="Flagged Resources"
            value={mockStats.flaggedResources}
            icon={Flag}
            description="Need attention"
          />
          <StatsCard
            title="Total Sales"
            value={mockStats.totalSales}
            icon={CheckSquare}
            description="Platform-wide sales"
          />
        </div>

        {/* Resource Management */}
        <Card>
          <CardHeader>
            <CardTitle>All Resources</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Filters and Search */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by title or author..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="flagged">Flagged</SelectItem>
                    <SelectItem value="removed">Removed</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                    <SelectItem value="science">Science</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="history">History</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant={showFlaggedOnly ? "default" : "outline"}
                  onClick={() => setShowFlaggedOnly(!showFlaggedOnly)}
                  className="flex items-center gap-2"
                >
                  <Flag className="w-4 h-4" />
                  Flagged Only
                </Button>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedResources.length > 0 && (
              <div className="flex items-center gap-4 p-4 bg-muted rounded-lg mb-4">
                <span className="text-sm font-medium">
                  {selectedResources.length} resource(s) selected
                </span>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleBulkApprove}>
                    <Check className="w-4 h-4 mr-2" />
                    Approve All
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete All
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete{" "}
                          {selectedResources.length} selected resource(s). This
                          action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleBulkDelete}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            )}

            {/* Resources Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={
                          selectedResources.length ===
                            filteredResources.length &&
                          filteredResources.length > 0
                        }
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="w-[80px]">Thumbnail</TableHead>
                    <TableHead>Resource Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Flags</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResources.map((resource) => (
                    <TableRow key={resource.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedResources.includes(resource.id)}
                          onCheckedChange={(checked) =>
                            handleSelectResource(resource.id, !!checked)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <img
                          src={resource.thumbnail}
                          alt={resource.title}
                          className="w-12 h-8 object-cover rounded border"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{resource.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {resource.subject}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{resource.author}</div>
                      </TableCell>
                      <TableCell>
                        {resource.price === 0 ? (
                          <Badge className="bg-green-100 text-green-800">
                            Free
                          </Badge>
                        ) : (
                          <span className="font-medium">
                            £{resource.price.toFixed(2)}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(resource.status)}</TableCell>
                      <TableCell>
                        {resource.flagsCount > 0 ? (
                          <Badge
                            variant="destructive"
                            className="flex items-center gap-1"
                          >
                            <Flag className="w-3 h-3" />
                            {resource.flagsCount}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">0</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-muted-foreground">
                          {new Date(resource.uploadDate).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Resource
                            </DropdownMenuItem>
                            {resource.status === "Pending" && (
                              <DropdownMenuItem className="text-green-600">
                                <Check className="mr-2 h-4 w-4" />
                                Approve
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="text-yellow-600">
                              <Flag className="mr-2 h-4 w-4" />
                              Flag Resource
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <X className="mr-2 h-4 w-4" />
                              Suspend
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredResources.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No resources found matching your criteria.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
