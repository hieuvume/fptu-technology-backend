const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const verifyToken = require('../middleware/authMiddleware');
const hasRole = require('../middleware/hasRole');
const exceptRoles = require('../middleware/exceptRole');

router.get('/', articleController.getAllArticles);
router.get('/:id', verifyToken, exceptRoles("USER"), articleController.getArticleById);
router.post('/', verifyToken, hasRole('ADMIN', 'AUTHOR', 'CONTRIBUTOR'), articleController.validate('createArticle'), articleController.createArticle);
router.put('/:id', verifyToken, hasRole('ADMIN', 'AUTHOR', 'CONTRIBUTOR'), articleController.validate('updateArticle'), articleController.updateArticle);
router.delete('/:id', verifyToken, hasRole('ADMIN', 'MODERATOR'), articleController.deleteArticle);

router.get('/list/trending', articleController.getTrendingArticles);
router.get('/details/:slug', articleController.getArticleBySlug);
router.get('/related/:slug', articleController.getRelatedArticles);

// router.get('/pending', verifyToken, articleController.getPendingArticles)

module.exports = router;