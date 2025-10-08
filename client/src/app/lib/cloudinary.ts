// This function will be our single source of truth for creating Cloudinary URLs.
export const buildCloudinaryUrl = (
  cloudName: string | undefined, // <-- Accept cloudName as an argument
  publicId?: string,
  resourceType?: string,
  version?: string
): string | null => {
  // The function now no longer depends on process.env directly.
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