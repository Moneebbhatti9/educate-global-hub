import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  MessageCircle,
  Users,
  ThumbsUp,
  Clock,
  Pin,
  TrendingUp,
  BookOpen,
  HelpCircle,
  Lightbulb,
  Plus,
  Tag,
  Send,
} from "lucide-react";

const Forum = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [newDiscussion, setNewDiscussion] = useState({
    title: "",
    content: "",
    category: "",
    tags: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreateDiscussion = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle discussion creation logic here
    console.log("New discussion:", newDiscussion);
    setIsDialogOpen(false);
    setNewDiscussion({ title: "", content: "", category: "", tags: "" });
  };

  const categories = [
    {
      id: "teaching-tips",
      name: "Teaching Tips & Strategies",
      description: "Share and discover effective teaching methods",
      icon: Lightbulb,
      color: "bg-brand-accent-orange/10 text-brand-accent-orange",
      posts: 156,
      members: 1240,
    },
    {
      id: "curriculum",
      name: "Curriculum & Resources",
      description: "Discuss curriculum development and share resources",
      icon: BookOpen,
      color: "bg-brand-accent-green/10 text-brand-accent-green",
      posts: 89,
      members: 890,
    },
    {
      id: "career-advice",
      name: "Career Advice",
      description: "Professional development and career guidance",
      icon: TrendingUp,
      color: "bg-brand-secondary/10 text-brand-secondary",
      posts: 234,
      members: 1560,
    },
    {
      id: "help-support",
      name: "Help & Support",
      description: "Ask questions and get help from the community",
      icon: HelpCircle,
      color: "bg-brand-primary/10 text-brand-primary",
      posts: 67,
      members: 450,
    },
  ];

  const discussions = [
    {
      id: 1,
      title: "How to engage reluctant learners in mathematics?",
      author: {
        name: "Sarah Johnson",
        avatar: "/api/placeholder/40/40",
        role: "Mathematics Teacher",
        reputation: 1250,
      },
      category: "Teaching Tips & Strategies",
      content:
        "I'm struggling with a few students who seem disinterested in math. Has anyone found effective strategies to make mathematics more engaging?",
      replies: 23,
      likes: 45,
      views: 234,
      lastActivity: "2 hours ago",
      isPinned: false,
      tags: ["mathematics", "engagement", "classroom-management"],
    },
    {
      id: 2,
      title: "Best practices for remote learning assessment",
      author: {
        name: "Michael Chen",
        avatar: "/api/placeholder/40/40",
        role: "High School Principal",
        reputation: 2100,
      },
      category: "Curriculum & Resources",
      content:
        "With hybrid learning becoming more common, what are your go-to methods for authentic online assessment?",
      replies: 31,
      likes: 67,
      views: 445,
      lastActivity: "4 hours ago",
      isPinned: true,
      tags: ["remote-learning", "assessment", "technology"],
    },
    {
      id: 3,
      title: "Transitioning from teaching to curriculum development",
      author: {
        name: "Emily Rodriguez",
        avatar: "/api/placeholder/40/40",
        role: "Curriculum Specialist",
        reputation: 890,
      },
      category: "Career Advice",
      content:
        "After 8 years in the classroom, I'm considering a move to curriculum development. What skills should I focus on developing?",
      replies: 18,
      likes: 32,
      views: 167,
      lastActivity: "6 hours ago",
      isPinned: false,
      tags: ["career-change", "curriculum-development", "professional-growth"],
    },
    {
      id: 4,
      title: "Integrating AI tools in education - your experiences?",
      author: {
        name: "David Kim",
        avatar: "/api/placeholder/40/40",
        role: "Technology Coordinator",
        reputation: 1450,
      },
      category: "Teaching Tips & Strategies",
      content:
        "I'm curious about how other educators are incorporating AI tools into their teaching. What has worked well for you?",
      replies: 42,
      likes: 89,
      views: 678,
      lastActivity: "8 hours ago",
      isPinned: false,
      tags: ["artificial-intelligence", "edtech", "innovation"],
    },
    {
      id: 5,
      title: "Help: Setting up parent-teacher conferences efficiently",
      author: {
        name: "Lisa Thompson",
        avatar: "/api/placeholder/40/40",
        role: "Elementary Teacher",
        reputation: 560,
      },
      category: "Help & Support",
      content:
        "First-year teacher here! I need advice on organizing parent-teacher conferences. Any templates or systems you'd recommend?",
      replies: 15,
      likes: 28,
      views: 123,
      lastActivity: "1 day ago",
      isPinned: false,
      tags: ["parent-communication", "organization", "new-teacher"],
    },
  ];

  const trendingTopics = [
    { name: "AI in Education", posts: 45 },
    { name: "Classroom Management", posts: 67 },
    { name: "Remote Learning", posts: 34 },
    { name: "Professional Development", posts: 28 },
    { name: "Student Engagement", posts: 52 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-4">
            <div className="flex-1">
              <h1 className="font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-foreground mb-4">
                Education Forum
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl">
                Connect with educators worldwide. Share knowledge, ask
                questions, and grow together as a global education community.
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="hero"
                  className="ml-0 sm:ml-4 w-full sm:w-auto"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="sm:inline">New Discussion</span>
                  <span className="sm:hidden">New Post</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto sm:w-full sm:max-w-2xl">
                <DialogHeader className="pb-4">
                  <DialogTitle className="font-heading text-lg sm:text-xl">
                    Start a New Discussion
                  </DialogTitle>
                  <DialogDescription className="text-sm sm:text-base">
                    Share your thoughts, ask questions, or start a conversation
                    with the community.
                  </DialogDescription>
                </DialogHeader>

                <form
                  onSubmit={handleCreateDiscussion}
                  className="space-y-4 sm:space-y-6"
                >
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium">
                      Discussion Title *
                    </Label>
                    <Input
                      id="title"
                      placeholder="Enter a clear, descriptive title for your discussion"
                      value={newDiscussion.title}
                      onChange={(e) =>
                        setNewDiscussion({
                          ...newDiscussion,
                          title: e.target.value,
                        })
                      }
                      className="w-full"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-medium">
                      Category *
                    </Label>
                    <Select
                      value={newDiscussion.category}
                      onValueChange={(value) =>
                        setNewDiscussion({ ...newDiscussion, category: value })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="teaching-tips">
                          Teaching Tips & Strategies
                        </SelectItem>
                        <SelectItem value="curriculum">
                          Curriculum & Resources
                        </SelectItem>
                        <SelectItem value="career-advice">
                          Career Advice
                        </SelectItem>
                        <SelectItem value="help-support">
                          Help & Support
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content" className="text-sm font-medium">
                      Content *
                    </Label>
                    <Textarea
                      id="content"
                      placeholder="Share your thoughts, ask your question, or describe your topic in detail..."
                      value={newDiscussion.content}
                      onChange={(e) =>
                        setNewDiscussion({
                          ...newDiscussion,
                          content: e.target.value,
                        })
                      }
                      rows={4}
                      className="w-full resize-none sm:resize-y min-h-[100px] sm:min-h-[120px]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags" className="text-sm font-medium">
                      Tags
                    </Label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="tags"
                        placeholder="e.g., mathematics, classroom-management, new-teacher (separate with commas)"
                        value={newDiscussion.tags}
                        onChange={(e) =>
                          setNewDiscussion({
                            ...newDiscussion,
                            tags: e.target.value,
                          })
                        }
                        className="pl-10 w-full"
                      />
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Add relevant tags to help others find your discussion
                    </p>
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 sm:pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      className="w-full sm:w-auto order-2 sm:order-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="hero"
                      className="w-full sm:w-auto order-1 sm:order-2"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      <span className="sm:inline">Start Discussion</span>
                      <span className="sm:hidden">Start</span>
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search and Tabs */}
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search discussions, topics, or users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Tabs defaultValue="recent" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="recent">Recent</TabsTrigger>
                  <TabsTrigger value="trending">Trending</TabsTrigger>
                  <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
                  <TabsTrigger value="following">Following</TabsTrigger>
                </TabsList>

                <TabsContent value="recent" className="space-y-4 mt-6">
                  {discussions.map((discussion) => (
                    <Card
                      key={discussion.id}
                      className="group hover:shadow-card-hover transition-all duration-300 hover:border-brand-primary/20"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              {discussion.isPinned && (
                                <Pin className="w-4 h-4 text-brand-accent-orange" />
                              )}
                              <Badge variant="outline" className="text-xs">
                                {discussion.category}
                              </Badge>
                            </div>
                            <CardTitle className="font-heading text-lg">
                              <Link
                                to={`/forum/${discussion.id}`}
                                className="hover:text-brand-primary transition-colors cursor-pointer block hover:underline"
                              >
                                {discussion.title}
                              </Link>
                            </CardTitle>
                            <CardDescription className="mt-2 line-clamp-2">
                              {discussion.content}
                            </CardDescription>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-3">
                          {discussion.tags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </CardHeader>

                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={discussion.author.avatar} />
                              <AvatarFallback>
                                {discussion.author.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-sm">
                                {discussion.author.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {discussion.author.role}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <MessageCircle className="w-4 h-4 mr-1" />
                              {discussion.replies}
                            </div>
                            <div className="flex items-center">
                              <ThumbsUp className="w-4 h-4 mr-1" />
                              {discussion.likes}
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {discussion.lastActivity}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="trending" className="mt-6">
                  <p className="text-center text-muted-foreground py-8">
                    Trending discussions will be shown here based on engagement
                    and activity.
                  </p>
                </TabsContent>

                <TabsContent value="unanswered" className="mt-6">
                  <p className="text-center text-muted-foreground py-8">
                    Discussions without replies will be displayed here to
                    encourage community support.
                  </p>
                </TabsContent>

                <TabsContent value="following" className="mt-6">
                  <p className="text-center text-muted-foreground py-8">
                    Discussions from people and topics you follow will appear
                    here.
                  </p>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <div
                      key={category.id}
                      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer group"
                    >
                      <div
                        className={`w-10 h-10 rounded-lg ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm group-hover:text-brand-primary transition-colors">
                          {category.name}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {category.posts} posts · {category.members} members
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Trending Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Trending Topics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trendingTopics.map((topic, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 hover:bg-muted/30 -mx-2 px-2 rounded cursor-pointer"
                    >
                      <span className="text-sm font-medium">#{topic.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {topic.posts}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Community Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">
                  Community
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-brand-primary">
                    15,240
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Active Members
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-foreground">
                      1,456
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Discussions
                    </div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-foreground">
                      8,932
                    </div>
                    <div className="text-xs text-muted-foreground">Replies</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Forum;
