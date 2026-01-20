import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Image,
  Save,
  RefreshCw,
  Upload,
  Globe,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Building2,
  Trash2,
} from "lucide-react";
import { customToast } from "@/components/ui/sonner";
import { adminApi, GeneralSettings as GeneralSettingsType } from "@/apis/admin";

const defaultSettings: GeneralSettingsType = {
  siteName: "Educate Link",
  siteDescription: "Connecting educators worldwide with resources and opportunities",
  logo: "",
  favicon: "",
  contactEmail: "",
  supportEmail: "",
  phoneNumber: "",
  address: "",
  socialLinks: {
    facebook: "",
    twitter: "",
    linkedin: "",
    instagram: "",
  },
  copyrightText: "",
};

const GeneralSettings = () => {
  const queryClient = useQueryClient();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<GeneralSettingsType>(defaultSettings);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch general settings
  const { data: settingsData, isLoading, refetch } = useQuery({
    queryKey: ["generalSettings"],
    queryFn: async () => {
      try {
        const response = await adminApi.getGeneralSettings();
        if (response.success && response.data) {
          const data = response.data;
          setFormData({
            siteName: data.siteName || defaultSettings.siteName,
            siteDescription: data.siteDescription || defaultSettings.siteDescription,
            logo: data.logo || "",
            favicon: data.favicon || "",
            contactEmail: data.contactEmail || "",
            supportEmail: data.supportEmail || "",
            phoneNumber: data.phoneNumber || "",
            address: data.address || "",
            socialLinks: {
              facebook: data.socialLinks?.facebook || "",
              twitter: data.socialLinks?.twitter || "",
              linkedin: data.socialLinks?.linkedin || "",
              instagram: data.socialLinks?.instagram || "",
            },
            copyrightText: data.copyrightText || "",
          });
          if (data.logo) setLogoPreview(data.logo);
          if (data.favicon) setFaviconPreview(data.favicon);
          return data;
        }
        return defaultSettings;
      } catch (error) {
        // If endpoint doesn't exist yet, use defaults
        
        return defaultSettings;
      }
    },
  });

  // Update settings mutation
  const updateMutation = useMutation({
    mutationFn: async (data: GeneralSettingsType) => {
      const formDataToSend = new FormData();

      // Append text fields
      formDataToSend.append("siteName", data.siteName);
      formDataToSend.append("siteDescription", data.siteDescription);
      formDataToSend.append("contactEmail", data.contactEmail);
      formDataToSend.append("supportEmail", data.supportEmail);
      formDataToSend.append("phoneNumber", data.phoneNumber);
      formDataToSend.append("address", data.address);
      formDataToSend.append("copyrightText", data.copyrightText);
      formDataToSend.append("socialLinks", JSON.stringify(data.socialLinks));

      // Append files if present
      if (logoFile) {
        formDataToSend.append("logo", logoFile);
      }
      if (faviconFile) {
        formDataToSend.append("favicon", faviconFile);
      }

      return adminApi.updateGeneralSettings(formDataToSend);
    },
    onSuccess: () => {
      customToast.success("Settings updated successfully");
      queryClient.invalidateQueries({ queryKey: ["generalSettings"] });
      setHasChanges(false);
      setLogoFile(null);
      setFaviconFile(null);
    },
    onError: (error: Error) => {
      customToast.error(error.message || "Failed to update settings");
    },
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [platform]: value },
    }));
    setHasChanges(true);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        customToast.error("Logo must be less than 5MB");
        return;
      }
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setHasChanges(true);
    }
  };

  const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        customToast.error("Favicon must be less than 1MB");
        return;
      }
      setFaviconFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFaviconPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setHasChanges(true);
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    setFormData((prev) => ({ ...prev, logo: "" }));
    setHasChanges(true);
    if (logoInputRef.current) {
      logoInputRef.current.value = "";
    }
  };

  const handleRemoveFavicon = () => {
    setFaviconFile(null);
    setFaviconPreview(null);
    setFormData((prev) => ({ ...prev, favicon: "" }));
    setHasChanges(true);
    if (faviconInputRef.current) {
      faviconInputRef.current.value = "";
    }
  };

  const handleSave = () => {
    if (!formData.siteName.trim()) {
      customToast.error("Site name is required");
      return;
    }
    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <DashboardLayout role="admin">
        <div className="space-y-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-[400px]" />
          <Skeleton className="h-[300px]" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
              General Settings
            </h1>
            <p className="text-muted-foreground">
              Manage your platform's basic information and branding
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => refetch()} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button
              onClick={handleSave}
              disabled={!hasChanges || updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Changes
            </Button>
          </div>
        </div>

        {/* Site Identity */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              <div>
                <CardTitle>Site Identity</CardTitle>
                <CardDescription>
                  Configure your platform's name, description, and branding
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Logo & Favicon */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Logo Upload */}
              <div className="space-y-3">
                <Label>Site Logo</Label>
                <div className="flex items-start gap-4">
                  <div className="w-32 h-32 border-2 border-dashed border-muted rounded-lg flex items-center justify-center overflow-hidden bg-muted/50">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Image className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => logoInputRef.current?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Logo
                    </Button>
                    {logoPreview && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRemoveLogo}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Recommended: 200x60px, PNG or SVG, max 5MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Favicon Upload */}
              <div className="space-y-3">
                <Label>Favicon</Label>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 border-2 border-dashed border-muted rounded-lg flex items-center justify-center overflow-hidden bg-muted/50">
                    {faviconPreview ? (
                      <img
                        src={faviconPreview}
                        alt="Favicon preview"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Image className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <input
                      ref={faviconInputRef}
                      type="file"
                      accept="image/*,.ico"
                      onChange={handleFaviconChange}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => faviconInputRef.current?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Favicon
                    </Button>
                    {faviconPreview && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRemoveFavicon}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Recommended: 32x32px, ICO or PNG, max 1MB
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Site Name & Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name *</Label>
                <Input
                  id="siteName"
                  value={formData.siteName}
                  onChange={(e) => handleInputChange("siteName", e.target.value)}
                  placeholder="Enter site name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="copyrightText">Copyright Text</Label>
                <Input
                  id="copyrightText"
                  value={formData.copyrightText}
                  onChange={(e) => handleInputChange("copyrightText", e.target.value)}
                  placeholder="e.g., © 2025 Educate Link. All rights reserved."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="siteDescription">Site Description</Label>
              <Textarea
                id="siteDescription"
                value={formData.siteDescription}
                onChange={(e) => handleInputChange("siteDescription", e.target.value)}
                placeholder="Brief description of your platform"
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Used for SEO and meta descriptions
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              <div>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Set up contact details displayed on your platform
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="contactEmail">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Contact Email
                </Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                  placeholder="contact@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supportEmail">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Support Email
                </Label>
                <Input
                  id="supportEmail"
                  type="email"
                  value={formData.supportEmail}
                  onChange={(e) => handleInputChange("supportEmail", e.target.value)}
                  placeholder="support@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                  placeholder="+1 234 567 8900"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Address
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="123 Main St, City, Country"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              <div>
                <CardTitle>Social Media Links</CardTitle>
                <CardDescription>
                  Connect your social media profiles
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="facebook">
                  <Facebook className="w-4 h-4 inline mr-2" />
                  Facebook
                </Label>
                <Input
                  id="facebook"
                  value={formData.socialLinks.facebook}
                  onChange={(e) => handleSocialLinkChange("facebook", e.target.value)}
                  placeholder="https://facebook.com/yourpage"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter">
                  <Twitter className="w-4 h-4 inline mr-2" />
                  Twitter / X
                </Label>
                <Input
                  id="twitter"
                  value={formData.socialLinks.twitter}
                  onChange={(e) => handleSocialLinkChange("twitter", e.target.value)}
                  placeholder="https://twitter.com/yourhandle"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">
                  <Linkedin className="w-4 h-4 inline mr-2" />
                  LinkedIn
                </Label>
                <Input
                  id="linkedin"
                  value={formData.socialLinks.linkedin}
                  onChange={(e) => handleSocialLinkChange("linkedin", e.target.value)}
                  placeholder="https://linkedin.com/company/yourcompany"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram">
                  <Instagram className="w-4 h-4 inline mr-2" />
                  Instagram
                </Label>
                <Input
                  id="instagram"
                  value={formData.socialLinks.instagram}
                  onChange={(e) => handleSocialLinkChange("instagram", e.target.value)}
                  placeholder="https://instagram.com/yourhandle"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default GeneralSettings;
