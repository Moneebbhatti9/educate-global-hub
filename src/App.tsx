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
import JobPostings from "./pages/school/JobPostings";
import PostJob from "./pages/school/PostJob";
import JobPostSuccess from "./pages/school/JobPostSuccess";
import Candidates from "./pages/school/Candidates";
import JobSearch from "./pages/teacher/JobSearch";
import JobApplication from "./pages/teacher/JobApplication";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import Unauthorized from "./pages/Unauthorized";

// Legal Pages
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import TermsConditions from "./pages/legal/TermsConditions";
import CookiePolicy from "./pages/legal/CookiePolicy";
import GDPRCompliance from "./pages/legal/GDPRCompliance";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import JobManagement from "./pages/admin/JobManagement";

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

      {/* Teacher Dashboard Routes */}
      <Route
        path="/dashboard/teacher/jobs"
        element={
          <TeacherRoute>
            <JobSearch />
          </TeacherRoute>
        }
      />
      <Route
        path="/dashboard/teacher/applications"
        element={
          <TeacherRoute>
            <JobApplication />
          </TeacherRoute>
        }
      />
      <Route
        path="/dashboard/teacher/apply/:id"
        element={
          <TeacherRoute>
            <JobApplication />
          </TeacherRoute>
        }
      />

      {/* School Dashboard Routes */}
      <Route
        path="/dashboard/school/postings"
        element={
          <SchoolRoute>
            <JobPostings />
          </SchoolRoute>
        }
      />
      <Route
        path="/dashboard/school/post-job"
        element={
          <SchoolRoute>
            <PostJob />
          </SchoolRoute>
        }
      />
      <Route
        path="/dashboard/school/candidates"
        element={
          <SchoolRoute>
            <Candidates />
          </SchoolRoute>
        }
      />
      <Route
        path="/dashboard/school/job-post-success"
        element={
          <SchoolRoute>
            <JobPostSuccess />
          </SchoolRoute>
        }
      />
      <Route
        path="/dashboard/school/analytics"
        element={
          <SchoolRoute>
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Analytics Dashboard</h1>
              <p className="text-muted-foreground">
                School analytics and insights will be displayed here.
              </p>
            </div>
          </SchoolRoute>
        }
      />

      {/* Recruiter Dashboard Routes */}
      <Route
        path="/dashboard/recruiter/placements"
        element={
          <RecruiterRoute>
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Placements</h1>
              <p className="text-muted-foreground">
                Recruiter placements and tracking will be displayed here.
              </p>
            </div>
          </RecruiterRoute>
        }
      />
      <Route
        path="/dashboard/recruiter/candidates"
        element={
          <RecruiterRoute>
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Candidates</h1>
              <p className="text-muted-foreground">
                Recruiter candidate management will be displayed here.
              </p>
            </div>
          </RecruiterRoute>
        }
      />
      <Route
        path="/dashboard/recruiter/clients"
        element={
          <RecruiterRoute>
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Clients</h1>
              <p className="text-muted-foreground">
                Recruiter client management will be displayed here.
              </p>
            </div>
          </RecruiterRoute>
        }
      />

      {/* Supplier Dashboard Routes */}
      <Route
        path="/dashboard/supplier/products"
        element={
          <SupplierRoute>
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Products</h1>
              <p className="text-muted-foreground">
                Supplier product catalog will be displayed here.
              </p>
            </div>
          </SupplierRoute>
        }
      />
      <Route
        path="/dashboard/supplier/orders"
        element={
          <SupplierRoute>
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Orders</h1>
              <p className="text-muted-foreground">
                Supplier order management will be displayed here.
              </p>
            </div>
          </SupplierRoute>
        }
      />
      <Route
        path="/dashboard/supplier/clients"
        element={
          <SupplierRoute>
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Clients</h1>
              <p className="text-muted-foreground">
                Supplier client management will be displayed here.
              </p>
            </div>
          </SupplierRoute>
        }
      />

      {/* Common Dashboard Routes */}
      <Route
        path="/dashboard/:role/messages"
        element={
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Messages</h1>
            <p className="text-muted-foreground">
              Messaging system will be displayed here.
            </p>
          </div>
        }
      />
      <Route
        path="/dashboard/:role/profile"
        element={
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Profile</h1>
            <p className="text-muted-foreground">
              User profile management will be displayed here.
            </p>
          </div>
        }
      />
      <Route
        path="/dashboard/:role/settings"
        element={
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Settings</h1>
            <p className="text-muted-foreground">
              User settings will be displayed here.
            </p>
          </div>
        }
      />

      {/* Additional Dashboard Routes */}
      <Route
        path="/dashboard/teacher/profile"
        element={
          <TeacherRoute>
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Teacher Profile</h1>
              <p className="text-muted-foreground">
                Teacher profile management will be displayed here.
              </p>
            </div>
          </TeacherRoute>
        }
      />
      <Route
        path="/dashboard/school/profile"
        element={
          <SchoolRoute>
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">School Profile</h1>
              <p className="text-muted-foreground">
                School profile management will be displayed here.
              </p>
            </div>
          </SchoolRoute>
        }
      />
      <Route
        path="/dashboard/recruiter/profile"
        element={
          <RecruiterRoute>
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Recruiter Profile</h1>
              <p className="text-muted-foreground">
                Recruiter profile management will be displayed here.
              </p>
            </div>
          </RecruiterRoute>
        }
      />
      <Route
        path="/dashboard/supplier/profile"
        element={
          <SupplierRoute>
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Supplier Profile</h1>
              <p className="text-muted-foreground">
                Supplier profile management will be displayed here.
              </p>
            </div>
          </SupplierRoute>
        }
      />

      {/* Settings Routes */}
      <Route
        path="/dashboard/teacher/settings"
        element={
          <TeacherRoute>
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Teacher Settings</h1>
              <p className="text-muted-foreground">
                Teacher settings and preferences will be displayed here.
              </p>
            </div>
          </TeacherRoute>
        }
      />
      <Route
        path="/dashboard/school/settings"
        element={
          <SchoolRoute>
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">School Settings</h1>
              <p className="text-muted-foreground">
                School settings and preferences will be displayed here.
              </p>
            </div>
          </SchoolRoute>
        }
      />
      <Route
        path="/dashboard/recruiter/settings"
        element={
          <RecruiterRoute>
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Recruiter Settings</h1>
              <p className="text-muted-foreground">
                Recruiter settings and preferences will be displayed here.
              </p>
            </div>
          </RecruiterRoute>
        }
      />
      <Route
        path="/dashboard/supplier/settings"
        element={
          <SupplierRoute>
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Supplier Settings</h1>
              <p className="text-muted-foreground">
                Supplier settings and preferences will be displayed here.
              </p>
            </div>
          </SupplierRoute>
        }
      />

      {/* Legal Pages */}
      <Route path="/legal/privacy" element={<PrivacyPolicy />} />
      <Route path="/legal/terms" element={<TermsConditions />} />
      <Route path="/legal/cookies" element={<CookiePolicy />} />
      <Route path="/legal/gdpr" element={<GDPRCompliance />} />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<UserManagement />} />
      <Route path="/admin/jobs" element={<JobManagement />} />

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
