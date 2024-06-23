const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/register', authController.validate('register'), authController.register);
router.post('/login', authController.validate('login'), authController.login);
router.get('/me', verifyToken, authController.me);

module.exports = router;
