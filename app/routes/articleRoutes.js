const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/', articleController.getAllArticles);
router.get('/:id', articleController.getArticleById);
router.post('/', verifyToken, articleController.validate('createArticle'), articleController.createArticle);
router.put('/:id', verifyToken, articleController.validate('updateArticle'), articleController.updateArticle);
router.delete('/:id', verifyToken, articleController.deleteArticle);

module.exports = router;