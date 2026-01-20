import { useState, useEffect } from "react";
import DashboardLayout from "@/layout/DashboardLayout";
import { AdminForumManagementSkeleton } from "@/components/skeletons";
import {
  DashboardErrorFallback,
  SectionErrorFallback,
} from "@/components/ui/error-fallback";
import {
  EmptyForumPosts,
  EmptySearchResults,
} from "@/components/ui/empty-state";
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
import { useDropdownOptions } from "@/components/ui/dynamic-select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreHorizontal,
  Pin,
  Lock,
  Unlock,
  Trash2,
  Eye,
  MessageCircle,
  ThumbsUp,
  Flag,
  Edit,
  Plus,
  Filter,
  Calendar,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Archive,
} from "lucide-react";
import {
  useAdminForumStats,
  useAdminForumList,
  useTogglePinDiscussion,
  useToggleLockDiscussion,
  useDeleteDiscussion,
} from "@/hooks/useAdminForum";
import DeleteDiscussionModal from "@/components/Modals/delete-discussion-modal";
import type { Discussion } from "@/types/forum";

const ForumManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDiscussion, setSelectedDiscussion] =
    useState<Discussion | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Dynamic dropdown options
  const { data: forumCategoryOptions, isLoading: loadingForumCategories } = useDropdownOptions("forumCategory");

  // API hooks
  const {
    data: statsData,
    isLoading: isLoadingStats,
    error: statsError,
  } = useAdminForumStats();

  const {
    data: discussionsData,
    isLoading: isLoadingDiscussions,
    error: discussionsError,
  } = useAdminForumList({
    status: statusFilter !== "all" ? statusFilter : undefined,
    category: categoryFilter !== "all" ? categoryFilter : undefined,
    sortBy: sortBy,
    page: currentPage,
    limit: 10,
  });

  const togglePinMutation = useTogglePinDiscussion();
  const toggleLockMutation = useToggleLockDiscussion();
  const deleteDiscussionMutation = useDeleteDiscussion();

  const stats = statsData;
  const discussions = discussionsData?.data || [];
  const pagination = {
    total: discussionsData?.total || 0,
    page: discussionsData?.page || 1,
    limit: discussionsData?.limit || 10,
    totalPages: Math.ceil(
      (discussionsData?.total || 0) / (discussionsData?.limit || 10)
    ),
    hasNextPage:
      (discussionsData?.page || 1) <
      Math.ceil((discussionsData?.total || 0) / (discussionsData?.limit || 10)),
    hasPrevPage: (discussionsData?.page || 1) > 1,
  };


  // Handle pin/unpin action
  const handleTogglePin = async (discussionId: string) => {
    try {
      await togglePinMutation.mutateAsync(discussionId);
    } catch (error) {
      // Error is handled in the mutation hook
    }
  };

  // Handle lock/unlock action
  const handleToggleLock = async (discussionId: string) => {
    try {
      await toggleLockMutation.mutateAsync(discussionId);
    } catch (error) {
      // Error is handled in the mutation hook
    }
  };

  // Handle delete action
  const handleDeleteDiscussion = async () => {
    if (!selectedDiscussion) return;

    try {
      await deleteDiscussionMutation.mutateAsync(selectedDiscussion._id);
      setIsDeleteModalOpen(false);
      setSelectedDiscussion(null);
    } catch (error) {
      // Error is handled in the mutation hook
    }
  };

  // Get status display info
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "active":
        return {
          color: "bg-green-100 text-green-700 border-green-200",
          icon: <CheckCircle className="w-3 h-3" />,
          label: "Active",
        };
      case "reported":
        return {
          color: "bg-red-100 text-red-700 border-red-200",
          icon: <Flag className="w-3 h-3" />,
          label: "Reported",
        };
      case "pinned":
        return {
          color: "bg-orange-100 text-orange-700 border-orange-200",
          icon: <Pin className="w-3 h-3" />,
          label: "Pinned",
        };
      default:
        return {
          color: "bg-gray-100 text-gray-700 border-gray-200",
          icon: <Clock className="w-3 h-3" />,
          label: status,
        };
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Calculate days ago
  const getDaysAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Handle search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm) {
        // Implement search functionality here
        // For now, we'll just reset to page 1
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Handle filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, categoryFilter, sortBy]);

  if (statsError || discussionsError) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Error Loading Forum Data
            </h3>
            <p className="text-muted-foreground">
              Failed to load forum data. Please try again later.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (isLoadingStats || isLoadingDiscussions) {
    return (
      <DashboardLayout role="admin">
        <AdminForumManagementSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="font-heading font-bold text-3xl text-foreground">
              Forum Management
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage forum discussions, moderate content, and oversee community
              interactions
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Card className="group hover-lift cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-blue-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground group-hover:text-blue-500 transition-colors duration-300">
                    Total Discussions
                  </p>
                  <p className="text-2xl font-bold group-hover:scale-110 transition-transform duration-300">
                    {stats?.totalDiscussions || 0}
                  </p>
                  <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out w-full"></div>
                  </div>
                </div>
                <div className="relative">
                  <MessageCircle className="w-8 h-8 text-blue-500 group-hover:scale-110 transition-all duration-300" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover-lift cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground group-hover:text-green-500 transition-colors duration-300">
                    Active
                  </p>
                  <p className="text-2xl font-bold text-green-500 group-hover:scale-110 transition-transform duration-300">
                    {stats?.active || 0}
                  </p>
                  <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full transition-all duration-1000 ease-out w-full"></div>
                  </div>
                </div>
                <div className="relative">
                  <CheckCircle className="w-8 h-8 text-green-500 group-hover:scale-110 transition-all duration-300" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover-lift cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-red-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground group-hover:text-red-500 transition-colors duration-300">
                    Reported
                  </p>
                  <p className="text-2xl font-bold text-red-500 group-hover:scale-110 transition-transform duration-300">
                    {stats?.reported || 0}
                  </p>
                  <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full transition-all duration-1000 ease-out w-full"></div>
                  </div>
                </div>
                <div className="relative">
                  <Flag className="w-8 h-8 text-red-500 group-hover:scale-110 transition-all duration-300" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover-lift cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-orange-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground group-hover:text-orange-500 transition-colors duration-300">
                    Pinned
                  </p>
                  <p className="text-2xl font-bold text-orange-500 group-hover:scale-110 transition-transform duration-300">
                    {stats?.pinned || 0}
                  </p>
                  <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full transition-all duration-1000 ease-out w-full"></div>
                  </div>
                </div>
                <div className="relative">
                  <Pin className="w-8 h-8 text-orange-500 group-hover:scale-110 transition-all duration-300" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover-lift cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground group-hover:text-purple-500 transition-colors duration-300">
                    Total Replies
                  </p>
                  <p className="text-2xl font-bold text-purple-500 group-hover:scale-110 transition-transform duration-300">
                    {stats?.totalReplies || 0}
                  </p>
                  <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full transition-all duration-1000 ease-out w-full"></div>
                  </div>
                </div>
                <div className="relative">
                  <TrendingUp className="w-8 h-8 text-purple-500 group-hover:scale-110 transition-all duration-300" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Search & Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search discussions, users, or content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="reported">Reported</SelectItem>
                  <SelectItem value="pinned">Pinned</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter} disabled={loadingForumCategories}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder={loadingForumCategories ? "Loading..." : "Category"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {forumCategoryOptions?.map((option) => (
                    <SelectItem key={option._id} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="trending">Trending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Discussions Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                Forum Discussions ({discussions.length})
              </CardTitle>
            </div>
            <CardDescription>
              Review and manage all forum discussions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {discussions.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No Discussions Found
                </h3>
                <p className="text-muted-foreground">
                  No discussions match your current filters.
                </p>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Discussion Details</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Replies</TableHead>
                      <TableHead>Likes</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {discussions.map((discussion) => {
                      // Determine status based on API response
                      let discussionStatus = "active";
                      if (discussion.reports && discussion.reports.length > 0) {
                        discussionStatus = "reported";
                      } else if (discussion.isPinned) {
                        discussionStatus = "pinned";
                      } else if (discussion.isActive) {
                        discussionStatus = "active";
                      }

                      const statusInfo = getStatusInfo(discussionStatus);
                      const daysAgo = getDaysAgo(discussion.createdAt);

                      return (
                        <TableRow
                          key={discussion._id}
                          className="group hover:bg-muted/50 transition-all duration-300 hover:shadow-sm"
                        >
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                {discussion.isPinned && (
                                  <Pin className="w-4 h-4 text-orange-500" />
                                )}
                                {discussion.isLocked && (
                                  <Lock className="w-4 h-4 text-gray-500" />
                                )}
                                {discussion.reports &&
                                  discussion.reports.length > 0 && (
                                    <Flag className="w-4 h-4 text-red-500" />
                                  )}
                                <div className="font-medium group-hover:text-brand-primary transition-colors duration-300">
                                  {discussion.title}
                                </div>
                              </div>
                              <div className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                                by {discussion.createdBy?.firstName}{" "}
                                {discussion.createdBy?.lastName}
                              </div>
                              <div className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                                {discussion.category || "General"}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`${statusInfo.color} flex items-center space-x-1 w-fit`}
                            >
                              {statusInfo.icon}
                              <span>{statusInfo.label}</span>
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1 group-hover:scale-105 transition-transform duration-300">
                              <MessageCircle className="w-4 h-4 text-muted-foreground group-hover:text-brand-primary transition-colors duration-300" />
                              <span className="font-medium group-hover:text-brand-primary transition-colors duration-300">
                                {discussion.replyCount || 0}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1 group-hover:scale-105 transition-transform duration-300">
                              <ThumbsUp className="w-4 h-4 text-muted-foreground group-hover:text-brand-primary transition-colors duration-300" />
                              <span className="font-medium group-hover:text-brand-primary transition-colors duration-300">
                                {discussion.likes?.length || 0}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1 group-hover:scale-105 transition-transform duration-300">
                              <Eye className="w-4 h-4 text-muted-foreground group-hover:text-brand-primary transition-colors duration-300" />
                              <span className="font-medium group-hover:text-brand-primary transition-colors duration-300">
                                {discussion.views || 0}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                            <div className="flex items-center group-hover:scale-105 transition-transform duration-300">
                              <Calendar className="w-3 h-3 mr-1 group-hover:text-brand-primary transition-colors duration-300" />
                              {daysAgo}d ago
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="group-hover:bg-brand-primary/10 group-hover:scale-110 transition-all duration-300"
                                >
                                  <MoreHorizontal className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Discussion
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleTogglePin(discussion._id)
                                  }
                                  disabled={togglePinMutation.isPending}
                                >
                                  {discussion.isPinned ? (
                                    <>
                                      <Pin className="w-4 h-4 mr-2" />
                                      Unpin Discussion
                                    </>
                                  ) : (
                                    <>
                                      <Pin className="w-4 h-4 mr-2" />
                                      Pin Discussion
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleToggleLock(discussion._id)
                                  }
                                  disabled={toggleLockMutation.isPending}
                                >
                                  {discussion.isLocked ? (
                                    <>
                                      <Unlock className="w-4 h-4 mr-2" />
                                      Unlock Discussion
                                    </>
                                  ) : (
                                    <>
                                      <Lock className="w-4 h-4 mr-2" />
                                      Lock Discussion
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => {
                                    setSelectedDiscussion(discussion);
                                    setIsDeleteModalOpen(true);
                                  }}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete Discussion
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-muted-foreground">
                      Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                      {Math.min(
                        pagination.page * pagination.limit,
                        pagination.total
                      )}{" "}
                      of {pagination.total} results
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(pagination.page - 1)}
                        disabled={!pagination.hasPrevPage}
                        className="hover:bg-brand-primary/10 hover:border-brand-primary hover:scale-105 transition-all duration-300"
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(pagination.page + 1)}
                        disabled={!pagination.hasNextPage}
                        className="hover:bg-brand-primary/10 hover:border-brand-primary hover:scale-105 transition-all duration-300"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteDiscussionModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedDiscussion(null);
        }}
        onConfirm={handleDeleteDiscussion}
        discussion={selectedDiscussion}
        isLoading={deleteDiscussionMutation.isPending}
      />
    </DashboardLayout>
  );
};

export default ForumManagement;
