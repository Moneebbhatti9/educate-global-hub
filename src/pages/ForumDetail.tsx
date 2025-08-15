import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft,
  MessageCircle, 
  ThumbsUp, 
  ThumbsDown,
  Share2,
  Bookmark,
  MoreHorizontal,
  Clock,
  Eye,
  Pin,
  Flag,
  Send,
  Heart,
  Reply,
  Edit,
  Trash2,
  Award,
  CheckCircle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ForumDetail = () => {
  const { id } = useParams();
  const [newReply, setNewReply] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [likedReplies, setLikedReplies] = useState<Set<number>>(new Set());
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Mock data - in real app would fetch based on id
  const discussion = {
    id: parseInt(id || "1"),
    title: "How to engage reluctant learners in mathematics?",
    author: {
      name: "Sarah Johnson",
      avatar: "/api/placeholder/48/48",
      role: "Mathematics Teacher",
      reputation: 1250,
      isVerified: true,
      joinDate: "2022-08-15",
      totalPosts: 89,
      helpfulAnswers: 34
    },
    category: "Teaching Tips & Strategies",
    content: `I'm struggling with a few students who seem disinterested in math. Has anyone found effective strategies to make mathematics more engaging?

I've tried various approaches like:
- Using real-world examples and applications
- Incorporating games and interactive activities
- Breaking down complex problems into smaller steps
- Encouraging peer collaboration

However, I still have 3-4 students who remain disengaged. They're bright students, but they seem to have developed a mental block about mathematics. 

What techniques have worked for you in similar situations? I'm particularly interested in strategies that have worked for middle school students (grades 6-8).

Any advice would be greatly appreciated!`,
    replies: 23,
    likes: 45,
    views: 234,
    lastActivity: "2 hours ago",
    isPinned: false,
    isAnswered: false,
    tags: ["mathematics", "engagement", "classroom-management", "middle-school"],
    createdAt: "2024-03-10T14:30:00Z"
  };

  const replies = [
    {
      id: 1,
      author: {
        name: "Michael Chen",
        avatar: "/api/placeholder/40/40",
        role: "High School Principal",
        reputation: 2100,
        isVerified: true
      },
      content: `Great question, Sarah! I've seen this challenge many times. Here are a few strategies that have worked well in our school:

**1. Student Choice & Autonomy**
- Let students choose which problems to solve from a selection
- Allow them to pick their preferred method for solving problems
- Give them ownership in their learning process

**2. Storytelling & Context**
- Frame math problems as stories or mysteries to solve
- Use characters and scenarios that resonate with your students
- Connect to current events or popular culture

**3. Technology Integration**
- Use apps like Desmos or GeoGebra for visual learning
- Gamify lessons with platforms like Kahoot or Prodigy
- Create digital portfolios where students can showcase their work

The key is finding what motivates each individual student. Sometimes it's competition, sometimes it's creativity, and sometimes it's just showing them how math applies to their future goals.`,
      likes: 28,
      isLiked: false,
      createdAt: "2024-03-10T15:45:00Z",
      replies: [
        {
          id: 11,
          author: {
            name: "Sarah Johnson",
            avatar: "/api/placeholder/32/32",
            role: "Mathematics Teacher",
            reputation: 1250
          },
          content: "Thank you, Michael! The storytelling approach sounds really interesting. Do you have any specific examples of math stories that worked well with middle schoolers?",
          likes: 5,
          createdAt: "2024-03-10T16:20:00Z"
        }
      ],
      isAcceptedAnswer: true
    },
    {
      id: 2,
      author: {
        name: "Emily Rodriguez",
        avatar: "/api/placeholder/40/40",
        role: "Curriculum Specialist",
        reputation: 890,
        isVerified: false
      },
      content: `I completely understand your frustration! Here's what I've found effective:

**Movement & Kinesthetic Learning:**
- Math walks around the school (measuring, calculating areas)
- Using manipulatives and hands-on activities
- Body-based learning (jumping for skip counting, etc.)

**Peer Teaching:**
- Pair struggling students with confident ones
- Have students explain concepts to each other
- Create study groups with mixed ability levels

**Regular Check-ins:**
- Short 1-on-1 conversations about their interests
- Find connections between their hobbies and math
- Celebrate small wins consistently

Remember, building relationships first often unlocks academic engagement!`,
      likes: 19,
      isLiked: false,
      createdAt: "2024-03-10T17:12:00Z",
      replies: []
    },
    {
      id: 3,
      author: {
        name: "David Kim",
        avatar: "/api/placeholder/40/40",
        role: "Technology Coordinator",
        reputation: 1450,
        isVerified: true
      },
      content: `Have you considered using escape rooms or mystery-solving activities? I've created several math-based escape rooms that require students to solve problems to "escape."

The competitive and collaborative nature really engages students who might otherwise be reluctant. Plus, they don't even realize they're doing intensive math practice!

I can share some templates if you're interested. The key is making the math feel incidental to the main activity.`,
      likes: 15,
      isLiked: false,
      createdAt: "2024-03-10T18:30:00Z",
      replies: [
        {
          id: 31,
          author: {
            name: "Lisa Thompson",
            avatar: "/api/placeholder/32/32",
            role: "Elementary Teacher",
            reputation: 560
          },
          content: "This sounds amazing! I'd love to see those templates too. My 5th graders would probably love this approach.",
          likes: 3,
          createdAt: "2024-03-10T19:00:00Z"
        }
      ]
    }
  ];

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleReplyLike = (replyId: number) => {
    const newLikedReplies = new Set(likedReplies);
    if (newLikedReplies.has(replyId)) {
      newLikedReplies.delete(replyId);
    } else {
      newLikedReplies.add(replyId);
    }
    setLikedReplies(newLikedReplies);
  };

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReply.trim()) {
      // Handle reply submission
      console.log("New reply:", newReply);
      setNewReply("");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const ReplyComponent = ({ reply, isNested = false }: { reply: any, isNested?: boolean }) => (
    <div className={`${isNested ? 'ml-8 mt-4' : ''}`}>
      <div className="flex items-start space-x-4">
        <Avatar className={isNested ? "w-8 h-8" : "w-10 h-10"}>
          <AvatarImage src={reply.author.avatar} />
          <AvatarFallback>
            {reply.author.name.split(' ').map((n: string) => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-sm">{reply.author.name}</span>
                {reply.author.isVerified && (
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                )}
                <Badge variant="outline" className="text-xs">
                  {reply.author.role}
                </Badge>
                {reply.isAcceptedAnswer && (
                  <Badge className="bg-green-100 text-green-800 text-xs">
                    <Award className="w-3 h-3 mr-1" />
                    Accepted Answer
                  </Badge>
                )}
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Flag className="w-4 h-4 mr-2" />
                    Report
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="text-sm text-muted-foreground mb-3">
              {formatDate(reply.createdAt)}
            </div>
            
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap">{reply.content}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 mt-3 text-sm">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleReplyLike(reply.id)}
              className={`${likedReplies.has(reply.id) ? 'text-red-500' : 'text-muted-foreground'}`}
            >
              <Heart className={`w-4 h-4 mr-1 ${likedReplies.has(reply.id) ? 'fill-current' : ''}`} />
              {reply.likes + (likedReplies.has(reply.id) ? 1 : 0)}
            </Button>
            
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <Reply className="w-4 h-4 mr-1" />
              Reply
            </Button>
            
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </Button>
          </div>
          
          {/* Nested replies */}
          {reply.replies && reply.replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {reply.replies.map((nestedReply: any) => (
                <ReplyComponent key={nestedReply.id} reply={nestedReply} isNested={true} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link 
            to="/forum" 
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Forum
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Discussion Header */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-3">
                      {discussion.isPinned && (
                        <Pin className="w-4 h-4 text-brand-accent-orange" />
                      )}
                      <Badge variant="outline">{discussion.category}</Badge>
                      {discussion.isAnswered && (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Answered
                        </Badge>
                      )}
                    </div>
                    
                    <CardTitle className="font-heading text-2xl mb-4">
                      {discussion.title}
                    </CardTitle>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {discussion.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Flag className="w-4 h-4 mr-2" />
                        Report
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Author Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={discussion.author.avatar} />
                      <AvatarFallback>
                        {discussion.author.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{discussion.author.name}</span>
                        {discussion.author.isVerified && (
                          <CheckCircle className="w-4 h-4 text-blue-500" />
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {discussion.author.role} • {discussion.author.reputation} reputation
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatDate(discussion.createdAt)}
                    </div>
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {discussion.views} views
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="prose max-w-none mb-6">
                  <p className="whitespace-pre-wrap text-foreground">
                    {discussion.content}
                  </p>
                </div>

                <Separator className="my-4" />

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLike}
                      className={`${isLiked ? 'text-red-500' : 'text-muted-foreground'}`}
                    >
                      <Heart className={`w-4 h-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                      {discussion.likes + (isLiked ? 1 : 0)}
                    </Button>
                    
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      {discussion.replies} replies
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleBookmark}
                      className={`${isBookmarked ? 'text-yellow-500' : 'text-muted-foreground'}`}
                    >
                      <Bookmark className={`w-4 h-4 mr-1 ${isBookmarked ? 'fill-current' : ''}`} />
                      {isBookmarked ? 'Saved' : 'Save'}
                    </Button>
                    
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <Share2 className="w-4 h-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Replies Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-heading text-lg">
                    {discussion.replies} Replies
                  </CardTitle>
                  
                  <div className="flex items-center space-x-2">
                    <select 
                      value={sortBy} 
                      onChange={(e) => setSortBy(e.target.value)}
                      className="text-sm border rounded px-2 py-1"
                    >
                      <option value="recent">Most Recent</option>
                      <option value="oldest">Oldest First</option>
                      <option value="popular">Most Popular</option>
                    </select>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {replies.map((reply) => (
                  <div key={reply.id}>
                    <ReplyComponent reply={reply} />
                    {reply.id !== replies[replies.length - 1].id && (
                      <Separator className="my-6" />
                    )}
                  </div>
                ))}

                {/* New Reply Form */}
                <div className="mt-8 pt-6 border-t">
                  <h3 className="font-medium mb-4">Add your reply</h3>
                  <form onSubmit={handleSubmitReply} className="space-y-4">
                    <Textarea
                      placeholder="Share your thoughts, experiences, or advice..."
                      value={newReply}
                      onChange={(e) => setNewReply(e.target.value)}
                      rows={4}
                      className="resize-none"
                    />
                    <div className="flex justify-end">
                      <Button type="submit" disabled={!newReply.trim()}>
                        <Send className="w-4 h-4 mr-2" />
                        Post Reply
                      </Button>
                    </div>
                  </form>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Author Profile */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Author</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-3">
                  <Avatar className="w-16 h-16 mx-auto">
                    <AvatarImage src={discussion.author.avatar} />
                    <AvatarFallback>
                      {discussion.author.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <div className="flex items-center justify-center space-x-2">
                      <span className="font-medium">{discussion.author.name}</span>
                      {discussion.author.isVerified && (
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{discussion.author.role}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center text-sm">
                    <div>
                      <div className="font-medium text-brand-primary">{discussion.author.reputation}</div>
                      <div className="text-muted-foreground">Reputation</div>
                    </div>
                    <div>
                      <div className="font-medium text-brand-primary">{discussion.author.totalPosts}</div>
                      <div className="text-muted-foreground">Posts</div>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full">
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Related Discussions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Related Discussions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  "Building math confidence in struggling students",
                  "Creative ways to teach algebra concepts",
                  "Using technology to enhance math learning"
                ].map((title, index) => (
                  <Link
                    key={index}
                    to={`/forum/${index + 10}`}
                    className="block p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="text-sm font-medium hover:text-brand-primary">
                      {title}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {Math.floor(Math.random() * 20 + 5)} replies
                    </div>
                  </Link>
                ))}
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