const mongoose = require('mongoose');

const GrowerProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  farmName: {
    type: String,
    required: true
  },
  farmDescription: {
    type: String,
    default: ''
  },
  farmAddress: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    default: ''
  },
  pincode: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    required: true
  },
  specialties: [{
    type: String
  }],
  certifications: [{
    type: String
  }],
  farmSize: {
    type: String,
    default: ''
  },
  rating: {
    type: Number,
    default: 0
  },
  totalOrders: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  logo: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('GrowerProfile', GrowerProfileSchema);
