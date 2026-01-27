import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiHelpers } from "@/apis/client";

interface SocialLinks {
  facebook: string;
  twitter: string;
  linkedin: string;
  instagram: string;
}

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  logo: string;
  favicon: string;
  contactEmail: string;
  supportEmail: string;
  phoneNumber: string;
  address: string;
  socialLinks: SocialLinks;
  copyrightText: string;
}

interface SiteSettingsContextType {
  settings: SiteSettings;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

const defaultSettings: SiteSettings = {
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

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: defaultSettings,
  isLoading: true,
  error: null,
  refetch: () => {},
});

export const useSiteSettings = () => {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error("useSiteSettings must be used within a SiteSettingsProvider");
  }
  return context;
};

interface SiteSettingsProviderProps {
  children: ReactNode;
}

export const SiteSettingsProvider: React.FC<SiteSettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["siteSettings"],
    queryFn: async () => {
      try {
        const response = await apiHelpers.get<{ success: boolean; data: SiteSettings }>(
          "/admin/settings/general"
        );
        return response.data;
      } catch (err) {
        
        return defaultSettings;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
    retry: 1,
  });

  useEffect(() => {
    if (data) {
      setSettings({
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

      // Update favicon if provided
      if (data.favicon) {
        const faviconLink = document.querySelector("link[rel='icon']") as HTMLLinkElement;
        if (faviconLink) {
          faviconLink.href = data.favicon;
        }
      }

      // Update page title
      if (data.siteName) {
        document.title = data.siteName;
      }
    }
  }, [data]);

  return (
    <SiteSettingsContext.Provider
      value={{
        settings,
        isLoading,
        error: error as Error | null,
        refetch,
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
};

export default SiteSettingsContext;
