const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const verifyToken = require('../middleware/authMiddleware');
const hasRole = require('../middleware/hasRole');
const exceptRoles = require('../middleware/exceptRole');

/**
 * @swagger
 * /apiapi/articles:
 *   get:
 *     summary: Get all articles
 *     tags: [Articles]
 *     responses:
 *       200:
 *         description: List of all articles
 */
router.get('/', articleController.getAllArticles);

/**
 * @swagger
 * /api/articles/{id}:
 *   get:
 *     summary: Get an article by ID
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The article ID
 *     responses:
 *       200:
 *         description: An article object
 *       404:
 *         description: Article not found
 */
router.get('/:id', verifyToken, exceptRoles("USER"), articleController.getArticleById);

/**
 * @swagger
 * /api/articles:
 *   post:
 *     summary: Create a new article
 *     tags: [Articles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Article created successfully
 *       400:
 *         description: Bad request
 */
router.post(
    '/',
    verifyToken,
    hasRole('ADMIN', 'AUTHOR', 'CONTRIBUTOR'),
    articleController.validate('createArticle'),
    articleController.createArticle
);

/**
 * @swagger
 * /api/articles/{id}:
 *   put:
 *     summary: Update an article
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The article ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Article updated successfully
 *       404:
 *         description: Article not found
 */
router.put('/:id',
    verifyToken,
    hasRole('ADMIN', 'AUTHOR', 'CONTRIBUTOR'),
    articleController.validate('updateArticle'),
    articleController.updateArticle);

/**
 * @swagger
 * /api/articles/{id}:
 *   delete:
 *     summary: Delete an article
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The article ID
 *     responses:
 *       200:
 *         description: Article deleted successfully
 *       404:
 *         description: Article not found
 */
router.delete('/:id',
    verifyToken,
    hasRole('ADMIN', 'MODERATOR'),
    articleController.deleteArticle);

/**
 * @swagger
 * /api/articles/list/trending:
 *   get:
 *     summary: Get trending articles
 *     tags: [Articles]
 *     responses:
 *       200:
 *         description: List of trending articles
 */
router.get('/list/trending',
    articleController.getTrendingArticles);

/**
 * @swagger
 * /api/articles/details/{slug}:
 *   get:
 *     summary: Get an article by slug
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: The article slug
 *     responses:
 *       200:
 *         description: An article object
 *       404:
 *         description: Article not found
 */
router.get('/details/:slug',
    articleController.getArticleBySlug);

/**
 * @swagger
 * /api/articles/related/{slug}:
 *   get:
 *     summary: Get related articles by slug
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: The article slug
 *     responses:
 *       200:
 *         description: List of related articles
 *       404:
 *         description: Article not found
 */
router.get('/related/:slug',
    articleController.getRelatedArticles);

/**
 * @swagger
 * /api/articles/search/articles:
 *   get:
 *     summary: Search articles
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: The search query
 *     responses:
 *       200:
 *         description: List of articles matching the search criteria
 */
router.get('/search/articles',
    articleController.searchArticles);

module.exports = router;
