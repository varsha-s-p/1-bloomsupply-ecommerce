const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: String,
    image: String,
    qty: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    },
    unit: String
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  shippingAddress: {
    fullName: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    phone: String
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'in-hub', 'delivered', 'cancelled'],
    default: 'pending'
  },
  trackingHistory: [{
    status: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String
  }],
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    default: 'demo'
  },
  giftWrap: {
    type: Boolean,
    default: false
  },
  notes: String,
  estimatedDelivery: Date,
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Auto-generate order number before saving
OrderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD-${String(9000 + count + 1).padStart(4, '0')}`;
  }
  next();
});

OrderSchema.index({ customer: 1, createdAt: -1 });
OrderSchema.index({ vendor: 1 });
OrderSchema.index({ status: 1 });

module.exports = mongoose.model('Order', OrderSchema);
