import React from 'react';

/**
 * Pagination - page navigation controls
 */
const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { page, totalPages, total, limit } = pagination;
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const pages = [];
  const delta = 2;
  for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) {
    pages.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
      <p className="text-sm text-surface-500">
        Showing <span className="text-surface-300">{start}–{end}</span> of{' '}
        <span className="text-surface-300">{total}</span> assets
      </p>

      <div className="flex items-center gap-1.5">
        {/* Prev */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!pagination.hasPrevPage}
          className="p-2 rounded-lg bg-surface-800 border border-surface-700 text-surface-400
                     hover:text-surface-100 hover:border-surface-600 disabled:opacity-30
                     disabled:cursor-not-allowed transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* First page if not visible */}
        {pages[0] > 1 && (
          <>
            <button onClick={() => onPageChange(1)} className={pageButtonClass(1 === page)}>1</button>
            {pages[0] > 2 && <span className="text-surface-600 px-1">…</span>}
          </>
        )}

        {/* Page numbers */}
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={pageButtonClass(p === page)}
          >
            {p}
          </button>
        ))}

        {/* Last page if not visible */}
        {pages[pages.length - 1] < totalPages && (
          <>
            {pages[pages.length - 1] < totalPages - 1 && (
              <span className="text-surface-600 px-1">…</span>
            )}
            <button onClick={() => onPageChange(totalPages)} className={pageButtonClass(totalPages === page)}>
              {totalPages}
            </button>
          </>
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!pagination.hasNextPage}
          className="p-2 rounded-lg bg-surface-800 border border-surface-700 text-surface-400
                     hover:text-surface-100 hover:border-surface-600 disabled:opacity-30
                     disabled:cursor-not-allowed transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const pageButtonClass = (active) =>
  `min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-all
   ${active
    ? 'bg-brand-600 text-white border border-brand-500 shadow-lg shadow-brand-900/40'
    : 'bg-surface-800 text-surface-400 border border-surface-700 hover:text-surface-100 hover:border-surface-600'
   }`;

export default Pagination;