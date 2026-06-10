const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Submission = require('../models/Submission');
const CalendarEvent = require('../models/CalendarEvent');
const Notification = require('../models/Notification');
const sendEmail = require('../utils/sendEmail');

const getApprovals = asyncHandler(async (req, res) => {
  const applicants = await User.find({
    role: { $in: ['student', 'tutor'] },
    status: 'pending',
  })
    .select('-password')
    .sort({ createdAt: -1 });

  res.json(applicants);
});

const reviewApproval = asyncHandler(async (req, res) => {
  const applicant = await User.findById(req.params.userId);
  if (!applicant) {
    res.status(404);
    throw new Error('Applicant not found');
  }

  applicant.status = req.body.status;
  await applicant.save();

  const notification = await Notification.create({
    user: applicant._id,
    title: applicant.status === 'approved' ? 'Account approved' : 'Registration update',
    message:
      applicant.status === 'approved'
        ? 'Great news! Your GIIT portal account is approved and ready for login.'
        : 'Your GIIT registration was not approved. Please contact admissions for support.',
    type: applicant.status === 'approved' ? 'approval' : 'warning',
  });

  await sendEmail({
    to: applicant.email,
    subject: applicant.status === 'approved' ? 'GIIT Account Approved' : 'GIIT Registration Update',
    text:
      applicant.status === 'approved'
        ? 'Your account has been approved. You can now log in to the GIIT portal.'
        : 'Your account was not approved. Please contact GIIT admissions.',
  });

  const io = req.app.locals.io;
  if (io) {
    io.to(`user:${applicant._id}`).emit('notification:new', notification);
  }

  res.json({ message: `Applicant ${applicant.status} successfully`, applicant });
});

const getAnalytics = asyncHandler(async (req, res) => {
  const [students, tutors, admins, courses, enrollments, submissions, pendingApprovals, totalEvents] = await Promise.all([
    User.countDocuments({ role: 'student' }),
    User.countDocuments({ role: 'tutor' }),
    User.countDocuments({ role: 'admin' }),
    Course.countDocuments(),
    Enrollment.countDocuments(),
    Submission.countDocuments(),
    User.countDocuments({ status: 'pending', role: { $ne: 'admin' } }),
    CalendarEvent.countDocuments(),
  ]);

  const completionBuckets = await Enrollment.aggregate([
    {
      $group: {
        _id: null,
        avgProgress: { $avg: '$progressPercent' },
        avgAttendance: { $avg: '$attendancePercent' },
      },
    },
  ]);

  res.json({
    metrics: {
      students,
      tutors,
      admins,
      courses,
      enrollments,
      submissions,
      pendingApprovals,
      totalEvents,
      avgProgress: Math.round(completionBuckets[0]?.avgProgress || 0),
      avgAttendance: Math.round(completionBuckets[0]?.avgAttendance || 0),
    },
    charts: {
      userMix: [students, tutors, admins],
      engagement: [
        Math.round(completionBuckets[0]?.avgProgress || 0),
        Math.round(completionBuckets[0]?.avgAttendance || 0),
        pendingApprovals,
      ],
    },
  });
});

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json(users);
});

module.exports = { getApprovals, reviewApproval, getAnalytics, getUsers };
