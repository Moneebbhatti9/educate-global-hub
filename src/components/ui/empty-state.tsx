import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Plus, 
  Search, 
  FileX, 
  Users, 
  Briefcase, 
  MessageCircle,
  BookOpen,
  Star,
  Settings,
  Calendar,
  Archive,
  Database
} from "lucide-react";

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "secondary" | "outline";
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  compact?: boolean;
}

const EmptyState = ({
  icon: Icon = FileX,
  title,
  description,
  action,
  secondaryAction,
  className = "",
  compact = false
}: EmptyStateProps) => {
  if (compact) {
    return (
      <div className={`text-center py-8 px-4 ${className}`}>
        <Icon className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
        <h3 className="font-semibold text-sm mb-2">{title}</h3>
        <p className="text-xs text-muted-foreground mb-4">{description}</p>
        {action && (
          <Button 
            variant={action.variant || "default"} 
            size="sm" 
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card className={`border-dashed border-2 border-muted ${className}`}>
      <CardContent className="text-center py-12">
        <div className="w-16 h-16 mx-auto rounded-full bg-muted/20 flex items-center justify-center mb-6">
          <Icon className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="font-heading font-semibold text-lg mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6 max-w-sm mx-auto">{description}</p>
        
        <div className="space-y-3">
          {action && (
            <Button 
              variant={action.variant || "default"} 
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button 
              variant="outline" 
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Pre-configured empty states for common scenarios
export const EmptyJobPostings = ({ onCreateJob }: { onCreateJob: () => void }) => (
  <EmptyState
    icon={Briefcase}
    title="No Job Postings Yet"
    description="Start attracting talented educators by posting your first job opening. It only takes a few minutes to create a compelling job listing."
    action={{
      label: "Post Your First Job",
      onClick: onCreateJob,
    }}
    secondaryAction={{
      label: "Browse Templates",
      onClick: () => console.log("Browse templates")
    }}
  />
);

export const EmptyApplications = ({ onBrowseJobs }: { onBrowseJobs: () => void }) => (
  <EmptyState
    icon={FileX}
    title="No Applications Yet"
    description="You haven't applied to any positions yet. Explore our job listings to find opportunities that match your skills and experience."
    action={{
      label: "Browse Available Jobs",
      onClick: onBrowseJobs,
    }}
  />
);

export const EmptySavedJobs = ({ onBrowseJobs }: { onBrowseJobs: () => void }) => (
  <EmptyState
    icon={Star}
    title="No Saved Jobs"
    description="Save interesting job opportunities to review later. Build your shortlist of positions you'd like to apply for."
    action={{
      label: "Explore Jobs",
      onClick: onBrowseJobs,
    }}
  />
);

export const EmptyCandidates = ({ onPostJob }: { onPostJob: () => void }) => (
  <EmptyState
    icon={Users}
    title="No Candidates Yet"
    description="Your job postings haven't received any applications yet. Make sure your job descriptions are clear and appealing to attract qualified candidates."
    action={{
      label: "Review Job Postings",
      onClick: onPostJob,
    }}
  />
);

export const EmptyForumPosts = ({ onCreatePost }: { onCreatePost: () => void }) => (
  <EmptyState
    icon={MessageCircle}
    title="No Forum Posts"
    description="Start the conversation! Share your thoughts, ask questions, or provide insights to help build our education community."
    action={{
      label: "Create First Post",
      onClick: onCreatePost,
    }}
  />
);

export const EmptyNotifications = () => (
  <EmptyState
    icon={Archive}
    title="All Caught Up!"
    description="You have no new notifications. We'll notify you about important updates, new job matches, and application status changes."
    compact
  />
);

export const EmptySearchResults = ({ onClearSearch }: { onClearSearch: () => void }) => (
  <EmptyState
    icon={Search}
    title="No Results Found"
    description="We couldn't find any items matching your search criteria. Try adjusting your filters or search terms."
    action={{
      label: "Clear Search",
      onClick: onClearSearch,
      variant: "outline" as const
    }}
    compact
  />
);

export const EmptyRecommendations = ({ onUpdateProfile }: { onUpdateProfile: () => void }) => (
  <EmptyState
    icon={Settings}
    title="No Recommendations Available"
    description="Complete your profile and set your preferences to receive personalized job recommendations tailored to your skills and interests."
    action={{
      label: "Update Profile",
      onClick: onUpdateProfile,
    }}
  />
);

export const EmptyCalendar = ({ onSchedule }: { onSchedule: () => void }) => (
  <EmptyState
    icon={Calendar}
    title="No Scheduled Events"
    description="Your calendar is clear. Schedule interviews, meetings, or set reminders for important deadlines."
    action={{
      label: "Schedule Event",
      onClick: onSchedule,
    }}
    compact
  />
);

export const EmptyAnalytics = () => (
  <EmptyState
    icon={Database}
    title="Insufficient Data"
    description="Not enough data available yet to generate meaningful analytics. Data will appear here as your activity increases."
    compact
  />
);

export default EmptyState;