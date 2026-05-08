const mongoose = require('mongoose');

/**
 * Asset Schema - stores metadata for uploaded files
 */
const assetSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: [true, 'Filename is required'],
      trim: true,
    },
    originalName: {
      type: String,
      required: [true, 'Original name is required'],
      trim: true,
    },
    mimetype: {
      type: String,
      required: [true, 'Mimetype is required'],
    },
    size: {
      type: Number,
      required: [true, 'File size is required'],
    },
    tags: {
      type: [String],
      default: [],
    },
    uploadDate: {
      type: Date,
      default: Date.now,
    },
    path: {
      type: String,
      required: [true, 'File path is required'],
    },
    fileUrl: {
      type: String,
      required: [true, 'File URL is required'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Index for search and filtering performance
assetSchema.index({ originalName: 'text' });
assetSchema.index({ mimetype: 1 });
assetSchema.index({ uploadDate: -1 });

const Asset = mongoose.model('Asset', assetSchema);

module.exports = Asset;