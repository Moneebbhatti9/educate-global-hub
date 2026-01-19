/**
 * Download Helper Utility
 * Handles file downloads from various sources including Cloudinary
 */

/**
 * Check if URL is from Cloudinary
 */
export function isCloudinaryUrl(url: string): boolean {
  return url.includes('cloudinary.com');
}

/**
 * Transform Cloudinary URL to force download
 * Adds fl_attachment flag to the URL
 */
export function getCloudinaryDownloadUrl(url: string): string {
  // Check if already has fl_attachment
  if (url.includes('fl_attachment')) {
    return url;
  }

  // Pattern to match Cloudinary URL structure
  // https://res.cloudinary.com/{cloud_name}/{resource_type}/upload/{transformations}/{version}/{public_id}
  // Match any resource type (image, video, raw, auto, etc.)
  const cloudinaryPattern = /(https:\/\/res\.cloudinary\.com\/[^\/]+\/[^\/]+\/upload\/)(.*)/;
  const match = url.match(cloudinaryPattern);

  if (match) {
    const baseUrl = match[1];
    const rest = match[2];

    // Insert fl_attachment transformation
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
 * Download file with proper handling for different sources
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
    // For Cloudinary URLs, use direct download with fl_attachment
    if (isCloudinaryUrl(url)) {
      const downloadUrl = getCloudinaryDownloadUrl(url);

      // Use direct link approach for Cloudinary
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      // Don't use target="_blank" as it opens in new tab instead of downloading
      link.style.display = 'none';

      document.body.appendChild(link);
      link.click();

      // Clean up after a short delay
      setTimeout(() => {
        document.body.removeChild(link);
      }, 100);

      options.onSuccess?.();
      return;
    }

    // For other URLs, try fetch + blob approach
    if (url.startsWith('http://') || url.startsWith('https://')) {
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/octet-stream',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
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
      } catch (fetchError) {
        console.error('Fetch failed, trying direct download:', fetchError);

        // Fallback to direct download
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        // Don't use target="_blank" to avoid opening in new tab
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();

        setTimeout(() => {
          document.body.removeChild(link);
        }, 100);

        options.onSuccess?.();
      }
    } else {
      // For relative URLs
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      options.onSuccess?.();
    }
  } catch (error) {
    console.error('Download error:', error);
    const errorObj = error instanceof Error ? error : new Error('Download failed');
    options.onError?.(errorObj);
    throw errorObj;
  }
}
