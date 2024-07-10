const express = require('express');
const { getDashboardStats } = require('../controllers/dashboardController');
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

module.exports = router;
