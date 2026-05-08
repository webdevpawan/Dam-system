import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

// Response interceptor for unified error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

/**
 * Upload a new asset with progress tracking
 * @param {FormData} formData - File + tags
 * @param {Function} onProgress - Progress callback (0-100)
 */
export const uploadAsset = (formData, onProgress) => {
  return api.post('/assets/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      const percent = Math.round(
        (progressEvent.loaded * 100) / (progressEvent.total || 1)
      );
      if (onProgress) onProgress(percent);
    },
  });
};

/**
 * Fetch all assets with optional filters and pagination
 * @param {Object} params - { type, tag, search, page, limit }
 */
export const getAssets = (params = {}) => {
  return api.get('/assets', { params });
};

/**
 * Fetch a single asset by ID
 * @param {string} id
 */
export const getAssetById = (id) => {
  return api.get(`/assets/${id}`);
};

/**
 * Delete an asset by ID
 * @param {string} id
 */
export const deleteAsset = (id) => {
  return api.delete(`/assets/${id}`);
};

/**
 * Fetch all unique tags
 */
export const getAllTags = () => {
  return api.get('/assets/tags');
};

export default api;