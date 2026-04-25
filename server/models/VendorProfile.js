const mongoose = require('mongoose');

const VendorProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  shopName: {
    type: String,
    required: true
  },
  shopDescription: {
    type: String,
    default: ''
  },
  shopAddress: {
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
  deliveryAvailable: {
    type: Boolean,
    default: false
  },
  deliveryRadius: {
    type: Number,
    default: 0
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

module.exports = mongoose.model('VendorProfile', VendorProfileSchema);
