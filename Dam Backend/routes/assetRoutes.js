const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  uploadAsset,
  getAssets,
  getAssetById,
  deleteAsset,
  getAllTags,
} = require('../controllers/assetController');

// GET /api/assets/tags - must come before /:id to avoid conflict
router.get('/tags', getAllTags);

// POST /api/assets/upload
router.post('/upload', upload.single('file'), uploadAsset);

// GET /api/assets
router.get('/', getAssets);

// GET /api/assets/:id
router.get('/:id', getAssetById);

// DELETE /api/assets/:id
router.delete('/:id', deleteAsset);

module.exports = router;