const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auth');
const upload = require('../middleware/upload');
const imagekit = require('../config/imagekit');

// @route   POST /api/upload
// @desc    Upload an image to ImageKit CDN (Admin only)
// @access  Private
router.post('/', requireAuth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image file.' });
    }

    // Upload memory buffer directly to ImageKit
    const response = await imagekit.upload({
      file: req.file.buffer, // file buffer
      fileName: `image-${Date.now()}-${req.file.originalname.replace(/\s+/g, '_')}`,
      folder: '/tsp_daily_code',
    });

    res.status(200).json({
      message: 'Image uploaded successfully to ImageKit',
      url: response.url,
      fileId: response.fileId,
      name: response.name,
    });
  } catch (error) {
    console.error('ImageKit upload error:', error);
    res.status(500).json({
      message: 'Failed to upload image to ImageKit CDN',
      error: error.message,
    });
  }
});

// @route   GET /api/upload/auth
// @desc    Get authentication parameters for direct frontend uploads
// @access  Private
router.get('/auth', requireAuth, (req, res) => {
  try {
    const authenticationParameters = imagekit.getAuthenticationParameters();
    res.json(authenticationParameters);
  } catch (error) {
    res.status(500).json({ message: 'Error generating ImageKit auth parameters', error: error.message });
  }
});

module.exports = router;
