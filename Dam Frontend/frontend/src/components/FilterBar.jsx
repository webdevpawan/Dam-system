import React from 'react';

const FILE_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'image', label: 'Images' },
  { value: 'pdf', label: 'PDFs' },
  { value: 'video', label: 'Videos' },
];

/**
 * FilterBar - search input + type + tag filters
 */
const FilterBar = ({ filters, tags, onFilterChange, onReset, totalResults }) => {
  const hasActiveFilters = filters.search || filters.type || filters.tag;

  return (
    <div className="card p-4 space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500 pointer-events-none"
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by filename..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="input-field pl-10"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange('search', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-300 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Type filter */}
        <select
          value={filters.type}
          onChange={(e) => onFilterChange('type', e.target.value)}
          className="input-field sm:w-40 cursor-pointer"
        >
          {FILE_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>

        {/* Tag filter */}
        {tags.length > 0 && (
          <select
            value={filters.tag}
            onChange={(e) => onFilterChange('tag', e.target.value)}
            className="input-field sm:w-44 cursor-pointer"
          >
            <option value="">All Tags</option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>#{tag}</option>
            ))}
          </select>
        )}
      </div>

      {/* Active filters + results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-surface-500">
          {totalResults !== undefined && (
            <span>
              <span className="text-surface-200 font-semibold">{totalResults}</span>
              {' '}asset{totalResults !== 1 ? 's' : ''} found
            </span>
          )}
        </p>

        {hasActiveFilters && (
          <button onClick={onReset} className="btn-ghost text-xs gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;