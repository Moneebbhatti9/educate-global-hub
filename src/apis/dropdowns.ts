/**
 * Dropdown API Client
 * Handles all dropdown-related API calls
 */

import apiClient from "./client";
import type {
  DropdownOption,
  DropdownCategory,
  CreateDropdownOptionRequest,
  UpdateDropdownOptionRequest,
  BulkCreateDropdownRequest,
  SortOrderUpdate,
  DropdownOptionsResponse,
  DropdownCategoriesResponse,
  DropdownMultipleCategoriesResponse,
  AdminDropdownOptionsResponse,
} from "@/types/dropdown";

const BASE_URL = "/dropdowns";

// ============================================
// PUBLIC APIs (No authentication required)
// ============================================

/**
 * Get all options for a specific category
 */
export const getDropdownOptions = async (
  category: string,
  includeInactive = false
): Promise<DropdownOption[]> => {
  const response = await apiClient.get<DropdownOptionsResponse>(
    `${BASE_URL}/${category}`,
    { params: { includeInactive } }
  );
  return response.data.data;
};

/**
 * Get child options for a parent category/value
 */
export const getChildDropdownOptions = async (
  parentCategory: string,
  parentValue: string,
  includeInactive = false
): Promise<DropdownOption[]> => {
  const response = await apiClient.get<DropdownOptionsResponse>(
    `${BASE_URL}/${parentCategory}/children/${parentValue}`,
    { params: { includeInactive } }
  );
  return response.data.data;
};

/**
 * Get multiple categories at once
 */
export const getMultipleDropdownCategories = async (
  categories: string[],
  includeInactive = false
): Promise<Record<string, DropdownOption[]>> => {
  const response = await apiClient.post<DropdownMultipleCategoriesResponse>(
    `${BASE_URL}/bulk`,
    { categories, includeInactive }
  );
  return response.data.data;
};

/**
 * Get all available dropdown categories with counts
 */
export const getAllDropdownCategories = async (): Promise<DropdownCategory[]> => {
  const response = await apiClient.get<DropdownCategoriesResponse>(
    `${BASE_URL}/categories`
  );
  return response.data.data;
};

// ============================================
// ADMIN APIs (Authentication required)
// ============================================

/**
 * Get all options with pagination for admin management
 */
export const getAdminDropdownOptions = async (params: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}): Promise<AdminDropdownOptionsResponse["data"]> => {
  const response = await apiClient.get<AdminDropdownOptionsResponse>(
    `${BASE_URL}/admin/all`,
    { params }
  );
  return response.data.data;
};

/**
 * Create a new dropdown option
 */
export const createDropdownOption = async (
  data: CreateDropdownOptionRequest
): Promise<DropdownOption> => {
  const response = await apiClient.post<{ data: DropdownOption }>(BASE_URL, data);
  return response.data.data;
};

/**
 * Update a dropdown option
 */
export const updateDropdownOption = async (
  id: string,
  data: UpdateDropdownOptionRequest
): Promise<DropdownOption> => {
  const response = await apiClient.put<{ data: DropdownOption }>(
    `${BASE_URL}/${id}`,
    data
  );
  return response.data.data;
};

/**
 * Delete a dropdown option
 */
export const deleteDropdownOption = async (id: string): Promise<void> => {
  await apiClient.delete(`${BASE_URL}/${id}`);
};

/**
 * Bulk create options for a category
 */
export const bulkCreateDropdownOptions = async (
  data: BulkCreateDropdownRequest
): Promise<{ insertedCount: number; options: DropdownOption[] }> => {
  const response = await apiClient.post<{
    data: { insertedCount: number; options: DropdownOption[] };
  }>(`${BASE_URL}/bulk-create`, data);
  return response.data.data;
};

/**
 * Update sort order for multiple options
 */
export const updateDropdownSortOrder = async (
  updates: SortOrderUpdate[]
): Promise<void> => {
  await apiClient.put(`${BASE_URL}/sort-order`, { updates });
};

/**
 * Toggle option active status
 */
export const toggleDropdownActive = async (
  id: string
): Promise<DropdownOption> => {
  const response = await apiClient.patch<{ data: DropdownOption }>(
    `${BASE_URL}/${id}/toggle-active`
  );
  return response.data.data;
};

/**
 * Delete entire category
 */
export const deleteDropdownCategory = async (
  category: string
): Promise<{ deletedCount: number }> => {
  const response = await apiClient.delete<{ data: { deletedCount: number } }>(
    `${BASE_URL}/category/${category}`,
    { params: { confirm: "true" } }
  );
  return response.data.data;
};

// ============================================
// HOOKS HELPER - For use with React Query
// ============================================

export const dropdownQueryKeys = {
  all: ["dropdowns"] as const,
  categories: () => [...dropdownQueryKeys.all, "categories"] as const,
  category: (category: string) =>
    [...dropdownQueryKeys.all, "category", category] as const,
  children: (parentCategory: string, parentValue: string) =>
    [...dropdownQueryKeys.all, "children", parentCategory, parentValue] as const,
  multiple: (categories: string[]) =>
    [...dropdownQueryKeys.all, "multiple", ...categories] as const,
  admin: (params: Record<string, unknown>) =>
    [...dropdownQueryKeys.all, "admin", params] as const,
};

export default {
  getDropdownOptions,
  getChildDropdownOptions,
  getMultipleDropdownCategories,
  getAllDropdownCategories,
  getAdminDropdownOptions,
  createDropdownOption,
  updateDropdownOption,
  deleteDropdownOption,
  bulkCreateDropdownOptions,
  updateDropdownSortOrder,
  toggleDropdownActive,
  deleteDropdownCategory,
  dropdownQueryKeys,
};
