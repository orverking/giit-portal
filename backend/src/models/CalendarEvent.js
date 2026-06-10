const mongoose = require('mongoose');

const calendarEventSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: String,
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    type: { type: String, enum: ['study', 'class', 'assessment', 'personal'], default: 'study' },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    color: { type: String, default: '#8B5CF6' },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CalendarEvent', calendarEventSchema);
