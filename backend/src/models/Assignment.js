const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
    tutor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: String,
    dueDate: Date,
    points: { type: Number, default: 100 },
    attachments: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Assignment', assignmentSchema);
