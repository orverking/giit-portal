const express = require('express');
const {
  getConversations,
  getMessagesForConversation,
  sendMessage,
} = require('../controllers/messageController');
const { protect, approvedOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect, approvedOnly);
router.get('/', getConversations);
router.get('/:userId', getMessagesForConversation);
router.post('/', sendMessage);

module.exports = router;
