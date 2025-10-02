import { apiHelpers } from "./client";
import type {
  Resource,
  CreateResourceRequest,
  UpdateResourceRequest,
  CreateResourceWithUrlsRequest,
  UpdateResourceWithUrlsRequest,
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
  GET_RESOURCE_BY_ID_ADMIN: "/resources/get-resource-by-id-admin",
  
  // Resource Search & Viewing (Public)
  GET_ALL_RESOURCES: "/resources/get-all-resources",
  GET_RESOURCE_BY_ID: "/resources/get-resource-by-id",

  // Upload Document
  UPLOAD_DOCUMENT: "/upload/document",
} as const;

// Upload Document Response Type
export interface UploadDocumentResponse {
  documentUrl: string;
  publicId: string;
}

// Resources API functions
export const resourcesAPI = {
  // Upload Document
  uploadDocument: async (
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<UploadDocumentResponse>> => {
    try {
      // Safety checks for file
      if (!file || !(file instanceof File)) {
        throw new Error("Invalid file: must be a valid File object");
      }

      if (file.size === 0) {
        throw new Error("Invalid file: file is empty");
      }

      const maxSize = 500 * 1024 * 1024; // 500MB
      if (file.size > maxSize) {
        throw new Error("File is too large. Maximum size is 500MB");
      }

      const formData = new FormData();
      formData.append("document", file);

      // Simulate progress for now (in real implementation, use axios onUploadProgress)
      if (onProgress) {
        const progressInterval = setInterval(() => {
          const currentProgress = Math.min(90, Math.random() * 100);
          onProgress(currentProgress);
        }, 200);

        const response = await apiHelpers.upload<ApiResponse<UploadDocumentResponse>>(
          RESOURCE_ENDPOINTS.UPLOAD_DOCUMENT,
          formData
        );

        clearInterval(progressInterval);
        if (onProgress) onProgress(100);

        return response;
      }

      return await apiHelpers.upload<ApiResponse<UploadDocumentResponse>>(
        RESOURCE_ENDPOINTS.UPLOAD_DOCUMENT,
        formData
      );
    } catch (error) {
      console.error("Error in uploadDocument:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to upload document",
        data: undefined
      };
    }
  },

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

      if (!data.resourceType || typeof data.resourceType !== 'string') {
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

      // Safety checks for URLs
      if (!data.coverPhotoUrl || typeof data.coverPhotoUrl !== 'string' || data.coverPhotoUrl.trim().length === 0) {
        throw new Error("Cover photo URL is required");
      }

      if (!data.previewImageUrls || !Array.isArray(data.previewImageUrls) || data.previewImageUrls.length === 0) {
        throw new Error("At least one preview image URL is required");
      }

      if (!data.mainFileUrl || typeof data.mainFileUrl !== 'string' || data.mainFileUrl.trim().length === 0) {
        throw new Error("Main file URL is required");
      }

      // Safety check for paid resources
      if (!data.isFree && (!data.price || data.price <= 0)) {
        throw new Error("Price is required for paid resources and must be greater than 0");
      }

      const requestBody = {
        title: data.title.trim(),
        description: data.description.trim(),
        resourceType: data.resourceType,
        ageRange: data.ageRange,
        curriculum: data.curriculum,
        curriculumType: data.curriculumType || "",
        subject: data.subject,
        isFree: data.isFree,
        saveAsDraft: data.saveAsDraft,
        visibility: data.visibility || "public",
        price: data.isFree ? undefined : data.price,
        currency: data.isFree ? undefined : (data.currency || "USD"),
        coverPhotoUrl: data.coverPhotoUrl.trim(),
        previewImageUrls: data.previewImageUrls.map(url => url.trim()),
        mainFileUrl: data.mainFileUrl.trim(),
      };

      return await apiHelpers.post<ApiResponse<Resource>>(
        RESOURCE_ENDPOINTS.CREATE_RESOURCE,
        requestBody
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

      const requestBody: Record<string, any> = {};

      // Add text fields with safety checks
      if (data.title && typeof data.title === 'string' && data.title.trim().length > 0) {
        requestBody.title = data.title.trim();
      }
      if (data.description && typeof data.description === 'string' && data.description.trim().length > 0) {
        requestBody.description = data.description.trim();
      }
      if (data.type && typeof data.type === 'string') {
        requestBody.type = data.type;
      }
      if (data.publishing && typeof data.publishing === 'string') {
        requestBody.publishing = data.publishing;
      }
      if (data.isFree !== undefined && typeof data.isFree === 'boolean') {
        requestBody.isFree = data.isFree;
      }
      if (data.price && typeof data.price === 'number' && data.price > 0) {
        requestBody.price = data.price;
      }
      if (data.currency && typeof data.currency === 'string') {
        requestBody.currency = data.currency;
      }
      if (data.ageRange && typeof data.ageRange === 'string') {
        requestBody.ageRange = data.ageRange;
      }
      if (data.curriculum && typeof data.curriculum === 'string') {
        requestBody.curriculum = data.curriculum;
      }
      if (data.curriculumType && typeof data.curriculumType === 'string') {
        requestBody.curriculumType = data.curriculumType;
      }
      if (data.subject && typeof data.subject === 'string') {
        requestBody.subject = data.subject;
      }
      if (data.status && typeof data.status === 'string') {
        requestBody.status = data.status;
      }

      // Add URLs with safety checks
      if (data.coverPhotoUrl && typeof data.coverPhotoUrl === 'string' && data.coverPhotoUrl.trim().length > 0) {
        requestBody.coverPhotoUrl = data.coverPhotoUrl.trim();
      }
      if (data.previewImageUrls && Array.isArray(data.previewImageUrls) && data.previewImageUrls.length > 0) {
        requestBody.previewImageUrls = data.previewImageUrls.map(url => url.trim());
      }
      if (data.mainFileUrl && typeof data.mainFileUrl === 'string' && data.mainFileUrl.trim().length > 0) {
        requestBody.mainFileUrl = data.mainFileUrl.trim();
      }

      return await apiHelpers.put<ApiResponse<Resource>>(
        `${RESOURCE_ENDPOINTS.UPDATE_RESOURCE}/${resourceId.trim()}`,
        requestBody
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

  // Get Resource by ID (Admin)
  getResourceByIdAdmin: async (resourceId: string): Promise<ApiResponse<Resource>> => {
    try {
      // Safety checks for resourceId
      if (!resourceId || typeof resourceId !== 'string' || resourceId.trim().length === 0) {
        throw new Error("Resource ID is required and must be a valid string");
      }

      const response = await apiHelpers.get<ApiResponse<Resource>>(
        `${RESOURCE_ENDPOINTS.GET_RESOURCE_BY_ID_ADMIN}/${resourceId.trim()}`
      );
      
      // Safety check for response structure
      if (!response || typeof response !== 'object') {
        throw new Error("Invalid response format from server");
      }

      return response;
    } catch (error) {
      console.error("Error in getResourceByIdAdmin:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to fetch admin resource",
        data: undefined
      };
    }
  },


  // Create Resource with Cloudinary URLs
  createResourceWithUrls: async (
    data: CreateResourceWithUrlsRequest
  ): Promise<ApiResponse<Resource>> => {
    try {
      return await apiHelpers.post<ApiResponse<Resource>>(
        RESOURCE_ENDPOINTS.CREATE_RESOURCE,
        data
      );
    } catch (error) {
      console.error("Error in createResourceWithUrls:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to create resource",
        data: undefined
      };
    }
  },

  // Update Resource with Cloudinary URLs
  updateResourceWithUrls: async (
    resourceId: string,
    data: UpdateResourceWithUrlsRequest
  ): Promise<ApiResponse<Resource>> => {
    try {
      return await apiHelpers.put<ApiResponse<Resource>>(
        `${RESOURCE_ENDPOINTS.UPDATE_RESOURCE}/${resourceId}`,
        data
      );
    } catch (error) {
      console.error("Error in updateResourceWithUrls:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to update resource",
        data: undefined
      };
    }
  },
};
