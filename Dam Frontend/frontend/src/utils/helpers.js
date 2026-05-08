/**
 * Format file size from bytes to human-readable string
 */
export const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
};

/**
 * Format date to readable string
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Get asset type from mimetype
 */
export const getAssetType = (mimetype) => {
  if (!mimetype) return 'unknown';
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype === 'application/pdf') return 'pdf';
  if (mimetype.startsWith('video/')) return 'video';
  return 'unknown';
};

/**
 * Get badge class based on asset type
 */
export const getTypeBadgeClass = (mimetype) => {
  const type = getAssetType(mimetype);
  const classes = {
    image: 'badge-image',
    pdf: 'badge-pdf',
    video: 'badge-video',
    unknown: 'badge-default',
  };
  return classes[type] || 'badge-default';
};

/**
 * Get display label for mimetype
 */
export const getMimeLabel = (mimetype) => {
  const labels = {
    'image/jpeg': 'JPEG',
    'image/jpg': 'JPEG',
    'image/png': 'PNG',
    'application/pdf': 'PDF',
    'video/mp4': 'MP4',
  };
  return labels[mimetype] || mimetype?.split('/')[1]?.toUpperCase() || 'FILE';
};

/**
 * Truncate filename for display
 */
export const truncateFilename = (name, maxLen = 30) => {
  if (!name || name.length <= maxLen) return name;
  const ext = name.split('.').pop();
  const base = name.slice(0, maxLen - ext.length - 4);
  return `${base}...${ext}`;
};

/**
 * Validate file before upload
 */
export const validateFile = (file) => {
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'video/mp4'];
  const MAX_SIZE = 20 * 1024 * 1024; // 20MB

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: `${file.type} is not supported. Use JPG, PNG, PDF, or MP4.` };
  }
  if (file.size > MAX_SIZE) {
    return { valid: false, error: `File exceeds 20MB limit (${formatFileSize(file.size)}).` };
  }
  return { valid: true };
};