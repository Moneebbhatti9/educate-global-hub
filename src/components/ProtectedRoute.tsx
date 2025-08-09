import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { UserRole, ProtectedRouteProps } from "../types/auth";

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  requireProfileCompletion = true,
}) => {
  const { isAuthenticated, user, isLoading, isInitialized } = useAuth();
  const location = useLocation();

  // Show loading spinner while initializing
  if (!isInitialized || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Check profile completion requirement
  if (requireProfileCompletion && !user.isProfileComplete) {
    return <Navigate to="/profile-completion" replace />;
  }

  // Check email verification
  if (!user.isEmailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return <>{children}</>;
};

// Role-specific protected routes
export const TeacherRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <ProtectedRoute allowedRoles={["teacher"]}>{children}</ProtectedRoute>;

export const SchoolRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <ProtectedRoute allowedRoles={["school"]}>{children}</ProtectedRoute>;

export const RecruiterRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <ProtectedRoute allowedRoles={["recruiter"]}>{children}</ProtectedRoute>;

export const SupplierRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <ProtectedRoute allowedRoles={["supplier"]}>{children}</ProtectedRoute>;

export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <ProtectedRoute allowedRoles={["admin"]}>{children}</ProtectedRoute>;

// Route for users who need to complete their profile
export const ProfileCompletionRoute: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => (
  <ProtectedRoute requireProfileCompletion={false}>{children}</ProtectedRoute>
);

// Route for unauthenticated users (login, signup, etc.)
export const PublicRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, user, isInitialized } = useAuth();
  const location = useLocation();

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is authenticated, redirect based on their state
  if (isAuthenticated && user) {
    if (!user.isEmailVerified) {
      return <Navigate to="/verify-email" replace />;
    } else if (!user.isProfileComplete) {
      return <Navigate to="/profile-completion" replace />;
    } else {
      // Redirect to intended page or role-specific dashboard
      const from = location.state?.from?.pathname;
      if (from && from !== "/login" && from !== "/register") {
        return <Navigate to={from} replace />;
      } else {
        return <Navigate to={`/dashboard/${user.role}`} replace />;
      }
    }
  }

  return <>{children}</>;
};
