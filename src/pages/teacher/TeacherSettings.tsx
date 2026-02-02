import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Lock,
  Bell,
  Shield,
  Upload,
  Save,
  Smartphone,
  Mail,
  MessageSquare,
  Loader2,
  Edit,
  Crown,
} from "lucide-react";
import CookiePreferenceManager from "@/components/gdpr/CookiePreferenceManager";
import DataPrivacyManager from "@/components/gdpr/DataPrivacyManager";
import SessionManagement from "@/components/security/SessionManagement";
import TwoFactorSettings from "@/components/security/TwoFactorSettings";
import ChangePasswordForm from "@/components/security/ChangePasswordForm";
import DashboardLayout from "@/layout/DashboardLayout";
import { SubscriptionManagement } from "@/components/subscription";
import { useUserSettings } from "@/apis/userSettings";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updateProfileSchema } from "@/helpers/validation";
import { customToast } from "@/components/ui/sonner";
import { PhoneInput } from "@/components/ui/phone-input";

// Types for form data
type ProfileFormData = z.infer<typeof updateProfileSchema>;

// API response type for profile
interface ProfileResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      status: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
      isEmailVerified: boolean;
      isProfileComplete: boolean;
      avatarUrl: string;
      phone: string | null;
      createdAt: string;
      updatedAt: string;
      lastActive: string;
      id: string;
    };
  };
}

