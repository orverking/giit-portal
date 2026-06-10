const fs = require('fs');
const slugify = require('slugify');
const asyncHandler = require('../utils/asyncHandler');
const { cloudinary, hasCloudinaryConfig } = require('../config/cloudinary');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Enrollment = require('../models/Enrollment');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const LiveClass = require('../models/LiveClass');
const CalendarEvent = require('../models/CalendarEvent');
const Notification = require('../models/Notification');
const User = require('../models/User');

const uploadFile = async (file) => {
  if (!file) return null;
  if (hasCloudinaryConfig) {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'giit-portal',
      resource_type: 'auto',
    });
    fs.unlinkSync(file.path);
    return result.secure_url;
  }
  return `/uploads/${file.filename}`;
};

const buildProgress = async (courseId, completedLessons = []) => {
  const totalLessons = await Lesson.countDocuments({ course: courseId });
  const progressPercent = totalLessons
    ? Math.round((completedLessons.length / totalLessons) * 100)
    : 0;
  return { totalLessons, progressPercent };
};

const getCourses = asyncHandler(async (req, res) => {
  const query = {};
  if (req.query.category) query.category = req.query.category;
  if (req.query.department) query.department = req.query.department;
  const courses = await Course.find(query).populate('tutor', 'name avatar email').sort({ createdAt: -1 });
  res.json(courses);
});

const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.courseId).populate('tutor', 'name avatar email bio');
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }
  const lessons = await Lesson.find({ course: course._id }).sort({ order: 1 });
  const assignments = await Assignment.find({ course: course._id }).sort({ dueDate: 1 });
  res.json({ ...course.toObject(), lessons, assignments });
});

const createCourse = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    shortDescription,
    category,
    department,
    level,
    duration,
    price,
    seats,
    credits,
    mode,
    tags,
    outcomes,
    modules,
    code,
  } = req.body;

  const slugBase = slugify(title, { lower: true, strict: true });
  const existingSlug = await Course.findOne({ slug: slugBase });
  const slug = existingSlug ? `${slugBase}-${Date.now()}` : slugBase;

  const course = await Course.create({
    title,
    slug,
    code,
    description,
    shortDescription,
    category,
    department,
    level,
    duration,
    price,
    seats,
    credits,
    mode,
    tutor: req.user.role === 'tutor' ? req.user._id : req.body.tutor || null,
    tags: Array.isArray(tags) ? tags : tags ? String(tags).split(',').map((x) => x.trim()) : [],
    outcomes: Array.isArray(outcomes)
      ? outcomes
      : outcomes
      ? String(outcomes).split('\n').filter(Boolean)
      : [],
    modules: Array.isArray(modules) ? modules : [],
  });

  const lessonPayload = Array.isArray(req.body.lessons) ? req.body.lessons : [];
  if (lessonPayload.length) {
    await Lesson.insertMany(
      lessonPayload.map((lesson, index) => ({
        course: course._id,
        title: lesson.title,
        description: lesson.description,
        order: lesson.order ?? index + 1,
        durationMinutes: lesson.durationMinutes || 30,
        content: lesson.content,
        videoUrl: lesson.videoUrl,
      }))
    );
  }

  res.status(201).json({ message: 'Course created successfully', course });
});

const getMyCourses = asyncHandler(async (req, res) => {
  if (req.user.role === 'student') {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate({ path: 'course', populate: { path: 'tutor', select: 'name avatar email' } })
      .sort({ updatedAt: -1 });
    return res.json(enrollments);
  }

  if (req.user.role === 'tutor') {
    const courses = await Course.find({ tutor: req.user._id }).sort({ createdAt: -1 });
    return res.json(courses);
  }

  const courses = await Course.find().sort({ createdAt: -1 });
  res.json(courses);
});

const enrollCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  const existing = await Enrollment.findOne({ student: req.user._id, course: course._id });
  if (existing) {
    res.status(400);
    throw new Error('You are already enrolled in this course');
  }

  const enrollment = await Enrollment.create({
    student: req.user._id,
    course: course._id,
    attendancePercent: 85,
  });

  await Notification.create({
    user: req.user._id,
    title: 'Welcome to the course!',
    message: `You are now enrolled in ${course.title}. Let's build momentum together.`,
    type: 'success',
    meta: { courseId: course._id },
  });

  res.status(201).json({ message: 'Enrolled successfully', enrollment });
});

const getCourseLessons = asyncHandler(async (req, res) => {
  const lessons = await Lesson.find({ course: req.params.courseId }).sort({ order: 1 });
  res.json(lessons);
});

const markLessonComplete = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.lessonId);
  if (!lesson) {
    res.status(404);
    throw new Error('Lesson not found');
  }

  const enrollment = await Enrollment.findOne({ student: req.user._id, course: lesson.course });
  if (!enrollment) {
    res.status(404);
    throw new Error('Enrollment not found');
  }

  const alreadyCompleted = enrollment.completedLessons.some(
    (item) => item.toString() === lesson._id.toString()
  );

  if (!alreadyCompleted) {
    enrollment.completedLessons.push(lesson._id);
  }

  const { progressPercent } = await buildProgress(lesson.course, enrollment.completedLessons);
  enrollment.progressPercent = progressPercent;
  enrollment.lastAccessedAt = new Date();
  if (progressPercent >= 100) {
    enrollment.status = 'completed';
    enrollment.completedAt = new Date();
  }
  await enrollment.save();

  const user = await User.findById(req.user._id);
  user.xp += lesson.points || 10;
  user.progressSnapshot = progressPercent;
  if (progressPercent >= 100 && !user.achievements.find((item) => item.title === 'Course Completed')) {
    user.achievements.push({ title: 'Course Completed', icon: '🎓' });
  }
  await user.save();

  await Notification.create({
    user: req.user._id,
    title: progressPercent === 100 ? 'Course completed!' : 'Lesson completed!',
    message:
      progressPercent === 100
        ? 'Outstanding work — you completed your course and unlocked a graduation celebration.'
        : `Progress updated to ${progressPercent}%. Keep going, you are building momentum!`,
    type: progressPercent === 100 ? 'achievement' : 'success',
    meta: { courseId: lesson.course, progressPercent },
  });

  res.json({ message: 'Lesson completion saved', progressPercent, enrollment });
});

const getAssignments = asyncHandler(async (req, res) => {
  const query = req.params.courseId ? { course: req.params.courseId } : {};
  if (req.user.role === 'tutor') query.tutor = req.user._id;
  const assignments = await Assignment.find(query).populate('course', 'title').sort({ dueDate: 1 });
  res.json(assignments);
});

const submitAssignment = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findById(req.params.assignmentId).populate('course', 'title tutor');
  if (!assignment) {
    res.status(404);
    throw new Error('Assignment not found');
  }

  const fileUrl = await uploadFile(req.file);

  const submission = await Submission.findOneAndUpdate(
    { assignment: assignment._id, student: req.user._id },
    {
      assignment: assignment._id,
      student: req.user._id,
      fileUrl,
      notes: req.body.notes,
      status: 'submitted',
      submittedAt: new Date(),
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  await Notification.create({
    user: req.user._id,
    title: 'Assignment submitted successfully',
    message: `${assignment.title} is now with your tutor. Great job staying on track!`,
    type: 'assignment',
    meta: { assignmentId: assignment._id },
  });

  if (assignment.tutor) {
    await Notification.create({
      user: assignment.tutor,
      title: 'New submission received',
      message: `${req.user.name} submitted work for ${assignment.title}.`,
      type: 'assignment',
      meta: { assignmentId: assignment._id, submissionId: submission._id },
    });
  }

  res.status(201).json({ message: 'Submission uploaded successfully', submission });
});

const getMySubmissions = asyncHandler(async (req, res) => {
  const query = req.user.role === 'student' ? { student: req.user._id } : {};
  const submissions = await Submission.find(query)
    .populate({ path: 'assignment', populate: { path: 'course', select: 'title' } })
    .populate('student', 'name email')
    .sort({ updatedAt: -1 });
  res.json(submissions);
});

