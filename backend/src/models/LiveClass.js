const mongoose = require('mongoose');

const attendeeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['invited', 'joined', 'missed'], default: 'invited' },
  },
  { _id: false }
);

const liveClassSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    tutor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    agenda: String,
    provider: { type: String, enum: ['jitsi', 'daily'], default: 'jitsi' },
    roomName: String,
    meetingUrl: String,
    startsAt: Date,
    endsAt: Date,
    isLive: { type: Boolean, default: false },
    attendees: [attendeeSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('LiveClass', liveClassSchema);
