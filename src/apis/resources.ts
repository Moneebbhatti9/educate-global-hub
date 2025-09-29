import { apiHelpers } from "./client";
import type {
  Resource,
  CreateResourceRequest,
  UpdateResourceRequest,
  UpdateResourceStatusRequest,
  MyResourcesQueryParams,
  MyResourcesResponse,
  TeacherResource,
  AdminResourcesQueryParams,
  AdminResource,
  AdminResourcesResponse,
  GetAllResourcesQueryParams,
  PaginatedResponse,
  PublicResource,
  PublicResourcesResponse,
} from "../types/resource";
import type { ApiResponse } from "../types/auth";

// API endpoints
const RESOURCE_ENDPOINTS = {
  // Resource Management (Teacher Only)
  CREATE_RESOURCE: "/resources/create-resource",
  UPDATE_RESOURCE: "/resources/update-resource",
  UPDATE_RESOURCE_STATUS: "/resources/update-status",
  GET_MY_RESOURCES: "/resources/my-resource-page",
  DELETE_RESOURCE: "/resources/delete-resource",
  
  // Admin Resource Management
  GET_ADMIN_RESOURCES: "adminDashboard/admin-resources",
  
  // Resource Search & Viewing (Public)
  GET_ALL_RESOURCES: "/resources/get-all-resources",
  GET_RESOURCE_BY_ID: "/resources/get-resource-by-id",
} as const;

