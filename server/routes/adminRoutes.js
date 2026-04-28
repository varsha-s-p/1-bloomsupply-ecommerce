const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllUsers, getAllOrders, updateUserStatus } = require('../controllers/adminController');
const { protect, isAdmin } = require('../middleware/auth');

router.use(protect, isAdmin);

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/orders', getAllOrders);
router.put('/users/:id', updateUserStatus);

module.exports = router;
