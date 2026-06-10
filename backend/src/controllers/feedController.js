const asyncHandler = require('../utils/asyncHandler');
const FeedPost = require('../models/FeedPost');

const getFeed = asyncHandler(async (req, res) => {
  const roleAudience = req.user.role === 'student' ? 'students' : 'tutors';
  const posts = await FeedPost.find({ audience: { $in: ['all', roleAudience] } })
    .populate('author', 'name role avatar')
    .populate('comments.user', 'name avatar')
    .sort({ createdAt: -1 });
  res.json(posts);
});

const createPost = asyncHandler(async (req, res) => {
  const post = await FeedPost.create({
    author: req.user._id,
    audience: req.body.audience || 'all',
    content: req.body.content,
    tags: Array.isArray(req.body.tags)
      ? req.body.tags
      : req.body.tags
      ? String(req.body.tags)
          .split(',')
          .map((tag) => tag.trim())
      : [],
  });

  const populated = await FeedPost.findById(post._id).populate('author', 'name role avatar');
  res.status(201).json({ message: 'Post created successfully', post: populated });
});

const toggleLike = asyncHandler(async (req, res) => {
  const post = await FeedPost.findById(req.params.postId);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  const existingLike = post.likes.find((id) => id.toString() === req.user._id.toString());
  if (existingLike) {
    post.likes = post.likes.filter((id) => id.toString() !== req.user._id.toString());
  } else {
    post.likes.push(req.user._id);
  }

  await post.save();
  const populated = await FeedPost.findById(post._id)
    .populate('author', 'name role avatar')
    .populate('comments.user', 'name avatar');
  res.json(populated);
});

const addComment = asyncHandler(async (req, res) => {
  const post = await FeedPost.findById(req.params.postId);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  post.comments.push({ user: req.user._id, content: req.body.content });
  await post.save();

  const populated = await FeedPost.findById(post._id)
    .populate('author', 'name role avatar')
    .populate('comments.user', 'name avatar');
  res.json(populated);
});

module.exports = { getFeed, createPost, toggleLike, addComment };
