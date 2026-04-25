const Cart = require('../models/Cart');

// @desc    Get user's cart
// @route   GET /api/cart
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate({
        path: 'items.product',
        select: 'name price bulkPrice unit images stock badge source'
      });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
exports.addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [{ product: productId, quantity }]
      });
    } else {
      // Check if product already in cart
      const existingItem = cart.items.find(
        item => item.product.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }

      await cart.save();
    }

    // Populate and return
    cart = await Cart.findOne({ user: req.user._id })
      .populate({
        path: 'items.product',
        select: 'name price bulkPrice unit images stock badge source'
      });

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
exports.updateCartItem = async (req, res) => {
  const { quantity } = req.body;

  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.find(
      item => item.product.toString() === req.params.productId
    );

    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter(
        item => item.product.toString() !== req.params.productId
      );
    } else {
      item.quantity = quantity;
    }

    await cart.save();

    const updatedCart = await Cart.findOne({ user: req.user._id })
      .populate({
        path: 'items.product',
        select: 'name price bulkPrice unit images stock badge source'
      });

    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
exports.removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      item => item.product.toString() !== req.params.productId
    );

    await cart.save();

    const updatedCart = await Cart.findOne({ user: req.user._id })
      .populate({
        path: 'items.product',
        select: 'name price bulkPrice unit images stock badge source'
      });

    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.json({ message: 'Cart cleared', items: [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
