const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/authMiddleware');
const hasRole = require('../middleware/hasRole');

router.get('/', verifyToken, hasRole("ADMIN"), userController.getAllUsers);
router.get('/:id', verifyToken, hasRole("ADMIN"), userController.getUserById);
router.post('/', verifyToken, hasRole("ADMIN"), userController.validate("createUser"), userController.createUser);
router.put('/:id', verifyToken, hasRole("ADMIN"), userController.validate("updateUser"), userController.updateUser);
router.delete('/:id', verifyToken, hasRole("ADMIN"), userController.deleteUser);

module.exports = router;