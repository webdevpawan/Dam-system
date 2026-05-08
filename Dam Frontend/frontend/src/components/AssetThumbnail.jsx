import React, { useState } from 'react';
import { getAssetType } from '../utils/helpers';

/**
 * PDFIcon - stylized PDF file icon
 */
const PDFIcon = ({ className = '' }) => (
  <div className={`flex items-center justify-center ${className}`}>
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="w-14 h-16 bg-red-500/10 border-2 border-red-500/30 rounded-xl flex items-center justify-center relative">
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500/20 border border-red-500/30 rounded-sm" />
        <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <span className="text-red-400 font-mono text-xs font-semibold tracking-widest">PDF</span>
    </div>
  </div>
);

/**
 * VideoIcon - stylized MP4 file icon
 */
const VideoIcon = ({ className = '' }) => (
  <div className={`flex items-center justify-center ${className}`}>
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="w-14 h-16 bg-violet-500/10 border-2 border-violet-500/30 rounded-xl flex items-center justify-center">
        <svg className="w-7 h-7 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <span className="text-violet-400 font-mono text-xs font-semibold tracking-widest">MP4</span>
    </div>
  </div>
);

/**
 * AssetThumbnail - renders preview thumbnail or type icon based on mimetype
 */
const AssetThumbnail = ({ asset, className = '' }) => {
  const [imgError, setImgError] = useState(false);
  const type = getAssetType(asset.mimetype);

  if (type === 'image' && !imgError) {
    return (
      <div className={`relative overflow-hidden bg-surface-800 ${className}`}>
        <img
          src={asset.fileUrl}
          alt={asset.originalName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImgError(true)}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    );
  }

  if (type === 'pdf') {
    return (
      <div className={`bg-gradient-to-br from-red-950/40 to-surface-850 flex items-center justify-center ${className}`}>
        <PDFIcon />
      </div>
    );
  }

  if (type === 'video') {
    return (
      <div className={`bg-gradient-to-br from-violet-950/40 to-surface-850 flex items-center justify-center ${className}`}>
        <VideoIcon />
      </div>
    );
  }

  return (
    <div className={`bg-surface-800 flex items-center justify-center ${className}`}>
      <svg className="w-10 h-10 text-surface-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </div>
  );
};

export { PDFIcon, VideoIcon };
export default AssetThumbnail;