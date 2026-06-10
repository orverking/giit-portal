const express = require('express');
const { getNotifications, markAsRead } = require('../controllers/notificationController');
const { protect, approvedOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect, approvedOnly);
router.get('/', getNotifications);
router.patch('/:notificationId/read', markAsRead);

module.exports = router;
