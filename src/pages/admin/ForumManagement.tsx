import { useState } from "react";
import { Link } from "react-router-dom";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import DashboardLayout from "@/layout/DashboardLayout";
import { DashboardErrorFallback, SectionErrorFallback } from "@/components/ui/error-fallback";
import { EmptyForumPosts, EmptySearchResults } from "@/components/ui/empty-state";

const ForumManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  // Mock data - replace with actual API calls
  const discussions = [
    {
      id: 1,
      title: "How to engage reluctant learners in mathematics?",
      author: {
        name: "Sarah Johnson",
        avatar: "/api/placeholder/40/40",
        role: "Mathematics Teacher",
      },
      category: "Teaching Tips & Strategies",
      status: "active",
      isPinned: false,
      isLocked: false,
      replies: 23,
      likes: 45,
      views: 234,
      reports: 0,
      createdAt: "2024-01-15T10:30:00Z",
      lastActivity: "2 hours ago",
      tags: ["mathematics", "engagement", "classroom-management"],
    },
    {
      id: 2,
      title: "Best practices for remote learning assessment",
      author: {
        name: "Michael Chen",
        avatar: "/api/placeholder/40/40",
        role: "High School Principal",
      },
      category: "Curriculum & Resources",
      status: "active",
      isPinned: true,
      isLocked: false,
      replies: 31,
      likes: 67,
      views: 445,
      reports: 1,
      createdAt: "2024-01-14T08:15:00Z",
      lastActivity: "4 hours ago",
      tags: ["remote-learning", "assessment", "technology"],
    },
    {
      id: 3,
      title: "Inappropriate content in discussion",
      author: {
        name: "Anonymous User",
        avatar: "/api/placeholder/40/40",
        role: "Teacher",
      },
      category: "Help & Support",
      status: "reported",
      isPinned: false,
      isLocked: true,
      replies: 5,
      likes: 2,
      views: 45,
      reports: 3,
      createdAt: "2024-01-13T14:20:00Z",
      lastActivity: "1 day ago",
      tags: ["help", "support"],
    },
  ];

  const categories = [
    { id: "teaching-tips", name: "Teaching Tips & Strategies", posts: 156 },
    { id: "curriculum", name: "Curriculum & Resources", posts: 89 },
    { id: "career-advice", name: "Career Advice", posts: 234 },
    { id: "help-support", name: "Help & Support", posts: 67 },
  ];

  const stats = {
    totalDiscussions: 546,
    activeDiscussions: 523,
    reportedDiscussions: 3,
    pinnedDiscussions: 8,
    totalReplies: 2847,
    moderationActions: 12,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 border-green-200";
      case "reported":
        return "bg-red-100 text-red-700 border-red-200";
      case "archived":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

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
          {/* <div className="flex gap-2">
            <Button variant="outline">
              <Archive className="w-4 h-4 mr-2" />
              Archive Selected
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Announcement
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Forum Announcement</DialogTitle>
                  <DialogDescription>
                    Create a pinned announcement for all forum users
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="announcement-title">Title</Label>
                    <Input
                      id="announcement-title"
                      placeholder="Enter announcement title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="announcement-category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="announcement-content">Content</Label>
                    <Textarea
                      id="announcement-content"
                      placeholder="Enter announcement content"
                      rows={6}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="pin-announcement" />
                    <Label htmlFor="pin-announcement">Pin announcement</Label>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline">Cancel</Button>
                    <Button>Create Announcement</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div> */}
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
                  <p className="text-2xl font-bold group-hover:scale-110 transition-transform duration-300">{stats.totalDiscussions}</p>
                  <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out" style={{ width: '100%' }}></div>
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
                  <p className="text-sm text-muted-foreground group-hover:text-green-500 transition-colors duration-300">Active</p>
                  <p className="text-2xl font-bold text-green-500 group-hover:scale-110 transition-transform duration-300">{stats.activeDiscussions}</p>
                  <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${stats.totalDiscussions ? (stats.activeDiscussions / stats.totalDiscussions) * 100 : 0}%` }}
                    ></div>
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
                  <p className="text-sm text-muted-foreground group-hover:text-red-500 transition-colors duration-300">Reported</p>
                  <p className="text-2xl font-bold text-red-500 group-hover:scale-110 transition-transform duration-300">
                    {stats.reportedDiscussions}
                  </p>
                  <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500 rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${stats.totalDiscussions ? (stats.reportedDiscussions / stats.totalDiscussions) * 100 : 0}%` }}
                    ></div>
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
                  <p className="text-sm text-muted-foreground group-hover:text-orange-500 transition-colors duration-300">Pinned</p>
                  <p className="text-2xl font-bold text-orange-500 group-hover:scale-110 transition-transform duration-300">{stats.pinnedDiscussions}</p>
                  <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-500 rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${stats.totalDiscussions ? (stats.pinnedDiscussions / stats.totalDiscussions) * 100 : 0}%` }}
                    ></div>
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
                  <p className="text-sm text-muted-foreground group-hover:text-purple-500 transition-colors duration-300">Total Replies</p>
                  <p className="text-2xl font-bold text-purple-500 group-hover:scale-110 transition-transform duration-300">{stats.totalReplies}</p>
                  <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-500 rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${stats.totalDiscussions ? Math.min((stats.totalReplies / stats.totalDiscussions) * 10, 100) : 0}%` }}
                    ></div>
                  </div>
                </div>
                <div className="relative">
                  <TrendingUp className="w-8 h-8 text-purple-500 group-hover:scale-110 transition-all duration-300" />
                </div>
              </div>
            </CardContent>
          </Card>
          {/* <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Mod Actions</p>
                  <p className="text-xl font-bold">{stats.moderationActions}</p>
                </div>
              </div>
            </CardContent>
          </Card> */}
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-4">
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
                  {/* <SelectItem value="archived">Archived</SelectItem> */}
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
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
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="most-replies">Most Replies</SelectItem>
                  <SelectItem value="most-likes">Most Likes</SelectItem>
                  <SelectItem value="most-reported">Most Reported</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Discussions List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Forum Discussions</span>
              <Badge variant="outline">{discussions.length} discussions</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {discussions.map((discussion) => (
                <div
                  key={discussion.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-all duration-300 hover:shadow-md hover:scale-[1.01] group"
                >
                  <div className="flex items-start space-x-4 flex-1">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={discussion.author.avatar} />
                      <AvatarFallback>
                        {discussion.author.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        {discussion.isPinned && (
                          <Pin className="w-4 h-4 text-orange-500 group-hover:scale-110 transition-transform duration-300" />
                        )}
                        {discussion.isLocked && (
                          <Lock className="w-4 h-4 text-gray-500 group-hover:scale-110 transition-transform duration-300" />
                        )}
                        {discussion.reports > 0 && (
                          <Flag className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform duration-300" />
                        )}
                        <Badge variant="outline" className="text-xs">
                          {discussion.category}
                        </Badge>
                        <Badge
                          className={`text-xs ${getStatusColor(
                            discussion.status
                          )}`}
                        >
                          {discussion.status}
                        </Badge>
                      </div>

                      <Link
                        to={`/forum/${discussion.id}`}
                        className="font-medium text-foreground hover:text-primary transition-colors block truncate group-hover:scale-105 transition-transform duration-300"
                      >
                        {discussion.title}
                      </Link>

                      <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                        <span className="group-hover:text-brand-primary transition-colors duration-300">by {discussion.author.name}</span>
                        <div className="flex items-center space-x-1 group-hover:scale-105 transition-transform duration-300">
                          <Calendar className="w-3 h-3 group-hover:text-brand-primary transition-colors duration-300" />
                          <span>{formatDate(discussion.createdAt)}</span>
                        </div>
                        <div className="flex items-center space-x-1 group-hover:scale-105 transition-transform duration-300">
                          <MessageCircle className="w-3 h-3 group-hover:text-brand-primary transition-colors duration-300" />
                          <span>{discussion.replies}</span>
                        </div>
                        <div className="flex items-center space-x-1 group-hover:scale-105 transition-transform duration-300">
                          <ThumbsUp className="w-3 h-3 group-hover:text-brand-primary transition-colors duration-300" />
                          <span>{discussion.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1 group-hover:scale-105 transition-transform duration-300">
                          <Eye className="w-3 h-3 group-hover:text-brand-primary transition-colors duration-300" />
                          <span>{discussion.views}</span>
                        </div>
                        {discussion.reports > 0 && (
                          <div className="flex items-center space-x-1 text-red-500 group-hover:scale-105 transition-transform duration-300">
                            <Flag className="w-3 h-3" />
                            <span>{discussion.reports} reports</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="group-hover:bg-brand-primary/10 group-hover:scale-110 transition-all duration-300">
                        <MoreHorizontal className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        View Discussion
                      </DropdownMenuItem>
                      {/* <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Discussion
                      </DropdownMenuItem> */}
                      <DropdownMenuItem>
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
                      <DropdownMenuItem>
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
                      {/* <DropdownMenuItem>
                        <Archive className="w-4 h-4 mr-2" />
                        Archive Discussion
                      </DropdownMenuItem> */}
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Discussion
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ForumManagement;
