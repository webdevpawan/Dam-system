import React from 'react';

/**
 * SkeletonCard - shimmer placeholder for asset card loading
 */
const SkeletonCard = () => (
  <div className="card animate-pulse">
    {/* Thumbnail area */}
    <div className="aspect-video bg-surface-800 shimmer" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-surface-700 shimmer rounded-lg w-3/4" />
      <div className="h-3 bg-surface-800 shimmer rounded-lg w-1/2" />
      <div className="flex gap-2 pt-1">
        <div className="h-5 w-12 bg-surface-700 shimmer rounded-lg" />
        <div className="h-5 w-16 bg-surface-700 shimmer rounded-lg" />
      </div>
      <div className="flex gap-2 pt-2">
        <div className="h-8 flex-1 bg-surface-700 shimmer rounded-lg" />
        <div className="h-8 flex-1 bg-surface-700 shimmer rounded-lg" />
      </div>
    </div>
  </div>
);

/**
 * SkeletonGrid - renders N skeleton cards in a grid
 */
const SkeletonGrid = ({ count = 8 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export { SkeletonCard, SkeletonGrid };
export default SkeletonGrid;