import { apiHelpers } from "./client";
import type { ApiResponse } from "../types/auth";
import type {
  CreateWithdrawalRequest,
  CreateWithdrawalResponse,
  WithdrawalHistoryQueryParams,
  WithdrawalHistoryResponse,
  WithdrawalInfo,
  UpdateTaxInfoRequest,
  TaxInfoResponse,
  ProcessWithdrawalRequest,
  PendingWithdrawalsQueryParams,
  PendingWithdrawalsResponse,
} from "../types/marketplace";

/**
 * Withdrawals API
 * Handles withdrawal requests, tax information, and payout processing
 */

// API endpoints
const WITHDRAWAL_ENDPOINTS = {
  REQUEST: "/withdrawals/request",
  HISTORY: "/withdrawals/history",
  INFO: "/withdrawals/info",
  TAX_INFO: "/withdrawals/tax-info",
  PROCESS: "/withdrawals/process",
  PENDING: "/withdrawals/pending",
} as const;

export const withdrawalsAPI = {
  /**
   * Request a withdrawal
   */
  requestWithdrawal: async (
    data: CreateWithdrawalRequest
  ): Promise<ApiResponse<CreateWithdrawalResponse>> => {
    try {
      // Safety checks
      if (!data || typeof data !== "object") {
        throw new Error("Withdrawal data is required and must be a valid object");
      }

      if (
        !data.amount ||
        typeof data.amount !== "number" ||
        data.amount <= 0
      ) {
        throw new Error("Amount is required and must be greater than 0");
      }

      if (
        !data.currency ||
        typeof data.currency !== "string" ||
        data.currency.trim().length === 0
      ) {
        throw new Error("Currency is required");
      }

      if (
        !data.payoutMethod ||
        typeof data.payoutMethod !== "string" ||
        data.payoutMethod.trim().length === 0
      ) {
        throw new Error("Payout method is required");
      }

      if (!data.payoutDetails || typeof data.payoutDetails !== "object") {
        throw new Error("Payout details are required");
      }

      // Validate payout details based on method
      if (data.payoutMethod === "stripe") {
        if (
          !data.payoutDetails.stripeAccountId ||
          typeof data.payoutDetails.stripeAccountId !== "string" ||
          data.payoutDetails.stripeAccountId.trim().length === 0
        ) {
          throw new Error("Stripe account ID is required");
        }
      } else if (data.payoutMethod === "paypal") {
        if (
          !data.payoutDetails.paypalEmail ||
          typeof data.payoutDetails.paypalEmail !== "string" ||
          data.payoutDetails.paypalEmail.trim().length === 0
        ) {
          throw new Error("PayPal email is required");
        }
      } else if (data.payoutMethod === "bank_transfer") {
        if (
          !data.payoutDetails.bankAccountHolder ||
          !data.payoutDetails.bankName ||
          !data.payoutDetails.accountNumber
        ) {
          throw new Error("Bank account details are incomplete");
        }
      }

      const requestBody = {
        amount: data.amount,
        currency: data.currency.toUpperCase(),
        payoutMethod: data.payoutMethod,
        payoutDetails: data.payoutDetails,
      };

      return await apiHelpers.post<ApiResponse<CreateWithdrawalResponse>>(
        WITHDRAWAL_ENDPOINTS.REQUEST,
        requestBody
      );
    } catch (error) {
      console.error("Error in requestWithdrawal:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to request withdrawal",
        data: undefined,
      };
    }
  },

  /**
   * Get withdrawal history
   */
  getWithdrawalHistory: async (
    params: WithdrawalHistoryQueryParams = {}
  ): Promise<ApiResponse<WithdrawalHistoryResponse>> => {
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

      const url = `${WITHDRAWAL_ENDPOINTS.HISTORY}${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      const response = await apiHelpers.get<
        ApiResponse<WithdrawalHistoryResponse>
      >(url);

      // Safety check for response structure
      if (!response || typeof response !== "object") {
        throw new Error("Invalid response format from server");
      }

      return response;
    } catch (error) {
      console.error("Error in getWithdrawalHistory:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch withdrawal history",
        data: undefined,
      };
    }
  },

  /**
   * Get withdrawal info (limits, balance, etc.)
   */
  getWithdrawalInfo: async (
    currency: string = "GBP"
  ): Promise<ApiResponse<WithdrawalInfo>> => {
    try {
      // Safety check for currency
      if (typeof currency !== "string" || currency.trim().length === 0) {
        throw new Error("Currency must be a valid string");
      }

      const url = `${WITHDRAWAL_ENDPOINTS.INFO}?currency=${currency.toUpperCase()}`;

      const response = await apiHelpers.get<ApiResponse<WithdrawalInfo>>(url);

      // Safety check for response structure
      if (!response || typeof response !== "object") {
        throw new Error("Invalid response format from server");
      }

      return response;
    } catch (error) {
      console.error("Error in getWithdrawalInfo:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch withdrawal info",
        data: undefined,
      };
    }
  },

  /**
   * Get tax information
   */
  getTaxInfo: async (): Promise<ApiResponse<TaxInfoResponse>> => {
    try {
      const response = await apiHelpers.get<ApiResponse<TaxInfoResponse>>(
        WITHDRAWAL_ENDPOINTS.TAX_INFO
      );

      // Safety check for response structure
      if (!response || typeof response !== "object") {
        throw new Error("Invalid response format from server");
      }

      return response;
    } catch (error) {
      console.error("Error in getTaxInfo:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch tax info",
        data: undefined,
      };
    }
  },

  /**
   * Update tax information
   */
  updateTaxInfo: async (
    data: UpdateTaxInfoRequest
  ): Promise<ApiResponse<TaxInfoResponse>> => {
    try {
      // Safety checks
      if (!data || typeof data !== "object") {
        throw new Error("Tax info data is required and must be a valid object");
      }

      if (
        !data.country ||
        typeof data.country !== "string" ||
        data.country.trim().length === 0
      ) {
        throw new Error("Country is required");
      }

      if (typeof data.isVATRegistered !== "boolean") {
        throw new Error("VAT registration status is required");
      }

      if (typeof data.isUSPerson !== "boolean") {
        throw new Error("US person status is required");
      }

      if (
        !data.businessType ||
        typeof data.businessType !== "string" ||
        data.businessType.trim().length === 0
      ) {
        throw new Error("Business type is required");
      }

      const requestBody = {
        country: data.country.toUpperCase(),
        isVATRegistered: data.isVATRegistered,
        vatNumber: data.vatNumber || undefined,
        vatCountry: data.vatCountry || undefined,
        isUSPerson: data.isUSPerson,
        taxIdType: data.taxIdType || undefined,
        taxFormType: data.taxFormType || undefined,
        businessType: data.businessType,
        businessName: data.businessName || undefined,
      };

      return await apiHelpers.put<ApiResponse<TaxInfoResponse>>(
        WITHDRAWAL_ENDPOINTS.TAX_INFO,
        requestBody
      );
    } catch (error) {
      console.error("Error in updateTaxInfo:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to update tax info",
        data: undefined,
      };
    }
  },

  /**
   * Process withdrawal (Admin only)
   */
  processWithdrawal: async (
    withdrawalId: string,
    data: ProcessWithdrawalRequest
  ): Promise<ApiResponse<void>> => {
    try {
      // Safety checks for withdrawalId
      if (
        !withdrawalId ||
        typeof withdrawalId !== "string" ||
        withdrawalId.trim().length === 0
      ) {
        throw new Error("Withdrawal ID is required and must be a valid string");
      }

      // Safety checks for data
      if (!data || typeof data !== "object") {
        throw new Error("Process data is required and must be a valid object");
      }

      if (
        !data.action ||
        typeof data.action !== "string" ||
        !["approve", "reject"].includes(data.action)
      ) {
        throw new Error("Action must be either 'approve' or 'reject'");
      }

      const requestBody: {
        action: string;
        transactionId?: string;
        notes?: string;
      } = {
        action: data.action,
      };

      if (
        data.transactionId &&
        typeof data.transactionId === "string" &&
        data.transactionId.trim().length > 0
      ) {
        requestBody.transactionId = data.transactionId.trim();
      }

      if (
        data.notes &&
        typeof data.notes === "string" &&
        data.notes.trim().length > 0
      ) {
        requestBody.notes = data.notes.trim();
      }

      return await apiHelpers.post<ApiResponse<void>>(
        `${WITHDRAWAL_ENDPOINTS.PROCESS}/${withdrawalId.trim()}`,
        requestBody
      );
    } catch (error) {
      console.error("Error in processWithdrawal:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to process withdrawal",
        data: undefined,
      };
    }
  },

  /**
   * Get pending withdrawals (Admin only)
   */
  getPendingWithdrawals: async (
    params: PendingWithdrawalsQueryParams = {}
  ): Promise<ApiResponse<PendingWithdrawalsResponse>> => {
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
        params.payoutMethod &&
        typeof params.payoutMethod === "string" &&
        params.payoutMethod.trim().length > 0
      ) {
        queryParams.append("payoutMethod", params.payoutMethod.trim());
      }

      const url = `${WITHDRAWAL_ENDPOINTS.PENDING}${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      const response = await apiHelpers.get<
        ApiResponse<PendingWithdrawalsResponse>
      >(url);

      // Safety check for response structure
      if (!response || typeof response !== "object") {
        throw new Error("Invalid response format from server");
      }

      return response;
    } catch (error) {
      console.error("Error in getPendingWithdrawals:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch pending withdrawals",
        data: undefined,
      };
    }
  },
};
