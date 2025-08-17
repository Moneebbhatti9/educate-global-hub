import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft,
  MessageCircle, 
  ThumbsUp, 
  ThumbsDown,
  Share2,
  Bookmark,
  MoreHorizontal,
  Reply,
  Edit3,
  Bold,
  Italic,
  Link as LinkIcon,
  Code,
  Quote,
  Flag,
  Award,
  Calendar,
  Eye,
  Pin,
  Heart,
  Laugh,
  Angry
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const ForumDetail = () => {
  const { id } = useParams();
  const [sortBy, setSortBy] = useState("newest");
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [likedComments, setLikedComments] = useState(new Set());
  const [userReaction, setUserReaction] = useState<string | null>(null);

  // Mock topic data - replace with API call
  const topic = {
    id: 1,
    title: "How to engage reluctant learners in mathematics?",
    content: `I'm struggling with a few students who seem disinterested in math. They're bright kids, but they've convinced themselves they're "not math people." 

I've tried different approaches:
- Making math more visual with manipulatives
- Connecting to real-world applications  
- Breaking problems into smaller steps
- Offering different ways to show understanding

But I'm still seeing blank stares and "I can't do this" attitudes. Has anyone found effective strategies to make mathematics more engaging and help students overcome their math anxiety?

**Background:** I teach 7th grade algebra concepts to students with mixed math backgrounds. Some come in already feeling defeated about math.

Any specific activities, mindset work, or classroom culture strategies you've seen work would be incredibly helpful!`,
    author: {
      name: "Sarah Johnson",
      avatar: "/api/placeholder/60/60",
      role: "Mathematics Teacher",
      reputation: 1250,
      badges: ["Verified Teacher", "Math Expert", "Community Helper"]
    },
    category: "Teaching Tips & Strategies",
    createdAt: "2024-01-15T10:30:00Z",
    replies: 23,
    likes: 45,
    views: 234,
    tags: ["mathematics", "engagement", "classroom-management", "middle-school", "algebra"]
  };

  const reactions = [
    { emoji: "👍", count: 45, label: "Helpful" },
    { emoji: "❤️", count: 12, label: "Love" },
    { emoji: "😊", count: 8, label: "Happy" },
    { emoji: "🤔", count: 3, label: "Thinking" }
  ];

  // Mock comments data
  const comments = [
    {
      id: 1,
      author: {
        name: "Michael Chen",
        avatar: "/api/placeholder/40/40",
        role: "High School Principal",
        reputation: 2100
      },
      content: `Great question, Sarah! I've seen similar challenges. Here's what worked in our school:

**Growth Mindset Approach:**
- Start each class with "mistakes help us learn" 
- Celebrate when students show their thinking, even if incorrect
- Use language like "You can't do this *yet*"

**Gamification Elements:**
- Math challenges with team competitions
- Progress badges for different concepts mastered
- "Math detective" problems that feel like puzzles

The key is making math feel achievable and relevant. What grade level are you working with specifically?`,
      createdAt: "2024-01-15T11:15:00Z",
      likes: 18,
      replies: [
        {
          id: 11,
          author: {
            name: "Sarah Johnson",
            avatar: "/api/placeholder/40/40",
            role: "Mathematics Teacher",
            reputation: 1250
          },
          content: "Thanks Michael! I'm working with 7th graders. The growth mindset language is something I definitely need to be more intentional about. Do you have specific examples of the 'math detective' problems?",
          createdAt: "2024-01-15T11:45:00Z",
          likes: 5,
          isOP: true
        }
      ]
    },
    {
      id: 2,
      author: {
        name: "Dr. Emily Rodriguez",
        avatar: "/api/placeholder/40/40",
        role: "Math Education Researcher",
        reputation: 3200
      },
      content: `Research shows that math anxiety often stems from timed tests and emphasis on speed over understanding. Here are evidence-based strategies:

**Building Number Sense:**
- Use number talks daily (5-10 minutes)
- Focus on multiple solution paths
- Ask "How did you think about that?" instead of "What's the answer?"

**Reducing Anxiety:**
- Eliminate timed tests for struggling students
- Allow use of manipulatives/visual aids
- Create "low-floor, high-ceiling" problems

**Resources I recommend:**
- Jo Boaler's "Mathematical Mindsets"
- Which One Doesn't Belong activities
- Notice & Wonder routines

Would love to hear how these work for you!`,
      createdAt: "2024-01-15T12:30:00Z",
      likes: 32,
      replies: []
    }
  ];

  const handleReaction = (emoji: string) => {
    setUserReaction(userReaction === emoji ? null : emoji);
  };

  const handleCommentLike = (commentId: number) => {
    const newLiked = new Set(likedComments);
    if (likedComments.has(commentId)) {
      newLiked.delete(commentId);
    } else {
      newLiked.add(commentId);
    }
    setLikedComments(newLiked);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link 
            to="/forum" 
            className="inline-flex items-center text-brand-primary hover:text-brand-secondary transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Forum
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Topic Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-3">
                      <Badge variant="outline" className="bg-brand-primary/10 text-brand-primary border-brand-primary/20">
                        {topic.category}
                      </Badge>
                      <Pin className="w-4 h-4 text-brand-accent-orange" />
                    </div>
                    <h1 className="font-heading font-bold text-2xl sm:text-3xl text-foreground mb-4">
                      {topic.title}
                    </h1>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Bookmark className="w-4 h-4 mr-2" />
                        Save Topic
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Flag className="w-4 h-4 mr-2" />
                        Report
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Author Info */}
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={topic.author.avatar} />
                    <AvatarFallback>{topic.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{topic.author.name}</span>
                      <Badge variant="secondary" className="text-xs">OP</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">{topic.author.role}</div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Award className="w-3 h-3 text-brand-accent-orange" />
                      <span className="text-xs text-muted-foreground">{topic.author.reputation} reputation</span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(topic.createdAt)}
                    </div>
                  </div>
                </div>

                {/* Topic Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {topic.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs hover:bg-brand-primary/10 cursor-pointer">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>

              <CardContent>
                {/* Topic Content */}
                <div className="prose prose-slate max-w-none mb-6">
                  <div className="whitespace-pre-wrap text-foreground">{topic.content}</div>
                </div>

                <Separator className="my-6" />

                {/* Reactions & Stats */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Reactions */}
                    <div className="flex items-center space-x-2">
                      {reactions.map((reaction, index) => (
                        <Button
                          key={index}
                          variant={userReaction === reaction.emoji ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleReaction(reaction.emoji)}
                          className="h-8 px-3"
                        >
                          <span className="mr-1">{reaction.emoji}</span>
                          <span className="text-xs">{reaction.count}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {topic.views} views
                    </div>
                    <div className="flex items-center">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      {topic.replies} replies
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-heading text-lg">
                    {comments.length} Replies
                  </CardTitle>
                  
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="oldest">Oldest</SelectItem>
                      <SelectItem value="most-liked">Most Liked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Add Reply Form */}
                <div className="border rounded-lg p-4 bg-muted/30">
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src="/api/placeholder/40/40" />
                      <AvatarFallback>YU</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Textarea
                        placeholder="Add your reply to help the community..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        className="min-h-[100px] mb-3"
                      />
                      
                      {/* Rich Text Toolbar */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Bold className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Italic className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <LinkIcon className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Code className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Quote className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <Button 
                          variant="default"
                          className="bg-brand-primary hover:bg-brand-primary/90"
                          disabled={!replyContent.trim()}
                        >
                          Post Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Comments List */}
                {comments.map((comment) => (
                  <div key={comment.id} className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={comment.author.avatar} />
                        <AvatarFallback>{comment.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-semibold">{comment.author.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {comment.author.role}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        
                        <div className="prose prose-slate max-w-none mb-3">
                          <div className="whitespace-pre-wrap text-foreground">{comment.content}</div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCommentLike(comment.id)}
                            className={`h-8 ${likedComments.has(comment.id) ? 'text-brand-primary' : ''}`}
                          >
                            <ThumbsUp className="w-4 h-4 mr-1" />
                            {comment.likes + (likedComments.has(comment.id) ? 1 : 0)}
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8">
                            <Reply className="w-4 h-4 mr-1" />
                            Reply
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8">
                            <Share2 className="w-4 h-4 mr-1" />
                            Share
                          </Button>
                        </div>

                        {/* Nested Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="mt-4 ml-6 border-l-2 border-muted pl-4 space-y-4">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex items-start space-x-3">
                                <Avatar className="w-8 h-8">
                                  <AvatarImage src={reply.author.avatar} />
                                  <AvatarFallback>{reply.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <span className="font-semibold text-sm">{reply.author.name}</span>
                                    {reply.isOP && <Badge variant="secondary" className="text-xs">OP</Badge>}
                                    <span className="text-xs text-muted-foreground">
                                      {formatDate(reply.createdAt)}
                                    </span>
                                  </div>
                                  
                                  <div className="text-sm mb-2">{reply.content}</div>
                                  
                                  <div className="flex items-center space-x-3">
                                    <Button variant="ghost" size="sm" className="h-6 text-xs">
                                      <ThumbsUp className="w-3 h-3 mr-1" />
                                      {reply.likes}
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-6 text-xs">
                                      <Reply className="w-3 h-3 mr-1" />
                                      Reply
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Separator />
                  </div>
                ))}

                {/* Load More Comments */}
                <div className="text-center">
                  <Button variant="outline">
                    Load More Comments
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Author Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">About the Author</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={topic.author.avatar} />
                    <AvatarFallback>{topic.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{topic.author.name}</div>
                    <div className="text-sm text-muted-foreground">{topic.author.role}</div>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Reputation</span>
                    <span className="font-semibold">{topic.author.reputation}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Posts</span>
                    <span className="font-semibold">47</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Joined</span>
                    <span className="font-semibold">Mar 2023</span>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {topic.author.badges.map((badge, index) => (
                    <Badge key={index} variant="secondary" className="mr-2 mb-2">
                      {badge}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Related Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">Related Topics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  "Building math confidence in elementary students",
                  "Visual math teaching strategies",
                  "Overcoming math anxiety in middle school",
                  "Real-world math applications for engagement"
                ].map((title, index) => (
                  <div key={index} className="p-3 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer">
                    <div className="font-medium text-sm text-brand-primary hover:text-brand-secondary transition-colors">
                      {title}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      12 replies · 3 hours ago
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Popular Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">Popular Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {["mathematics", "engagement", "classroom-management", "teaching-tips", "student-motivation", "algebra", "middle-school"].map((tag, index) => (
                    <Badge key={index} variant="outline" className="cursor-pointer hover:bg-brand-primary/10">
                      #{tag}
                    </Badge>
                  ))}
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

export default ForumDetail;