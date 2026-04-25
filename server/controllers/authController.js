const User = require('../models/User');
const VendorProfile = require('../models/VendorProfile');
const GrowerProfile = require('../models/GrowerProfile');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
  const { name, email, password, role, phone, address, city, state, pincode,
          shopName, shopDescription, shopAddress, shopCity, shopPhone, deliveryAvailable, deliveryRadius,
          farmName, farmDescription, farmAddress, farmCity, farmPhone, specialties, certifications, farmSize
  } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = await User.create({
      name, email, password, role,
      phone: phone || '',
      address: address || '',
      city: city || '',
      state: state || '',
      pincode: pincode || ''
    });

    // Create vendor profile if vendor
    if (role === 'vendor' && shopName) {
      const vendorProfile = await VendorProfile.create({
        user: user._id,
        shopName,
        shopDescription: shopDescription || '',
        shopAddress: shopAddress || address || '',
        city: shopCity || city || '',
        phone: shopPhone || phone || '',
        deliveryAvailable: deliveryAvailable || false,
        deliveryRadius: deliveryRadius || 0
      });
      user.vendorProfile = vendorProfile._id;
      await user.save();
    }

    // Create grower profile if grower
    if (role === 'grower' && farmName) {
      const growerProfile = await GrowerProfile.create({
        user: user._id,
        farmName,
        farmDescription: farmDescription || '',
        farmAddress: farmAddress || address || '',
        city: farmCity || city || '',
        phone: farmPhone || phone || '',
        specialties: specialties || [],
        certifications: certifications || [],
        farmSize: farmSize || ''
      });
      user.growerProfile = growerProfile._id;
      await user.save();
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      city: user.city,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email })
      .populate('vendorProfile')
      .populate('growerProfile');

    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        city: user.city,
        avatar: user.avatar,
        vendorProfile: user.vendorProfile || null,
        growerProfile: user.growerProfile || null,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('vendorProfile')
      .populate('growerProfile');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;
    user.city = req.body.city || user.city;
    user.state = req.body.state || user.state;
    user.pincode = req.body.pincode || user.pincode;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone,
      city: updatedUser.city,
      token: generateToken(updatedUser._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