const TeacherSettings = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(
    null
  );
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // API hooks
  const {
    getProfile,
    updateProfile,
    uploadAvatar,
    deleteAccount,
  } = useUserSettings();

  // Profile form
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  });

  // Mock settings data for notifications (will be implemented later)
  const [settings, setSettings] = useState({
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      jobAlerts: true,
      applicationUpdates: true,
      forumActivity: false,
      weeklyDigest: true,
      marketingEmails: false,
    },
    preferences: {
      language: "en",
      timezone: "America/New_York",
      theme: "light",
      currency: "USD",
      dateFormat: "MM/DD/YYYY",
      profileVisibility: "public",
    },
  });

  // Load profile data when component mounts or profile data changes
  useEffect(() => {
    if ((getProfile?.data as ProfileResponse)?.data?.user) {
      const profileData = (getProfile?.data as ProfileResponse)?.data?.user;
      profileForm.reset({
        firstName: profileData.firstName || "",
        lastName: profileData.lastName || "",
        email: profileData.email || "",
        phone: profileData.phone || "",
      });
    }
  }, [getProfile.data, profileForm]);

  // Handle profile photo selection
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle profile update
  const handleProfileUpdate = async (data: ProfileFormData) => {
    try {
      const result = await updateProfile.mutateAsync(data);
      if (result.success) {
        customToast.success("Profile updated successfully!");
        // Update local user context
        if (user) {
          updateUser({
            ...user,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
          });
        }
        // Refresh profile data to get latest avatar
        getProfile.refetch();
        setIsEditing(false);
      }
    } catch (error: unknown) {
      // Try to extract error message and errors from different possible response structures
      let errorTitle = "Profile Update Failed";
      let errorDescription = "Failed to update profile. Please try again.";

      if (error && typeof error === "object") {
        // Check for axios error response structure
        if (
          "response" in error &&
          error.response &&
          typeof error.response === "object"
        ) {
          if (
            "data" in error.response &&
            error.response.data &&
            typeof error.response.data === "object"
          ) {
            // Extract message for title
            if (
              "message" in error.response.data &&
              typeof error.response.data.message === "string"
            ) {
              errorTitle = error.response.data.message;
            }
            // Extract errors for description
            if (
              "errors" in error.response.data &&
              typeof error.response.data.errors === "string"
            ) {
              errorDescription = error.response.data.errors;
            } else if (
              "message" in error.response.data &&
              typeof error.response.data.message === "string"
            ) {
              // If no errors field, use message as description
              errorDescription = error.response.data.message;
            }
          }
        }
        // Check for direct error object structure
        else if ("message" in error && typeof error.message === "string") {
          errorDescription = error.message;
        }
      }

      customToast.error(errorTitle, errorDescription);
      console.error("Profile update error:", error);
    }
  };

  // Handle avatar upload and update
  const handleAvatarUpload = async () => {
    if (!selectedAvatarFile) return;

    try {
      // Upload the file and get the URL
      const uploadResult = await uploadAvatar.mutateAsync(selectedAvatarFile);
      if (uploadResult.success && uploadResult.data?.url) {
        // Update the user's profile with the new avatar URL
        const updateResult = await updateProfile.mutateAsync({
          firstName: currentProfileData?.firstName || "",
          lastName: currentProfileData?.lastName || "",
          email: currentProfileData?.email || "",
          phone: currentProfileData?.phone || "",
          avatarUrl: uploadResult.data.url,
        });

        if (updateResult.success) {
          customToast.success("Profile photo updated successfully!");
          setSelectedAvatarFile(null);
          setAvatarPreview(null);
          // Refresh profile data
          getProfile.refetch();
          // Also update the local user context if available
          if (user) {
            updateUser({
              ...user,
              avatarUrl: uploadResult.data.url,
            });
          }
        }
      }
    } catch (error: unknown) {
      // Try to extract error message and errors from different possible response structures
      let errorTitle = "Avatar Update Failed";
      let errorDescription =
        "Failed to update profile photo. Please try again.";

      if (error && typeof error === "object") {
        // Check for axios error response structure
        if (
          "response" in error &&
          error.response &&
          typeof error.response === "object"
        ) {
          if (
            "data" in error.response &&
            error.response.data &&
            typeof error.response.data === "object"
          ) {
            // Extract message for title
            if (
              "message" in error.response.data &&
              typeof error.response.data.message === "string"
            ) {
              errorTitle = error.response.data.message;
            }
            // Extract errors for description
            if (
              "errors" in error.response.data &&
              typeof error.response.data.errors === "string"
            ) {
              errorDescription = error.response.data.errors;
            } else if (
              "message" in error.response.data &&
              typeof error.response.data.message === "string"
            ) {
              // If no errors field, use message as description
              errorDescription = error.response.data.message;
            }
          }
        }
        // Check for direct error object structure
        else if ("message" in error && typeof error.message === "string") {
          errorDescription = error.message;
        }
      }

      customToast.error(errorTitle, errorDescription);
      console.error("Avatar update error:", error);
    }
  };

  // Handle account deletion
  // const handleDeleteAccount = async () => {
  //   if (
  //     window.confirm(
  //       "Are you sure you want to delete your account? This action cannot be undone."
  //     )
  //   ) {
  //     try {
  //       const result = await deleteAccount.mutateAsync();
  //       if (result.success) {
  //         customToast.success("Account deleted successfully");
  //         // Redirect will be handled by the API hook
  //       }
  //     } catch (error: unknown) {
  //       // Try to extract error message and errors from different possible response structures
  //       let errorTitle = "Account Deletion Failed";
  //       let errorDescription = "Failed to delete account. Please try again.";

  //       if (error && typeof error === "object") {
  //         // Check for axios error response structure
  //         if (
  //           "response" in error &&
  //           error.response &&
  //           typeof error.response === "object"
  //         ) {
  //           if (
  //             "data" in error.response &&
  //             error.response.data &&
  //             typeof error.response.data === "object"
  //           ) {
  //             // Extract message for title
  //             if (
  //               "message" in error.response.data &&
  //               typeof error.response.data.message === "string"
  //             ) {
  //               errorTitle = error.response.data.message;
  //             }
  //             // Extract errors for description
  //             if (
  //               "errors" in error.response.data &&
  //               typeof error.response.data.errors === "string"
  //             ) {
  //               errorDescription = error.response.data.errors;
  //             } else if (
  //               "message" in error.response.data &&
  //               typeof error.response.data.message === "string"
  //             ) {
  //               // If no errors field, use message as description
  //               errorDescription = error.response.data.message;
  //             }
  //           }
  //         }
  //         // Check for direct error object structure
  //         else if ("message" in error && typeof error.message === "string") {
  //           errorDescription = error.message;
  //         }
  //       }

  //       customToast.error(errorTitle, errorDescription);
  //       console.error("Account deletion error:", error);
  //     }
  //   }
  // };

  // Get current profile data
  const currentProfileData = (getProfile?.data as ProfileResponse)?.data?.user;

  // Loading states
  const isProfileLoading = getProfile.isLoading || updateProfile.isPending;
  const isAvatarLoading = uploadAvatar.isPending || updateProfile.isPending;
  const isDeleteLoading = deleteAccount.isPending;

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
            Account Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your account preferences and security settings
          </p>
        </div>

        {/* Settings Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-muted rounded-lg">
            <TabsTrigger
              value="profile"
              className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all duration-200 rounded-md"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all duration-200 rounded-md"
            >
              <Lock className="w-4 h-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all duration-200 rounded-md"
            >
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger
              value="privacy"
              className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all duration-200 rounded-md"
            >
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Privacy</span>
            </TabsTrigger>
            <TabsTrigger
              value="subscription"
              className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all duration-200 rounded-md"
            >
              <Crown className="w-4 h-4" />
              <span className="hidden sm:inline">Subscription</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Profile Information
                  </div>
                  {!isEditing && (
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                      disabled={isProfileLoading}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </CardTitle>
                <CardDescription>
                  Update your personal information and profile photo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Photo */}
                <div className="flex items-center space-x-6">
                  <Avatar className="w-24 h-24">
                    <AvatarImage
                      src={
                        avatarPreview ||
                        currentProfileData?.avatarUrl ||
                        user?.avatarUrl ||
                        "/api/placeholder/120/120"
                      }
                    />
                    <AvatarFallback className="text-2xl">
                      {currentProfileData?.firstName?.[0] ||
                        user?.firstName?.[0] ||
                        "U"}
                      {currentProfileData?.lastName?.[0] ||
                        user?.lastName?.[0] ||
                        "S"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <input
                        type="file"
                        id="avatar-upload"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                      <label htmlFor="avatar-upload">
                        <Button variant="outline" asChild>
                          <span>
                            <Upload className="w-4 h-4 mr-2" />
                            Change Photo
                          </span>
                        </Button>
                      </label>
                      {selectedAvatarFile && (
                        <Button
                          onClick={handleAvatarUpload}
                          disabled={isAvatarLoading}
                          size="sm"
                        >
                          {isAvatarLoading ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4 mr-2" />
                          )}
                          Save
                        </Button>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      JPG, GIF or PNG. Max size of 2MB.
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Personal Information Form */}
                <form
                  onSubmit={profileForm.handleSubmit(handleProfileUpdate)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        {...profileForm.register("firstName")}
                        disabled={!isEditing}
                        className={
                          profileForm.formState.errors.firstName
                            ? "border-destructive"
                            : ""
                        }
                      />
                      {profileForm.formState.errors.firstName && (
                        <p className="text-sm text-destructive mt-1">
                          {profileForm.formState.errors.firstName.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        {...profileForm.register("lastName")}
                        disabled={!isEditing}
                        className={
                          profileForm.formState.errors.lastName
                            ? "border-destructive"
                            : ""
                        }
                      />
                      {profileForm.formState.errors.lastName && (
                        <p className="text-sm text-destructive mt-1">
                          {profileForm.formState.errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      {...profileForm.register("email")}
                      disabled={true}
                      className="bg-muted cursor-not-allowed"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Email address cannot be changed
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <PhoneInput
                      id="phone"
                      value={profileForm.watch("phone") || ""}
                      onChange={(value) => profileForm.setValue("phone", value)}
                      disabled={!isEditing}
                      className={
                        profileForm.formState.errors.phone
                          ? "border-destructive"
                          : ""
                      }
                    />
                    {profileForm.formState.errors.phone && (
                      <p className="text-sm text-destructive mt-1">
                        {profileForm.formState.errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>Account Role</Label>
                    <div className="mt-2">
                      <Badge variant="secondary" className="capitalize">
                        {currentProfileData?.role || user?.role || "teacher"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Contact support to change your account role
                    </p>
                  </div>

                  {isEditing && (
                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          // Reset form to original values
                          if (currentProfileData) {
                            profileForm.reset({
                              firstName: currentProfileData.firstName || "",
                              lastName: currentProfileData.lastName || "",
                              email: currentProfileData.email || "",
                              phone: currentProfileData.phone || "",
                            });
                          }
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={
                          isProfileLoading || !profileForm.formState.isDirty
                        }
                      >
                        {isProfileLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            {/* Change Password Form */}
            <ChangePasswordForm />

            {/* Two-Factor Authentication Settings */}
            <TwoFactorSettings />

            {/* Session Management */}
            <SessionManagement />

            {/* Account Actions */}
            {/* <Card className="border-destructive/20">
              <CardHeader>
                <CardTitle className="flex items-center text-destructive">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Danger Zone
                </CardTitle>
                <CardDescription>
                  Irreversible actions that will affect your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    These actions cannot be undone. Please proceed with caution.
                  </AlertDescription>
                </Alert>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Delete Account</p>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all associated data
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDeleteAccount}
                    disabled={isDeleteLoading}
                  >
                    {isDeleteLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Delete Account"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card> */}
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Choose how you want to be notified about updates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Notification Channels */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Notification Channels</h4>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Email Notifications</p>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications via email
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.notifications.emailNotifications}
                        onCheckedChange={(checked) =>
                          setSettings({
                            ...settings,
                            notifications: {
                              ...settings.notifications,
                              emailNotifications: checked,
                            },
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Smartphone className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Push Notifications</p>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications in your browser
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.notifications.pushNotifications}
                        onCheckedChange={(checked) =>
                          setSettings({
                            ...settings,
                            notifications: {
                              ...settings.notifications,
                              pushNotifications: checked,
                            },
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <MessageSquare className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">SMS Notifications</p>
                          <p className="text-sm text-muted-foreground">
                            Receive important updates via SMS
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.notifications.smsNotifications}
                        onCheckedChange={(checked) =>
                          setSettings({
                            ...settings,
                            notifications: {
                              ...settings.notifications,
                              smsNotifications: checked,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Content Notifications */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Content Notifications</h4>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Job Alerts</p>
                        <p className="text-sm text-muted-foreground">
                          New job postings matching your profile
                        </p>
                      </div>
                      <Switch
                        checked={settings.notifications.jobAlerts}
                        onCheckedChange={(checked) =>
                          setSettings({
                            ...settings,
                            notifications: {
                              ...settings.notifications,
                              jobAlerts: checked,
                            },
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Application Updates</p>
                        <p className="text-sm text-muted-foreground">
                          Updates on your job applications
                        </p>
                      </div>
                      <Switch
                        checked={settings.notifications.applicationUpdates}
                        onCheckedChange={(checked) =>
                          setSettings({
                            ...settings,
                            notifications: {
                              ...settings.notifications,
                              applicationUpdates: checked,
                            },
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Forum Activity</p>
                        <p className="text-sm text-muted-foreground">
                          Replies to your forum posts
                        </p>
                      </div>
                      <Switch
                        checked={settings.notifications.forumActivity}
                        onCheckedChange={(checked) =>
                          setSettings({
                            ...settings,
                            notifications: {
                              ...settings.notifications,
                              forumActivity: checked,
                            },
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Weekly Digest</p>
                        <p className="text-sm text-muted-foreground">
                          Summary of platform activity
                        </p>
                      </div>
                      <Switch
                        checked={settings.notifications.weeklyDigest}
                        onCheckedChange={(checked) =>
                          setSettings({
                            ...settings,
                            notifications: {
                              ...settings.notifications,
                              weeklyDigest: checked,
                            },
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Marketing Emails</p>
                        <p className="text-sm text-muted-foreground">
                          Product updates and promotions
                        </p>
                      </div>
                      <Switch
                        checked={settings.notifications.marketingEmails}
                        onCheckedChange={(checked) =>
                          setSettings({
                            ...settings,
                            notifications: {
                              ...settings.notifications,
                              marketingEmails: checked,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => setActiveTab("profile")}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Notification Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <CookiePreferenceManager />
            <DataPrivacyManager />
          </TabsContent>

          {/* Subscription Tab */}
          <TabsContent value="subscription" className="space-y-6">
            <SubscriptionManagement />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default TeacherSettings;
