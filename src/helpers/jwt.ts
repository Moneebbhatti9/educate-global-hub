import { JWTPayload, UserRole } from "../types/auth";

// JWT Token helpers
export const jwtHelpers = {
  // Parse JWT token without verification (client-side only)
  parseToken: (token: string): JWTPayload | null => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error parsing JWT token:", error);
      return null;
    }
  },

  // Check if token is expired
  isTokenExpired: (token: string): boolean => {
    const payload = jwtHelpers.parseToken(token);
    if (!payload) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  },

  // Get token expiration time
  getTokenExpiration: (token: string): Date | null => {
    const payload = jwtHelpers.parseToken(token);
    if (!payload) return null;

    return new Date(payload.exp * 1000);
  },

  // Get time until token expires (in milliseconds)
  getTimeUntilExpiration: (token: string): number => {
    const payload = jwtHelpers.parseToken(token);
    if (!payload) return 0;

    const currentTime = Math.floor(Date.now() / 1000);
    return Math.max(0, (payload.exp - currentTime) * 1000);
  },

  // Check if token will expire soon (within 5 minutes)
  isTokenExpiringSoon: (
    token: string,
    thresholdMinutes: number = 5
  ): boolean => {
    const timeUntilExpiration = jwtHelpers.getTimeUntilExpiration(token);
    const thresholdMs = thresholdMinutes * 60 * 1000;
    return timeUntilExpiration < thresholdMs;
  },

  // Extract user role from token
  getUserRole: (token: string): UserRole | null => {
    const payload = jwtHelpers.parseToken(token);
    return payload?.role || null;
  },

  // Extract user ID from token
  getUserId: (token: string): string | null => {
    const payload = jwtHelpers.parseToken(token);
    return payload?.sub || null;
  },

  // Extract user email from token
  getUserEmail: (token: string): string | null => {
    const payload = jwtHelpers.parseToken(token);
    return payload?.email || null;
  },

  // Validate token structure (basic validation)
  isValidTokenStructure: (token: string): boolean => {
    if (!token || typeof token !== "string") return false;

    const parts = token.split(".");
    if (parts.length !== 3) return false;

    try {
      const payload = jwtHelpers.parseToken(token);
      return !!payload && !!payload.sub && !!payload.email && !!payload.role;
    } catch {
      return false;
    }
  },
};
