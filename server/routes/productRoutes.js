const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getMyProducts } = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getProducts);
router.get('/my', protect, authorize('vendor', 'grower'), getMyProducts);
router.get('/:id', getProductById);

// Protected routes (vendor/grower only)
router.post('/', protect, authorize('vendor', 'grower'), createProduct);
router.put('/:id', protect, authorize('vendor', 'grower'), updateProduct);
router.delete('/:id', protect, authorize('vendor', 'grower'), deleteProduct);

module.exports = router;
