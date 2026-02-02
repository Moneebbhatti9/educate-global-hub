import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock, Shield, Settings } from "lucide-react";
import SessionManagement from "@/components/security/SessionManagement";
import TwoFactorSettings from "@/components/security/TwoFactorSettings";
import ChangePasswordForm from "@/components/security/ChangePasswordForm";
import DashboardLayout from "@/layout/DashboardLayout";

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("security");

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading font-bold text-3xl text-foreground mb-2 flex items-center">
            <Settings className="w-8 h-8 mr-3" />
            Admin Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your account security and authentication settings
          </p>
        </div>

        {/* Settings Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-2 h-auto p-1 bg-muted rounded-lg max-w-md">
            <TabsTrigger
              value="security"
              className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all duration-200 rounded-md"
            >
              <Lock className="w-4 h-4" />
              <span>Security</span>
            </TabsTrigger>
            <TabsTrigger
              value="sessions"
              className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all duration-200 rounded-md"
            >
              <Shield className="w-4 h-4" />
              <span>Sessions</span>
            </TabsTrigger>
          </TabsList>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            {/* Change Password Form */}
            <ChangePasswordForm />

            {/* Two-Factor Authentication Settings */}
            <TwoFactorSettings />
          </TabsContent>

          {/* Sessions Tab */}
          <TabsContent value="sessions" className="space-y-6">
            {/* Session Management */}
            <SessionManagement />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminSettings;
