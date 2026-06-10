const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
    progressPercent: { type: Number, default: 0 },
    attendancePercent: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'completed', 'paused'], default: 'active' },
    lastAccessedAt: Date,
    completedAt: Date,
  },
  { timestamps: true }
);

enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
