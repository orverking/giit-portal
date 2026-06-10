const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const feedPostSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    audience: { type: String, enum: ['students', 'tutors', 'all', 'course'], default: 'all' },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    content: { type: String, required: true },
    mediaUrl: String,
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [commentSchema],
    tags: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model('FeedPost', feedPostSchema);
