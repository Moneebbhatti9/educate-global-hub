import { useState } from "react";
import { useAuthQueries, Session } from "@/apis/auth";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  Clock,
  MapPin,
  LogOut,
  Shield,
  Loader2,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { customToast } from "@/components/ui/sonner";
import { formatDistanceToNow } from "date-fns";

const SessionManagement = () => {
  const { logout } = useAuth();
  const {
    useSessions,
    useTerminateSession,
    useTerminateOtherSessions,
    useLogoutAllDevices,
  } = useAuthQueries();

  const sessionsQuery = useSessions();
  const terminateSession = useTerminateSession();
  const terminateOtherSessions = useTerminateOtherSessions();
  const logoutAllDevices = useLogoutAllDevices();

  const [terminatingId, setTerminatingId] = useState<string | null>(null);

  const sessions = sessionsQuery.data?.data?.sessions || [];

  const getDeviceIcon = (device: string, isMobile: boolean) => {
    if (isMobile) {
      return device.toLowerCase().includes("tablet") ? (
        <Tablet className="w-5 h-5" />
      ) : (
        <Smartphone className="w-5 h-5" />
      );
    }
    return <Monitor className="w-5 h-5" />;
  };

  const handleTerminateSession = async (sessionId: string) => {
    try {
      setTerminatingId(sessionId);
      await terminateSession.mutateAsync(sessionId);
      customToast.success("Session terminated successfully");
    } catch (error: any) {
      customToast.error(
        "Failed to terminate session",
        error?.response?.data?.message || "Please try again"
      );
    } finally {
      setTerminatingId(null);
    }
  };

  const handleTerminateOtherSessions = async () => {
    try {
      await terminateOtherSessions.mutateAsync();
      customToast.success("All other sessions terminated successfully");
    } catch (error: any) {
      customToast.error(
        "Failed to terminate sessions",
        error?.response?.data?.message || "Please try again"
      );
    }
  };

  const handleLogoutAllDevices = async () => {
    try {
      await logoutAllDevices.mutateAsync();
      customToast.success("Logged out from all devices");
      // The logout mutation will clear the cache and redirect
      logout(true);
    } catch (error: any) {
      customToast.error(
        "Failed to logout from all devices",
        error?.response?.data?.message || "Please try again"
      );
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Active Sessions
            </CardTitle>
            <CardDescription>
              Manage your active sessions across all devices
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => sessionsQuery.refetch()}
            disabled={sessionsQuery.isRefetching}
          >
            {sessionsQuery.isRefetching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {sessionsQuery.isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : sessionsQuery.isError ? (
          <div className="text-center py-8">
            <AlertTriangle className="w-8 h-8 mx-auto text-destructive mb-2" />
            <p className="text-muted-foreground">Failed to load sessions</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => sessionsQuery.refetch()}
            >
              Try Again
            </Button>
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-8">
            <Monitor className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No active sessions found</p>
          </div>
        ) : (
          <>
            {/* Session List */}
            <div className="space-y-4">
              {sessions.map((session: Session) => (
                <div
                  key={session.id}
                  className={`flex items-start justify-between p-4 rounded-lg border ${
                    session.isCurrent
                      ? "border-primary/50 bg-primary/5"
                      : "border-border"
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-2 rounded-full bg-muted">
                      {getDeviceIcon(
                        session.deviceInfo.device,
                        session.deviceInfo.isMobile
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">
                          {session.deviceInfo.browser} on{" "}
                          {session.deviceInfo.os}
                        </span>
                        {session.isCurrent && (
                          <Badge variant="secondary" className="text-xs">
                            Current Session
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <Globe className="w-3 h-3 mr-1" />
                          {session.ipAddress}
                        </span>
                        {session.location?.city && (
                          <span className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {session.location.city}
                            {session.location.country &&
                              `, ${session.location.country}`}
                          </span>
                        )}
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          Last active{" "}
                          {formatDistanceToNow(
                            new Date(session.lastActivityAt),
                            { addSuffix: true }
                          )}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Logged in{" "}
                        {formatDistanceToNow(new Date(session.loginAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                  {!session.isCurrent && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleTerminateSession(session.id)}
                      disabled={terminatingId === session.id}
                    >
                      {terminatingId === session.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <LogOut className="w-4 h-4" />
                      )}
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <Separator />

            {/* Bulk Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              {sessions.filter((s: Session) => !s.isCurrent).length > 0 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="text-destructive border-destructive/50 hover:bg-destructive/10"
                      disabled={terminateOtherSessions.isPending}
                    >
                      {terminateOtherSessions.isPending ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <LogOut className="w-4 h-4 mr-2" />
                      )}
                      Sign Out Other Sessions
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Sign out of other sessions?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This will sign you out of all other devices and browsers.
                        You will remain signed in on this device.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleTerminateOtherSessions}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Sign Out Other Sessions
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    disabled={logoutAllDevices.isPending}
                  >
                    {logoutAllDevices.isPending ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <LogOut className="w-4 h-4 mr-2" />
                    )}
                    Sign Out All Devices
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Sign out of all devices?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This will sign you out of all devices including this one.
                      You will need to sign in again.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleLogoutAllDevices}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Sign Out All Devices
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SessionManagement;
