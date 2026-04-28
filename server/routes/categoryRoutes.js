const express = require('express');
const router = express.Router();
const { getCategories, getCategoryBySlug, createCategory, updateCategory, deleteCategory, getAllCategories } = require('../controllers/categoryController');
const { protect, isAdmin } = require('../middleware/auth');

router.get('/', getCategories);
router.get('/all', protect, isAdmin, getAllCategories);
router.get('/:slug', getCategoryBySlug);

router.post('/', protect, isAdmin, createCategory);
router.put('/:id', protect, isAdmin, updateCategory);
router.delete('/:id', protect, isAdmin, deleteCategory);

module.exports = router;
