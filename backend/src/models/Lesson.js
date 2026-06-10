const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    description: String,
    order: { type: Number, default: 0 },
    durationMinutes: { type: Number, default: 30 },
    videoUrl: String,
    content: String,
    resources: [String],
    isPreview: { type: Boolean, default: false },
    points: { type: Number, default: 10 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lesson', lessonSchema);
