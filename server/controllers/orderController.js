const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Create order from cart
// @route   POST /api/orders
exports.createOrder = async (req, res) => {
  const { shippingAddress, giftWrap, notes } = req.body;

  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Build order items
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      name: item.product.name,
      image: item.product.images && item.product.images.length > 0 ? item.product.images[0] : '',
      qty: item.quantity,
      price: item.product.price,
      unit: item.product.unit
    }));

    const totalAmount = orderItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

    // Determine vendor from first product (simplified)
    const firstProduct = await Product.findById(orderItems[0].product);
    const vendorId = firstProduct ? (firstProduct.vendor || firstProduct.grower) : null;

    const order = await Order.create({
      customer: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress: shippingAddress || {
        fullName: req.user.name,
        address: req.user.address,
        city: req.user.city,
        state: req.user.state,
        pincode: req.user.pincode,
        phone: req.user.phone
      },
      giftWrap: giftWrap || false,
      notes: notes || '',
      vendor: vendorId,
      status: 'pending',
      paymentStatus: 'paid', // Demo: auto-mark as paid
      trackingHistory: [
        { status: 'Order Placed', timestamp: new Date(), note: 'Your order has been placed successfully' }
      ],
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days from now
    });

    // Update stock for each product
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity }
      });
    }

    // Clear cart
    cart.items = [];
    await cart.save();

    const populatedOrder = await Order.findById(order._id)
      .populate('customer', 'name email phone')
      .populate('items.product', 'name images');

    res.status(201).json(populatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged-in user's orders
// @route   GET /api/orders/my
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .populate('items.product', 'name images price')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email phone city')
      .populate('items.product', 'name images price unit')
      .populate('vendor', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify access (customer, vendor, or grower)
    const isCustomer = order.customer._id.toString() === req.user._id.toString();
    const isVendor = order.vendor && order.vendor._id.toString() === req.user._id.toString();

    if (!isCustomer && !isVendor) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status (vendor/grower)
// @route   PUT /api/orders/:id/status
exports.updateOrderStatus = async (req, res) => {
  const { status, note } = req.body;

  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    order.trackingHistory.push({
      status: status.charAt(0).toUpperCase() + status.slice(1),
      timestamp: new Date(),
      note: note || `Order status updated to ${status}`
    });

    if (status === 'delivered') {
      order.trackingHistory.push({
        status: 'Delivered',
        timestamp: new Date(),
        note: 'Package has been delivered successfully'
      });
    }

    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get orders for vendor dashboard
// @route   GET /api/orders/vendor
exports.getVendorOrders = async (req, res) => {
  try {
    const orders = await Order.find({ vendor: req.user._id })
      .populate('customer', 'name email phone city')
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get orders for grower (products they grow)
// @route   GET /api/orders/grower
exports.getGrowerOrders = async (req, res) => {
  try {
    // Find products owned by this grower
    const growerProducts = await Product.find({ grower: req.user._id }).select('_id');
    const productIds = growerProducts.map(p => p._id);

    // Find orders containing these products
    const orders = await Order.find({ 'items.product': { $in: productIds } })
      .populate('customer', 'name email phone city')
      .populate('items.product', 'name images price')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/orders/stats
exports.getOrderStats = async (req, res) => {
  try {
    let matchQuery = {};

    if (req.user.role === 'vendor') {
      matchQuery.vendor = req.user._id;
    } else if (req.user.role === 'customer') {
      matchQuery.customer = req.user._id;
    }

    const totalOrders = await Order.countDocuments(matchQuery);
    const pendingOrders = await Order.countDocuments({ ...matchQuery, status: 'pending' });
    const processingOrders = await Order.countDocuments({ ...matchQuery, status: 'processing' });
    const deliveredOrders = await Order.countDocuments({ ...matchQuery, status: 'delivered' });

    // Revenue
    const revenueResult = await Order.aggregate([
      { $match: { ...matchQuery, paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Today's revenue
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayRevenue = await Order.aggregate([
      { $match: { ...matchQuery, paymentStatus: 'paid', createdAt: { $gte: today } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.json({
      totalOrders,
      pendingOrders,
      processingOrders,
      deliveredOrders,
      totalRevenue,
      todayRevenue: todayRevenue.length > 0 ? todayRevenue[0].total : 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
