
/**
 * Resolves the image path based on the provided source string.
 * Handles remote URLs (http/https) and local paths.
 * 
 * @param src - The source string for the image
 * @returns The resolved image URL
 */
export const resolveImagePath = (src?: string): string => {
  if (!src) return '';
  
  // Remote resources
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }
  
  // Local resources (absolute path)
  if (src.startsWith('/')) {
    return src;
  }
  
  // Local resources (relative path) - Assumes assets are in public directory
  // You might want to adjust this logic based on your specific asset organization
  return `/${src}`;
};
