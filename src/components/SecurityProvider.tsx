/**
 * Security Provider Component
 * Provides additional security measures and monitoring
 */

import React, { useEffect, ReactNode } from "react";
import { SecurityLogger, isSecureContext } from "../utils/security";
import { securityConfig } from "../config/security";

interface SecurityProviderProps {
  children: ReactNode;
}

export const SecurityProvider: React.FC<SecurityProviderProps> = ({
  children,
}) => {
  const logger = SecurityLogger.getInstance();

  useEffect(() => {
    // Check if running in secure context
    if (!isSecureContext() && import.meta.env.MODE === "production") {
      logger.logSecurityEvent("Application running in non-secure context", {
        protocol: window.location.protocol,
        hostname: window.location.hostname,
      });
    }

    // Monitor for potential security issues
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // Log potential data loss scenarios
      if (document.hasFocus()) {
        logger.logSecurityEvent(
          "User attempting to leave page with unsaved data"
        );
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        logger.logSecurityEvent("Page became hidden", {
          timestamp: new Date().toISOString(),
        });
      }
    };

    const handleFocus = () => {
      logger.logSecurityEvent("Page gained focus", {
        timestamp: new Date().toISOString(),
      });
    };

    const handleBlur = () => {
      logger.logSecurityEvent("Page lost focus", {
        timestamp: new Date().toISOString(),
      });
    };

    // Add event listeners for security monitoring
    if (securityConfig.monitoring.enabled) {
      window.addEventListener("beforeunload", handleBeforeUnload);
      document.addEventListener("visibilitychange", handleVisibilityChange);
      window.addEventListener("focus", handleFocus);
      window.addEventListener("blur", handleBlur);
    }

    // Monitor for suspicious DOM modifications
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              // Check for suspicious script tags
              if (element.tagName === "SCRIPT" && element.getAttribute("src")) {
                const src = element.getAttribute("src");
                if (
                  src &&
                  !src.startsWith("/") &&
                  !src.startsWith(window.location.origin)
                ) {
                  logger.logSuspiciousActivity(
                    "Suspicious script tag detected",
                    {
                      src: src,
                      timestamp: new Date().toISOString(),
                    }
                  );
                }
              }
            }
          });
        }
      });
    });

    if (securityConfig.monitoring.enabled) {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }

    // Cleanup function
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
      observer.disconnect();
    };
  }, [logger]);

  // Additional security measures
  useEffect(() => {
    // Right-click context menu is now enabled for better user experience
    // Users can access inspect element, copy, paste, and other browser features
    // This improves accessibility and user experience while maintaining security through other measures
  }, [logger]);

  // Text selection is now enabled for better user experience
  // Users can select and copy text content as needed
  // This improves accessibility and user experience while maintaining security through other measures
  useEffect(() => {
    // No longer disabling text selection - users can now select and copy content
  }, []);

  return <>{children}</>;
};

export default SecurityProvider;
