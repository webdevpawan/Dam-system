import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadAsset } from '../services/assetService';
import { validateFile, formatFileSize, getAssetType } from '../utils/helpers';
import useToast from '../hooks/useToast';
import ToastContainer from '../components/ToastContainer';

/**
 * UploadPage - drag-and-drop file upload with progress, tags, and validation
 */
const UploadPage = () => {
  const navigate = useNavigate();
  const { toasts, toast, removeToast } = useToast();

  const [file, setFile] = useState(null);
  const [tags, setTags] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = useCallback((selectedFile) => {
    if (!selectedFile) return;
    const { valid, error } = validateFile(selectedFile);
    if (!valid) {
      toast.error(error);
      return;
    }
    setFile(selectedFile);
    setProgress(0);
  }, [toast]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFileSelect(dropped);
  }, [handleFileSelect]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);
    formData.append('tags', JSON.stringify(tagList));

    try {
      setUploading(true);
      setProgress(0);
      await uploadAsset(formData, (pct) => setProgress(pct));
      toast.success(`"${file.name}" uploaded successfully!`);
      setFile(null);
      setTags('');
      setProgress(0);
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      toast.error(err.message || 'Upload failed. Please try again.');
      setProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const typeInfo = file ? getAssetType(file.type) : null;

  const typeColors = {
    image: 'text-emerald-400',
    pdf: 'text-red-400',
    video: 'text-violet-400',
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 animate-fade-in">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Header */}
      <div className="mb-10">
        <h1 className="font-display font-bold text-3xl text-surface-50 tracking-tight mb-2">
          Upload Asset
        </h1>
        <p className="text-surface-400">
          Add files to your vault. Supports JPG, PNG, PDF, and MP4 up to 20MB.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`
            relative border-2 border-dashed rounded-2xl cursor-pointer
            transition-all duration-200 min-h-[200px] flex flex-col items-center justify-center gap-4 p-8
            ${dragOver
              ? 'border-brand-500 bg-brand-500/8 scale-[1.01]'
              : file
                ? 'border-surface-600 bg-surface-800/40 hover:border-surface-500'
                : 'border-surface-700 bg-surface-850/50 hover:border-surface-600 hover:bg-surface-800/30'
            }
            ${uploading ? 'cursor-not-allowed opacity-70' : ''}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,application/pdf,video/mp4"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files[0])}
            disabled={uploading}
          />

          {file ? (
            /* File selected state */
            <div className="text-center space-y-3">
              <div className={`text-4xl ${typeColors[typeInfo] || 'text-surface-400'}`}>
                {typeInfo === 'image' && '🖼️'}
                {typeInfo === 'pdf' && '📄'}
                {typeInfo === 'video' && '🎬'}
                {!typeInfo && '📁'}
              </div>
              <div>
                <p className="font-display font-semibold text-surface-100 mb-1">
                  {file.name}
                </p>
                <p className="text-sm text-surface-500">
                  {formatFileSize(file.size)} • {file.type.split('/')[1].toUpperCase()}
                </p>
              </div>
              {!uploading && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  className="text-xs text-surface-500 hover:text-red-400 transition-colors"
                >
                  Remove file
                </button>
              )}
            </div>
          ) : (
            /* Empty state */
            <div className="text-center space-y-3">
              <div className="w-14 h-14 mx-auto bg-surface-800 rounded-2xl flex items-center justify-center
                              border border-surface-700 group-hover:border-brand-600 transition-colors">
                <svg className="w-7 h-7 text-surface-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <p className="font-display font-semibold text-surface-200 mb-1">
                  Drop your file here, or{' '}
                  <span className="text-brand-400">browse</span>
                </p>
                <p className="text-sm text-surface-500">JPG, PNG, PDF, MP4 — max 20MB</p>
              </div>
            </div>
          )}

          {dragOver && (
            <div className="absolute inset-0 rounded-2xl bg-brand-500/5 border-2 border-brand-500 flex items-center justify-center pointer-events-none">
              <span className="font-display font-semibold text-brand-400">Release to upload</span>
            </div>
          )}
        </div>

        {/* Tags input */}
        <div className="space-y-2">
          <label className="block text-sm font-display font-medium text-surface-300">
            Tags
            <span className="text-surface-600 font-normal ml-2">(optional, comma-separated)</span>
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g. invoice, q3, design, marketing"
            className="input-field"
            disabled={uploading}
          />
          {/* Tag preview */}
          {tags && (
            <div className="flex flex-wrap gap-2 pt-1">
              {tags.split(',').map(t => t.trim()).filter(Boolean).map((tag) => (
                <span key={tag} className="badge bg-brand-950/60 text-brand-300 border border-brand-800/40">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Upload progress */}
        {uploading && (
          <div className="space-y-2 animate-fade-in">
            <div className="flex items-center justify-between text-sm">
              <span className="text-surface-400 font-medium">Uploading…</span>
              <span className="text-brand-400 font-mono font-semibold">{progress}%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-surface-600">
              {progress < 100 ? 'Transferring file…' : 'Saving to database…'}
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={!file || uploading}
            className="btn-primary flex-1 justify-center py-3 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-brand-600"
          >
            {uploading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Uploading {progress}%
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload to Vault
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            disabled={uploading}
            className="btn-secondary disabled:opacity-40"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Supported formats info */}
      <div className="mt-10 p-5 card space-y-3">
        <h3 className="font-display font-semibold text-sm text-surface-300 uppercase tracking-wider">
          Supported Formats
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'JPEG / JPG', icon: '🖼️', desc: 'Images', color: 'text-emerald-400' },
            { label: 'PNG', icon: '🖼️', desc: 'Images', color: 'text-emerald-400' },
            { label: 'PDF', icon: '📄', desc: 'Documents', color: 'text-red-400' },
            { label: 'MP4', icon: '🎬', desc: 'Videos', color: 'text-violet-400' },
          ].map((fmt) => (
            <div key={fmt.label} className="p-3 bg-surface-800/60 rounded-xl text-center">
              <div className="text-2xl mb-1">{fmt.icon}</div>
              <p className={`font-mono text-xs font-semibold ${fmt.color}`}>{fmt.label}</p>
              <p className="text-surface-600 text-xs">{fmt.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UploadPage;