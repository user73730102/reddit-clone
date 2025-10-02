// This function will be our single source of truth for creating Cloudinary URLs.
export const buildCloudinaryUrl = (
  publicId?: string,
  resourceType?: string,
  version?: string
): string | null => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!publicId || !resourceType || !cloudName) {
    return null;
  }

  const transformations = resourceType === 'image'
    ? 'q_auto,f_auto,w_auto' // Image-specific optimizations
    : 'q_auto,f_auto';      // Video-specific optimizations

  // Construct the URL parts carefully to avoid double slashes
  const versionPart = version ? `/${version}` : '';
  
  return `https://res.cloudinary.com/${cloudName}/${resourceType}/upload/${transformations}${versionPart}/${publicId}`;
};