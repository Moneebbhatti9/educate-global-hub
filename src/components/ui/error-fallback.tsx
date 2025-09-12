import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AlertTriangle, 
  Wifi, 
  RefreshCw, 
  Home, 
  Clock, 
  Server,
  Database,
  FileX,
  Search,
  MessageCircle,
  HelpCircle
} from "lucide-react";

interface ErrorFallbackProps {
  title?: string;
  description?: string;
  action?: () => void;
  actionLabel?: string;
  showHomeButton?: boolean;
  showRetryButton?: boolean;
  type?: 'network' | 'server' | 'timeout' | 'empty' | 'not-found' | 'generic';
  className?: string;
}

const ErrorFallback = ({
  title,
  description,
  action,
  actionLabel = "Try Again",
  showHomeButton = true,
  showRetryButton = true,
  type = 'generic',
  className = ""
}: ErrorFallbackProps) => {
  const errorConfig = {
    network: {
      icon: Wifi,
      title: "Connection Problem",
      description: "Unable to connect to our servers. Please check your internet connection and try again.",
      iconColor: "text-brand-accent-orange",
      bgColor: "bg-brand-accent-orange/10",
    },
    server: {
      icon: Server,
      title: "Server Error",
      description: "We're experiencing technical difficulties. Our team has been notified and is working on a fix.",
      iconColor: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    timeout: {
      icon: Clock,
      title: "Request Timeout",
      description: "The request is taking longer than expected. Please try again or check your connection.",
      iconColor: "text-brand-secondary",
      bgColor: "bg-brand-secondary/10",
    },
    empty: {
      icon: FileX,
      title: "No Data Available",
      description: "There's nothing to show here yet. This section will populate as data becomes available.",
      iconColor: "text-muted-foreground",
      bgColor: "bg-muted/20",
    },
    'not-found': {
      icon: Search,
      title: "Content Not Found",
      description: "The content you're looking for doesn't exist or may have been moved.",
      iconColor: "text-brand-primary",
      bgColor: "bg-brand-primary/10",
    },
    generic: {
      icon: AlertTriangle,
      title: "Something Went Wrong",
      description: "An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.",
      iconColor: "text-brand-accent-orange",
      bgColor: "bg-brand-accent-orange/10",
    }
  };

  const config = errorConfig[type];
  const Icon = config.icon;
  const finalTitle = title || config.title;
  const finalDescription = description || config.description;

  const handleRetry = () => {
    if (action) {
      action();
    } else {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <Card className={`max-w-md mx-auto ${className}`}>
      <CardHeader className="text-center pb-4">
        <div className={`w-16 h-16 mx-auto rounded-full ${config.bgColor} flex items-center justify-center mb-4`}>
          <Icon className={`w-8 h-8 ${config.iconColor}`} />
        </div>
        <CardTitle className="text-xl font-heading">{finalTitle}</CardTitle>
        <CardDescription className="text-center">
          {finalDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-3">
        {showRetryButton && (
          <Button onClick={handleRetry} className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            {actionLabel}
          </Button>
        )}
        {showHomeButton && (
          <Button variant="outline" onClick={handleGoHome} className="w-full">
            <Home className="w-4 h-4 mr-2" />
            Go to Homepage
          </Button>
        )}
        {type === 'server' && (
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground pt-2">
            <MessageCircle className="w-4 h-4" />
            <span>Contact support if this persists</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Specific error components for common scenarios
export const NetworkError = (props: Omit<ErrorFallbackProps, 'type'>) => (
  <ErrorFallback {...props} type="network" />
);

export const ServerError = (props: Omit<ErrorFallbackProps, 'type'>) => (
  <ErrorFallback {...props} type="server" />
);

export const TimeoutError = (props: Omit<ErrorFallbackProps, 'type'>) => (
  <ErrorFallback {...props} type="timeout" />
);

export const EmptyState = (props: Omit<ErrorFallbackProps, 'type'>) => (
  <ErrorFallback {...props} type="empty" showRetryButton={false} />
);

export const NotFoundError = (props: Omit<ErrorFallbackProps, 'type'>) => (
  <ErrorFallback {...props} type="not-found" />
);

// Dashboard-specific error fallback
interface DashboardErrorFallbackProps {
  error?: Error | string;
  onRetry?: () => void;
  title?: string;
  description?: string;
}

export const DashboardErrorFallback = ({ 
  error, 
  onRetry,
  title = "Dashboard Temporarily Unavailable",
  description
}: DashboardErrorFallbackProps) => {
  const errorMessage = error instanceof Error ? error.message : error;
  
  // Determine error type based on error message
  let errorType: ErrorFallbackProps['type'] = 'generic';
  if (errorMessage?.toLowerCase().includes('network') || errorMessage?.toLowerCase().includes('fetch')) {
    errorType = 'network';
  } else if (errorMessage?.toLowerCase().includes('timeout')) {
    errorType = 'timeout';
  } else if (errorMessage?.toLowerCase().includes('server') || errorMessage?.toLowerCase().includes('500')) {
    errorType = 'server';
  }

  const finalDescription = description || 
    "We're having trouble loading your dashboard data. This is usually temporary - please try again.";

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <ErrorFallback
        type={errorType}
        title={title}
        description={finalDescription}
        action={onRetry}
        actionLabel="Refresh Dashboard"
        className="w-full max-w-lg"
      />
    </div>
  );
};

// Section-specific error fallback for cards/components
interface SectionErrorFallbackProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  compact?: boolean;
}

export const SectionErrorFallback = ({
  title = "Unable to Load Content",
  description = "This section couldn't be loaded. Click retry to try again.",
  onRetry,
  compact = false
}: SectionErrorFallbackProps) => {
  if (compact) {
    return (
      <div className="text-center py-8 px-4">
        <AlertTriangle className="w-8 h-8 text-brand-accent-orange mx-auto mb-3" />
        <h3 className="font-semibold text-sm mb-2">{title}</h3>
        <p className="text-xs text-muted-foreground mb-4">{description}</p>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            <RefreshCw className="w-3 h-3 mr-2" />
            Retry
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card className="border-destructive/20">
      <CardContent className="text-center py-8">
        <div className="w-12 h-12 mx-auto rounded-full bg-destructive/10 flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6 text-destructive" />
        </div>
        <h3 className="font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ErrorFallback;