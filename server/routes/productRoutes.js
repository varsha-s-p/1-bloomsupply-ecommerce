const express = require('express');
const router = express.Router();
const { getProducts, getProductById, getRelatedProducts, getBestsellers, getRecentProducts, createProduct, updateProduct, deleteProduct, getAllProducts } = require('../controllers/productController');
const { protect, isAdmin } = require('../middleware/auth');

router.get('/', getProducts);
router.get('/bestsellers', getBestsellers);
router.get('/recent', getRecentProducts);
router.get('/all', protect, isAdmin, getAllProducts);
router.get('/:id', getProductById);
router.get('/:id/related', getRelatedProducts);

router.post('/', protect, isAdmin, createProduct);
router.put('/:id', protect, isAdmin, updateProduct);
router.delete('/:id', protect, isAdmin, deleteProduct);

module.exports = router;
