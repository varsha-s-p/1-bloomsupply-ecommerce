const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getOrderById, updateOrderStatus, getVendorOrders, getGrowerOrders, getOrderStats } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

// All order routes require authentication
router.post('/', protect, createOrder);
router.get('/my', protect, getMyOrders);
router.get('/stats', protect, getOrderStats);
router.get('/vendor', protect, authorize('vendor'), getVendorOrders);
router.get('/grower', protect, authorize('grower'), getGrowerOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, authorize('vendor', 'grower'), updateOrderStatus);

module.exports = router;
