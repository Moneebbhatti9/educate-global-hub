/**
 * Security configuration for different environments
 */

export interface SecurityConfig {
  csp: {
    reportUri?: string;
    reportOnly?: boolean;
  };
  monitoring: {
    enabled: boolean;
    logLevel: "debug" | "info" | "warn" | "error";
  };
  features: {
    xssProtection: boolean;
    clickjackingProtection: boolean;
    mimeTypeSniffingProtection: boolean;
    referrerPolicy: boolean;
    allowUserInteractions: boolean; // Allow right-click, text selection, and copy functionality
  };
}

const developmentConfig: SecurityConfig = {
  csp: {
    reportOnly: true, // Use report-only mode in development
  },
  monitoring: {
    enabled: true,
    logLevel: "debug",
  },
  features: {
    xssProtection: true,
    clickjackingProtection: true,
    mimeTypeSniffingProtection: true,
    referrerPolicy: true,
    allowUserInteractions: true, // Enable user interactions in development
  },
};

const productionConfig: SecurityConfig = {
  csp: {
    reportUri: "/api/security/csp-report", // Report CSP violations to backend
    reportOnly: false, // Enforce CSP in production
  },
  monitoring: {
    enabled: true,
    logLevel: "warn",
  },
  features: {
    xssProtection: true,
    clickjackingProtection: true,
    mimeTypeSniffingProtection: true,
    referrerPolicy: true,
    allowUserInteractions: true, // Enable user interactions in production for better UX
  },
};

const testConfig: SecurityConfig = {
  csp: {
    reportOnly: true,
  },
  monitoring: {
    enabled: false,
    logLevel: "error",
  },
  features: {
    xssProtection: true,
    clickjackingProtection: true,
    mimeTypeSniffingProtection: true,
    referrerPolicy: true,
    allowUserInteractions: true, // Enable user interactions in test environment
  },
};

export function getSecurityConfig(): SecurityConfig {
  const env = import.meta.env.MODE;

  switch (env) {
    case "development":
      return developmentConfig;
    case "production":
      return productionConfig;
    case "test":
      return testConfig;
    default:
      return developmentConfig;
  }
}

export const securityConfig = getSecurityConfig();
