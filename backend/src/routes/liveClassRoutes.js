const express = require('express');
const {
  createLiveClass,
  getLiveClasses,
  updateAttendance,
} = require('../controllers/liveClassController');
const { protect, authorize, approvedOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect, approvedOnly);
router.get('/', getLiveClasses);
router.post('/', authorize('tutor', 'admin'), createLiveClass);
router.patch('/:liveClassId/attendance', authorize('tutor', 'admin'), updateAttendance);

module.exports = router;
