export const mockStudentData = {
  metrics: {
    enrolledCourses: 3,
    averageProgress: 72,
    pendingAssignments: 1,
    streak: 5,
    xp: 430,
  },
  achievements: [{ title: '5-day learning streak', icon: '🔥' }],
  attendanceSeries: [72, 76, 84, 81, 90, 95],
  courses: [
    {
      _id: 'course-1',
      progressPercent: 75,
      attendancePercent: 92,
      course: {
        _id: 'software',
        title: 'Software Engineering',
        department: 'Computer & IT',
        shortDescription: 'Build modern web apps with strong UX foundations.',
        code: 'SDLC',
      },
    },
    {
      _id: 'course-2',
      progressPercent: 33,
      attendancePercent: 86,
      course: {
        _id: 'cyber',
        title: 'Cyber Security',
        department: 'Computer & IT',
        shortDescription: 'Protect systems and respond to live incidents.',
        code: 'CSIT',
      },
    },
  ],
  upcomingClasses: [
    {
      _id: 'live-1',
      title: 'Live UI Critique & Sprint Planning',
      meetingUrl: 'https://meet.jit.si/giit-software-live-class',
      startsAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      course: { title: 'Software Engineering' },
      tutor: { name: 'Sarah Nakyewa' },
    },
  ],
  events: [
    {
      _id: 'event-1',
      title: 'Revise prototype feedback',
      start: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
      end: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
      type: 'study',
      color: '#8B5CF6',
    },
  ],
  assignments: [
    {
      _id: 'assign-1',
      title: 'Prototype a Student Portal Journey',
      dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
      course: { title: 'Software Engineering' },
      points: 100,
    },
  ],
  feed: [
    {
      _id: 'post-1',
      author: { name: 'Sarah Nakyewa', role: 'tutor' },
      content: 'Welcome back, GIIT learners! Share one win from your study week. 🚀',
      likes: ['a'],
      comments: [{ _id: 'c1', user: { name: 'Mercy Atwine' }, content: 'Finished my reflection early!' }],
      createdAt: new Date().toISOString(),
    },
  ],
  messages: [
    {
      conversationKey: 'demo',
      participant: { _id: 'tutor-1', name: 'Sarah Nakyewa', role: 'tutor' },
      latestMessage: { content: 'Can you add one accessibility improvement before class?' },
      unreadCount: 1,
    },
  ],
  notifications: [
    {
      _id: 'n1',
      title: "You're on fire! 🔥",
      message: 'You are on a 5-day learning streak. Keep the momentum alive.',
      type: 'achievement',
      read: false,
      createdAt: new Date().toISOString(),
    },
  ],
};

export const mockTutorData = {
  metrics: {
    activeCourses: 4,
    upcomingClasses: 2,
    submissionsToGrade: 3,
    gradedSubmissions: 12,
  },
};

export const mockAdminData = {
  metrics: {
    totalUsers: 124,
    pendingApprovals: 2,
    totalCourses: 18,
    totalEvents: 45,
  },
  charts: {
    userMix: [96, 22, 6],
    engagement: [78, 88, 2],
  },
};
