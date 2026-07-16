const mongoose = require('mongoose');

const ClaimSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ownerName: {
    type: String,
    required: [true, 'Owner name is required'],
    trim: true
  },
  vehicleNumber: {
    type: String,
    required: [true, 'Vehicle plate number is required'],
    trim: true
  },
  vehicleModel: {
    type: String,
    required: [true, 'Vehicle model is required'],
    trim: true
  },
  insuranceType: {
    type: String,
    required: [true, 'Insurance coverage type is required'],
    enum: ['Comprehensive', 'Third-Party', 'Collision', 'Liability', 'Warranty']
  },
  description: {
    type: String,
    required: [true, 'Damage description is required'],
    trim: true
  },
  imageUrl: {
    type: String,
    required: [true, 'Vehicle image is required']
  },
  damageType: {
    type: String
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Unknown'],
    default: 'Unknown'
  },
  repairCost: {
    type: Number,
    default: 0
  },
  confidence: {
    type: Number,
    default: 0
  },
  fraudRisk: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Unknown'],
    default: 'Unknown'
  },
  recommendation: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Claim', ClaimSchema);
