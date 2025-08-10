import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import {
  TeacherRoute,
  SchoolRoute,
  RecruiterRoute,
  SupplierRoute,
  PublicRoute,
  ProfileCompletionRoute,
} from "./components/ProtectedRoute";
import { useScrollToTop } from "./hooks/useScrollToTop";
import Index from "./pages/Index";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import Forum from "./pages/Forum";
import Resources from "./pages/Resources";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import OTPVerificationPage from "./pages/OTPVerificationPage";
import ProfileCompletionPage from "./pages/ProfileCompletionPage";
import TeacherDashboard from "./pages/dashboards/TeacherDashboard";
import SchoolDashboard from "./pages/dashboards/SchoolDashboard";
import RecruiterDashboard from "./pages/dashboards/RecruiterDashboard";
import SupplierDashboard from "./pages/dashboards/SupplierDashboard";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import Unauthorized from "./pages/Unauthorized";

const queryClient = new QueryClient();

// Wrapper component to handle scroll to top
const AppRoutes = () => {
  useScrollToTop();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/jobs" element={<Jobs />} />
      <Route path="/jobs/:id" element={<JobDetail />} />
      <Route path="/forum" element={<Forum />} />
      <Route path="/resources" element={<Resources />} />

      {/* Authentication Routes - Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <SignIn />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        }
      />
      <Route path="/otp-verification" element={<OTPVerificationPage />} />
      <Route
        path="/profile-completion"
        element={
          <ProfileCompletionRoute>
            <ProfileCompletionPage />
          </ProfileCompletionRoute>
        }
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected Dashboard Routes */}
      <Route
        path="/dashboard/teacher"
        element={
          <TeacherRoute>
            <TeacherDashboard />
          </TeacherRoute>
        }
      />
      <Route
        path="/dashboard/school"
        element={
          <SchoolRoute>
            <SchoolDashboard />
          </SchoolRoute>
        }
      />
      <Route
        path="/dashboard/recruiter"
        element={
          <RecruiterRoute>
            <RecruiterDashboard />
          </RecruiterRoute>
        }
      />
      <Route
        path="/dashboard/supplier"
        element={
          <SupplierRoute>
            <SupplierDashboard />
          </SupplierRoute>
        }
      />

      {/* Error Routes */}
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
