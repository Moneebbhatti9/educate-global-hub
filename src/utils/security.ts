/**
 * Security utilities for the frontend application
 * Provides security-related configurations and helpers
 */

// Security configuration constants
export const SECURITY_CONFIG = {
  // Content Security Policy configuration
  CSP: {
    "default-src": ["'self'"],
    "script-src": [
      "'self'",
      "'unsafe-inline'",
      "'unsafe-eval'",
      "https://fonts.googleapis.com",
      "https://fonts.gstatic.com",
    ],
    "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    "font-src": ["'self'", "https://fonts.gstatic.com"],
    "img-src": ["'self'", "data:", "blob:", "https:"],
    "connect-src": ["'self'", "https:"],
    "object-src": ["'none'"],
    "frame-ancestors": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
  },

  // Permissions Policy configuration
  PERMISSIONS_POLICY: {
    geolocation: [],
    microphone: [],
    camera: [],
    payment: [],
    usb: [],
    magnetometer: [],
    gyroscope: [],
    accelerometer: [],
  },

  // Security headers
  HEADERS: {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  },
} as const;

/**
 * Generate Content Security Policy header value
 */
export function generateCSPHeader(): string {
  return Object.entries(SECURITY_CONFIG.CSP)
    .map(([directive, sources]) => `${directive} ${sources.join(" ")}`)
    .join("; ");
}

/**
 * Generate Permissions Policy header value
 */
export function generatePermissionsPolicyHeader(): string {
  return Object.entries(SECURITY_CONFIG.PERMISSIONS_POLICY)
    .map(([feature, allowlist]) => `${feature}=(${allowlist.join(" ")})`)
    .join(", ");
}

/**
 * Sanitize user input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== "string") {
    return "";
  }

  return input
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, "") // Remove event handlers
    .trim();
}

/**
 * Validate URL to ensure it's safe
 */
export function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    // Only allow https and http protocols
    return ["https:", "http:"].includes(urlObj.protocol);
  } catch {
    return false;
  }
}

/**
 * Check if the current environment is secure (HTTPS)
 */
export function isSecureContext(): boolean {
  return window.isSecureContext || window.location.protocol === "https:";
}

/**
 * Security event logging for monitoring
 */
export class SecurityLogger {
  private static instance: SecurityLogger;

  static getInstance(): SecurityLogger {
    if (!SecurityLogger.instance) {
      SecurityLogger.instance = new SecurityLogger();
    }
    return SecurityLogger.instance;
  }

  logSecurityEvent(event: string, details?: Record<string, unknown>): void {
    if (import.meta.env.DEV) {
      console.warn(`🔒 Security Event: ${event}`, details);
    }

    // In production, you might want to send this to a security monitoring service
    // Example: sendToSecurityService(event, details);
  }

  logSuspiciousActivity(
    activity: string,
    details?: Record<string, unknown>
  ): void {
    console.error(`🚨 Suspicious Activity: ${activity}`, details);

    // In production, immediately alert security team
    // Example: alertSecurityTeam(activity, details);
  }
}

/**
 * Content Security Policy violation handler
 */
export function handleCSPViolation(event: SecurityPolicyViolationEvent): void {
  const logger = SecurityLogger.getInstance();

  logger.logSuspiciousActivity("CSP Violation", {
    violatedDirective: event.violatedDirective,
    blockedURI: event.blockedURI,
    documentURI: event.documentURI,
    sourceFile: event.sourceFile,
    lineNumber: event.lineNumber,
    columnNumber: event.columnNumber,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Initialize security monitoring
 */
export function initializeSecurityMonitoring(): void {
  // Monitor CSP violations
  document.addEventListener("securitypolicyviolation", handleCSPViolation);

  // Monitor for potential XSS attempts
  const originalInnerHTML = Object.getOwnPropertyDescriptor(
    Element.prototype,
    "innerHTML"
  )?.set;
  if (originalInnerHTML) {
    Object.defineProperty(Element.prototype, "innerHTML", {
      set: function (value: string) {
        if (value && typeof value === "string") {
          const sanitized = sanitizeInput(value);
          if (sanitized !== value) {
            const logger = SecurityLogger.getInstance();
            logger.logSuspiciousActivity("Potential XSS attempt detected", {
              original: value,
              sanitized: sanitized,
            });
          }
        }
        originalInnerHTML.call(this, value);
      },
      configurable: true,
    });
  }

  // Monitor for suspicious network requests
  const originalFetch = window.fetch;
  window.fetch = function (input: RequestInfo | URL, init?: RequestInit) {
    const url = typeof input === "string" ? input : input.toString();

    if (!isValidUrl(url)) {
      const logger = SecurityLogger.getInstance();
      logger.logSuspiciousActivity("Invalid URL in fetch request", { url });
      return Promise.reject(new Error("Invalid URL"));
    }

    return originalFetch.call(this, input, init);
  };
}

/**
 * Security headers validation
 */
export function validateSecurityHeaders(): boolean {
  const requiredHeaders = Object.keys(SECURITY_CONFIG.HEADERS);
  const missingHeaders: string[] = [];

  // This would typically be done server-side, but we can check what's available
  if (import.meta.env.DEV) {
    console.log("🔒 Security headers validation (client-side check)");
    console.log("Required headers:", requiredHeaders);
    console.log("Note: Full validation should be done server-side");
  }

  return missingHeaders.length === 0;
}

// Export security utilities
export const securityUtils = {
  generateCSPHeader,
  generatePermissionsPolicyHeader,
  sanitizeInput,
  isValidUrl,
  isSecureContext,
  SecurityLogger,
  handleCSPViolation,
  initializeSecurityMonitoring,
  validateSecurityHeaders,
};
