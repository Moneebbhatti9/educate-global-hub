import { apiHelpers } from "./client";
import type { ApiResponse } from "../types/auth";
import type {
  PurchaseResourceRequest,
  PurchaseResourceResponse,
  MySalesQueryParams,
  MySalesResponse,
  EarningsDashboard,
  ResourceSalesQueryParams,
  ResourceSalesResponse,
  RefundSaleRequest,
} from "../types/marketplace";

/**
 * Sales API
 * Handles resource purchases, sales history, and earnings analytics
 */

// API endpoints
const SALES_ENDPOINTS = {
  PURCHASE: "/sales/purchase",
  MY_SALES: "/sales/my-sales",
  MY_PURCHASES: "/sales/my-purchases",
  PURCHASE_BY_SESSION: "/sales/purchase/session",
  EARNINGS: "/sales/earnings",
  RESOURCE_SALES: "/sales/resource",
  REFUND: "/sales/refund",
} as const;

export const salesAPI = {
  /**
   * Purchase a resource
   */
  purchaseResource: async (
    data: PurchaseResourceRequest
  ): Promise<ApiResponse<PurchaseResourceResponse>> => {
    try {
      // Safety checks
      if (!data || typeof data !== "object") {
        throw new Error("Purchase data is required and must be a valid object");
      }

      if (
        !data.resourceId ||
        typeof data.resourceId !== "string" ||
        data.resourceId.trim().length === 0
      ) {
        throw new Error("Resource ID is required and must be a valid string");
      }

      if (
        !data.paymentMethodId ||
        typeof data.paymentMethodId !== "string" ||
        data.paymentMethodId.trim().length === 0
      ) {
        throw new Error("Payment method ID is required");
      }

      const requestBody = {
        resourceId: data.resourceId.trim(),
        paymentMethodId: data.paymentMethodId.trim(),
        buyerCountry: data.buyerCountry || "GB",
      };

      return await apiHelpers.post<ApiResponse<PurchaseResourceResponse>>(
        SALES_ENDPOINTS.PURCHASE,
        requestBody
      );
    } catch (error) {
      console.error("Error in purchaseResource:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to purchase resource",
        data: undefined,
      };
    }
  },

  /**
   * Get my purchases (resources I bought)
   */
  getMyPurchases: async (): Promise<ApiResponse<any>> => {
    try {
      const response = await apiHelpers.get<ApiResponse<any>>(
        SALES_ENDPOINTS.MY_PURCHASES
      );

      // Safety check for response structure
      if (!response || typeof response !== "object") {
        throw new Error("Invalid response format from server");
      }

      return response;
    } catch (error) {
      console.error("Error in getMyPurchases:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch purchases",
        data: undefined,
      };
    }
  },

  /**
   * Get purchase details by Stripe session ID
   */
  getPurchaseBySession: async (sessionId: string): Promise<ApiResponse<any>> => {
    try {
      // Safety checks for sessionId
      if (
        !sessionId ||
        typeof sessionId !== "string" ||
        sessionId.trim().length === 0
      ) {
        throw new Error("Session ID is required and must be a valid string");
      }

      const response = await apiHelpers.get<ApiResponse<any>>(
        `${SALES_ENDPOINTS.PURCHASE_BY_SESSION}/${sessionId.trim()}`
      );

      // Safety check for response structure
      if (!response || typeof response !== "object") {
        throw new Error("Invalid response format from server");
      }

      return response;
    } catch (error) {
      console.error("Error in getPurchaseBySession:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch purchase details",
        data: undefined,
      };
    }
  },

  /**
   * Get my sales history
   */
  getMySales: async (
    params: MySalesQueryParams = {}
  ): Promise<ApiResponse<MySalesResponse>> => {
    try {
      // Safety checks
      if (!params || typeof params !== "object") {
        throw new Error("Parameters must be a valid object");
      }

      const queryParams = new URLSearchParams();

      // Add optional query parameters with safety checks
      if (params.page && typeof params.page === "number" && params.page > 0) {
        queryParams.append("page", params.page.toString());
      }
      if (
        params.limit &&
        typeof params.limit === "number" &&
        params.limit > 0 &&
        params.limit <= 100
      ) {
        queryParams.append("limit", params.limit.toString());
      }
      if (
        params.status &&
        typeof params.status === "string" &&
        params.status.trim().length > 0
      ) {
        queryParams.append("status", params.status.trim());
      }
      if (
        params.currency &&
        typeof params.currency === "string" &&
        params.currency.trim().length > 0
      ) {
        queryParams.append("currency", params.currency.trim());
      }
      if (
        params.startDate &&
        typeof params.startDate === "string" &&
        params.startDate.trim().length > 0
      ) {
        queryParams.append("startDate", params.startDate.trim());
      }
      if (
        params.endDate &&
        typeof params.endDate === "string" &&
        params.endDate.trim().length > 0
      ) {
        queryParams.append("endDate", params.endDate.trim());
      }

      const url = `${SALES_ENDPOINTS.MY_SALES}${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      const response = await apiHelpers.get<ApiResponse<MySalesResponse>>(url);

      // Safety check for response structure
      if (!response || typeof response !== "object") {
        throw new Error("Invalid response format from server");
      }

      return response;
    } catch (error) {
      console.error("Error in getMySales:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch sales history",
        data: undefined,
      };
    }
  },

  /**
   * Get earnings dashboard
   */
  getEarningsDashboard: async (): Promise<
    ApiResponse<EarningsDashboard>
  > => {
    try {
      const response = await apiHelpers.get<ApiResponse<EarningsDashboard>>(
        SALES_ENDPOINTS.EARNINGS
      );

      // Safety check for response structure
      if (!response || typeof response !== "object") {
        throw new Error("Invalid response format from server");
      }

      return response;
    } catch (error) {
      console.error("Error in getEarningsDashboard:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch earnings dashboard",
        data: undefined,
      };
    }
  },

  /**
   * Get sales for a specific resource
   */
  getResourceSales: async (
    resourceId: string,
    params: ResourceSalesQueryParams = {}
  ): Promise<ApiResponse<ResourceSalesResponse>> => {
    try {
      // Safety checks for resourceId
      if (
        !resourceId ||
        typeof resourceId !== "string" ||
        resourceId.trim().length === 0
      ) {
        throw new Error("Resource ID is required and must be a valid string");
      }

      // Safety checks for params
      if (!params || typeof params !== "object") {
        throw new Error("Parameters must be a valid object");
      }

      const queryParams = new URLSearchParams();

      // Add optional query parameters with safety checks
      if (params.page && typeof params.page === "number" && params.page > 0) {
        queryParams.append("page", params.page.toString());
      }
      if (
        params.limit &&
        typeof params.limit === "number" &&
        params.limit > 0 &&
        params.limit <= 100
      ) {
        queryParams.append("limit", params.limit.toString());
      }
      if (
        params.startDate &&
        typeof params.startDate === "string" &&
        params.startDate.trim().length > 0
      ) {
        queryParams.append("startDate", params.startDate.trim());
      }
      if (
        params.endDate &&
        typeof params.endDate === "string" &&
        params.endDate.trim().length > 0
      ) {
        queryParams.append("endDate", params.endDate.trim());
      }

      const url = `${SALES_ENDPOINTS.RESOURCE_SALES}/${resourceId.trim()}${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      const response = await apiHelpers.get<
        ApiResponse<ResourceSalesResponse>
      >(url);

      // Safety check for response structure
      if (!response || typeof response !== "object") {
        throw new Error("Invalid response format from server");
      }

      return response;
    } catch (error) {
      console.error("Error in getResourceSales:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch resource sales",
        data: undefined,
      };
    }
  },

  /**
   * Refund a sale (Admin only)
   */
  refundSale: async (
    saleId: string,
    data: RefundSaleRequest = {}
  ): Promise<ApiResponse<void>> => {
    try {
      // Safety checks for saleId
      if (
        !saleId ||
        typeof saleId !== "string" ||
        saleId.trim().length === 0
      ) {
        throw new Error("Sale ID is required and must be a valid string");
      }

      // Safety checks for data
      if (!data || typeof data !== "object") {
        throw new Error("Refund data must be a valid object");
      }

      const requestBody: { reason?: string } = {};

      if (
        data.reason &&
        typeof data.reason === "string" &&
        data.reason.trim().length > 0
      ) {
        requestBody.reason = data.reason.trim();
      }

      return await apiHelpers.post<ApiResponse<void>>(
        `${SALES_ENDPOINTS.REFUND}/${saleId.trim()}`,
        requestBody
      );
    } catch (error) {
      console.error("Error in refundSale:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to refund sale",
        data: undefined,
      };
    }
  },
};
