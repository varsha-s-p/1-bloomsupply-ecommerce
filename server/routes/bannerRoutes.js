const express = require('express');
const router = express.Router();
const { getActiveBanners, getAllBanners, createBanner, updateBanner, deleteBanner } = require('../controllers/bannerController');
const { protect, isAdmin } = require('../middleware/auth');

router.get('/', getActiveBanners);
router.get('/all', protect, isAdmin, getAllBanners);

router.post('/', protect, isAdmin, createBanner);
router.put('/:id', protect, isAdmin, updateBanner);
router.delete('/:id', protect, isAdmin, deleteBanner);

module.exports = router;
