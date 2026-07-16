const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Claim = require('../models/Claim');
const { protect } = require('../middleware/auth');
const { analyzeDamage } = require('../services/aiService');

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File Filter for Images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpg, jpeg, png, webp, gif) are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

/**
 * @route   POST /api/claims
 * @desc    Create a new damage claim & analyze image via AI
 * @access  Private
 */
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const ownerName = req.body.ownerName || 'Demo Adjuster';
    const vehicleNumber = req.body.vehicleNumber || 'DL-3C-0001';
    const vehicleModel = req.body.vehicleModel || 'Standard Class';
    const insuranceType = req.body.insuranceType || 'Comprehensive';
    const description = req.body.description || (req.file ? req.file.originalname : 'Vehicle Damage Photo');

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a vehicle damage image' });
    }

    // Relative image path for client retrieval
    const imageUrl = `/uploads/${req.file.filename}`;

    // Perform AI assessment (simulated Gemini service)
    const assessment = await analyzeDamage(imageUrl, description, vehicleModel);

    // Create claim instance
    const claim = new Claim({
      userId: req.user._id,
      ownerName,
      vehicleNumber,
      vehicleModel,
      insuranceType,
      description,
      imageUrl,
      ...assessment // Spreads damageType, severity, repairCost, confidence, fraudRisk, recommendation
    });

    const savedClaim = await claim.save();
    res.status(201).json({ success: true, data: savedClaim });

  } catch (error) {
    console.error('Create claim error:', error.message);
    // Cleanup file in case of server failure
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ success: false, message: error.message || 'Server error creating claim' });
  }
});

/**
 * @route   GET /api/claims
 * @desc    Get all claims for logged-in user (supports search & filter)
 * @access  Private
 */
router.get('/', protect, async (req, res) => {
  try {
    const { search, severity, insuranceType } = req.query;
    
    // Construct query object specific to authenticated user
    const query = { userId: req.user._id };

    // Apply Search (ownerName or vehicleNumber or vehicleModel)
    if (search) {
      query.$or = [
        { ownerName: { $regex: search, $options: 'i' } },
        { vehicleNumber: { $regex: search, $options: 'i' } },
        { vehicleModel: { $regex: search, $options: 'i' } }
      ];
    }

    // Apply filters
    if (severity && severity !== 'All') {
      query.severity = severity;
    }
    
    if (insuranceType && insuranceType !== 'All') {
      query.insuranceType = insuranceType;
    }

    // Fetch and sort by newest first
    const claims = await Claim.find(query).sort({ createdAt: -1 });

    res.json({ success: true, count: claims.length, data: claims });
  } catch (error) {
    console.error('Get claims error:', error.message);
    res.status(500).json({ success: false, message: 'Server error retrieving claims' });
  }
});

/**
 * @route   GET /api/claims/:id
 * @desc    Get specific claim details by ID
 * @access  Private
 */
router.get('/:id', protect, async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);

    if (!claim) {
      return res.status(404).json({ success: false, message: 'Claim not found' });
    }

    // Check claim ownership
    if (claim.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to view this claim' });
    }

    res.json({ success: true, data: claim });
  } catch (error) {
    console.error('Get claim detail error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Claim not found' });
    }
    res.status(500).json({ success: false, message: 'Server error retrieving claim detail' });
  }
});

/**
 * @route   DELETE /api/claims/:id
 * @desc    Delete a claim and its associated image
 * @access  Private
 */
router.delete('/:id', protect, async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);

    if (!claim) {
      return res.status(404).json({ success: false, message: 'Claim not found' });
    }

    // Check claim ownership
    if (claim.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this claim' });
    }

    // Delete image file if exists
    const fileRelativePath = claim.imageUrl;
    const fileFullPath = path.join(__dirname, '..', fileRelativePath);

    if (fs.existsSync(fileFullPath)) {
      try {
        fs.unlinkSync(fileFullPath);
      } catch (err) {
        console.error('Error deleting claim image file:', err.message);
      }
    }

    // Delete database entry
    await claim.deleteOne();

    res.json({ success: true, message: 'Claim and associated image successfully deleted' });
  } catch (error) {
    console.error('Delete claim error:', error.message);
    res.status(500).json({ success: false, message: 'Server error deleting claim' });
  }
});

/**
 * @route   PUT /api/claims/:id
 * @desc    Update claim assessment details manually
 * @access  Private
 */
router.put('/:id', protect, async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);

    if (!claim) {
      return res.status(404).json({ success: false, message: 'Claim not found' });
    }

    // Check claim ownership
    if (claim.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to update this claim' });
    }

    const { damageType, severity, repairCost, recommendation, fraudRisk } = req.body;

    if (damageType !== undefined) claim.damageType = damageType;
    if (severity !== undefined) claim.severity = severity;
    if (repairCost !== undefined) claim.repairCost = Number(repairCost);
    if (recommendation !== undefined) claim.recommendation = recommendation;
    if (fraudRisk !== undefined) claim.fraudRisk = fraudRisk;

    const updatedClaim = await claim.save();
    res.json({ success: true, data: updatedClaim });
  } catch (error) {
    console.error('Update claim error:', error.message);
    res.status(500).json({ success: false, message: 'Server error updating claim' });
  }
});

module.exports = router;
