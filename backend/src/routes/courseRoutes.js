const express = require('express');
const upload = require('../middleware/uploadMiddleware');
const {
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
} = require('../controllers/courseController');
const { protect, authorize, approvedOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getCourses);
router.get('/detail/:courseId', getCourseById);
router.use(protect, approvedOnly);
router.get('/dashboard', getDashboardSnapshot);
router.get('/my', getMyCourses);
router.post('/', authorize('tutor', 'admin'), createCourse);
router.post('/:courseId/enroll', authorize('student'), enrollCourse);
router.get('/:courseId/lessons', getCourseLessons);
router.post('/lessons/:lessonId/complete', authorize('student'), markLessonComplete);
router.get('/:courseId/assignments', getAssignments);
router.get('/assignments/all', getAssignments);
router.post('/assignments/:assignmentId/submissions', authorize('student'), upload.single('file'), submitAssignment);
router.get('/submissions/mine', getMySubmissions);
router.get('/submissions/tutor', authorize('tutor', 'admin'), getTutorSubmissions);
router.patch('/submissions/:submissionId/grade', authorize('tutor', 'admin'), gradeSubmission);

module.exports = router;
