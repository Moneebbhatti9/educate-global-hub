import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layout/DashboardLayout";
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
  Loader2,
} from "lucide-react";
import ResourceStatsModal from "@/components/Modals/resource-stats-modal";
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
import { useToast } from "@/hooks/use-toast";
import { resourceApi, Resource, MyResourcesResponse } from "@/apis/resources";

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: unknown;
}

// Resource interface for display
interface DisplayResource {
  id: string;
  title: string;
  thumbnail: string;
  price: number;
  status: "Published" | "Draft" | "Flagged" | "Pending" | "Rejected";
  salesCount: number;
  uploadDate: string;
  isFree: boolean;
  currency?: string;
}

export default function ResourceManagement() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // State for resources and stats
  const [resources, setResources] = useState<DisplayResource[]>([]);
  const [stats, setStats] = useState({
    totalResources: 0,
    totalSales: 0,
    currentBalance: 0,
    royaltyTier: "Bronze" as const,
  });
  const [loading, setLoading] = useState(true);

  // Filter and search state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("uploadDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Modal state
  const [selectedResource, setSelectedResource] =
    useState<DisplayResource | null>(null);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);

  // Load resources and stats
  const loadResources = async () => {
    try {
      setLoading(true);
      const response = (await resourceApi.getMyResources({
        search: searchTerm || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        page: 1,
        limit: 50,
      })) as ApiResponse;

      if (response.success) {
        const data = response.data as MyResourcesResponse;

        // Update stats
        setStats({
          totalResources: data.stats.totalResources,
          totalSales: data.stats.totalSales,
          currentBalance: data.stats.currentBalance,
          royaltyTier: "Bronze", // Default tier, could be enhanced with actual tier data
        });

        // Convert resources to display format
        const displayResources: DisplayResource[] = data.resources.map(
          (resource) => ({
            id: resource._id,
            title: resource.title,
            thumbnail: resource.coverPhoto?.url || "/placeholder.svg",
            price: resource.isFree ? 0 : resource.price,
            status: mapStatusToDisplay(resource.status),
            salesCount: 0, // This would need to come from sales data
            uploadDate: resource.createdAt,
            isFree: resource.isFree,
            currency: resource.currency,
          })
        );

        setResources(displayResources);
      } else {
        throw new Error(response.message || "Failed to load resources");
      }
    } catch (error: unknown) {
      console.error("Error loading resources:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to load resources. Please try again.";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Map API status to display status
  const mapStatusToDisplay = (status: string): DisplayResource["status"] => {
    switch (status.toLowerCase()) {
      case "approved":
        return "Published";
      case "draft":
        return "Draft";
      case "pending":
        return "Pending";
      case "rejected":
        return "Rejected";
      default:
        return "Pending";
    }
  };

  // Load resources on component mount and when filters change
  useEffect(() => {
    loadResources();
  }, [searchTerm, statusFilter]);

  // Handle resource deletion
  const handleDeleteResource = async (resourceId: string) => {
    try {
      const response = (await resourceApi.deleteResource(
        resourceId
      )) as ApiResponse;

      if (response.success) {
        toast({
          title: "Resource deleted",
          description: "The resource has been successfully deleted.",
        });
        // Reload resources
        loadResources();
      } else {
        throw new Error(response.message || "Failed to delete resource");
      }
    } catch (error: unknown) {
      console.error("Error deleting resource:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to delete resource. Please try again.";

      toast({
        title: "Delete failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Published":
        return <Badge className="bg-green-100 text-green-800">Published</Badge>;
      case "Draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "Pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "Rejected":
        return <Badge variant="destructive">Rejected</Badge>;
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

  // Sort resources
  const sortedResources = [...resources].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (sortBy) {
      case "title":
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case "price":
        aValue = a.price;
        bValue = b.price;
        break;
      case "sales":
        aValue = a.salesCount;
        bValue = b.salesCount;
        break;
      case "uploadDate":
      default:
        aValue = new Date(a.uploadDate).getTime();
        bValue = new Date(b.uploadDate).getTime();
        break;
    }

    if (sortOrder === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
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
            value={stats.totalResources}
            icon={BarChart3}
            description="Resources uploaded"
          />
          <StatsCard
            title="Total Sales"
            value={stats.totalSales}
            icon={BarChart3}
            description="Units sold"
          />
          <StatsCard
            title="Current Balance"
            value={`£${stats.currentBalance.toFixed(2)}`}
            icon={BarChart3}
            description="Available to withdraw"
          />
          <StatsCard
            title="Royalty Tier"
            value={stats.royaltyTier}
            icon={BarChart3}
            description="Your commission level"
            className={getRoyaltyTierColor(stats.royaltyTier)}
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
                  <SelectItem value="approved">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Resources Table */}
            <div className="border rounded-lg">
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="w-6 h-6 animate-spin mr-2" />
                  <span>Loading resources...</span>
                </div>
              ) : (
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
                      <TableHead>
                        <Button
                          variant="ghost"
                          className="h-auto p-0 font-medium"
                          onClick={() => {
                            setSortBy("uploadDate");
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                          }}
                        >
                          Upload Date
                          {sortBy === "uploadDate" &&
                            (sortOrder === "asc" ? (
                              <SortAsc className="ml-2 w-4 h-4" />
                            ) : (
                              <SortDesc className="ml-2 w-4 h-4" />
                            ))}
                        </Button>
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedResources.map((resource) => (
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
                          {resource.isFree ? (
                            <Badge className="bg-green-100 text-green-800">
                              Free
                            </Badge>
                          ) : (
                            <span className="font-medium">
                              {resource.currency || "£"}
                              {resource.price.toFixed(2)}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(resource.status)}</TableCell>
                        <TableCell>
                          <span className="font-medium">
                            {resource.salesCount}
                          </span>
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
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedResource(resource);
                                  setIsStatsModalOpen(true);
                                }}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Stats
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  navigate(
                                    `/teacher/edit-resource/${resource.id}`
                                  )
                                }
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Resource
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() =>
                                  handleDeleteResource(resource.id)
                                }
                              >
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
              )}
            </div>

            {!loading && sortedResources.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No resources found matching your criteria.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resource Stats Modal */}
        <ResourceStatsModal
          isOpen={isStatsModalOpen}
          onClose={() => {
            setIsStatsModalOpen(false);
            setSelectedResource(null);
          }}
          resource={selectedResource}
        />
      </div>
    </DashboardLayout>
  );
}
