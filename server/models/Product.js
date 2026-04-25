const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['roses', 'lilies', 'tulips', 'orchids', 'dahlias', 'protea', 'peonies', 'hydrangea', 'ranunculus', 'eucalyptus', 'sunflowers', 'lavender', 'anemone', 'bouquet', 'mixed', 'other']
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  bulkPrice: {
    type: Number,
    min: 0
  },
  unit: {
    type: String,
    default: 'per stem',
    enum: ['per stem', 'per bunch', 'per bouquet', 'per box']
  },
  images: [{
    type: String
  }],
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  grower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  stock: {
    type: Number,
    required: true,
    default: 0
  },
  minOrderQty: {
    type: Number,
    default: 1
  },
  harvestDate: {
    type: Date
  },
  stemLength: {
    type: String
  },
  vaseLife: {
    type: String
  },
  fragranceLevel: {
    type: String,
    enum: ['none', 'low', 'medium', 'high'],
    default: 'low'
  },
  headSize: {
    type: String
  },
  color: {
    type: String
  },
  badge: {
    type: String,
    enum: ['', 'bestseller', 'fresh', 'low-stock', 'new', 'wholesale'],
    default: ''
  },
  badgeColor: {
    type: String,
    default: ''
  },
  isBouquet: {
    type: Boolean,
    default: false
  },
  bouquetContents: [{
    type: String
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  source: {
    type: String
  },
  coldChainTemp: {
    type: String
  }
}, {
  timestamps: true
});

// Index for search and filtering
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ category: 1, price: 1 });
ProductSchema.index({ vendor: 1 });
ProductSchema.index({ grower: 1 });

module.exports = mongoose.model('Product', ProductSchema);
