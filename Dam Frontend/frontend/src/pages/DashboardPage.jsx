import React from 'react';
import { Link } from 'react-router-dom';
import useAssets from '../hooks/useAssets';
import useToast from '../hooks/useToast';
import AssetCard from '../components/AssetCard';
import FilterBar from '../components/FilterBar';
import Pagination from '../components/Pagination';
import SkeletonGrid from '../components/Skeleton';
import ToastContainer from '../components/ToastContainer';

/**
 * EmptyState - shown when no assets match current filters
 */
const EmptyState = ({ hasFilters, onReset }) => (
  <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
    <div className="w-20 h-20 bg-surface-800 rounded-3xl flex items-center justify-center mb-6 border border-surface-700">
      {hasFilters ? (
        <svg className="w-9 h-9 text-surface-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ) : (
        <svg className="w-9 h-9 text-surface-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )}
    </div>
    <h3 className="font-display font-bold text-xl text-surface-200 mb-2">
      {hasFilters ? 'No results found' : 'Your vault is empty'}
    </h3>
    <p className="text-surface-500 mb-6 max-w-xs">
      {hasFilters
        ? 'Try adjusting your search or filters to find what you re looking for.'
        : 'Upload your first asset to get started building your digital library.'}
    </p>
    {hasFilters ? (
      <button onClick={onReset} className="btn-secondary">
        Clear filters
      </button>
    ) : (
      <Link to="/upload" className="btn-primary">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 4v16m8-8H4" />
        </svg>
        Upload First Asset
      </Link>
    )}
  </div>
);

/**
 * ErrorState - shown when API fetch fails
 */
const ErrorState = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mb-5">
      <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      </svg>
    </div>
    <h3 className="font-display font-bold text-xl text-surface-200 mb-2">Failed to load assets</h3>
    <p className="text-surface-500 text-sm mb-5 max-w-sm">{message}</p>
    <button onClick={onRetry} className="btn-secondary">
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      Retry
    </button>
  </div>
);

/**
 * DashboardPage - main asset library view
 */
const DashboardPage = () => {
  const { toasts, toast, removeToast } = useToast();
  const {
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
  } = useAssets();

  const handleDelete = async (id) => {
    try {
      await deleteAsset(id);
      toast.success('Asset deleted successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to delete asset');
    }
  };

  const hasFilters = !!(filters.search || filters.type || filters.tag);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-surface-50 tracking-tight">
            Asset Library
          </h1>
          <p className="text-surface-500 mt-1">
            Manage and explore your digital assets
          </p>
        </div>
        <Link to="/upload" className="btn-primary self-start sm:self-auto">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Upload New
        </Link>
      </div>

      {/* Filters */}
      <FilterBar
        filters={filters}
        tags={tags}
        onFilterChange={updateFilter}
        onReset={resetFilters}
        totalResults={pagination?.total}
      />

      {/* Content */}
      {loading ? (
        <SkeletonGrid count={12} />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : assets.length === 0 ? (
        <EmptyState hasFilters={hasFilters} onReset={resetFilters} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {assets.map((asset) => (
              <AssetCard
                key={asset._id}
                asset={asset}
                onDelete={handleDelete}
              />
            ))}
          </div>

          <Pagination
            pagination={pagination}
            onPageChange={(page) => updateFilter('page', page)}
          />
        </>
      )}
    </div>
  );
};

export default DashboardPage;