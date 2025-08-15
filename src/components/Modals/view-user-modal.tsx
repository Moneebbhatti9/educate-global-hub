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
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  School,
  UserCheck,
  Truck,
  Settings,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Edit,
  Ban,
  MessageSquare,
} from "lucide-react";

interface ViewUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    avatar?: string;
    phone?: string;
    location?: string;
    joinedDate: string;
    lastActive: string;
    profileCompleted: number;
    totalPosts?: number;
    totalApplications?: number;
    totalJobs?: number;
    verification: {
      email: boolean;
      phone: boolean;
      identity: boolean;
    };
    stats?: {
      activeJobs?: number;
      totalHires?: number;
      rating?: number;
      completedOrders?: number;
    };
  };
}

export const ViewUserModal = ({ isOpen, onClose, user }: ViewUserModalProps) => {
  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case "teacher":
        return <User className="w-4 h-4" />;
      case "school":
        return <School className="w-4 h-4" />;
      case "recruiter":
        return <UserCheck className="w-4 h-4" />;
      case "supplier":
        return <Truck className="w-4 h-4" />;
      case "admin":
        return <Settings className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "teacher":
        return "bg-brand-primary text-white";
      case "school":
        return "bg-brand-accent-green text-white";
      case "recruiter":
        return "bg-brand-secondary text-white";
      case "supplier":
        return "bg-brand-accent-orange text-white";
      case "admin":
        return "bg-red-600 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-brand-accent-green text-white";
      case "suspended":
        return "bg-red-500 text-white";
      case "pending":
        return "bg-brand-accent-orange text-white";
      case "inactive":
        return "bg-gray-500 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <CheckCircle className="w-3 h-3" />;
      case "suspended":
        return <Ban className="w-3 h-3" />;
      case "pending":
        return <Clock className="w-3 h-3" />;
      case "inactive":
        return <XCircle className="w-3 h-3" />;
      default:
        return <AlertTriangle className="w-3 h-3" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">User Details</DialogTitle>
          <DialogDescription>
            Complete information about this user account
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Header */}
          <div className="flex items-start space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="text-lg">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="font-heading font-bold text-xl">{user.name}</h3>
                <Badge className={`${getRoleColor(user.role)} flex items-center space-x-1`}>
                  {getRoleIcon(user.role)}
                  <span className="capitalize">{user.role}</span>
                </Badge>
                <Badge className={`${getStatusColor(user.status)} flex items-center space-x-1`}>
                  {getStatusIcon(user.status)}
                  <span className="capitalize">{user.status}</span>
                </Badge>
              </div>
              
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  {user.email}
                </div>
                {user.phone && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    {user.phone}
                  </div>
                )}
                {user.location && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {user.location}
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Account Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Account Information</h4>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">User ID:</span>
                  <span className="font-mono">{user.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Joined:</span>
                  <span>{new Date(user.joinedDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Active:</span>
                  <span>{user.lastActive}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Profile Completed:</span>
                  <span className="flex items-center">
                    {user.profileCompleted}%
                    <div className="w-16 h-2 bg-muted rounded-full ml-2">
                      <div 
                        className="h-full bg-brand-primary rounded-full" 
                        style={{ width: `${user.profileCompleted}%` }}
                      />
                    </div>
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Verification Status</h4>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Email</span>
                  {user.verification.email ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Phone</span>
                  {user.verification.phone ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Identity</span>
                  {user.verification.identity ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Activity & Stats */}
          <div className="space-y-4">
            <h4 className="font-medium">Activity & Statistics</h4>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {user.totalPosts !== undefined && (
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="font-bold text-lg text-brand-primary">{user.totalPosts}</div>
                  <div className="text-sm text-muted-foreground">Forum Posts</div>
                </div>
              )}
              
              {user.totalApplications !== undefined && (
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="font-bold text-lg text-brand-primary">{user.totalApplications}</div>
                  <div className="text-sm text-muted-foreground">Applications</div>
                </div>
              )}
              
              {user.totalJobs !== undefined && (
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="font-bold text-lg text-brand-primary">{user.totalJobs}</div>
                  <div className="text-sm text-muted-foreground">Jobs Posted</div>
                </div>
              )}
              
              {user.stats?.activeJobs !== undefined && (
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="font-bold text-lg text-brand-primary">{user.stats.activeJobs}</div>
                  <div className="text-sm text-muted-foreground">Active Jobs</div>
                </div>
              )}
              
              {user.stats?.totalHires !== undefined && (
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="font-bold text-lg text-brand-primary">{user.stats.totalHires}</div>
                  <div className="text-sm text-muted-foreground">Total Hires</div>
                </div>
              )}
              
              {user.stats?.rating !== undefined && (
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="font-bold text-lg text-brand-primary">{user.stats.rating}/5</div>
                  <div className="text-sm text-muted-foreground">Rating</div>
                </div>
              )}
              
              {user.stats?.completedOrders !== undefined && (
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="font-bold text-lg text-brand-primary">{user.stats.completedOrders}</div>
                  <div className="text-sm text-muted-foreground">Orders</div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <MessageSquare className="w-4 h-4 mr-2" />
                Send Message
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit User
              </Button>
            </div>
            
            <div className="flex space-x-2">
              {user.status === "active" ? (
                <Button variant="destructive" size="sm">
                  <Ban className="w-4 h-4 mr-2" />
                  Suspend User
                </Button>
              ) : (
                <Button variant="outline" size="sm">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Activate User
                </Button>
              )}
              
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};