// Resources API functions
export const resourcesAPI = {
  // Create Resource
  createResource: async (
    data: CreateResourceRequest
  ): Promise<ApiResponse<Resource>> => {
    try {
      // Safety checks for required fields
      if (!data) {
        throw new Error("Resource data is required");
      }

      if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
        throw new Error("Title is required and must be a non-empty string");
      }

      if (!data.description || typeof data.description !== 'string' || data.description.trim().length === 0) {
        throw new Error("Description is required and must be a non-empty string");
      }

      if (!data.type || typeof data.type !== 'string') {
        throw new Error("Resource type is required");
      }

      if (!data.ageRange || typeof data.ageRange !== 'string') {
        throw new Error("Age range is required");
      }

      if (!data.curriculum || typeof data.curriculum !== 'string') {
        throw new Error("Curriculum is required");
      }

      if (!data.subject || typeof data.subject !== 'string') {
        throw new Error("Subject is required");
      }

      // Safety checks for files
      if (!data.banner || !(data.banner instanceof File)) {
        throw new Error("Banner image is required and must be a valid file");
      }

      if (!data.previews || !Array.isArray(data.previews) || data.previews.length === 0) {
        throw new Error("At least one preview image is required");
      }

      if (!data.files || !Array.isArray(data.files) || data.files.length === 0) {
        throw new Error("At least one resource file is required");
      }

      // Validate file sizes and types
      const maxBannerSize = 5 * 1024 * 1024; // 5MB
      if (data.banner.size > maxBannerSize) {
        throw new Error("Banner image must be under 5MB");
      }

      const maxPreviewSize = 3 * 1024 * 1024; // 3MB per preview
      for (const preview of data.previews) {
        if (!(preview instanceof File)) {
          throw new Error("All preview images must be valid files");
        }
        if (preview.size > maxPreviewSize) {
          throw new Error(`Preview image ${preview.name} must be under 3MB`);
        }
      }

      const maxResourceSize = 500 * 1024 * 1024; // 500MB total
      let totalResourceSize = 0;
      for (const file of data.files) {
        if (!(file instanceof File)) {
          throw new Error("All resource files must be valid files");
        }
        totalResourceSize += file.size;
      }
      if (totalResourceSize > maxResourceSize) {
        throw new Error("Total resource files size must be under 500MB");
      }

      // Safety check for paid resources
      if (!data.isFree && (!data.price || data.price <= 0)) {
        throw new Error("Price is required for paid resources and must be greater than 0");
      }

      const formData = new FormData();
      
      // Add required text fields with safety checks
      formData.append("title", data.title.trim());
      formData.append("description", data.description.trim());
      formData.append("resourceType", data.type);
      formData.append("ageRange", data.ageRange);
      formData.append("curriculum", data.curriculum);
      formData.append("curriculumType", data.curriculumType);
      formData.append("subject", data.subject);
      formData.append("isFree", data.isFree.toString());
      formData.append("saveAsDraft", data.saveAsDraft.toString());
      
      // Add optional fields with safety checks
      if (data.publishing && typeof data.publishing === 'string') {
        formData.append("visibility", data.publishing);
      }
      if (data.price && typeof data.price === 'number' && data.price > 0) {
        formData.append("price", data.price.toString());
      }
      if (data.currency && typeof data.currency === 'string') {
        formData.append("currency", data.currency);
      }
      
      // Add files with safety checks
      formData.append("banner", data.banner);
      data.previews.forEach((file) => {
        if (file instanceof File) {
          formData.append("previews", file);
        }
      });
      data.files.forEach((file) => {
        if (file instanceof File) {
          formData.append("files", file);
        }
      });
      
      return await apiHelpers.upload<ApiResponse<Resource>>(
        RESOURCE_ENDPOINTS.CREATE_RESOURCE,
        formData
      );
    } catch (error) {
      console.error("Error in createResource:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to create resource",
        data: undefined
      };
    }
  },

  // Get My Resources
  getMyResources: async (
    params: MyResourcesQueryParams = {}
  ): Promise<ApiResponse<MyResourcesResponse>> => {
    try {
      // Safety checks for parameters
      if (!params || typeof params !== 'object') {
        throw new Error("Parameters must be a valid object");
      }

      const queryParams = new URLSearchParams();
      
      // Add optional query parameters with safety checks
      if (params.search && typeof params.search === 'string' && params.search.trim().length > 0) {
        queryParams.append("search", params.search.trim());
      }
      if (params.status && typeof params.status === 'string' && params.status.trim().length > 0) {
        queryParams.append("status", params.status.trim());
      }
      if (params.page && typeof params.page === 'number' && params.page > 0) {
        queryParams.append("page", params.page.toString());
      }
      if (params.limit && typeof params.limit === 'number' && params.limit > 0 && params.limit <= 100) {
        queryParams.append("limit", params.limit.toString());
      }

      const url = `${RESOURCE_ENDPOINTS.GET_MY_RESOURCES}${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;
      
      const response = await apiHelpers.get<ApiResponse<MyResourcesResponse>>(url);
      
      // Safety check for response structure
      if (!response || typeof response !== 'object') {
        throw new Error("Invalid response format from server");
      }

      return response;
    } catch (error) {
      console.error("Error in getMyResources:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to fetch resources",
        data: undefined
      };
    }
  },

  // Get Admin Resources
  getAdminResources: async (
    params: AdminResourcesQueryParams = {}
  ): Promise<ApiResponse<AdminResourcesResponse>> => {
    try {
      // Safety checks for parameters
      if (!params || typeof params !== 'object') {
        throw new Error("Parameters must be a valid object");
      }

      const queryParams = new URLSearchParams();
      
      // Add optional query parameters with safety checks
      if (params.search && typeof params.search === 'string' && params.search.trim().length > 0) {
        queryParams.append("search", params.search.trim());
      }
      if (params.status && typeof params.status === 'string' && params.status.trim().length > 0) {
        queryParams.append("status", params.status.trim());
      }
      if (params.subject && typeof params.subject === 'string' && params.subject.trim().length > 0) {
        queryParams.append("subject", params.subject.trim());
      }
      if (params.authorId && typeof params.authorId === 'string' && params.authorId.trim().length > 0) {
        queryParams.append("authorId", params.authorId.trim());
      }
      if (params.page && typeof params.page === 'number' && params.page > 0) {
        queryParams.append("page", params.page.toString());
      }
      if (params.limit && typeof params.limit === 'number' && params.limit > 0 && params.limit <= 100) {
        queryParams.append("limit", params.limit.toString());
      }

      const url = `${RESOURCE_ENDPOINTS.GET_ADMIN_RESOURCES}${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;
      
      const response = await apiHelpers.get<ApiResponse<AdminResourcesResponse>>(url);
      
      // Safety check for response structure
      if (!response || typeof response !== 'object') {
        throw new Error("Invalid response format from server");
      }

      return response;
    } catch (error) {
      console.error("Error in getAdminResources:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to fetch admin resources",
        data: undefined
      };
    }
  },

  // Update Resource
  updateResource: async (
    resourceId: string,
    data: UpdateResourceRequest
  ): Promise<ApiResponse<Resource>> => {
    try {
      // Safety checks for resourceId
      if (!resourceId || typeof resourceId !== 'string' || resourceId.trim().length === 0) {
        throw new Error("Resource ID is required and must be a valid string");
      }

      // Safety checks for data
      if (!data || typeof data !== 'object') {
        throw new Error("Update data is required and must be a valid object");
      }

      const formData = new FormData();
      
      // Add text fields with safety checks
      if (data.title && typeof data.title === 'string' && data.title.trim().length > 0) {
        formData.append("title", data.title.trim());
      }
      if (data.description && typeof data.description === 'string' && data.description.trim().length > 0) {
        formData.append("description", data.description.trim());
      }
      if (data.type && typeof data.type === 'string') {
        formData.append("type", data.type);
      }
      if (data.publishing && typeof data.publishing === 'string') {
        formData.append("publishing", data.publishing);
      }
      if (data.isFree !== undefined && typeof data.isFree === 'boolean') {
        formData.append("isFree", data.isFree.toString());
      }
      if (data.price && typeof data.price === 'number' && data.price > 0) {
        formData.append("price", data.price.toString());
      }
      if (data.currency && typeof data.currency === 'string') {
        formData.append("currency", data.currency);
      }
      if (data.ageRange && typeof data.ageRange === 'string') {
        formData.append("ageRange", data.ageRange);
      }
      if (data.curriculum && typeof data.curriculum === 'string') {
        formData.append("curriculum", data.curriculum);
      }
      if (data.curriculumType && typeof data.curriculumType === 'string') {
        formData.append("curriculumType", data.curriculumType);
      }
      if (data.subject && typeof data.subject === 'string') {
        formData.append("subject", data.subject);
      }
      if (data.status && typeof data.status === 'string') {
        formData.append("status", data.status);
      }
      
      // Add files with safety checks
      if (data.coverPhoto && data.coverPhoto instanceof File) {
        // Validate file size
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (data.coverPhoto.size > maxSize) {
          throw new Error("Cover photo must be under 5MB");
        }
        formData.append("coverPhoto", data.coverPhoto);
      }
      if (data.previewImages && Array.isArray(data.previewImages)) {
        const maxSize = 3 * 1024 * 1024; // 3MB per image
        for (const file of data.previewImages) {
          if (!(file instanceof File)) {
            throw new Error("All preview images must be valid files");
          }
          if (file.size > maxSize) {
            throw new Error(`Preview image ${file.name} must be under 3MB`);
          }
          formData.append("previewImages", file);
        }
      }
      if (data.mainFile && data.mainFile instanceof File) {
        const maxSize = 500 * 1024 * 1024; // 500MB
        if (data.mainFile.size > maxSize) {
          throw new Error("Main file must be under 500MB");
        }
        formData.append("mainFile", data.mainFile);
      }
      
      return await apiHelpers.put<ApiResponse<Resource>>(
        `${RESOURCE_ENDPOINTS.UPDATE_RESOURCE}/${resourceId.trim()}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } catch (error) {
      console.error("Error in updateResource:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to update resource",
        data: undefined
      };
    }
  },

  // Update Resource Status
  updateResourceStatus: async (
    resourceId: string,
    data: UpdateResourceStatusRequest
  ): Promise<ApiResponse<Resource>> => {
    try {
      // Safety checks for resourceId
      if (!resourceId || typeof resourceId !== 'string' || resourceId.trim().length === 0) {
        throw new Error("Resource ID is required and must be a valid string");
      }

      // Safety checks for data
      if (!data || typeof data !== 'object') {
        throw new Error("Status data is required and must be a valid object");
      }

      if (!data.status || typeof data.status !== 'string') {
        throw new Error("Status is required and must be a valid string");
      }

      // Validate status value
      const validStatuses = ["draft", "pending", "approved", "rejected"];
      if (!validStatuses.includes(data.status)) {
        throw new Error(`Status must be one of: ${validStatuses.join(", ")}`);
      }

      const requestBody = {
        status: data.status
      };

      return await apiHelpers.patch<ApiResponse<Resource>>(
        `${RESOURCE_ENDPOINTS.UPDATE_RESOURCE_STATUS}/${resourceId.trim()}`,
        requestBody
      );
    } catch (error) {
      console.error("Error in updateResourceStatus:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to update resource status",
        data: undefined
      };
    }
  },

  // Delete Resource
  deleteResource: async (resourceId: string): Promise<ApiResponse<void>> => {
    try {
      // Safety checks for resourceId
      if (!resourceId || typeof resourceId !== 'string' || resourceId.trim().length === 0) {
        throw new Error("Resource ID is required and must be a valid string");
      }

      return await apiHelpers.delete<ApiResponse<void>>(
        `${RESOURCE_ENDPOINTS.DELETE_RESOURCE}/${resourceId.trim()}`
      );
    } catch (error) {
      console.error("Error in deleteResource:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to delete resource",
        data: undefined
      };
    }
  },

  // Get All Resources (Public)
  getAllResources: async (
    params: GetAllResourcesQueryParams = {}
  ): Promise<ApiResponse<PublicResourcesResponse>> => {
    try {
      // Safety checks for parameters
      if (!params || typeof params !== 'object') {
        throw new Error("Parameters must be a valid object");
      }

      const queryParams = new URLSearchParams();
      
      // Add optional query parameters with safety checks
      if (params.q && typeof params.q === 'string' && params.q.trim().length > 0) {
        queryParams.append("q", params.q.trim());
      }
      if (params.subject && typeof params.subject === 'string' && params.subject.trim().length > 0) {
        queryParams.append("subject", params.subject.trim());
      }
      if (params.page && typeof params.page === 'number' && params.page > 0) {
        queryParams.append("page", params.page.toString());
      }
      if (params.limit && typeof params.limit === 'number' && params.limit > 0 && params.limit <= 100) {
        queryParams.append("limit", params.limit.toString());
      }

      const url = `${RESOURCE_ENDPOINTS.GET_ALL_RESOURCES}${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;
      
      const response = await apiHelpers.get<ApiResponse<PublicResourcesResponse>>(url);
      
      // Safety check for response structure
      if (!response || typeof response !== 'object') {
        throw new Error("Invalid response format from server");
      }

      return response;
    } catch (error) {
      console.error("Error in getAllResources:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to fetch resources",
        data: undefined
      };
    }
  },

  // Get Resource by ID (Public)
  getResourceById: async (resourceId: string): Promise<ApiResponse<Resource>> => {
    try {
      // Safety checks for resourceId
      if (!resourceId || typeof resourceId !== 'string' || resourceId.trim().length === 0) {
        throw new Error("Resource ID is required and must be a valid string");
      }

      const response = await apiHelpers.get<ApiResponse<Resource>>(
        `${RESOURCE_ENDPOINTS.GET_RESOURCE_BY_ID}/${resourceId.trim()}`
      );
      
      // Safety check for response structure
      if (!response || typeof response !== 'object') {
        throw new Error("Invalid response format from server");
      }

      return response;
    } catch (error) {
      console.error("Error in getResourceById:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to fetch resource",
        data: undefined
      };
    }
  },
};
