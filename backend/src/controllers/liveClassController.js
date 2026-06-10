const asyncHandler = require('../utils/asyncHandler');
const LiveClass = require('../models/LiveClass');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Notification = require('../models/Notification');

const createLiveClass = asyncHandler(async (req, res) => {
  const { course, title, agenda, startsAt, endsAt, provider = 'jitsi' } = req.body;
  const courseDoc = await Course.findById(course);
  if (!courseDoc) {
    res.status(404);
    throw new Error('Course not found');
  }

  const roomName = `giit-${courseDoc.slug}-${Date.now()}`;
  const meetingUrl =
    provider === 'jitsi'
      ? `https://meet.jit.si/${roomName}`
      : `https://your-domain.daily.co/${roomName}`;

  const enrolledStudents = await Enrollment.find({ course }).select('student');

  const liveClass = await LiveClass.create({
    course,
    tutor: req.user._id,
    title,
    agenda,
    provider,
    roomName,
    meetingUrl,
    startsAt,
    endsAt,
    attendees: enrolledStudents.map((item) => ({ user: item.student, status: 'invited' })),
  });

  if (enrolledStudents.length) {
    await Notification.insertMany(
      enrolledStudents.map((item) => ({
        user: item.student,
        title: 'New live class scheduled',
        message: `${title} has been scheduled. Get ready to join and keep your momentum going.`,
        type: 'info',
        meta: { liveClassId: liveClass._id, meetingUrl },
      }))
    );
  }

  res.status(201).json({ message: 'Live class created successfully', liveClass });
});

const getLiveClasses = asyncHandler(async (req, res) => {
  let query = {};
  if (req.user.role === 'tutor') query.tutor = req.user._id;

  if (req.user.role === 'student') {
    const enrollments = await Enrollment.find({ student: req.user._id }).select('course');
    query.course = { $in: enrollments.map((item) => item.course) };
  }

  const liveClasses = await LiveClass.find(query)
    .populate('course', 'title code')
    .populate('tutor', 'name email')
    .populate('attendees.user', 'name email programme')
    .sort({ startsAt: 1 });

  res.json(liveClasses);
});

const updateAttendance = asyncHandler(async (req, res) => {
  const liveClass = await LiveClass.findById(req.params.liveClassId);
  if (!liveClass) {
    res.status(404);
    throw new Error('Live class not found');
  }

  liveClass.attendees = req.body.attendees || liveClass.attendees;
  liveClass.isLive = Boolean(req.body.isLive ?? liveClass.isLive);
  await liveClass.save();

  res.json({ message: 'Attendance updated successfully', liveClass });
});

module.exports = { createLiveClass, getLiveClasses, updateAttendance };
