/**
 * Marketplace Types
 * TypeScript type definitions for sales, withdrawals, and earnings
 */

import type { ApiResponse } from "./auth";

// ==================== Currency and Money ====================

export type Currency = "GBP" | "USD" | "EUR" | "PKR";

export type SellerTier = "Bronze" | "Silver" | "Gold";

export interface MoneyAmount {
  amount: number;
  currency: Currency;
  formatted: string;
}

// ==================== Sales ====================

export type SaleStatus = "completed" | "refunded" | "disputed" | "pending";

export interface Sale {
  _id: string;
  resource: string | {
    _id: string;
    title: string;
    coverPhotoUrl: string;
  };
  seller: string;
  buyer: string | {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  price: number;
  currency: Currency;
  vatAmount: number;
  transactionFee: number;
  platformCommission: number;
  sellerEarnings: number;
  royaltyRate: number;
  sellerTier: SellerTier;
  status: SaleStatus;
  saleDate: string;
  stripeChargeId?: string;
  stripePaymentIntentId?: string;
  refundedAt?: string;
  refundAmount?: number;
  buyerCountry?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface RoyaltyBreakdown {
  originalPrice: number;
  currency: Currency;
  vatAmount: number;
  netPrice: number;
  transactionFee: number;
  royaltyRate: number;
  sellerTier: SellerTier;
  sellerEarnings: number;
  platformCommission: number;
  breakdown: {
    gross: string;
    vat: string;
    net: string;
    fee: string;
    sellerShare: string;
    sellerEarnings: string;
    platformShare: string;
    platformCommission: string;
  };
}

// Purchase Request/Response
export interface PurchaseResourceRequest {
  resourceId: string;
  paymentMethodId: string;
  buyerCountry?: string;
}

export interface PurchaseResourceResponse {
  sale: Sale;
  paymentIntent: {
    id: string;
    status: string;
    clientSecret?: string;
  };
  royaltyBreakdown: RoyaltyBreakdown;
}

// Sales History
export interface MySalesQueryParams {
  page?: number;
  limit?: number;
  status?: SaleStatus;
  currency?: Currency;
  startDate?: string;
  endDate?: string;
}

export interface MySalesResponse {
  sales: Sale[];
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
  };
  totalEarnings: {
    [key in Currency]?: number;
  };
}

// Earnings Dashboard
export interface EarningsDashboard {
  totalEarnings: {
    [key in Currency]?: {
      gross: number;
      net: number;
      formatted: string;
    };
  };
  thisMonth: {
    [key in Currency]?: {
      gross: number;
      net: number;
      formatted: string;
    };
  };
  last30Days: {
    [key in Currency]?: {
      gross: number;
      net: number;
      formatted: string;
    };
  };
  last12Months: {
    [key in Currency]?: {
      gross: number;
      net: number;
      formatted: string;
    };
  };
  sellerTier: {
    current: SellerTier;
    royaltyRate: number;
    last12MonthsSales: number;
    nextTier?: {
      tier: SellerTier;
      requiredSales: number;
      remainingSales: number;
    };
  };
  topResources: Array<{
    resourceId: string;
    title: string;
    totalSales: number;
    totalEarnings: number;
    salesCount: number;
  }>;
  recentSales: Sale[];
  monthlySales: Array<{
    month: string;
    sales: number;
    earnings: number;
  }>;
  salesByCountry: Array<{
    country: string;
    count: number;
    earnings: number;
  }>;
}

// Resource Sales
export interface ResourceSalesQueryParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}

export interface ResourceSalesResponse {
  resource: {
    _id: string;
    title: string;
    coverPhotoUrl: string;
    price: number;
    currency: Currency;
  };
  sales: Sale[];
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
  };
  analytics: {
    totalSales: number;
    totalEarnings: number;
    averagePrice: number;
    refundRate: number;
  };
}

// ==================== Withdrawals ====================

export type WithdrawalStatus = "pending" | "processing" | "completed" | "failed";

export type PayoutMethod = "stripe" | "paypal" | "bank_transfer";

