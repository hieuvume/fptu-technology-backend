const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const hasRole = require('../middleware/hasRole');
const userController = require('../controllers/userController');

// Routes cho Admin
router.get('/', verifyToken, hasRole("ADMIN"), userController.getAllUsers);
router.get('/:id', verifyToken, hasRole("ADMIN"), userController.getUserById);
router.post('/', verifyToken, hasRole("ADMIN"), userController.validate("createUser"), userController.createUser);
router.put('/:id', verifyToken, hasRole("ADMIN"), userController.validate("updateUser"), userController.updateUser);
router.delete('/:id', verifyToken, hasRole("ADMIN"), userController.deleteUser);

// Routes cho User
router.put('/me/:id', verifyToken, userController.validate("updateUser"), userController.updateUser);

module.exports = router;