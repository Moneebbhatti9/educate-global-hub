import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import {
  TeacherRoute,
  SchoolRoute,
  PublicRoute,
  ProfileCompletionRoute,
} from "./components/ProtectedRoute";
import { useScrollToTop } from "./hooks/useScrollToTop";
import { Suspense, lazy, useEffect } from "react";
import {
  initializeSecurityMonitoring,
  validateSecurityHeaders,
} from "./utils/security";
import SecurityProvider from "./components/SecurityProvider";

// Lazy load components
const Index = lazy(() => import("./pages/Index"));
const Jobs = lazy(() => import("./pages/Jobs"));
const JobDetail = lazy(() => import("./pages/JobDetail"));
const Forum = lazy(() => import("./pages/Forum"));
const ForumDetail = lazy(() => import("./pages/ForumDetail"));
const Resources = lazy(() => import("./pages/Resources"));
const TeacherProfile = lazy(() => import("./pages/teacher/TeacherProfile"));
const SchoolProfile = lazy(() => import("./pages/school/SchoolProfile"));
const SignUp = lazy(() => import("./pages/SignUp"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const OTPVerificationPage = lazy(() => import("./pages/OTPVerificationPage"));
const ProfileCompletionPage = lazy(
  () => import("./pages/ProfileCompletionPage")
);
const TeacherDashboard = lazy(
  () => import("./pages/dashboards/TeacherDashboard")
);
const SchoolDashboard = lazy(
  () => import("./pages/dashboards/SchoolDashboard")
);
const JobPostings = lazy(() => import("./pages/school/JobPostings"));
const PostJob = lazy(() => import("./pages/school/PostJob"));
const EditJob = lazy(() => import("./pages/school/EditJob"));
const JobPostSuccess = lazy(() => import("./pages/school/JobPostSuccess"));
const Candidates = lazy(() => import("./pages/school/Candidates"));
const JobSearch = lazy(() => import("./pages/teacher/JobSearch"));
const JobApplication = lazy(() => import("./pages/teacher/JobApplication"));
const Applications = lazy(() => import("./pages/teacher/Applications"));
const NotFound = lazy(() => import("./pages/NotFound"));
const SignIn = lazy(() => import("./pages/SignIn"));
const Unauthorized = lazy(() => import("./pages/Unauthorized"));

// Legal Pages
const PrivacyPolicy = lazy(() => import("./pages/legal/PrivacyPolicy"));
const TermsConditions = lazy(() => import("./pages/legal/TermsConditions"));
const CookiePolicy = lazy(() => import("./pages/legal/CookiePolicy"));
const GDPRCompliance = lazy(() => import("./pages/legal/GDPRCompliance"));

// Admin Pages
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));
const JobManagement = lazy(() => import("./pages/admin/JobManagement"));
const ForumManagement = lazy(() => import("./pages/admin/ForumManagement"));
const JobAdvertisementManagement = lazy(
  () => import("./pages/admin/JobAdvertisementManagement")
);

// New Public Pages
const AboutUs = lazy(() => import("./pages/AboutUs"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const Pricing = lazy(() => import("./pages/Pricing"));
const TeacherSettings = lazy(() => import("./pages/teacher/TeacherSettings"));
const SchoolSettings = lazy(() => import("./pages/school/SchoolSettings"));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
  </div>
);

// Simple layout wrappers that use Outlet
const TeacherLayout = () => (
  <TeacherRoute>
    <Outlet />
  </TeacherRoute>
);

const SchoolLayout = () => (
  <SchoolRoute>
    <Outlet />
  </SchoolRoute>
);

const AdminLayout = () => <Outlet />;

const queryClient = new QueryClient();

// Wrapper component to handle scroll to top
const AppRoutes = () => {
  useScrollToTop();

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* ======================================== */}
        {/* PUBLIC WEBSITE ROUTES - NO AUTH REQUIRED */}
        {/* ======================================== */}
        <Route path="/" element={<Index />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/forum/:id" element={<ForumDetail />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/pricing" element={<Pricing />} />

        {/* Legal Pages */}
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsConditions />} />
        <Route path="/cookies" element={<CookiePolicy />} />
        <Route path="/gdpr" element={<GDPRCompliance />} />

        {/* ======================================== */}
        {/* AUTHENTICATION ROUTES - PUBLIC ACCESS */}
        {/* ======================================== */}
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
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/profile-completion"
          element={
            <ProfileCompletionRoute>
              <ProfileCompletionPage />
            </ProfileCompletionRoute>
          }
        />

        {/* ======================================== */}
        {/* TEACHER DASHBOARD ROUTES - PROTECTED */}
        {/* ======================================== */}
        <Route path="/dashboard/teacher" element={<TeacherLayout />}>
          <Route index element={<TeacherDashboard />} />
          <Route path="jobs" element={<JobSearch />} />
          <Route path="applications" element={<Applications />} />
          <Route path="job/:id" element={<JobDetail />} />
          <Route path="job-application/:jobId" element={<JobApplication />} />
          <Route path="profile" element={<TeacherProfile />} />
          <Route path="teacher-profile" element={<TeacherProfile />} />
          <Route path="settings" element={<TeacherSettings />} />
        </Route>

        {/* ======================================== */}
        {/* SCHOOL DASHBOARD ROUTES - PROTECTED */}
        {/* ======================================== */}
        <Route path="/dashboard/school" element={<SchoolLayout />}>
          <Route index element={<SchoolDashboard />} />
          <Route path="postings" element={<JobPostings />} />
          <Route path="post-job" element={<PostJob />} />
          <Route path="edit-job/:jobId" element={<EditJob />} />
          <Route path="candidates" element={<Candidates />} />
          <Route path="job-post-success" element={<JobPostSuccess />} />
          <Route path="profile" element={<SchoolProfile />} />
          <Route path="settings" element={<SchoolSettings />} />
          <Route
            path="analytics"
            element={
              <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Analytics Dashboard</h1>
                <p className="text-muted-foreground">
                  School analytics and insights will be displayed here.
                </p>
              </div>
            }
          />
        </Route>

        {/* ======================================== */}
        {/* ADMIN ROUTES - PROTECTED */}
        {/* ======================================== */}
        <Route path="/dashboard/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="jobs" element={<JobManagement />} />
          <Route path="forum" element={<ForumManagement />} />
          <Route path="job-ads" element={<JobAdvertisementManagement />} />
        </Route>

        {/* ======================================== */}
        {/* ERROR ROUTES */}
        {/* ======================================== */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

const App = () => {
  // Initialize security monitoring on app startup
  useEffect(() => {
    initializeSecurityMonitoring();
    validateSecurityHeaders();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SecurityProvider>
          <Toaster />
          <BrowserRouter>
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          </BrowserRouter>
        </SecurityProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
