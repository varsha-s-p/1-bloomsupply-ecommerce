const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Product = require('./models/Product');
const Category = require('./models/Category');
const Banner = require('./models/Banner');
const Order = require('./models/Order');
const Cart = require('./models/Cart');

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bloomsupply');
    console.log('MongoDB connected for seeding...');

    await User.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Banner.deleteMany({});
    await Order.deleteMany({});
    await Cart.deleteMany({});
    console.log('Cleared existing data.');

    const admin = await User.create({
      name: 'BloomSupply Admin',
      email: 'admin@bloomsupply.com',
      password: 'admin123',
      role: 'admin',
      phone: '9000000001',
      address: 'BloomSupply HQ',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001'
    });

    const customer = await User.create({
      name: 'Priya Sharma',
      email: 'customer@bloomsupply.com',
      password: 'password123',
      role: 'customer',
      phone: '9876543210',
      address: '42 Rosewood Lane, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050'
    });

    const customer2 = await User.create({
      name: 'Rahul Verma',
      email: 'rahul@bloomsupply.com',
      password: 'password123',
      role: 'customer',
      phone: '9876543211',
      address: '15 MG Road, Koramangala',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560034'
    });

    console.log('Created users.');

    const categories = await Category.insertMany([
      { name: 'Roses', slug: 'roses', image: 'https://images.unsplash.com/photo-1591886103814-616147485303?w=400&h=400&fit=crop', description: 'Premium roses in every color and variety', order: 1 },
      { name: 'Lilies', slug: 'lilies', image: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=400&h=400&fit=crop', description: 'Elegant lilies for every occasion', order: 2 },
      { name: 'Tulips', slug: 'tulips', image: 'https://images.unsplash.com/photo-1520323232427-6b4b4576a89b?w=400&h=400&fit=crop', description: 'Vibrant tulips fresh from the farm', order: 3 },
      { name: 'Orchids', slug: 'orchids', image: 'https://images.unsplash.com/photo-1567696911980-2c669aad1fd9?w=400&h=400&fit=crop', description: 'Exotic orchids for premium gifting', order: 4 },
      { name: 'Sunflowers', slug: 'sunflowers', image: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=400&h=400&fit=crop', description: 'Bright sunflowers to bring warmth', order: 5 },
      { name: 'Bouquets', slug: 'bouquets', image: 'https://images.unsplash.com/photo-1509610952-e2e6786a9158?w=400&h=400&fit=crop', description: 'Handcrafted designer bouquets', order: 6 },
      { name: 'Lavender', slug: 'lavender', image: 'https://images.unsplash.com/photo-1468327768560-75b778cbb551?w=400&h=400&fit=crop', description: 'Fragrant lavender for every space', order: 7 },
      { name: 'Indoor Plants', slug: 'indoor-plants', image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&h=400&fit=crop', description: 'Low-maintenance indoor greenery', order: 8 }
    ]);

    console.log(`Created ${categories.length} categories.`);

    const catMap = {};
    categories.forEach(c => { catMap[c.slug] = c._id; });

    const products = await Product.insertMany([
      {
        name: 'Heritage Crimson Rose Bunch',
        description: 'A stunning bunch of 12 premium crimson roses, hand-picked for maximum freshness. Deep velvety petals with a natural sheen. Perfect for anniversaries and romantic gestures.',
        category: catMap['roses'],
        price: 499,
        mrp: 799,
        unit: 'per bunch',
        images: ['https://images.unsplash.com/photo-1591886103814-616147485303?w=600&h=600&fit=crop'],
        stock: 250,
        badge: 'bestseller',
        rating: 4.9,
        reviewCount: 148,
        createdBy: admin._id
      },
      {
        name: 'Avalanche White Roses',
        description: 'Premium long-stemmed white roses, the gold standard for elegance. Perfect spiral formation with creamy centers. Ideal for weddings and formal events.',
        category: catMap['roses'],
        price: 599,
        mrp: 899,
        unit: 'per bunch',
        images: ['https://images.unsplash.com/photo-1558652093-1a9c1e7d6a74?w=600&h=600&fit=crop'],
        stock: 180,
        badge: 'bestseller',
        rating: 4.8,
        reviewCount: 92,
        createdBy: admin._id
      },
      {
        name: 'Architectural Calla Lily',
        description: 'Elegant white calla lilies with sculptural form. Perfect for modern arrangements and minimalist displays. Each stem is a work of art.',
        category: catMap['lilies'],
        price: 349,
        mrp: 499,
        unit: 'per piece',
        images: ['https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=600&h=600&fit=crop'],
        stock: 120,
        badge: 'new',
        rating: 4.7,
        reviewCount: 56,
        createdBy: admin._id
      },
      {
        name: 'Ivory Oriental Lily Bunch',
        description: 'Pure ivory oriental lilies with incredible fragrance. Show-stopping blooms that open dramatically over days. 5 stems per bunch.',
        category: catMap['lilies'],
        price: 649,
        mrp: 999,
        unit: 'per bunch',
        images: ['https://images.unsplash.com/photo-1550596334-080562e84c98?w=600&h=600&fit=crop'],
        stock: 90,
        badge: '',
        rating: 4.6,
        reviewCount: 38,
        createdBy: admin._id
      },
      {
        name: 'Classic White Tulip Bunch',
        description: 'Pristine white tulips with clean lines and elegant simplicity. A bunch of 10 stems. Versatile blooms for any occasion or interior setting.',
        category: catMap['tulips'],
        price: 399,
        mrp: 599,
        unit: 'per bunch',
        images: ['https://images.unsplash.com/photo-1520323232427-6b4b4576a89b?w=600&h=600&fit=crop'],
        stock: 200,
        badge: '',
        rating: 4.5,
        reviewCount: 67,
        createdBy: admin._id
      },
      {
        name: 'Danish Canary Yellow Tulips',
        description: 'Bright canary yellow tulips, cheerful and vibrant. Perfect for brightening up any room. 10 stems per bunch, long-lasting freshness.',
        category: catMap['tulips'],
        price: 449,
        mrp: 649,
        unit: 'per bunch',
        images: ['https://images.unsplash.com/photo-1496062031456-07b8f162a322?w=600&h=600&fit=crop'],
        stock: 150,
        badge: 'sale',
        rating: 4.4,
        reviewCount: 42,
        createdBy: admin._id
      },
      {
        name: 'Blush Orchid Phalaenopsis',
        description: 'Exotic moth orchid in soft blush tones. Long-lasting elegance perfect for premium gifting and home décor. Comes in a decorative pot.',
        category: catMap['orchids'],
        price: 1299,
        mrp: 1799,
        unit: 'per piece',
        images: ['https://images.unsplash.com/photo-1567696911980-2c669aad1fd9?w=600&h=600&fit=crop'],
        stock: 45,
        badge: 'bestseller',
        rating: 4.9,
        reviewCount: 83,
        createdBy: admin._id
      },
      {
        name: 'Golden Sunflower Giant Bunch',
        description: 'Magnificent oversized sunflowers radiating warmth and joy. A bunch of 6 giant stems. Statement pieces for summer-inspired arrangements.',
        category: catMap['sunflowers'],
        price: 299,
        mrp: 449,
        unit: 'per bunch',
        images: ['https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=600&h=600&fit=crop'],
        stock: 300,
        badge: '',
        rating: 4.5,
        reviewCount: 55,
        createdBy: admin._id
      },
      {
        name: 'Bridal Blush Bouquet',
        description: 'Hand-tied bridal bouquet featuring blush roses, white peonies, eucalyptus, and baby\'s breath. Complete wedding-ready arrangement with satin ribbon.',
        category: catMap['bouquets'],
        price: 1999,
        mrp: 2999,
        unit: 'per bouquet',
        images: ['https://images.unsplash.com/photo-1509610952-e2e6786a9158?w=600&h=600&fit=crop'],
        stock: 20,
        badge: 'bestseller',
        rating: 4.9,
        reviewCount: 124,
        createdBy: admin._id
      },
      {
        name: 'Tropical Paradise Bouquet',
        description: 'Vibrant tropical arrangement with birds of paradise, anthuriums, and lush greenery. Bold and exotic statement piece for special occasions.',
        category: catMap['bouquets'],
        price: 1499,
        mrp: 2199,
        unit: 'per bouquet',
        images: ['https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=600&h=600&fit=crop'],
        stock: 15,
        badge: 'new',
        rating: 4.7,
        reviewCount: 31,
        createdBy: admin._id
      },
      {
        name: 'Provence Dried Lavender Bundle',
        description: 'Sun-dried French lavender bundles with intense fragrance. Perfect for rustic arrangements, home décor, and aromatherapy. Lasts for months.',
        category: catMap['lavender'],
        price: 349,
        mrp: 549,
        unit: 'per bunch',
        images: ['https://images.unsplash.com/photo-1468327768560-75b778cbb551?w=600&h=600&fit=crop'],
        stock: 180,
        badge: '',
        rating: 4.6,
        reviewCount: 73,
        createdBy: admin._id
      },
      {
        name: 'Money Plant Golden Pothos',
        description: 'Lush golden pothos in a premium ceramic planter. Low-maintenance, air-purifying indoor plant. Perfect for offices and living rooms.',
        category: catMap['indoor-plants'],
        price: 399,
        mrp: 599,
        unit: 'per piece',
        images: ['https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=600&h=600&fit=crop'],
        stock: 100,
        badge: 'new',
        rating: 4.4,
        reviewCount: 28,
        createdBy: admin._id
      },
      {
        name: 'Pink Rose Romance Bouquet',
        description: 'A romantic bouquet of 20 premium pink roses wrapped in luxury paper with a satin bow. Express your love with the most timeless gesture.',
        category: catMap['bouquets'],
        price: 899,
        mrp: 1299,
        unit: 'per bouquet',
        images: ['https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600&h=600&fit=crop'],
        stock: 60,
        badge: 'sale',
        rating: 4.8,
        reviewCount: 95,
        createdBy: admin._id
      },
      {
        name: 'Mixed Wildflower Box',
        description: 'A curated box of seasonal wildflowers in vibrant colors. Each box is unique with a mix of daisies, chrysanthemums, and seasonal fillers.',
        category: catMap['bouquets'],
        price: 699,
        mrp: 999,
        unit: 'per box',
        images: ['https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=600&h=600&fit=crop'],
        stock: 40,
        badge: '',
        rating: 4.5,
        reviewCount: 47,
        createdBy: admin._id
      },
      {
        name: 'Red Rose Single Stem',
        description: 'A single premium red rose stem, carefully selected and wrapped. The perfect minimalist gesture for someone special.',
        category: catMap['roses'],
        price: 99,
        mrp: 149,
        unit: 'per piece',
        images: ['https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=600&h=600&fit=crop'],
        stock: 500,
        badge: '',
        rating: 4.3,
        reviewCount: 210,
        createdBy: admin._id
      },
      {
        name: 'White Orchid Premium Pot',
        description: 'A stunning white Dendrobium orchid in a handcrafted ceramic pot. Elegant, long-lasting, and perfect for any upscale interior.',
        category: catMap['orchids'],
        price: 1599,
        mrp: 2299,
        unit: 'per piece',
        images: ['https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?w=600&h=600&fit=crop'],
        stock: 30,
        badge: 'limited',
        rating: 4.8,
        reviewCount: 19,
        createdBy: admin._id
      },
      {
        name: 'Sunshine Daisy Basket',
        description: 'A cheerful basket arrangement of bright yellow and white daisies. Perfect for birthdays, get-well wishes, or just brightening someone\'s day.',
        category: catMap['sunflowers'],
        price: 549,
        mrp: 799,
        unit: 'per piece',
        images: ['https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=600&h=600&fit=crop'],
        stock: 75,
        badge: '',
        rating: 4.6,
        reviewCount: 52,
        createdBy: admin._id
      },
      {
        name: 'Peace Lily Indoor Plant',
        description: 'Beautiful peace lily in a minimalist white pot. Known for its air-purifying qualities and elegant white blooms. Thrives in low light.',
        category: catMap['indoor-plants'],
        price: 549,
        mrp: 799,
        unit: 'per piece',
        images: ['https://images.unsplash.com/photo-1567113110300-8488e046a362?w=600&h=600&fit=crop'],
        stock: 80,
        badge: '',
        rating: 4.7,
        reviewCount: 61,
        createdBy: admin._id
      },
      {
        name: 'Lavender Sachets Gift Set',
        description: 'Set of 6 handmade dried lavender sachets in organza bags. Perfect for wardrobes, drawers, or as a thoughtful gift. Intense natural fragrance.',
        category: catMap['lavender'],
        price: 249,
        mrp: 399,
        unit: 'per box',
        images: ['https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=600&h=600&fit=crop'],
        stock: 200,
        badge: 'sale',
        rating: 4.5,
        reviewCount: 88,
        createdBy: admin._id
      },
      {
        name: 'Elegant Lily Arrangement',
        description: 'A premium vase arrangement featuring pink and white Asiatic lilies with greenery. Ready-to-display gift with a glass vase included.',
        category: catMap['lilies'],
        price: 1199,
        mrp: 1799,
        unit: 'per piece',
        images: ['https://images.unsplash.com/photo-1533907650686-70576141c030?w=600&h=600&fit=crop'],
        stock: 25,
        badge: '',
        rating: 4.7,
        reviewCount: 36,
        createdBy: admin._id
      }
    ]);

    console.log(`Created ${products.length} products.`);

    await Banner.insertMany([
      {
        title: 'Flat 50% Off on Premium Roses',
        subtitle: 'Tonight only! Express your love with our bestselling rose collections.',
        image: 'https://images.unsplash.com/photo-1591886103814-616147485303?w=1400&h=600&fit=crop',
        link: '/shop?category=' + catMap['roses'],
        discountPercent: 50,
        isActive: true,
        order: 1
      },
      {
        title: 'Free Delivery Above ₹999',
        subtitle: 'Pan India delivery with temperature-controlled packaging. Order now!',
        image: 'https://images.unsplash.com/photo-1509610952-e2e6786a9158?w=1400&h=600&fit=crop',
        link: '/shop',
        discountPercent: 0,
        isActive: true,
        order: 2
      },
      {
        title: 'New Arrivals — Exotic Orchids',
        subtitle: 'Discover our curated collection of rare orchids. Starting from ₹1,299.',
        image: 'https://images.unsplash.com/photo-1567696911980-2c669aad1fd9?w=1400&h=600&fit=crop',
        link: '/shop?category=' + catMap['orchids'],
        discountPercent: 0,
        isActive: true,
        order: 3
      },
      {
        title: 'Wedding Season Special',
        subtitle: 'Up to 30% off on bulk bridal bouquets and floral arrangements.',
        image: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=1400&h=600&fit=crop',
        link: '/shop?category=' + catMap['bouquets'],
        discountPercent: 30,
        isActive: true,
        order: 4
      }
    ]);

    console.log('Created banners.');

    const order1 = await Order.create({
      customer: customer._id,
      items: [
        { product: products[0]._id, name: products[0].name, image: products[0].images[0], qty: 2, price: products[0].price, unit: 'bunch' },
        { product: products[8]._id, name: products[8].name, image: products[8].images[0], qty: 1, price: products[8].price, unit: 'bouquet' }
      ],
      totalAmount: (2 * 499) + 1999,
      deliveryCharge: 0,
      shippingAddress: {
        fullName: 'Priya Sharma',
        address: '42 Rosewood Lane, Bandra West',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400050',
        phone: '9876543210'
      },
      status: 'shipped',
      paymentStatus: 'paid',
      trackingHistory: [
        { status: 'Order Placed', timestamp: new Date(Date.now() - 3 * 86400000), note: 'Your order has been placed' },
        { status: 'Confirmed', timestamp: new Date(Date.now() - 2.5 * 86400000), note: 'Order confirmed by seller' },
        { status: 'Processing', timestamp: new Date(Date.now() - 2 * 86400000), note: 'Your order is being prepared' },
        { status: 'Shipped', timestamp: new Date(Date.now() - 1 * 86400000), note: 'Your order has been shipped' }
      ],
      estimatedDelivery: new Date(Date.now() + 2 * 86400000)
    });

    const order2 = await Order.create({
      customer: customer._id,
      items: [
        { product: products[6]._id, name: products[6].name, image: products[6].images[0], qty: 1, price: products[6].price, unit: 'piece' }
      ],
      totalAmount: 1299,
      deliveryCharge: 0,
      shippingAddress: {
        fullName: 'Priya Sharma',
        address: '42 Rosewood Lane, Bandra West',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400050',
        phone: '9876543210'
      },
      status: 'delivered',
      paymentStatus: 'paid',
      trackingHistory: [
        { status: 'Order Placed', timestamp: new Date(Date.now() - 7 * 86400000), note: 'Order placed' },
        { status: 'Confirmed', timestamp: new Date(Date.now() - 6.5 * 86400000), note: 'Order confirmed' },
        { status: 'Shipped', timestamp: new Date(Date.now() - 5 * 86400000), note: 'Shipped' },
        { status: 'Delivered', timestamp: new Date(Date.now() - 3 * 86400000), note: 'Delivered successfully' }
      ]
    });

    console.log('Created sample orders.');
    console.log('\n=== SEED COMPLETE ===');
    console.log('Admin:    admin@bloomsupply.com / admin123');
    console.log('Customer: customer@bloomsupply.com / password123');
    console.log('==================\n');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDB();
