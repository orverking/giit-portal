require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const { programmeCatalog } = require('./data/seedContent');
const User = require('./models/User');
const Course = require('./models/Course');
const Lesson = require('./models/Lesson');
const Enrollment = require('./models/Enrollment');
const Assignment = require('./models/Assignment');
const Submission = require('./models/Submission');
const LiveClass = require('./models/LiveClass');
const CalendarEvent = require('./models/CalendarEvent');
const FeedPost = require('./models/FeedPost');
const Message = require('./models/Message');
const Notification = require('./models/Notification');

const buildConversationKey = (userA, userB) => [userA.toString(), userB.toString()].sort().join('__');

const seed = async () => {
  await connectDB();

  await Promise.all([
    Notification.deleteMany(),
    Message.deleteMany(),
    FeedPost.deleteMany(),
    CalendarEvent.deleteMany(),
    LiveClass.deleteMany(),
    Submission.deleteMany(),
    Assignment.deleteMany(),
    Enrollment.deleteMany(),
    Lesson.deleteMany(),
    Course.deleteMany(),
    User.deleteMany(),
  ]);

  const [admin, tutor, studentOne, studentTwo, pendingTutor, pendingStudent] = await User.create([
    {
      name: 'GIIT Administrator',
      email: 'admin@giit.ac.ug',
      password: 'Admin@123',
      role: 'admin',
      status: 'approved',
      streak: 0,
      xp: 1000,
    },
    {
      name: 'Sarah Nakyewa',
      email: 'sarah.nakyewa@giit.ac.ug',
      password: 'Tutor@123',
      role: 'tutor',
      status: 'approved',
      expertise: ['Software Engineering', 'Cyber Security', 'Digital Skills'],
      bio: 'Hands-on tutor passionate about coaching students into confident practitioners.',
      streak: 12,
      xp: 890,
    },
    {
      name: 'Brian Ssemwanga',
      email: 'brian@student.giit.ac.ug',
      password: 'Student@123',
      role: 'student',
      status: 'approved',
      programme: 'Diploma in Software Engineering',
      studentNumber: 'GIIT/2026/001',
      streak: 5,
      xp: 430,
      progressSnapshot: 72,
      achievements: [{ title: '5-day learning streak', icon: '🔥' }],
    },
    {
      name: 'Mercy Atwine',
      email: 'mercy@student.giit.ac.ug',
      password: 'Student@123',
      role: 'student',
      status: 'approved',
      programme: 'Diploma in Cyber Security',
      studentNumber: 'GIIT/2026/002',
      streak: 9,
      xp: 520,
      progressSnapshot: 88,
      achievements: [{ title: 'Attendance champion', icon: '⭐' }],
    },
    {
      name: 'Peter Walusimbi',
      email: 'peter.walusimbi@giit.ac.ug',
      password: 'Tutor@123',
      role: 'tutor',
      status: 'pending',
      expertise: ['Journalism', 'Media Production'],
    },
    {
      name: 'Shamim Namusoke',
      email: 'shamim@student.giit.ac.ug',
      password: 'Student@123',
      role: 'student',
      status: 'pending',
      programme: 'Diploma in Information Technology',
    },
  ]);

  const courseDocs = [];
  for (const programme of programmeCatalog) {
    const course = await Course.create({
      title: programme.title,
      slug: programme.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      code: programme.code,
      shortDescription: programme.description,
      description: programme.description,
      category: programme.category,
      department: programme.department,
      level: programme.level,
      duration: programme.duration,
      price: programme.price,
      seats: programme.seats,
      credits: programme.credits,
      tutor,
      tags: ['Practical', 'GIIT', 'Career-ready'],
      outcomes: [
        'Hands-on practical training',
        'Career mentorship and portfolio development',
        'Assessment-driven progress tracking',
      ],
      modules: [
        { title: 'Foundations', summary: 'Core concepts and vocabulary.' },
        { title: 'Applied Practice', summary: 'Hands-on lab work and exercises.' },
        { title: 'Capstone Readiness', summary: 'Portfolio and assessment preparation.' },
      ],
    });
    courseDocs.push(course);
  }

  const softwareCourse = courseDocs.find((course) => course.title === 'Software Engineering');
  const cyberCourse = courseDocs.find((course) => course.title === 'Cyber Security');
  const itCourse = courseDocs.find((course) => course.title === 'Information Technology');

  const softwareLessons = await Lesson.insertMany([
    {
      course: softwareCourse._id,
      title: 'Welcome to Software Engineering',
      description: 'Orientation, outcomes and workflow mindset.',
      order: 1,
      durationMinutes: 24,
      points: 15,
      content: 'Introduction to GIIT’s project-based learning model.',
      isPreview: true,
    },
    {
      course: softwareCourse._id,
      title: 'User Research & Requirements',
      description: 'Translate user needs into product requirements.',
      order: 2,
      durationMinutes: 42,
      points: 20,
      content: 'Stakeholder mapping, user stories and requirement gathering.',
    },
    {
      course: softwareCourse._id,
      title: 'Interface Prototyping',
      description: 'Build interface flows for responsive web apps.',
      order: 3,
      durationMinutes: 55,
      points: 20,
      content: 'Wireframes, user journeys and design handoff.',
    },
    {
      course: softwareCourse._id,
      title: 'Deployment & QA',
      description: 'Quality assurance and production deployment strategy.',
      order: 4,
      durationMinutes: 38,
      points: 25,
      content: 'Testing plans, release checklists and feedback loops.',
    },
  ]);

  const cyberLessons = await Lesson.insertMany([
    {
      course: cyberCourse._id,
      title: 'Security Fundamentals',
      description: 'Threats, vulnerabilities and controls.',
      order: 1,
      durationMinutes: 32,
      points: 15,
      content: 'Security basics for modern digital systems.',
    },
    {
      course: cyberCourse._id,
      title: 'Network Defence Basics',
      description: 'Monitoring, firewalls and segmentation.',
      order: 2,
      durationMinutes: 48,
      points: 20,
      content: 'Secure network design and practical monitoring.',
    },
    {
      course: cyberCourse._id,
      title: 'Incident Response Simulation',
      description: 'Responding to suspicious events and breaches.',
      order: 3,
      durationMinutes: 60,
      points: 25,
      content: 'Playbooks, logs and coordinated response.',
    },
  ]);

  await Lesson.insertMany([
    {
      course: itCourse._id,
      title: 'Computer Systems Lab',
      description: 'Hardware and operating system foundations.',
      order: 1,
      durationMinutes: 35,
      points: 12,
      content: 'System setup and troubleshooting.',
    },
    {
      course: itCourse._id,
      title: 'Networking Essentials',
      description: 'Connectivity and diagnostics.',
      order: 2,
      durationMinutes: 50,
      points: 18,
      content: 'Routing, switching and connectivity issues.',
    },
  ]);

  const [softwareAssignment, cyberAssignment] = await Assignment.create([
    {
      course: softwareCourse._id,
      lesson: softwareLessons[2]._id,
      tutor: tutor._id,
      title: 'Prototype a Student Portal Journey',
      description: 'Create a clickable interface prototype for the student dashboard and upload your design rationale.',
      dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      points: 100,
    },
    {
      course: cyberCourse._id,
      lesson: cyberLessons[2]._id,
      tutor: tutor._id,
      title: 'Incident Response Reflection',
      description: 'Document the steps you would take during a simulated phishing incident.',
      dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      points: 100,
    },
  ]);

  const [enrollmentOne, enrollmentTwo, enrollmentThree] = await Enrollment.create([
    {
      student: studentOne._id,
      course: softwareCourse._id,
      completedLessons: [softwareLessons[0]._id, softwareLessons[1]._id, softwareLessons[2]._id],
      progressPercent: 75,
      attendancePercent: 92,
      lastAccessedAt: new Date(),
    },
    {
      student: studentOne._id,
      course: cyberCourse._id,
      completedLessons: [cyberLessons[0]._id],
      progressPercent: 33,
      attendancePercent: 86,
      lastAccessedAt: new Date(),
    },
    {
      student: studentTwo._id,
      course: cyberCourse._id,
      completedLessons: [cyberLessons[0]._id, cyberLessons[1]._id],
      progressPercent: 67,
      attendancePercent: 95,
      lastAccessedAt: new Date(),
    },
  ]);

  await Submission.create([
    {
      assignment: softwareAssignment._id,
      student: studentOne._id,
      notes: 'Attached my low-fidelity and high-fidelity dashboard flow.',
      status: 'graded',
      grade: 89,
      feedback: 'Excellent structure and clear rationale. Add more accessibility notes.',
      gradedAt: new Date(),
    },
    {
      assignment: cyberAssignment._id,
      student: studentTwo._id,
      notes: 'Documented my response playbook and escalation chain.',
      status: 'submitted',
    },
  ]);

  await LiveClass.create([
    {
      course: softwareCourse._id,
      tutor: tutor._id,
      title: 'Live UI Critique & Sprint Planning',
      agenda: 'Review student prototypes and plan capstone improvements.',
      roomName: 'giit-software-live-class',
      provider: 'jitsi',
      meetingUrl: 'https://meet.jit.si/giit-software-live-class',
      startsAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
      endsAt: new Date(Date.now() + 3 * 60 * 60 * 1000),
      attendees: [
        { user: studentOne._id, status: 'invited' },
        { user: studentTwo._id, status: 'invited' },
      ],
    },
    {
      course: cyberCourse._id,
      tutor: tutor._id,
      title: 'Threat Hunting Lab',
      agenda: 'Walk through common attack patterns and defensive actions.',
      roomName: 'giit-cyber-threat-hunt',
      provider: 'jitsi',
      meetingUrl: 'https://meet.jit.si/giit-cyber-threat-hunt',
      startsAt: new Date(Date.now() + 26 * 60 * 60 * 1000),
      endsAt: new Date(Date.now() + 27 * 60 * 60 * 1000),
      attendees: [
        { user: studentOne._id, status: 'invited' },
        { user: studentTwo._id, status: 'invited' },
      ],
    },
  ]);

  await CalendarEvent.create([
    {
      user: studentOne._id,
      title: 'Revise prototype feedback',
      description: 'Update dashboard interactions before Friday critique.',
      start: new Date(Date.now() + 5 * 60 * 60 * 1000),
      end: new Date(Date.now() + 6 * 60 * 60 * 1000),
      type: 'study',
      color: '#8B5CF6',
      course: softwareCourse._id,
    },
    {
      user: studentOne._id,
      title: 'Cyber security self-study',
      description: 'Review incident response notes.',
      start: new Date(Date.now() + 30 * 60 * 60 * 1000),
      end: new Date(Date.now() + 31 * 60 * 60 * 1000),
      type: 'study',
      color: '#F97316',
      course: cyberCourse._id,
    },
    {
      user: tutor._id,
      title: 'Grade pending submissions',
      description: 'Finish grading the incident response reflection.',
      start: new Date(Date.now() + 8 * 60 * 60 * 1000),
      end: new Date(Date.now() + 9 * 60 * 60 * 1000),
      type: 'assessment',
      color: '#2E1065',
      course: cyberCourse._id,
    },
  ]);

  await FeedPost.create([
    {
      author: tutor._id,
      audience: 'all',
      content: 'Welcome back, GIIT learners! This week is all about consistency, confidence and showing your work proudly. Drop one win from your study week below. 🚀',
      likes: [studentOne._id],
      comments: [{ user: studentTwo._id, content: 'Finished my incident response reflection ahead of time!' }],
      tags: ['motivation', 'community'],
    },
    {
      author: studentOne._id,
      audience: 'students',
      content: 'Today I pushed my student portal prototype to the next stage. The progress ring animation is finally smooth! 🎉',
      likes: [studentTwo._id, tutor._id],
      comments: [{ user: tutor._id, content: 'Brilliant momentum, Brian. Bring it to the critique session.' }],
      tags: ['build-in-public', 'software'],
    },
  ]);

  await Message.create([
    {
      conversationKey: buildConversationKey(studentOne._id, tutor._id),
      sender: tutor._id,
      recipient: studentOne._id,
      content: 'Great momentum on your dashboard prototype. Can you add one accessibility improvement before class?',
      readAt: new Date(),
    },
    {
      conversationKey: buildConversationKey(studentOne._id, tutor._id),
      sender: studentOne._id,
      recipient: tutor._id,
      content: 'Absolutely — I will improve contrast and keyboard navigation before the live critique.',
    },
  ]);

  await Notification.create([
    {
      user: studentOne._id,
      title: 'You\'re on fire! 🔥',
      message: 'Welcome back — you are on a 5-day learning streak. Keep the momentum alive.',
      type: 'achievement',
    },
    {
      user: studentOne._id,
      title: 'Upcoming live class',
      message: 'Live UI Critique & Sprint Planning starts in 2 hours. Your join button will glow as class time approaches.',
      type: 'info',
    },
    {
      user: tutor._id,
      title: 'Submission ready for grading',
      message: 'Mercy Atwine submitted the Incident Response Reflection assignment.',
      type: 'assignment',
    },
    {
      user: admin._id,
      title: 'Pending approval queue',
      message: 'Two new accounts are waiting for review.',
      type: 'approval',
    },
  ]);

  console.log('Seed complete');
  console.log('Admin login: admin@giit.ac.ug / Admin@123');
  console.log('Tutor login: sarah.nakyewa@giit.ac.ug / Tutor@123');
  console.log('Student login: brian@student.giit.ac.ug / Student@123');
  console.log('Student login: mercy@student.giit.ac.ug / Student@123');

  await mongoose.connection.close();
};

seed().catch(async (error) => {
  console.error(error);
  await mongoose.connection.close();
  process.exit(1);
});
