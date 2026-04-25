const Product = require('../models/Product');

// @desc    Get all products with filtering, sorting, pagination
// @route   GET /api/products
exports.getProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, vendor, grower, badge, search, sort, page = 1, limit = 12, isBouquet } = req.query;

    let query = { isAvailable: true };

    // Category filter
    if (category) {
      const categories = category.split(',');
      query.category = { $in: categories };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Vendor filter
    if (vendor) {
      query.vendor = vendor;
    }

    // Grower filter
    if (grower) {
      query.grower = grower;
    }

    // Badge filter
    if (badge) {
      query.badge = badge;
    }

    // Bouquet filter
    if (isBouquet !== undefined) {
      query.isBouquet = isBouquet === 'true';
    }

    // Text search
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    // Sort options
    let sortOption = {};
    switch (sort) {
      case 'price-asc':
        sortOption = { price: 1 };
        break;
      case 'price-desc':
        sortOption = { price: -1 };
        break;
      case 'name-asc':
        sortOption = { name: 1 };
        break;
      case 'name-desc':
        sortOption = { name: -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'rating':
        sortOption = { rating: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find(query)
      .populate('vendor', 'name email')
      .populate('grower', 'name email')
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(query);

    // Get unique categories for filter sidebar
    const categories = await Product.distinct('category', { isAvailable: true });

    res.json({
      products,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      total,
      categories
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('vendor', 'name email city')
      .populate('grower', 'name email city');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Get vendor/grower profile info
    let vendorProfile = null;
    let growerProfile = null;

    if (product.vendor) {
      const VendorProfile = require('../models/VendorProfile');
      vendorProfile = await VendorProfile.findOne({ user: product.vendor._id });
    }
    if (product.grower) {
      const GrowerProfile = require('../models/GrowerProfile');
      growerProfile = await GrowerProfile.findOne({ user: product.grower._id });
    }

    res.json({
      ...product.toObject(),
      vendorProfile,
      growerProfile
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
exports.createProduct = async (req, res) => {
  try {
    const productData = { ...req.body };

    // Set vendor or grower based on user role
    if (req.user.role === 'vendor') {
      productData.vendor = req.user._id;
    } else if (req.user.role === 'grower') {
      productData.grower = req.user._id;
    }

    const product = await Product.create(productData);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Verify ownership
    const isOwner = (product.vendor && product.vendor.toString() === req.user._id.toString()) ||
                    (product.grower && product.grower.toString() === req.user._id.toString());
    if (!isOwner) {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const isOwner = (product.vendor && product.vendor.toString() === req.user._id.toString()) ||
                    (product.grower && product.grower.toString() === req.user._id.toString());
    if (!isOwner) {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get products by current vendor/grower (for dashboard)
// @route   GET /api/products/my
exports.getMyProducts = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'vendor') {
      query.vendor = req.user._id;
    } else if (req.user.role === 'grower') {
      query.grower = req.user._id;
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
