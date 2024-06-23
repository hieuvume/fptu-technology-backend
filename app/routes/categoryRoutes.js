const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const verifyToken = require('../middleware/authMiddleware');
const hasRole = require('../middleware/hasRole');

router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.post('/', verifyToken, hasRole('ADMIN'), categoryController.validate('createCategory'), categoryController.createCategory);
router.put('/:id', verifyToken, hasRole('ADMIN'), categoryController.validate('updateCategory'), categoryController.updateCategory);
router.delete('/:id', verifyToken, hasRole('ADMIN'), categoryController.deleteCategory);
router.get('/:id/articles', categoryController.getArticlesByCategory);

module.exports = router;
