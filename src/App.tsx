import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import Forum from "./pages/Forum";
import Resources from "./pages/Resources";
import SignUp from "./pages/SignUp";
import SignUpFlow from "./pages/SignUpFlow";
import SignInFlow from "./pages/SignInFlow";
import ForgotPassword from "./pages/ForgotPassword";
import TeacherDashboard from "./pages/dashboards/TeacherDashboard";
import SchoolDashboard from "./pages/dashboards/SchoolDashboard";
import RecruiterDashboard from "./pages/dashboards/RecruiterDashboard";
import SupplierDashboard from "./pages/dashboards/SupplierDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/resources" element={<Resources />} />
          
          {/* Authentication Routes */}
          <Route path="/signin" element={<SignInFlow />} />
          <Route path="/signup" element={<SignUpFlow />} />
          <Route path="/login" element={<SignInFlow />} />
          <Route path="/register" element={<SignUpFlow />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Dashboard Routes */}
          <Route path="/dashboard/teacher" element={<TeacherDashboard />} />
          <Route path="/dashboard/school" element={<SchoolDashboard />} />
          <Route path="/dashboard/recruiter" element={<RecruiterDashboard />} />
          <Route path="/dashboard/supplier" element={<SupplierDashboard />} />
          
          {/* Legacy Routes */}
          <Route path="/signup-old" element={<SignUp />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
