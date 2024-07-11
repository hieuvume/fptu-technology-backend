const express = require('express');
const { getDashboardStats } = require('../controllers/dashboardController');
const { getPendingArticles, approveArticle } = require('../controllers/articleController');
const hasRole = require('../middleware/hasRole');
const verifyToken = require('../middleware/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 */
router.get('/', getDashboardStats);
router.get('/pending', verifyToken, hasRole('ADMIN', 'MODERATOR'), getPendingArticles);
router.put('/pending/:articleId', verifyToken, hasRole('ADMIN', 'MODERATOR'), approveArticle);

module.exports = router;
