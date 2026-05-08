import React, { useState } from 'react';
import AssetThumbnail from './AssetThumbnail';
import {
  formatFileSize,
  formatDate,
  getTypeBadgeClass,
  getMimeLabel,
  truncateFilename,
} from '../utils/helpers';

/**
 * AssetCard - displays a single asset in the grid
 */
const AssetCard = ({ asset, onDelete }) => {
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000); // Auto-cancel after 3s
      return;
    }
    try {
      setDeleting(true);
      await onDelete(asset._id);
    } catch {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  const handleView = () => {
    window.open(asset.fileUrl, '_blank', 'noopener,noreferrer');
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = asset.fileUrl;
    link.download = asset.originalName;
    link.click();
  };

  return (
    <div className="card-hover group flex flex-col animate-scale-in">
      {/* Thumbnail */}
      <div className="aspect-video relative">
        <AssetThumbnail asset={asset} className="aspect-video w-full" />
        {/* Hover overlay with quick actions */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
          <button
            onClick={handleView}
            className="p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-all"
            title="View file"
          >
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button
            onClick={handleDownload}
            className="p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-all"
            title="Download"
          >
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Card body */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        {/* File info */}
        <div>
          <h3
            className="text-surface-100 font-display font-semibold text-sm leading-snug mb-1"
            title={asset.originalName}
          >
            {truncateFilename(asset.originalName, 32)}
          </h3>
          <div className="flex items-center gap-2 text-xs text-surface-500">
            <span>{formatFileSize(asset.size)}</span>
            <span className="w-1 h-1 rounded-full bg-surface-700" />
            <span>{formatDate(asset.uploadDate)}</span>
          </div>
        </div>

        {/* Type badge + Tags */}
        <div className="flex flex-wrap gap-1.5">
          <span className={getTypeBadgeClass(asset.mimetype)}>
            {getMimeLabel(asset.mimetype)}
          </span>
          {asset.tags?.slice(0, 3).map((tag) => (
            <span key={tag} className="badge bg-brand-950/60 text-brand-300 border border-brand-800/40">
              #{tag}
            </span>
          ))}
          {asset.tags?.length > 3 && (
            <span className="badge bg-surface-800 text-surface-500 border border-surface-700">
              +{asset.tags.length - 3}
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-auto pt-1">
          <button
            onClick={handleView}
            className="btn-secondary flex-1 justify-center py-2 text-xs"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View
          </button>
          <button
            onClick={handleDownload}
            className="btn-secondary flex-1 justify-center py-2 text-xs"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Save
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className={`p-2 rounded-lg text-xs font-medium transition-all duration-150 flex-shrink-0
              ${confirmDelete
                ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                : 'bg-surface-800 text-surface-500 border border-surface-700 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20'
              } ${deleting ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={confirmDelete ? 'Click again to confirm' : 'Delete'}
          >
            {deleting ? (
              <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : confirmDelete ? (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssetCard;