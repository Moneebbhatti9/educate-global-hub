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
import { SocketProvider } from "./contexts/SocketContext";
import { SiteSettingsProvider } from "./contexts/SiteSettingsContext";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
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
import CookieConsent from "./components/gdpr/CookieConsent";

// Lazy load components
const Index = lazy(() => import("./pages/Index"));
const Jobs = lazy(() => import("./pages/Jobs"));
const JobDetail = lazy(() => import("./pages/JobDetail"));
const Forum = lazy(() => import("./pages/Forum"));
const ForumDetail = lazy(() => import("./pages/ForumDetail"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Resources = lazy(() => import("./pages/Resources"));
const TeacherProfile = lazy(() => import("./pages/teacher/TeacherProfile"));
const SchoolProfile = lazy(() => import("./pages/school/SchoolProfile"));
const SignUp = lazy(() => import("./pages/SignUp"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const OTPVerificationPage = lazy(() => import("./pages/OTPVerificationPage"));
const ProfileCompletionPage = lazy(
  () => import("./pages/ProfileCompletionPage")
);
const SchoolApproval = lazy(() => import("./pages/SchoolApproval"));
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

// 2FA Page
const TwoFAVerificationPage = lazy(() => import("./pages/TwoFAVerificationPage"));

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
const AdminResourceManagement = lazy(
  () => import("./pages/admin/ResourceManagement")
);
const AdminUploadResource = lazy(
  () => import("./pages/admin/UploadResource")
);
const PlatformSettings = lazy(
  () => import("./pages/admin/PlatformSettings")
);
const DropdownManagement = lazy(
  () => import("./pages/admin/DropdownManagement")
);
const GeneralSettings = lazy(
  () => import("./pages/admin/GeneralSettings")
);
const SubscriptionSettings = lazy(
  () => import("./pages/admin/SubscriptionSettings")
);
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));

// New Public Pages
const AboutUs = lazy(() => import("./pages/AboutUs"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const Pricing = lazy(() => import("./pages/Pricing"));
const TeacherSettings = lazy(() => import("./pages/teacher/TeacherSettings"));
const SchoolSettings = lazy(() => import("./pages/school/SchoolSettings"));

// Resource and Download Pages
const ResourceDetail = lazy(() => import("./pages/ResourceDetail"));
const DownloadPage = lazy(() => import("./pages/DownloadPage"));
const UploadResource = lazy(() => import("./pages/teacher/UploadResource"));
const Withdraw = lazy(() => import("./pages/teacher/Withdraw"));
const WithdrawalHistory = lazy(
  () => import("./pages/teacher/WithdrawalHistory")
);
const TeacherResourceManagement = lazy(
  () => import("./pages/teacher/ResourceManagement")
);
const Earnings = lazy(() => import("./pages/teacher/Earnings"));
const SalesHistory = lazy(() => import("./pages/teacher/SalesHistory"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const MyLibrary = lazy(() => import("./pages/teacher/MyLibrary"));
const SalesManagement = lazy(() => import("./pages/admin/SalesManagement"));
const PayoutManagement = lazy(() => import("./pages/admin/PayoutManagement"));

// Subscription Pages
const SubscriptionSuccess = lazy(() => import("./pages/subscription/SubscriptionSuccess"));
const SubscriptionCancel = lazy(() => import("./pages/subscription/SubscriptionCancel"));

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
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/resources/:id" element={<ResourceDetail />} />
        <Route path="/download/:id" element={<DownloadPage />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/my-library" element={<MyLibrary />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/pricing" element={<Pricing />} />

        {/* Subscription Pages */}
        <Route path="/subscription/success" element={<SubscriptionSuccess />} />
        <Route path="/subscription/cancel" element={<SubscriptionCancel />} />

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
        <Route path="/verify-2fa" element={<TwoFAVerificationPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/profile-completion"
          element={
            <ProfileCompletionRoute>
              <ProfileCompletionPage />
            </ProfileCompletionRoute>
          }
        />

        <Route path="/school-approval" element={<SchoolApproval />} />

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
          <Route path="upload-resource" element={<UploadResource />} />
          <Route
            path="resource-management"
            element={<TeacherResourceManagement />}
          />
          <Route path="earnings" element={<Earnings />} />
          <Route path="sales-history" element={<SalesHistory />} />
          <Route path="withdraw" element={<Withdraw />} />
          <Route path="withdrawal-history" element={<WithdrawalHistory />} />
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
          <Route path="upload-resource" element={<AdminUploadResource />} />
          <Route path="resources" element={<AdminResourceManagement />} />
          <Route path="sales-management" element={<SalesManagement />} />
          <Route path="payout-management" element={<PayoutManagement />} />
          <Route path="general-settings" element={<GeneralSettings />} />
          <Route path="platform-settings" element={<PlatformSettings />} />
          <Route path="subscription-settings" element={<SubscriptionSettings />} />
          <Route path="dropdown-management" element={<DropdownManagement />} />
          <Route path="settings" element={<AdminSettings />} />
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
            <SiteSettingsProvider>
              <AuthProvider>
                <SubscriptionProvider>
                  <SocketProvider>
                    <AppRoutes />
                    <CookieConsent />
                  </SocketProvider>
                </SubscriptionProvider>
              </AuthProvider>
            </SiteSettingsProvider>
          </BrowserRouter>
        </SecurityProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
