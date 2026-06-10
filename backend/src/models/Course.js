const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema(
  {
    title: String,
    summary: String,
  },
  { _id: false }
);

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    code: String,
    shortDescription: String,
    description: { type: String, required: true },
    category: String,
    department: String,
    level: String,
    duration: String,
    price: Number,
    seats: Number,
    credits: Number,
    mode: { type: String, default: 'Blended' },
    tutor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    coverImage: String,
    heroColor: { type: String, default: '#6D28D9' },
    tags: [String],
    outcomes: [String],
    modules: [moduleSchema],
    published: { type: Boolean, default: true },
    completionCelebration: { type: String, default: 'graduation-cap' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
