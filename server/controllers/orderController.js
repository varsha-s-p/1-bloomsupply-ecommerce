const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.createOrder = async (req, res) => {
  const { shippingAddress, notes, paymentMethod } = req.body;

  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      name: item.product.name,
      image: item.product.images && item.product.images.length > 0 ? item.product.images[0] : '',
      qty: item.quantity,
      price: item.product.price,
      unit: item.product.unit
    }));

    const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const deliveryCharge = subtotal >= 999 ? 0 : 49;
    const totalAmount = subtotal + deliveryCharge;

    const order = await Order.create({
      customer: req.user._id,
      items: orderItems,
      totalAmount,
      deliveryCharge,
      shippingAddress: shippingAddress || {
        fullName: req.user.name,
        address: req.user.address,
        city: req.user.city,
        state: req.user.state,
        pincode: req.user.pincode,
        phone: req.user.phone
      },
      notes: notes || '',
      paymentMethod: paymentMethod || 'cod',
      status: 'pending',
      paymentStatus: 'paid',
      trackingHistory: [
        { status: 'Order Placed', timestamp: new Date(), note: 'Your order has been placed successfully' }
      ],
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
    });

    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity }
      });
    }

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

exports.getMyOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Number(limit));
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      Order.find({ customer: req.user._id })
        .populate('items.product', 'name images price')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Order.countDocuments({ customer: req.user._id })
    ]);

    res.json({
      orders,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email phone city')
      .populate('items.product', 'name images price unit');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const isCustomer = order.customer._id.toString() === req.user._id.toString();
    const isAdminUser = req.user.role === 'admin';

    if (!isCustomer && !isAdminUser) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

    await order.save();

    const populated = await Order.findById(order._id)
      .populate('customer', 'name email phone')
      .populate('items.product', 'name images');

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
