import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  BarChart3,
  Eye,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/StatsCard";
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

// Mock data for demonstration
const mockResources = [
  {
    id: "1",
    title: "Year 7 Mathematics: Algebra Basics",
    thumbnail: "/api/placeholder/100/60",
    price: 4.99,
    status: "Published" as const,
    salesCount: 127,
    uploadDate: "2024-01-15",
  },
  {
    id: "2",
    title: "Science Lab Safety Worksheet",
    thumbnail: "/api/placeholder/100/60",
    price: 0,
    status: "Published" as const,
    salesCount: 89,
    uploadDate: "2024-01-10",
  },
  {
    id: "3",
    title: "Creative Writing Prompts Bundle",
    thumbnail: "/api/placeholder/100/60",
    price: 7.5,
    status: "Draft" as const,
    salesCount: 0,
    uploadDate: "2024-01-20",
  },
  {
    id: "4",
    title: "History Timeline Activity",
    thumbnail: "/api/placeholder/100/60",
    price: 3.99,
    status: "Flagged" as const,
    salesCount: 45,
    uploadDate: "2024-01-05",
  },
];

const mockStats = {
  totalResources: 24,
  totalSales: 1567,
  currentBalance: 234.5,
  royaltyTier: "Silver" as const,
};

export default function ResourceManagement() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("uploadDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Published":
        return <Badge className="bg-green-100 text-green-800">Published</Badge>;
      case "Draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "Flagged":
        return <Badge variant="destructive">Flagged</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoyaltyTierColor = (tier: string) => {
    switch (tier) {
      case "Bronze":
        return "text-amber-600";
      case "Silver":
        return "text-slate-600";
      case "Gold":
        return "text-yellow-600";
      default:
        return "text-muted-foreground";
    }
  };

  const filteredResources = mockResources.filter((resource) => {
    const matchesSearch = resource.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || resource.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Resources</h1>
          <p className="text-muted-foreground">
            Manage your uploaded teaching resources
          </p>
        </div>
        <Button
          onClick={() => navigate("/dashboard/teacher/upload-resource")}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create New Resource
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Resources"
          value={mockStats.totalResources}
          icon={BarChart3}
          description="Resources uploaded"
        />
        <StatsCard
          title="Total Sales"
          value={mockStats.totalSales}
          icon={BarChart3}
          description="Units sold"
        />
        <StatsCard
          title="Current Balance"
          value={`£${mockStats.currentBalance.toFixed(2)}`}
          icon={BarChart3}
          description="Available to withdraw"
        />
        <StatsCard
          title="Royalty Tier"
          value={mockStats.royaltyTier}
          icon={BarChart3}
          description="Your commission level"
          className={getRoyaltyTierColor(mockStats.royaltyTier)}
        />
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Resource Library</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search resources..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Resources Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Thumbnail</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      className="h-auto p-0 font-medium"
                      onClick={() => {
                        setSortBy("title");
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                      }}
                    >
                      Resource Title
                      {sortBy === "title" &&
                        (sortOrder === "asc" ? (
                          <SortAsc className="ml-2 w-4 h-4" />
                        ) : (
                          <SortDesc className="ml-2 w-4 h-4" />
                        ))}
                    </Button>
                  </TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sales</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResources.map((resource) => (
                  <TableRow key={resource.id}>
                    <TableCell>
                      <img
                        src={resource.thumbnail}
                        alt={resource.title}
                        className="w-16 h-10 object-cover rounded border"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{resource.title}</div>
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
                      <span className="font-medium">{resource.salesCount}</span>
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
                            <span className="sr-only">Open menu</span>
                            <svg
                              className="h-4 w-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Stats
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Resource
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
  );
}
