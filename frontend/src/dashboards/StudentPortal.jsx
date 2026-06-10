import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  GraduationCap,
  Home,
  LayoutGrid,
  MessageSquare,
  Rocket,
  Video,
  Bell,
  User,
  Heart,
  Send,
} from 'lucide-react';
import { motion } from 'framer-motion';
import api, { withFallback } from '../services/api';
import { mockStudentData } from '../data/mockPortal';
import { fetchDashboard } from '../features/portal/portalSlice';
import { logout, updateProfile } from '../features/auth/authSlice';
import { useSocket } from '../hooks/useSocket';
import DashboardSidebar from '../components/DashboardSidebar';
import DashboardHeader from '../components/DashboardHeader';
import GlassCard from '../components/GlassCard';
import GradientButton from '../components/GradientButton';
import PageLoader from '../components/PageLoader';
import ProgressRing from '../components/ProgressRing';
import AttendanceChart from '../components/AttendanceChart';
import StudyCalendar from '../components/StudyCalendar';
import MotivationalBanner from '../components/MotivationalBanner';
import FeedList from '../components/FeedList';
import MessagePanel from '../components/MessagePanel';
import LiveClassFrame from '../components/LiveClassFrame';

const StudentPortal = () => {
  const { section = 'overview' } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useSelector((state) => state.auth);
  const dashboardState = useSelector((state) => state.portal.dashboard);
  const socket = useSocket(user);

  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [liveClasses, setLiveClasses] = useState([]);
  const [events, setEvents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [feed, setFeed] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [liveJoin, setLiveJoin] = useState(null);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    programme: user?.programme || '',
    avatar: user?.avatar || '',
  });

  const sidebarItems = useMemo(
    () => [
      { to: '/portal/student/overview', label: 'Overview', icon: Home },
      { to: '/portal/student/courses', label: 'My Courses', icon: LayoutGrid },
      { to: '/portal/student/live', label: 'Live Classes', icon: Video },
      { to: '/portal/student/planner', label: 'Study Planner', icon: CalendarDays },
      { to: '/portal/student/assessments', label: 'Assessments', icon: BookOpen },
      { to: '/portal/student/feed', label: 'Feeds', icon: Heart },
      { to: '/portal/student/messages', label: 'Messaging', icon: MessageSquare },
      { to: '/portal/student/profile', label: 'Profile', icon: User },
    ],
    []
  );

  const dashboard = dashboardState || mockStudentData;

  useEffect(() => {
    dispatch(fetchDashboard('student'));
  }, [dispatch]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [coursesData, liveData, eventData, assignmentData, submissionData, feedData, convoData, notificationData] =
        await Promise.all([
          withFallback(() => api.get('/courses/my'), mockStudentData.courses),
          withFallback(() => api.get('/live-classes'), mockStudentData.upcomingClasses),
          withFallback(() => api.get('/calendar'), mockStudentData.events),
          withFallback(() => api.get('/courses/assignments/all'), mockStudentData.assignments),
          withFallback(() => api.get('/courses/submissions/mine'), []),
          withFallback(() => api.get('/feed'), mockStudentData.feed),
          withFallback(() => api.get('/messages'), mockStudentData.messages),
          withFallback(() => api.get('/notifications'), mockStudentData.notifications),
        ]);

      setCourses(coursesData);
      setLiveClasses(liveData);
      setEvents(eventData);
      setAssignments(assignmentData);
      setSubmissions(submissionData);
      setFeed(feedData);
      setConversations(convoData);
      setNotifications(notificationData);
      setLoading(false);
    };

    load();
  }, []);

  useEffect(() => {
    if (!socket) return undefined;

    const handleNewMessage = (message) => {
      toast.success('New message received');
      setNotifications((prev) => [
        {
          _id: `local-${Date.now()}`,
          title: 'New message',
          message: `${message.sender?.name || 'Someone'} sent you a message.`,
          read: false,
        },
        ...prev,
      ]);
    };

    const handleNewNotification = (notification) => {
      toast.success(notification.title);
      setNotifications((prev) => [notification, ...prev]);
    };

    socket.on('message:new', handleNewMessage);
    socket.on('notification:new', handleNewNotification);

    return () => {
      socket.off('message:new', handleNewMessage);
      socket.off('notification:new', handleNewNotification);
    };
  }, [socket]);

  useEffect(() => {
    setProfileForm({
      name: user?.name || '',
      phone: user?.phone || '',
      bio: user?.bio || '',
      programme: user?.programme || '',
      avatar: user?.avatar || '',
    });
  }, [user]);

  const attendanceSeries = [72, 76, 84, 81, 90, 95];

  const handleLikePost = async (post) => {
    const updated = await withFallback(() => api.post(`/feed/${post._id}/like`), {
      ...post,
      likes: post.likes?.length ? [] : ['local'],
    });
    setFeed((prev) => prev.map((item) => (item._id === post._id ? updated : item)));
    toast.success('Heart burst! You liked a community post.');
  };

  const handleCommentPost = async (post, content) => {
    const updated = await withFallback(() => api.post(`/feed/${post._id}/comment`, { content }), {
      ...post,
      comments: [...(post.comments || []), { _id: Date.now().toString(), user: { name: user.name }, content }],
    });
    setFeed((prev) => prev.map((item) => (item._id === post._id ? updated : item)));
    toast.success('Comment shared — community momentum unlocked!');
  };

  const openConversation = async (conversation) => {
    setActiveConversation(conversation);
    const list = await withFallback(() => api.get(`/messages/${conversation.participant._id}`), []);
    setMessages(list);
    socket?.emit('join-conversation', conversation.conversationKey);
  };

  const sendMessage = async (conversation, content) => {
    const recipientId = conversation.participant?._id;
    const message = await withFallback(() => api.post('/messages', { recipientId, content }), {
      _id: Date.now().toString(),
      sender: { _id: user._id, name: user.name },
      recipient: conversation.participant,
      content,
      createdAt: new Date().toISOString(),
    });
    setMessages((prev) => [...prev, message]);
    toast.success('Message sent with a gentle pop.');
  };

  const markNotificationRead = async (notification) => {
    await withFallback(() => api.patch(`/notifications/${notification._id}/read`), notification);
    setNotifications((prev) => prev.map((item) => (item._id === notification._id ? { ...item, read: true } : item)));
  };

  const moveEvent = async ({ event, start, end }) => {
    const payload = { ...event, start, end };
    await withFallback(() => api.patch(`/calendar/${event._id}`, payload), payload);
    setEvents((prev) => prev.map((item) => (item._id === event._id ? { ...item, start, end } : item)));
    toast.success('Your study plan is set! 🚀');
  };

  const addPlannerItem = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      title: formData.get('title'),
      description: formData.get('description'),
      start: new Date(formData.get('start')).toISOString(),
      end: new Date(formData.get('end')).toISOString(),
      type: 'study',
      color: '#8B5CF6',
    };
    const response = await withFallback(() => api.post('/calendar', payload), { event: { _id: Date.now().toString(), ...payload } });
    setEvents((prev) => [...prev, response.event || response]);
    e.currentTarget.reset();
    toast.success('Your study plan is set! 🚀');
  };

  const submitAssignment = async (assignment) => {
    const formData = new FormData();
    formData.append('notes', 'Submitting from the GIIT portal demo experience.');
    await withFallback(() => api.post(`/courses/assignments/${assignment._id}/submissions`, formData), { ok: true });
    toast.success('Paper plane launched — assignment submitted successfully!');
  };

  const updateProgress = async (courseItem) => {
    try {
      const lessons = await withFallback(() => api.get(`/courses/${courseItem.course._id}/lessons`), []);
      if (!lessons.length) {
        toast.success('Lesson completion sparkle!');
        return;
      }
      const targetLesson = lessons[Math.min(lessons.length - 1, 0)];
      await withFallback(() => api.post(`/courses/lessons/${targetLesson._id}/complete`), { progressPercent: Math.min(100, (courseItem.progressPercent || 0) + 25) });
      setCourses((prev) =>
        prev.map((item) =>
          item._id === courseItem._id
            ? { ...item, progressPercent: Math.min(100, (item.progressPercent || 0) + 25) }
            : item
        )
      );
      toast.success('Lesson completed — progress bar sparkles upward!');
    } catch (error) {
      toast.error(String(error));
    }
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    await dispatch(updateProfile(profileForm));
    toast.success('Profile updated with a success spin!');
  };

  if (loading || authLoading) {
    return <PageLoader label="Preparing your student cockpit..." />;
  }

  const renderOverview = () => (
    <div className="space-y-6">
      <MotivationalBanner
        title={`You’re on fire, ${user?.name?.split(' ')[0] || 'Learner'}! 🔥`}
        message="Your streak, progress pulse and upcoming class reminders are all aligned to keep you motivated today."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Enrolled Courses', value: dashboard.metrics?.enrolledCourses || courses.length, icon: GraduationCap },
          { label: 'Average Progress', value: `${dashboard.metrics?.averageProgress || 0}%`, icon: Rocket },
          { label: 'Pending Assignments', value: dashboard.metrics?.pendingAssignments || assignments.length, icon: BookOpen },
          { label: 'Learning XP', value: dashboard.metrics?.xp || user?.xp || 0, icon: SparkCardIcon },
        ].map((item) => (
          <GlassCard key={item.label} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-white/55">{item.label}</p>
                <h3 className="mt-3 text-3xl font-black text-white">{item.value}</h3>
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/5 text-giit-orange">
                <item.icon className="h-5 w-5" />
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <GlassCard className="p-6">
          <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
            <ProgressRing value={dashboard.metrics?.averageProgress || 72} label="Course mastery" showCelebration />
            <div className="max-w-sm">
              <h3 className="text-2xl font-black text-white">Progress rings that pulse with your momentum</h3>
              <p className="mt-3 text-white/65">
                Every completed lesson nudges your ring forward. Hit 100% and the celebration sequence kicks in.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {(dashboard.achievements || user?.achievements || []).map((achievement) => (
                  <span key={achievement.title} className="rounded-full bg-white/5 px-3 py-2 text-sm text-white/75">
                    {achievement.icon} {achievement.title}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>
        <AttendanceChart series={attendanceSeries} />
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <GlassCard className="p-6">
          <h3 className="text-xl font-bold text-white">My course momentum</h3>
          <div className="mt-5 space-y-4">
            {courses.map((item) => (
              <motion.div key={item._id} whileHover={{ x: 4 }} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-giit-orange">{item.course?.code || 'GIIT'}</p>
                    <h4 className="mt-1 text-lg font-bold text-white">{item.course?.title}</h4>
                    <p className="mt-1 text-sm text-white/55">{item.course?.shortDescription}</p>
                  </div>
                  <GradientButton onClick={() => updateProgress(item)} className="shrink-0">
                    Complete next lesson
                  </GradientButton>
                </div>
                <div className="mt-4 h-3 rounded-full bg-white/8">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.progressPercent || 0}%` }}
                    className="relative h-3 rounded-full bg-gradient-to-r from-giit-purpleLight via-giit-purple to-giit-orange"
                  >
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 text-xs">🚀</span>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
        <GlassCard className="mesh-panel p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-giit-orange">Upcoming class</p>
          <h3 className="mt-3 text-2xl font-black text-white">{liveClasses[0]?.title || 'No class scheduled yet'}</h3>
          <p className="mt-2 text-white/70">{liveClasses[0]?.course?.title || 'Your next live class reminder will bounce in here.'}</p>
          {liveClasses[0] ? (
            <motion.button
              animate={{ scale: [1, 1.04, 1], boxShadow: ['0 0 0 rgba(249,115,22,0)', '0 0 30px rgba(249,115,22,0.45)', '0 0 0 rgba(249,115,22,0)'] }}
              transition={{ repeat: Infinity, duration: 2.2 }}
              onClick={() => setLiveJoin(liveClasses[0])}
              className="mt-6 rounded-full bg-gradient-to-r from-giit-purple to-giit-orange px-5 py-3 font-semibold text-white"
            >
              Join Now
            </motion.button>
          ) : null}
        </GlassCard>
      </div>
    </div>
  );

  const renderCourses = () => (
    <div className="grid gap-5 lg:grid-cols-2">
      {courses.map((item) => (
        <GlassCard key={item._id} className="group overflow-hidden p-6">
          <div className="rounded-[28px] bg-gradient-to-br from-giit-purpleDeep via-giit-purple to-giit-orange p-6 transition duration-500 group-hover:scale-[1.02]">
            <p className="text-xs uppercase tracking-[0.22em] text-white/65">{item.course?.department}</p>
            <h3 className="mt-2 text-2xl font-black text-white">{item.course?.title}</h3>
          </div>
          <p className="mt-5 text-white/70">{item.course?.shortDescription}</p>
          <div className="mt-5 h-3 rounded-full bg-white/8">
            <motion.div animate={{ width: `${item.progressPercent || 0}%` }} className="h-3 rounded-full bg-gradient-to-r from-giit-purpleLight via-giit-purple to-giit-orange" />
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-white/60">
            <span>{item.progressPercent || 0}% complete</span>
            <span>{item.attendancePercent || 0}% attendance</span>
          </div>
          <div className="mt-5 flex gap-3">
            <GradientButton onClick={() => updateProgress(item)}>Continue</GradientButton>
            <GradientButton variant="ghost" onClick={() => toast.success('Course celebration primed!')}>
              Celebrate milestone
            </GradientButton>
          </div>
        </GlassCard>
      ))}
    </div>
  );

  const renderLive = () => (
    <div className="space-y-6">
      <div className="grid gap-5 lg:grid-cols-2">
        {liveClasses.map((item) => (
          <GlassCard key={item._id} className="p-6">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-red-300">
                <motion.span animate={{ scale: [1, 1.25, 1] }} transition={{ repeat: Infinity, duration: 1.1 }} className="h-2.5 w-2.5 rounded-full bg-red-500" />
                Live / Upcoming
              </span>
              <span className="text-sm text-white/55">{new Date(item.startsAt).toLocaleString()}</span>
            </div>
            <h3 className="mt-4 text-2xl font-black text-white">{item.title}</h3>
            <p className="mt-2 text-white/65">{item.course?.title}</p>
            <button
              onClick={() => setLiveJoin(item)}
              className="mt-6 rounded-full bg-gradient-to-r from-giit-purple to-giit-orange px-5 py-3 font-semibold text-white"
            >
              Join class
            </button>
          </GlassCard>
        ))}
      </div>
      {liveJoin ? <LiveClassFrame title={liveJoin.title} url={liveJoin.meetingUrl} /> : null}
    </div>
  );

  const renderPlanner = () => (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <StudyCalendar events={events} onMoveEvent={moveEvent} />
      <GlassCard className="p-6">
        <h3 className="text-xl font-bold text-white">Add a study task</h3>
        <p className="mt-2 text-sm text-white/60">Events pop into view, and dragging them around feels fluid.</p>
        <form className="mt-5 grid gap-3" onSubmit={addPlannerItem}>
          <input name="title" placeholder="Task title" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
          <textarea name="description" placeholder="Description" className="min-h-28 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
          <input name="start" type="datetime-local" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
          <input name="end" type="datetime-local" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
          <GradientButton type="submit">Add to planner</GradientButton>
        </form>
      </GlassCard>
    </div>
  );

  const renderAssessments = () => (
    <div className="space-y-5">
      {assignments.map((assignment) => {
        const gradedSubmission = submissions.find((item) => item.assignment?._id === assignment._id || item.assignment === assignment._id);
        return (
          <GlassCard key={assignment._id} className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-giit-orange">{assignment.course?.title}</p>
                <h3 className="mt-2 text-2xl font-black text-white">{assignment.title}</h3>
                <p className="mt-2 text-white/65">Due {new Date(assignment.dueDate).toLocaleDateString()}</p>
              </div>
              <GradientButton onClick={() => submitAssignment(assignment)}>
                <Send className="h-4 w-4" /> Submit Assignment
              </GradientButton>
            </div>
            {gradedSubmission?.grade ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-5"
              >
                <p className="text-sm uppercase tracking-[0.22em] text-emerald-300">Grade reveal</p>
                <h4 className="mt-2 text-3xl font-black text-white">{gradedSubmission.grade}%</h4>
                <p className="mt-2 text-white/70">{gradedSubmission.feedback}</p>
              </motion.div>
            ) : null}
          </GlassCard>
        );
      })}
    </div>
  );

  const renderFeed = () => <FeedList posts={feed} onLike={handleLikePost} onComment={handleCommentPost} />;

  const renderMessages = () => (
    <MessagePanel
      conversations={conversations}
      activeMessages={messages}
      onSelect={openConversation}
      onSend={sendMessage}
      typingText={activeConversation ? `${activeConversation.participant?.name} is typing` : ''}
    />
  );

  const renderProfile = () => (
    <GlassCard className="p-8">
      <form className="grid gap-4 md:grid-cols-2" onSubmit={saveProfile}>
        <input value={profileForm.name} onChange={(e) => setProfileForm((prev) => ({ ...prev, name: e.target.value }))} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none" placeholder="Name" />
        <input value={profileForm.phone} onChange={(e) => setProfileForm((prev) => ({ ...prev, phone: e.target.value }))} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none" placeholder="Phone" />
        <input value={profileForm.programme} onChange={(e) => setProfileForm((prev) => ({ ...prev, programme: e.target.value }))} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none md:col-span-2" placeholder="Programme" />
        <input value={profileForm.avatar} onChange={(e) => setProfileForm((prev) => ({ ...prev, avatar: e.target.value }))} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none md:col-span-2" placeholder="Profile image URL" />
        <textarea value={profileForm.bio} onChange={(e) => setProfileForm((prev) => ({ ...prev, bio: e.target.value }))} className="min-h-36 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none md:col-span-2" placeholder="Bio" />
        <GradientButton type="submit" className="md:col-span-2">Save profile</GradientButton>
      </form>
    </GlassCard>
  );

  const contentBySection = {
    overview: renderOverview(),
    courses: renderCourses(),
    live: renderLive(),
    planner: renderPlanner(),
    assessments: renderAssessments(),
    feed: renderFeed(),
    messages: renderMessages(),
    profile: renderProfile(),
  };

  return (
    <div className="min-h-screen bg-[#07070a] px-4 py-4 md:px-6">
      <div className="mx-auto grid max-w-[1600px] gap-4 lg:grid-cols-[290px_1fr]">
        <DashboardSidebar items={sidebarItems} role="student" />
        <main className="glass-card min-h-[calc(100vh-2rem)] rounded-[32px] p-5 md:p-7">
          <DashboardHeader
            title={`Student dashboard · ${section}`}
            subtitle="Every route glides in with motion, every achievement feels celebrated, and your learning data stays beautifully alive."
            user={user}
            notifications={notifications}
            onReadNotification={markNotificationRead}
          />
          <div className="mb-6 flex flex-wrap gap-3">
            <GradientButton variant="ghost" onClick={() => navigate('/')}>Back to website</GradientButton>
            <GradientButton
              variant="ghost"
              onClick={() => {
                dispatch(logout());
                navigate('/login');
              }}
            >
              Sign out
            </GradientButton>
          </div>
          <motion.div key={section} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            {contentBySection[section] || renderOverview()}
          </motion.div>
          {!Object.keys(contentBySection).includes(section) ? (
            <div className="mt-8 text-sm text-white/60">
              Unknown section. <Link className="text-giit-orange" to="/portal/student/overview">Go back to overview</Link>
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
};

const SparkCardIcon = (props) => <Bell {...props} />;

export default StudentPortal;
