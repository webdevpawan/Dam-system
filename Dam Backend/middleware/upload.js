const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

// Allowed MIME types
const ALLOWED_MIME_TYPES = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'application/pdf': 'pdf',
  'video/mp4': 'mp4',
};

/**
 * Disk storage configuration
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp + random hash + extension
    const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;
    const ext = ALLOWED_MIME_TYPES[file.mimetype];
    cb(null, `${uniqueSuffix}.${ext}`);
  },
});

/**
 * File type filter - reject unsupported formats
 */
const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES[file.mimetype]) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Unsupported file type: ${file.mimetype}. Allowed types: JPG, PNG, PDF, MP4`
      ),
      false
    );
  }
};

/**
 * Multer upload instance with limits
 */
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 20 * 1024 * 1024, // 20MB
  },
});

module.exports = upload;
module.exports.ALLOWED_MIME_TYPES = ALLOWED_MIME_TYPES;