/**
 * Download Helper Utility
 * Handles file downloads from various sources including Cloudinary
 * Enhanced: Fixed Cloudinary PDF download issues
 */

import { secureStorage } from '@/helpers/storage';
import { STORAGE_KEYS } from '@/types/auth';

/**
 * Check if URL is from Cloudinary
 */
export function isCloudinaryUrl(url: string): boolean {
  return url.includes('cloudinary.com');
}

/**
 * Check if the file is a document type (PDF, DOCX, etc.)
 */
export function isDocumentFile(url: string): boolean {
  const documentExtensions = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx', '.zip', '.rar'];
  const lowerUrl = url.toLowerCase();
  return documentExtensions.some(ext => lowerUrl.includes(ext));
}

/**
 * Get the proper Cloudinary URL for downloading
 * Note: fl_attachment doesn't work reliably for documents, so we use a different approach
 */
export function getCloudinaryDownloadUrl(url: string): string {
  // For documents (PDF, DOCX, etc.), don't use fl_attachment as it causes errors
  // Instead, return the original URL - we'll handle the download differently
  if (isDocumentFile(url)) {
    return url;
  }

  // Check if already has fl_attachment
  if (url.includes('fl_attachment')) {
    return url;
  }

  // Pattern to match Cloudinary URL structure for images
  const cloudinaryPattern = /(https:\/\/res\.cloudinary\.com\/[^\/]+\/[^\/]+\/upload\/)(.*)/;
  const match = url.match(cloudinaryPattern);

  if (match) {
    const baseUrl = match[1];
    const rest = match[2];
    // Only add fl_attachment for non-document files (images, etc.)
    return `${baseUrl}fl_attachment/${rest}`;
  }

  return url;
}

/**
 * Extract filename from URL or use default
 */
export function getFilenameFromUrl(url: string, defaultTitle: string = 'resource'): string {
  try {
    // Get the last part of the URL path
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const parts = pathname.split('/');
    const lastPart = parts[parts.length - 1];

    // Extract extension
    const extensionMatch = lastPart.match(/\.([a-zA-Z0-9]+)$/);
    const extension = extensionMatch ? extensionMatch[1] : 'pdf';

    // Clean the title
    const cleanTitle = defaultTitle
      .replace(/[^a-zA-Z0-9\s-]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 100);

    return `${cleanTitle}.${extension}`;
  } catch (error) {
    console.error('Error extracting filename:', error);
    return `${defaultTitle}.pdf`;
  }
}

/**
 * Download file using the backend proxy (for secure downloads)
 * This is the recommended approach for Cloudinary documents
 * Uses the /file endpoint which streams the file with proper headers
 */
export async function downloadViaBackend(
  resourceId: string,
  filename: string,
  options: {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
    onProgress?: (progress: number) => void;
  } = {}
): Promise<void> {
  try {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
    const token = secureStorage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);

    // Use the proxy download endpoint that streams the file directly
    const response = await fetch(`${API_BASE_URL}/sales/download/${resourceId}/file`, {
      method: 'GET',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      // Try to get error message from response
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Download failed with status ${response.status}`);
      }
      throw new Error(`Download failed with status ${response.status}`);
    }

    // Get the blob from the response
    const blob = await response.blob();

    // Get filename from Content-Disposition header if available
    const contentDisposition = response.headers.get('content-disposition');
    let downloadFilename = filename;
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?([^";\n]+)"?/);
      if (filenameMatch) {
        downloadFilename = filenameMatch[1];
      }
    }

    // Create download link
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = downloadFilename;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    }, 100);

    options.onSuccess?.();
  } catch (error) {
    console.error('Backend download error:', error);
    const errorObj = error instanceof Error ? error : new Error('Download failed');
    options.onError?.(errorObj);
    throw errorObj;
  }
}

/**
 * Download file directly from URL
 * Handles both Cloudinary and other sources
 */
async function downloadFileDirectly(
  url: string,
  filename: string,
  options: {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
  } = {}
): Promise<void> {
  // For Cloudinary documents, we need to use fetch + blob approach
  // because direct links with fl_attachment don't work for PDFs
  if (isCloudinaryUrl(url) && isDocumentFile(url)) {
    try {
      // Try to fetch the file as a blob
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.status}`);
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      link.style.display = 'none';

      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      }, 100);

      options.onSuccess?.();
      return;
    } catch (fetchError) {
      console.warn('Fetch blob failed, opening in new tab:', fetchError);
      // Fallback: Open in new tab and let browser handle download
      window.open(url, '_blank');
      options.onSuccess?.();
      return;
    }
  }

  // For Cloudinary images/videos, use fl_attachment
  if (isCloudinaryUrl(url)) {
    const downloadUrl = getCloudinaryDownloadUrl(url);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
    }, 100);

    options.onSuccess?.();
    return;
  }

  // For other URLs, use standard approach
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();

  setTimeout(() => {
    document.body.removeChild(link);
  }, 100);

  options.onSuccess?.();
}

/**
 * Download file with proper handling for different sources
 * Enhanced: Better handling for Cloudinary PDFs and documents
 */
export async function downloadFile(
  url: string,
  filename: string,
  options: {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
  } = {}
): Promise<void> {
  try {
    await downloadFileDirectly(url, filename, options);
  } catch (error) {
    console.error('Download error:', error);
    const errorObj = error instanceof Error ? error : new Error('Download failed');
    options.onError?.(errorObj);
    throw errorObj;
  }
}