export interface WithdrawalRequest {
  _id: string;
  seller: string;
  amount: number;
  currency: Currency;
  payoutMethod: PayoutMethod;
  payoutDetails: {
    stripeAccountId?: string;
    paypalEmail?: string;
    bankAccountHolder?: string;
    bankName?: string;
    accountNumber?: string;
    sortCode?: string;
    iban?: string;
    swiftCode?: string;
  };
  feeAmount: number;
  netAmount: number;
  status: WithdrawalStatus;
  requestedAt: string;
  processedAt?: string;
  completedAt?: string;
  failureReason?: string;
  transactionId?: string;
}

// Withdrawal Request
export interface CreateWithdrawalRequest {
  amount: number;
  currency: Currency;
  payoutMethod: PayoutMethod;
  payoutDetails: {
    stripeAccountId?: string;
    paypalEmail?: string;
    bankAccountHolder?: string;
    bankName?: string;
    accountNumber?: string;
    sortCode?: string;
    iban?: string;
    swiftCode?: string;
  };
}

export interface CreateWithdrawalResponse {
  withdrawal: {
    _id: string;
    amount: string;
    fee: string;
    netAmount: string;
    currency: Currency;
    status: WithdrawalStatus;
    payoutMethod: PayoutMethod;
    requestedAt: string;
    expectedArrival?: string;
    message?: string;
  };
}

// Withdrawal History
export interface WithdrawalHistoryQueryParams {
  page?: number;
  limit?: number;
  status?: WithdrawalStatus;
  currency?: Currency;
}

export interface WithdrawalHistoryResponse {
  withdrawals: Array<{
    _id: string;
    amount: string;
    fee: string;
    netAmount: string;
    currency: Currency;
    payoutMethod: PayoutMethod;
    status: WithdrawalStatus;
    requestedAt: string;
    processedAt?: string;
    completedAt?: string;
    failureReason?: string;
  }>;
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
  };
  canWithdraw: boolean;
  daysUntilNextWithdrawal: number;
}

// Withdrawal Info
export interface WithdrawalInfo {
  balance: {
    available: number;
    formatted: string;
    currency: Currency;
  };
  limits: {
    minimum: {
      amount: number;
      formatted: string;
    };
    maximum: {
      amount: number;
      formatted: string;
    };
  };
  withdrawal: {
    canWithdraw: boolean;
    daysRemaining: number;
    lastWithdrawal?: WithdrawalRequest;
    frequency: string;
  };
  payoutMethods: {
    stripe: {
      available: boolean;
      fee: string;
      processingTime: string;
    };
    paypal: {
      available: boolean;
      fee: string;
      processingTime: string;
    };
    bank_transfer: {
      available: boolean;
      fee: string;
      processingTime: string;
    };
  };
  taxInfo: {
    isComplete: boolean;
    isVerified: boolean;
  };
}

// ==================== Tax Information ====================

export type BusinessType = "individual" | "company" | "partnership";

export interface TaxInfo {
  _id: string;
  seller: string;
  country: string;
  isVATRegistered: boolean;
  vatNumber?: string;
  vatCountry?: string;
  isUSPerson: boolean;
  taxIdType?: string;
  taxFormType?: string;
  taxFormUrl?: string;
  businessType: BusinessType;
  businessName?: string;
  isVerified: boolean;
  isComplete: boolean;
  lastReviewedAt?: string;
}

export interface UpdateTaxInfoRequest {
  country: string;
  isVATRegistered: boolean;
  vatNumber?: string;
  vatCountry?: string;
  isUSPerson: boolean;
  taxIdType?: string;
  taxFormType?: string;
  businessType: BusinessType;
  businessName?: string;
}

export interface TaxInfoResponse {
  taxInfo: TaxInfo | null;
  isComplete: boolean;
}

// ==================== Admin ====================

export interface ProcessWithdrawalRequest {
  action: "approve" | "reject";
  transactionId?: string;
  notes?: string;
}

export interface PendingWithdrawalsQueryParams {
  page?: number;
  limit?: number;
  payoutMethod?: PayoutMethod;
}

export interface PendingWithdrawalsResponse {
  withdrawals: Array<WithdrawalRequest & {
    seller: {
      _id: string;
      email: string;
      firstName: string;
      lastName: string;
    };
  }>;
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
  };
}

export interface RefundSaleRequest {
  reason?: string;
}