const getTutorSubmissions = asyncHandler(async (req, res) => {
  const assignments = await Assignment.find({ tutor: req.user._id }).select('_id');
  const submissions = await Submission.find({ assignment: { $in: assignments.map((a) => a._id) } })
    .populate({ path: 'assignment', populate: { path: 'course', select: 'title' } })
    .populate('student', 'name email programme')
    .sort({ updatedAt: -1 });
  res.json(submissions);
});

const gradeSubmission = asyncHandler(async (req, res) => {
  const submission = await Submission.findById(req.params.submissionId)
    .populate('student', 'name')
    .populate('assignment', 'title course');

  if (!submission) {
    res.status(404);
    throw new Error('Submission not found');
  }

  submission.grade = Number(req.body.grade);
  submission.feedback = req.body.feedback;
  submission.status = 'graded';
  submission.gradedAt = new Date();
  await submission.save();

  await Notification.create({
    user: submission.student._id,
    title: 'Your grade is in!',
    message:
      submission.grade >= 80
        ? `Excellent work! You scored ${submission.grade}% on ${submission.assignment.title}.`
        : `Your ${submission.assignment.title} has been graded: ${submission.grade}%. Review feedback and keep growing.`,
    type: submission.grade >= 80 ? 'achievement' : 'success',
    meta: { submissionId: submission._id, grade: submission.grade },
  });

  res.json({ message: 'Submission graded successfully', submission });
});

const getDashboardSnapshot = asyncHandler(async (req, res) => {
  if (req.user.role === 'student') {
    const enrollments = await Enrollment.find({ student: req.user._id }).populate('course', 'title');
    const upcomingClasses = await LiveClass.find({
      startsAt: { $gte: new Date() },
    })
      .populate('course', 'title')
      .sort({ startsAt: 1 })
      .limit(3);
    const submissions = await Submission.find({ student: req.user._id }).populate('assignment', 'title');
    const averageProgress = enrollments.length
      ? Math.round(
          enrollments.reduce((sum, item) => sum + (item.progressPercent || 0), 0) / enrollments.length
        )
      : 0;

    return res.json({
      metrics: {
        enrolledCourses: enrollments.length,
        averageProgress,
        pendingAssignments: submissions.filter((item) => item.status === 'submitted').length,
        streak: req.user.streak,
        xp: req.user.xp,
      },
      enrollments,
      upcomingClasses,
      achievements: req.user.achievements,
    });
  }

  if (req.user.role === 'tutor') {
    const courses = await Course.find({ tutor: req.user._id });
    const liveClasses = await LiveClass.find({ tutor: req.user._id, startsAt: { $gte: new Date() } }).limit(5);
    const assignments = await Assignment.find({ tutor: req.user._id });
    const submissions = await Submission.find({ assignment: { $in: assignments.map((a) => a._id) } });
    return res.json({
      metrics: {
        activeCourses: courses.length,
        upcomingClasses: liveClasses.length,
        submissionsToGrade: submissions.filter((item) => item.status === 'submitted').length,
        gradedSubmissions: submissions.filter((item) => item.status === 'graded').length,
      },
      courses,
      liveClasses,
      assignments,
    });
  }

  const totalUsers = await User.countDocuments();
  const pendingApprovals = await User.countDocuments({ status: 'pending', role: { $ne: 'admin' } });
  const totalCourses = await Course.countDocuments();
  const totalEvents = await CalendarEvent.countDocuments();
  return res.json({
    metrics: {
      totalUsers,
      pendingApprovals,
      totalCourses,
      totalEvents,
    },
  });
});

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  getMyCourses,
  enrollCourse,
  getCourseLessons,
  markLessonComplete,
  getAssignments,
  submitAssignment,
  getMySubmissions,
  getTutorSubmissions,
  gradeSubmission,
  getDashboardSnapshot,
};
