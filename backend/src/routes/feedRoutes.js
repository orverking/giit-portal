const express = require('express');
const { getFeed, createPost, toggleLike, addComment } = require('../controllers/feedController');
const { protect, approvedOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect, approvedOnly);
router.get('/', getFeed);
router.post('/', createPost);
router.post('/:postId/like', toggleLike);
router.post('/:postId/comment', addComment);

module.exports = router;
