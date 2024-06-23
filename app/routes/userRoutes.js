const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/', verifyToken, userController.getAllUsers);
router.get('/:id', verifyToken, userController.getUserById);

// router.post('/', verifyToken, articleController.validate('createArticle'), articleController.createArticle);
// router.put('/:id', verifyToken, articleController.validate('updateArticle'), articleController.updateArticle);
// router.delete('/:id', verifyToken, articleController.deleteArticle);

module.exports = router;