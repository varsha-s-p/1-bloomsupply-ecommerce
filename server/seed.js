const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Product = require('./models/Product');
const VendorProfile = require('./models/VendorProfile');
const GrowerProfile = require('./models/GrowerProfile');
const Order = require('./models/Order');
const Cart = require('./models/Cart');

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bloomsupply');
    console.log('MongoDB connected for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await VendorProfile.deleteMany({});
    await GrowerProfile.deleteMany({});
    await Order.deleteMany({});
    await Cart.deleteMany({});
    console.log('Cleared existing data.');

    // Create demo users
    const customer = await User.create({
      name: 'Alice Henderson',
      email: 'customer@bloom.com',
      password: 'password123',
      role: 'customer',
      phone: '9876543210',
      address: '42 Rosewood Lane',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001'
    });

    const vendor = await User.create({
      name: 'Rahul Sharma',
      email: 'vendor@bloom.com',
      password: 'password123',
      role: 'vendor',
      phone: '9876543211',
      address: '15 Flower Market Road',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001'
    });

    const grower = await User.create({
      name: 'Priya Desai',
      email: 'grower@bloom.com',
      password: 'password123',
      role: 'grower',
      phone: '9876543212',
      address: 'Farm Plot 7, Green Valley',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411001'
    });

    // Create vendor profile
    const vendorProfile = await VendorProfile.create({
      user: vendor._id,
      shopName: 'Bloom Boutique',
      shopDescription: 'Premium floral arrangements for weddings, events, and everyday beauty. Specializing in architectural installations.',
      shopAddress: '15 Flower Market Road, MG Road',
      city: 'Bangalore',
      phone: '9876543211',
      deliveryAvailable: true,
      deliveryRadius: 25,
      rating: 4.8,
      totalOrders: 1240,
      isVerified: true
    });
    vendor.vendorProfile = vendorProfile._id;
    await vendor.save();

    // Create grower profile
    const growerProfile = await GrowerProfile.create({
      user: grower._id,
      farmName: 'Heritage Botanical Farm',
      farmDescription: 'Operating out of the Pune highlands, Heritage Botanical specializes in structural floral varieties for high-end hospitality and architectural installations.',
      farmAddress: 'Farm Plot 7, Green Valley, Mulshi Road',
      city: 'Pune',
      phone: '9876543212',
      specialties: ['Roses', 'Protea', 'Orchids', 'Eucalyptus', 'Dahlias'],
      certifications: ['Organic Certified', 'Sustainable Farming', 'ISO 14001'],
      farmSize: '25 acres',
      rating: 4.9,
      totalOrders: 3400,
      isVerified: true
    });
    grower.growerProfile = growerProfile._id;
    await grower.save();

    console.log('Created users and profiles.');

    // Create products
    const products = await Product.insertMany([
      {
        name: 'Heritage Crimson Rose',
        description: 'Premium Grade A+ roses harvested in small batches for cellular integrity and maximum vase life. Deep crimson petals with velvety texture.',
        category: 'roses',
        price: 4.50,
        bulkPrice: 3.25,
        unit: 'per stem',
        images: ['https://images.unsplash.com/photo-1591886103814-616147485303?w=500&h=500&fit=crop'],
        vendor: vendor._id,
        grower: grower._id,
        stock: 1240,
        minOrderQty: 1,
        harvestDate: new Date('2026-04-20'),
        stemLength: '60cm - 80cm',
        vaseLife: '10-14 Days',
        fragranceLevel: 'low',
        headSize: '5.5cm - 6.5cm',
        color: 'Crimson Red',
        badge: 'bestseller',
        badgeColor: 'bg-green-100 text-green-700',
        rating: 4.9,
        reviewCount: 48,
        source: 'Heritage Botanical + Glasshouse B',
        coldChainTemp: '2°C - 5°C'
      },
      {
        name: 'Architectural Calla Lily',
        description: 'Elegant white calla lilies with sculptural form. Perfect for modern arrangements and minimalist displays.',
        category: 'lilies',
        price: 12.00,
        bulkPrice: 9.00,
        unit: 'per stem',
        images: ['https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=500&h=500&fit=crop'],
        vendor: vendor._id,
        grower: grower._id,
        stock: 450,
        minOrderQty: 5,
        harvestDate: new Date('2026-04-19'),
        stemLength: '50cm - 70cm',
        vaseLife: '12-16 Days',
        fragranceLevel: 'medium',
        headSize: '8cm - 10cm',
        color: 'Pure White',
        badge: 'bestseller',
        badgeColor: 'bg-green-100 text-green-700',
        rating: 4.7,
        reviewCount: 32,
        source: 'The Vellum Glasshouse + Row 12',
        coldChainTemp: '3°C - 6°C'
      },
      {
        name: 'Silver Dollar Eucalyptus',
        description: 'Premium eucalyptus bunches with signature round silver-green leaves. Essential greenery for sophisticated arrangements.',
        category: 'eucalyptus',
        price: 28.00,
        bulkPrice: 22.00,
        unit: 'per bunch',
        images: ['https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?w=500&h=500&fit=crop'],
        vendor: vendor._id,
        grower: grower._id,
        stock: 180,
        minOrderQty: 5,
        harvestDate: new Date('2026-04-21'),
        stemLength: '40cm - 60cm',
        vaseLife: '14-21 Days',
        fragranceLevel: 'high',
        headSize: 'N/A',
        color: 'Silver Green',
        badge: 'fresh',
        badgeColor: 'bg-blue-100 text-blue-700',
        rating: 4.6,
        reviewCount: 22,
        source: 'Verdant Ridge Co. + Field 04',
        coldChainTemp: '4°C - 8°C'
      },
      {
        name: "Peony 'Sarah Bernhardt'",
        description: 'Classic double-petaled peonies in soft blush pink. Lush, romantic blooms ideal for bridal and event arrangements.',
        category: 'peonies',
        price: 8.75,
        bulkPrice: 6.50,
        unit: 'per stem',
        images: ['https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=500&h=500&fit=crop'],
        vendor: vendor._id,
        grower: grower._id,
        stock: 620,
        minOrderQty: 10,
        harvestDate: new Date('2026-04-18'),
        stemLength: '45cm - 65cm',
        vaseLife: '7-10 Days',
        fragranceLevel: 'high',
        headSize: '10cm - 15cm',
        color: 'Blush Pink',
        badge: '',
        rating: 4.8,
        reviewCount: 55,
        source: 'Heritage Botanical + Row 03'
      },
      {
        name: 'Honey Dahlia Collection',
        description: 'Warm honey-toned dahlia bunches with intricate petal patterns. Eye-catching focal flowers for autumn-inspired design.',
        category: 'dahlias',
        price: 15.50,
        bulkPrice: 12.00,
        unit: 'per bunch',
        images: ['https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=500&h=500&fit=crop'],
        vendor: vendor._id,
        grower: grower._id,
        stock: 95,
        minOrderQty: 3,
        harvestDate: new Date('2026-04-22'),
        stemLength: '35cm - 50cm',
        vaseLife: '5-7 Days',
        fragranceLevel: 'low',
        headSize: '8cm - 12cm',
        color: 'Honey Gold',
        badge: '',
        rating: 4.5,
        reviewCount: 18,
        source: 'Heritage Botanical + Field A2'
      },
      {
        name: 'Twilight Anemone',
        description: 'Dramatic deep purple anemones with striking dark centers. Bold statement flowers for contemporary arrangements.',
        category: 'anemone',
        price: 6.75,
        bulkPrice: 5.15,
        unit: 'per stem',
        images: ['https://images.unsplash.com/photo-1567113110300-8488e046a362?w=500&h=500&fit=crop'],
        vendor: vendor._id,
        grower: grower._id,
        stock: 28,
        minOrderQty: 10,
        harvestDate: new Date('2026-04-23'),
        stemLength: '30cm - 45cm',
        vaseLife: '5-7 Days',
        fragranceLevel: 'none',
        headSize: '4cm - 6cm',
        color: 'Deep Purple',
        badge: 'low-stock',
        badgeColor: 'bg-red-100 text-red-700',
        rating: 4.4,
        reviewCount: 12,
        source: 'The Vellum Glasshouse + Row 08'
      },
      {
        name: 'King Protea Imperial',
        description: 'Majestic king protea with spectacular large heads. The ultimate architectural statement flower for luxury installations.',
        category: 'protea',
        price: 22.00,
        bulkPrice: 18.00,
        unit: 'per stem',
        images: ['https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=500&h=500&fit=crop'],
        vendor: vendor._id,
        grower: grower._id,
        stock: 65,
        minOrderQty: 5,
        harvestDate: new Date('2026-04-17'),
        stemLength: '40cm - 60cm',
        vaseLife: '14-21 Days',
        fragranceLevel: 'low',
        headSize: '15cm - 25cm',
        color: 'Pink & Cream',
        badge: 'new',
        badgeColor: 'bg-purple-100 text-purple-700',
        rating: 5.0,
        reviewCount: 8,
        source: 'Heritage Botanical + Greenhouse'
      },
      {
        name: 'Classic White Tulips',
        description: 'Pristine white tulips with clean lines and elegant simplicity. Versatile blooms for any occasion or interior setting.',
        category: 'tulips',
        price: 10.00,
        bulkPrice: 7.50,
        unit: 'per bunch',
        images: ['https://images.unsplash.com/photo-1520323232427-6b4b4576a89b?w=500&h=500&fit=crop'],
        vendor: vendor._id,
        grower: grower._id,
        stock: 340,
        minOrderQty: 5,
        stemLength: '35cm - 50cm',
        vaseLife: '7-10 Days',
        fragranceLevel: 'low',
        headSize: '4cm - 6cm',
        color: 'White',
        badge: '',
        rating: 4.6,
        reviewCount: 29,
        source: 'Verdant Ridge Co. + Field 02'
      },
      {
        name: 'Blush Orchid Phalaenopsis',
        description: 'Exotic moth orchids in soft blush tones. Long-lasting elegance perfect for premium gifting and office décor.',
        category: 'orchids',
        price: 35.00,
        bulkPrice: 28.00,
        unit: 'per stem',
        images: ['https://images.unsplash.com/photo-1567696911980-2c669aad1fd9?w=500&h=500&fit=crop'],
        vendor: vendor._id,
        grower: grower._id,
        stock: 110,
        minOrderQty: 1,
        stemLength: '50cm - 80cm',
        vaseLife: '21-30 Days',
        fragranceLevel: 'low',
        headSize: '8cm - 12cm',
        color: 'Blush Pink',
        badge: 'wholesale',
        badgeColor: 'bg-gray-100 text-gray-700',
        rating: 4.9,
        reviewCount: 41,
        source: 'Tropical Nursery + House 3'
      },
      {
        name: 'Provence Dried Lavender',
        description: 'Sun-dried French lavender bundles with intense fragrance. Perfect for rustic arrangements and potpourri.',
        category: 'lavender',
        price: 18.00,
        bulkPrice: 14.00,
        unit: 'per bunch',
        images: ['https://images.unsplash.com/photo-1468327768560-75b778cbb551?w=500&h=500&fit=crop'],
        vendor: vendor._id,
        grower: grower._id,
        stock: 200,
        minOrderQty: 3,
        stemLength: '25cm - 35cm',
        vaseLife: '60+ Days (Dried)',
        fragranceLevel: 'high',
        headSize: 'N/A',
        color: 'Purple',
        badge: 'fresh',
        badgeColor: 'bg-blue-100 text-blue-700',
        rating: 4.7,
        reviewCount: 36,
        source: 'Heritage Botanical + Field C1'
      },
      {
        name: 'Golden Sunflower Giant',
        description: 'Magnificent oversized sunflowers radiating warmth and joy. Statement pieces for summer arrangements.',
        category: 'sunflowers',
        price: 7.50,
        bulkPrice: 5.50,
        unit: 'per stem',
        images: ['https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=500&h=500&fit=crop'],
        vendor: vendor._id,
        grower: grower._id,
        stock: 520,
        minOrderQty: 5,
        stemLength: '60cm - 90cm',
        vaseLife: '7-10 Days',
        fragranceLevel: 'none',
        headSize: '15cm - 20cm',
        color: 'Golden Yellow',
        badge: '',
        rating: 4.5,
        reviewCount: 19,
        source: 'Verdant Ridge Co. + Field 06'
      },
      {
        name: 'Crimson Velvet Ranunculus',
        description: 'Multi-layered ranunculus with paper-thin petals in deep crimson. Delicate yet impactful for refined arrangements.',
        category: 'ranunculus',
        price: 5.50,
        bulkPrice: 4.00,
        unit: 'per stem',
        images: ['https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=500&h=500&fit=crop'],
        vendor: vendor._id,
        grower: grower._id,
        stock: 380,
        minOrderQty: 10,
        stemLength: '30cm - 45cm',
        vaseLife: '7-10 Days',
        fragranceLevel: 'none',
        headSize: '4cm - 7cm',
        color: 'Deep Red',
        badge: 'wholesale',
        badgeColor: 'bg-gray-100 text-gray-700',
        rating: 4.6,
        reviewCount: 25,
        source: 'Heritage Botanical + Glasshouse B'
      },
      {
        name: 'Blue Hydrangea Cascade',
        description: 'Lush blue hydrangea with massive flower heads. Perfect for volumetric arrangements and luxury event décor.',
        category: 'hydrangea',
        price: 16.00,
        bulkPrice: 12.50,
        unit: 'per stem',
        images: ['https://images.unsplash.com/photo-1596438459194-f275f413d6ff?w=500&h=500&fit=crop'],
        vendor: vendor._id,
        grower: grower._id,
        stock: 42,
        minOrderQty: 3,
        stemLength: '40cm - 55cm',
        vaseLife: '7-12 Days',
        fragranceLevel: 'low',
        headSize: '15cm - 25cm',
        color: 'Ocean Blue',
        badge: 'low-stock',
        badgeColor: 'bg-red-100 text-red-700',
        rating: 4.8,
        reviewCount: 33,
        source: 'The Vellum Glasshouse + Row 05'
      },
      {
        name: 'Ivory Alabaster Lily',
        description: 'Pure ivory oriental lilies with incredible fragrance. Show-stopping blooms that open dramatically over days.',
        category: 'lilies',
        price: 9.50,
        bulkPrice: 7.00,
        unit: 'per stem',
        images: ['https://images.unsplash.com/photo-1550596334-080562e84c98?w=500&h=500&fit=crop'],
        vendor: vendor._id,
        grower: grower._id,
        stock: 290,
        minOrderQty: 5,
        stemLength: '60cm - 80cm',
        vaseLife: '10-14 Days',
        fragranceLevel: 'high',
        headSize: '12cm - 18cm',
        color: 'Ivory White',
        badge: '',
        rating: 4.7,
        reviewCount: 27,
        source: 'Heritage Botanical + Row 07'
      },
      {
        name: 'Bridal Blush Bouquet',
        description: 'Hand-tied bridal bouquet featuring blush roses, white peonies, eucalyptus, and baby\'s breath. Complete wedding-ready arrangement.',
        category: 'bouquet',
        price: 85.00,
        bulkPrice: 70.00,
        unit: 'per bouquet',
        images: ['https://images.unsplash.com/photo-1509610952-e2e6786a9158?w=500&h=500&fit=crop'],
        vendor: vendor._id,
        grower: grower._id,
        stock: 25,
        minOrderQty: 1,
        vaseLife: '5-7 Days',
        fragranceLevel: 'medium',
        color: 'Blush & White',
        badge: 'bestseller',
        badgeColor: 'bg-green-100 text-green-700',
        isBouquet: true,
        bouquetContents: ['Blush Roses x5', 'White Peonies x3', 'Eucalyptus x4', "Baby's Breath x6"],
        rating: 4.9,
        reviewCount: 62,
        source: 'Bloom Boutique Studio'
      },
      {
        name: 'Tropical Paradise Bouquet',
        description: 'Vibrant tropical arrangement with birds of paradise, anthuriums, and lush greenery. Bold and exotic statement piece.',
        category: 'bouquet',
        price: 65.00,
        bulkPrice: 52.00,
        unit: 'per bouquet',
        images: ['https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=500&h=500&fit=crop'],
        vendor: vendor._id,
        grower: grower._id,
        stock: 15,
        minOrderQty: 1,
        vaseLife: '10-14 Days',
        fragranceLevel: 'low',
        color: 'Mixed Tropical',
        badge: 'new',
        badgeColor: 'bg-purple-100 text-purple-700',
        isBouquet: true,
        bouquetContents: ['Bird of Paradise x2', 'Anthurium x3', 'Monstera Leaf x2', 'Heliconia x1'],
        rating: 4.6,
        reviewCount: 14,
        source: 'Bloom Boutique Studio'
      },
      {
        name: 'Sweet Red Dahlias',
        description: 'Rich red dinner-plate dahlias with complex petal geometry. Stunning centerpiece flowers for autumn celebrations.',
        category: 'dahlias',
        price: 14.00,
        bulkPrice: 10.50,
        unit: 'per stem',
        images: ['https://images.unsplash.com/photo-1533907650686-70576141c030?w=500&h=500&fit=crop'],
        vendor: vendor._id,
        grower: grower._id,
        stock: 160,
        minOrderQty: 5,
        stemLength: '40cm - 60cm',
        vaseLife: '5-7 Days',
        fragranceLevel: 'none',
        headSize: '15cm - 25cm',
        color: 'Deep Red',
        badge: '',
        rating: 4.5,
        reviewCount: 15,
        source: 'Heritage Botanical + Field A1'
      },
      {
        name: 'Cobalt Delphinium Tower',
        description: 'Tall spikes of vivid cobalt blue delphiniums. Dramatic vertical elements for grand arrangements.',
        category: 'other',
        price: 11.00,
        bulkPrice: 8.50,
        unit: 'per stem',
        images: ['https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=500&h=500&fit=crop'],
        vendor: vendor._id,
        grower: grower._id,
        stock: 200,
        minOrderQty: 5,
        stemLength: '70cm - 100cm',
        vaseLife: '7-10 Days',
        fragranceLevel: 'low',
        headSize: 'Spike',
        color: 'Cobalt Blue',
        badge: '',
        rating: 4.4,
        reviewCount: 11,
        source: 'Verdant Ridge Co. + Field 08'
      },
      {
        name: 'Avalanche White Roses',
        description: 'Premium long-stemmed white roses, the gold standard for elegance. Perfect spiral formation with creamy centers.',
        category: 'roses',
        price: 6.00,
        bulkPrice: 4.50,
        unit: 'per stem',
        images: ['https://images.unsplash.com/photo-1558652093-1a9c1e7d6a74?w=500&h=500&fit=crop'],
        vendor: vendor._id,
        grower: grower._id,
        stock: 800,
        minOrderQty: 10,
        stemLength: '60cm - 90cm',
        vaseLife: '10-14 Days',
        fragranceLevel: 'medium',
        headSize: '6cm - 8cm',
        color: 'White',
        badge: 'bestseller',
        badgeColor: 'bg-green-100 text-green-700',
        rating: 4.8,
        reviewCount: 72,
        source: 'Heritage Botanical + Greenhouse A'
      },
      {
        name: 'Danish Canary Tulips',
        description: 'Bright canary yellow tulips imported from Danish farms. Cheerful, vibrant, and long-lasting spring blooms.',
        category: 'tulips',
        price: 8.00,
        bulkPrice: 6.00,
        unit: 'per bunch',
        images: ['https://images.unsplash.com/photo-1496062031456-07b8f162a322?w=500&h=500&fit=crop'],
        vendor: vendor._id,
        grower: grower._id,
        stock: 270,
        minOrderQty: 5,
        stemLength: '30cm - 45cm',
        vaseLife: '7-10 Days',
        fragranceLevel: 'low',
        headSize: '4cm - 5cm',
        color: 'Canary Yellow',
        badge: 'fresh',
        badgeColor: 'bg-blue-100 text-blue-700',
        rating: 4.5,
        reviewCount: 20,
        source: 'Verdant Ridge Co. + Field 01'
      }
    ]);

    console.log(`Created ${products.length} products.`);

    // Create sample orders for the customer
    const order1 = await Order.create({
      customer: customer._id,
      items: [
        { product: products[0]._id, name: products[0].name, image: products[0].images[0], qty: 250, price: products[0].bulkPrice, unit: 'stems' },
        { product: products[2]._id, name: products[2].name, image: products[2].images[0], qty: 50, price: products[2].bulkPrice, unit: 'bunches' }
      ],
      totalAmount: (250 * 3.25) + (50 * 22.00),
      shippingAddress: {
        fullName: 'Alice Henderson',
        address: '42 Rosewood Lane',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        phone: '9876543210'
      },
      status: 'shipped',
      vendor: vendor._id,
      paymentStatus: 'paid',
      trackingHistory: [
        { status: 'Order Placed', timestamp: new Date(Date.now() - 3 * 86400000), note: 'Your order has been placed successfully' },
        { status: 'Processing', timestamp: new Date(Date.now() - 2 * 86400000), note: 'Your order is being processed' },
        { status: 'Shipped', timestamp: new Date(Date.now() - 1 * 86400000), note: 'Your order has been shipped via express delivery' }
      ],
      estimatedDelivery: new Date(Date.now() + 2 * 86400000)
    });

    const order2 = await Order.create({
      customer: customer._id,
      items: [
        { product: products[14]._id, name: products[14].name, image: products[14].images[0], qty: 1, price: products[14].price, unit: 'bouquet' }
      ],
      totalAmount: 85.00,
      shippingAddress: {
        fullName: 'Alice Henderson',
        address: '42 Rosewood Lane',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        phone: '9876543210'
      },
      status: 'delivered',
      vendor: vendor._id,
      paymentStatus: 'paid',
      trackingHistory: [
        { status: 'Order Placed', timestamp: new Date(Date.now() - 7 * 86400000), note: 'Order placed' },
        { status: 'Processing', timestamp: new Date(Date.now() - 6 * 86400000), note: 'Preparing' },
        { status: 'Shipped', timestamp: new Date(Date.now() - 5 * 86400000), note: 'Shipped' },
        { status: 'In Hub', timestamp: new Date(Date.now() - 4 * 86400000), note: 'At local hub' },
        { status: 'Delivered', timestamp: new Date(Date.now() - 3 * 86400000), note: 'Delivered successfully' }
      ]
    });

    console.log('Created sample orders.');
    console.log('\n=== SEED COMPLETE ===');
    console.log('Demo Credentials:');
    console.log('  Customer: customer@bloom.com / password123');
    console.log('  Vendor:   vendor@bloom.com   / password123');
    console.log('  Grower:   grower@bloom.com   / password123');
    console.log('==================\n');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDB();
