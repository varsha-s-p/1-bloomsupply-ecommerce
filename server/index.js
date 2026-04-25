const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// Basic Route
app.get('/', (req, res) => {
  res.send('BloomSupply API is running...');
});

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bloomsupply')
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
