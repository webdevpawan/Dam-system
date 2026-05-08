import { useState, useEffect, useCallback, useRef } from 'react';
import { getAssets, getAllTags, deleteAsset as deleteAssetAPI } from '../services/assetService';

/**
 * useAssets - manages asset list state, filtering, pagination, and deletion
 */
const useAssets = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [tags, setTags] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    tag: '',
    page: 1,
    limit: 12,
  });

  const debounceRef = useRef(null);

  const fetchAssets = useCallback(async (params) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAssets(params);
      setAssets(response.data.data);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTags = useCallback(async () => {
    try {
      const response = await getAllTags();
      setTags(response.data.data);
    } catch {
      // Tags failing is non-critical
    }
  }, []);

  // Debounced search
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const cleanParams = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== '' && v !== null)
      );
      fetchAssets(cleanParams);
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [filters, fetchAssets]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: key !== 'page' ? 1 : value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ search: '', type: '', tag: '', page: 1, limit: 12 });
  }, []);

  const deleteAsset = useCallback(async (id) => {
    try {
      await deleteAssetAPI(id);
      setAssets((prev) => prev.filter((a) => a._id !== id));
      setPagination((prev) => prev ? { ...prev, total: prev.total - 1 } : prev);
      return true;
    } catch (err) {
      throw new Error(err.message);
    }
  }, []);

  const refetch = useCallback(() => {
    const cleanParams = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== '')
    );
    fetchAssets(cleanParams);
    fetchTags();
  }, [filters, fetchAssets, fetchTags]);

  return {
    assets,
    loading,
    error,
    pagination,
    filters,
    tags,
    updateFilter,
    resetFilters,
    deleteAsset,
    refetch,
  };
};

export default useAssets;