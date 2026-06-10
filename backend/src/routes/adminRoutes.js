const express = require('express');
const {
  getApprovals,
  reviewApproval,
  getAnalytics,
  getUsers,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect, authorize('admin'));
router.get('/approvals', getApprovals);
router.patch('/approvals/:userId', reviewApproval);
router.get('/analytics', getAnalytics);
router.get('/users', getUsers);

module.exports = router;
