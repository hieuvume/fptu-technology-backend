const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const { sendApplication, getApplication, getAll, rejectApplication, approveApplication, getById } = require('../controllers/applicationController');
const hasRole = require('../middleware/hasRole');

router.post('/send', verifyToken, sendApplication);
router.get('/get', verifyToken, getApplication);
router.get('/getAll', verifyToken, hasRole('ADMIN'), getAll);
router.get('/:id', verifyToken, hasRole('ADMIN'), getById);
router.post('/:id/reject', verifyToken, hasRole('ADMIN'), rejectApplication);
router.post('/:id/approve', verifyToken, hasRole('ADMIN'), approveApplication);

module.exports = router;