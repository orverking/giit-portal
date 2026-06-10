const express = require('express');
const { getEvents, createEvent, updateEvent } = require('../controllers/calendarController');
const { protect, approvedOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect, approvedOnly);
router.get('/', getEvents);
router.post('/', createEvent);
router.patch('/:eventId', updateEvent);

module.exports = router;
