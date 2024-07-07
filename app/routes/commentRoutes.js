const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const verifyToken = require('../middleware/authMiddleware');
const hasRole = require('../middleware/hasRole');

router.get('/', commentController.getAllComments);
router.get('/:id', verifyToken, commentController.getCommentById);
router.post('/',verifyToken, commentController.validate('createComment'), commentController.createComment);
router.put('/:id', verifyToken, hasRole('USER'), commentController.validate('updateComment'), commentController.updateComment);
router.delete('/:id', verifyToken, hasRole('USER'), commentController.deleteComment);

module.exports = router;
