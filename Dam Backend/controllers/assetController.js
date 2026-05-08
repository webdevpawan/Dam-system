const Asset = require('../models/Asset');
const path = require('path');
const fs = require('fs');

/**
 * @desc    Upload a new asset
 * @route   POST /api/assets/upload
 * @access  Public
 */
const uploadAsset = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded. Please attach a file.',
      });
    }

    const { originalname, mimetype, size, filename, path: filePath } = req.file;

    // Parse tags from request body (comma-separated string or JSON array)
    let tags = [];
    if (req.body.tags) {
      try {
        tags = JSON.parse(req.body.tags);
      } catch {
        tags = req.body.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);
      }
    }

    // Build public file URL
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const fileUrl = `${baseUrl}/uploads/${filename}`;

    const asset = await Asset.create({
      filename,
      originalName: originalname,
      mimetype,
      size,
      tags,
      path: filePath,
      fileUrl,
    });

    res.status(201).json({
      success: true,
      message: 'Asset uploaded successfully',
      data: asset,
    });
  } catch (error) {
    // Clean up uploaded file if DB save fails
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, () => {});
    }
    next(error);
  }
};

/**
 * @desc    Get all assets with optional filtering and search
 * @route   GET /api/assets
 * @access  Public
 */
const getAssets = async (req, res, next) => {
  try {
    const { type, tag, search, page = 1, limit = 12, startDate, endDate } = req.query;

    const query = {};

    // Filter by file type (mimetype prefix)
    if (type) {
      const typeMap = {
        image: /^image\//,
        pdf: /^application\/pdf$/,
        video: /^video\//,
      };
      if (typeMap[type]) {
        query.mimetype = { $regex: typeMap[type] };
      } else {
        // Allow raw mimetype filtering
        query.mimetype = { $regex: type, $options: 'i' };
      }
    }

    // Filter by tag
    if (tag) {
      query.tags = { $in: [tag] };
    }

    // Search by filename
    if (search) {
      query.originalName = { $regex: search, $options: 'i' };
    }

    // Filter by date range
    if (startDate || endDate) {
      query.uploadDate = {};
      if (startDate) query.uploadDate.$gte = new Date(startDate);
      if (endDate) query.uploadDate.$lte = new Date(endDate);
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [assets, total] = await Promise.all([
      Asset.find(query).sort({ uploadDate: -1 }).skip(skip).limit(limitNum),
      Asset.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: assets,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        hasNextPage: pageNum < Math.ceil(total / limitNum),
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single asset by ID
 * @route   GET /api/assets/:id
 * @access  Public
 */
const getAssetById = async (req, res, next) => {
  try {
    const asset = await Asset.findById(req.params.id);

    if (!asset) {
      return res.status(404).json({
        success: false,
        error: 'Asset not found',
      });
    }

    res.status(200).json({
      success: true,
      data: asset,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete an asset by ID
 * @route   DELETE /api/assets/:id
 * @access  Public
 */
const deleteAsset = async (req, res, next) => {
  try {
    const asset = await Asset.findById(req.params.id);

    if (!asset) {
      return res.status(404).json({
        success: false,
        error: 'Asset not found',
      });
    }

    // Remove file from disk
    if (fs.existsSync(asset.path)) {
      fs.unlinkSync(asset.path);
    }

    await Asset.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Asset deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all unique tags
 * @route   GET /api/assets/tags
 * @access  Public
 */
const getAllTags = async (req, res, next) => {
  try {
    const tags = await Asset.distinct('tags');
    res.status(200).json({
      success: true,
      data: tags.filter(Boolean).sort(),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadAsset,
  getAssets,
  getAssetById,
  deleteAsset,
  getAllTags,
};