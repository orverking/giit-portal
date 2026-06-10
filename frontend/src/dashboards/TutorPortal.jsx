import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import {
  BookOpenCheck,
  CalendarPlus,
  ClipboardList,
  Home,
  MessageSquare,
  User,
  Video,
  Users,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api, { withFallback } from '../services/api';
import { fetchDashboard } from '../features/portal/portalSlice';
import { logout, updateProfile } from '../features/auth/authSlice';
import { mockTutorData } from '../data/mockPortal';
import { useSocket } from '../hooks/useSocket';
import DashboardSidebar from '../components/DashboardSidebar';
import DashboardHeader from '../components/DashboardHeader';
import GlassCard from '../components/GlassCard';
import GradientButton from '../components/GradientButton';
import PageLoader from '../components/PageLoader';
import MessagePanel from '../components/MessagePanel';
import MotivationalBanner from '../components/MotivationalBanner';

const TutorPortal = () => {
  const { section = 'overview' } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const dashboardState = useSelector((state) => state.portal.dashboard);
  const socket = useSocket(user);

  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [liveClasses, setLiveClasses] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [showLiveForm, setShowLiveForm] = useState(false);
  const [gradeDrafts, setGradeDrafts] = useState({});
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
    expertise: (user?.expertise || []).join(', '),
  });

  const sidebarItems = useMemo(
    () => [
      { to: '/portal/tutor/overview', label: 'Overview', icon: Home },
      { to: '/portal/tutor/courses', label: 'My Courses', icon: BookOpenCheck },
      { to: '/portal/tutor/live', label: 'Live Classes', icon: Video },
      { to: '/portal/tutor/submissions', label: 'Submissions', icon: ClipboardList },
      { to: '/portal/tutor/attendance', label: 'Attendance', icon: Users },
      { to: '/portal/tutor/messages', label: 'Messages', icon: MessageSquare },
      { to: '/portal/tutor/profile', label: 'Profile', icon: User },
    ],
    []
  );

  const dashboard = dashboardState || mockTutorData;

  useEffect(() => {
    dispatch(fetchDashboard('tutor'));
  }, [dispatch]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [coursesData, liveData, submissionsData, convoData, notificationData] = await Promise.all([
        withFallback(() => api.get('/courses/my'), []),
        withFallback(() => api.get('/live-classes'), []),
        withFallback(() => api.get('/courses/submissions/tutor'), []),
        withFallback(() => api.get('/messages'), []),
        withFallback(() => api.get('/notifications'), []),
      ]);
      setCourses(coursesData);
      setLiveClasses(liveData);
      setSubmissions(submissionsData);
      setConversations(convoData);
      setNotifications(notificationData);
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    if (!socket) return undefined;
    const handler = (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      toast.success(notification.title);
    };
    socket.on('notification:new', handler);
    return () => socket.off('notification:new', handler);
  }, [socket]);

  const openConversation = async (conversation) => {
    setActiveConversation(conversation);
    const list = await withFallback(() => api.get(`/messages/${conversation.participant._id}`), []);
    setMessages(list);
  };

  const sendMessage = async (conversation, content) => {
    const recipientId = conversation.participant?._id;
    const response = await withFallback(() => api.post('/messages', { recipientId, content }), {
      _id: Date.now().toString(),
      sender: { _id: user._id, name: user.name },
      recipient: conversation.participant,
      content,
    });
    setMessages((prev) => [...prev, response]);
    toast.success('Feedback sent with a smooth success pulse.');
  };

  const createLiveClass = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      course: formData.get('course'),
      title: formData.get('title'),
      agenda: formData.get('agenda'),
      startsAt: new Date(formData.get('startsAt')).toISOString(),
      endsAt: new Date(formData.get('endsAt')).toISOString(),
      provider: 'jitsi',
    };
    const result = await withFallback(() => api.post('/live-classes', payload), {
      liveClass: { _id: Date.now().toString(), ...payload, course: courses.find((course) => course._id === payload.course) },
    });
    setLiveClasses((prev) => [result.liveClass || result, ...prev]);
    setShowLiveForm(false);
    e.currentTarget.reset();
    toast.success('Class created — success pulse activated!');
  };

  const saveGrade = async (submission) => {
    const payload = gradeDrafts[submission._id] || { grade: 85, feedback: 'Excellent work.' };
    const response = await withFallback(
      () => api.patch(`/courses/submissions/${submission._id}/grade`, payload),
      { submission: { ...submission, ...payload, status: 'graded' } }
    );
    const updated = response.submission || response;
    setSubmissions((prev) => prev.map((item) => (item._id === submission._id ? updated : item)));
    toast.success('Grade submitted — feedback sent beautifully.');
  };

  const toggleAttendance = async (liveClass, attendee, status) => {
    const attendees = (liveClass.attendees || []).map((item) =>
      item.user === attendee.user || item.user?._id === attendee.user?._id ? { ...item, status } : item
    );
    await withFallback(() => api.patch(`/live-classes/${liveClass._id}/attendance`, { attendees }), { liveClass: { ...liveClass, attendees } });
    setLiveClasses((prev) => prev.map((item) => (item._id === liveClass._id ? { ...item, attendees } : item)));
    toast.success(`Attendance marked as ${status}.`);
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    await dispatch(
      updateProfile({
        ...profileForm,
        expertise: profileForm.expertise,
      })
    );
    toast.success('Tutor profile updated successfully.');
  };

  if (loading) {
    return <PageLoader label="Preparing your tutor studio..." />;
  }

  const renderOverview = () => (
    <div className="space-y-6">
      <MotivationalBanner
        title="Guide. Grade. Celebrate progress."
        message="Tutor workflows are designed with fluid motion — from live class creation to feedback delivery and attendance confirmation."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Active Courses', value: dashboard.metrics?.activeCourses || courses.length },
          { label: 'Upcoming Classes', value: dashboard.metrics?.upcomingClasses || liveClasses.length },
          { label: 'Need Grading', value: dashboard.metrics?.submissionsToGrade || submissions.filter((item) => item.status === 'submitted').length },
          { label: 'Graded', value: dashboard.metrics?.gradedSubmissions || submissions.filter((item) => item.status === 'graded').length },
        ].map((item) => (
          <GlassCard key={item.label} className="p-5">
            <p className="text-sm text-white/55">{item.label}</p>
            <h3 className="mt-3 text-3xl font-black text-white">{item.value}</h3>
          </GlassCard>
        ))}
      </div>
    </div>
  );

  const renderCourses = () => (
    <div className="grid gap-5 lg:grid-cols-2">
      {courses.map((course) => (
        <GlassCard key={course._id} className="p-6">
          <p className="text-xs uppercase tracking-[0.22em] text-giit-orange">{course.department}</p>
          <h3 className="mt-2 text-2xl font-black text-white">{course.title}</h3>
          <p className="mt-3 text-white/65">{course.shortDescription || course.description}</p>
          <div className="mt-5 flex flex-wrap gap-2 text-sm text-white/60">
            <span className="rounded-full bg-white/5 px-3 py-2">{course.duration}</span>
            <span className="rounded-full bg-white/5 px-3 py-2">{course.level}</span>
            <span className="rounded-full bg-white/5 px-3 py-2">UGX {course.price?.toLocaleString?.() || course.price}</span>
          </div>
        </GlassCard>
      ))}
    </div>
  );

  const renderLive = () => (
    <div className="relative space-y-5">
      <div className="flex justify-end">
        <GradientButton onClick={() => setShowLiveForm(true)}>
          <CalendarPlus className="h-4 w-4" /> Create Live Class
        </GradientButton>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        {liveClasses.map((item) => (
          <GlassCard key={item._id} className="p-6">
            <p className="text-xs uppercase tracking-[0.22em] text-giit-orange">{item.course?.title || 'Live session'}</p>
            <h3 className="mt-2 text-2xl font-black text-white">{item.title}</h3>
            <p className="mt-2 text-white/65">{item.agenda}</p>
            <p className="mt-4 text-sm text-white/50">{new Date(item.startsAt).toLocaleString()}</p>
          </GlassCard>
        ))}
      </div>
      <AnimatePresence>
        {showLiveForm ? (
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-xl bg-[#0b0b10]/95 p-6 backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-white">Create a live class</h3>
              <button onClick={() => setShowLiveForm(false)} className="text-white/60">Close</button>
            </div>
            <form className="mt-6 grid gap-4" onSubmit={createLiveClass}>
              <select name="course" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none">
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>{course.title}</option>
                ))}
              </select>
              <input name="title" placeholder="Class title" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none" />
              <textarea name="agenda" placeholder="Agenda" className="min-h-32 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none" />
              <input name="startsAt" type="datetime-local" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none" />
              <input name="endsAt" type="datetime-local" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none" />
              <GradientButton type="submit">Create class</GradientButton>
            </form>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );

  const renderSubmissions = () => (
    <div className="space-y-5">
      {submissions.map((submission) => (
        <GlassCard key={submission._id} className="p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-giit-orange">{submission.assignment?.course?.title}</p>
              <h3 className="mt-2 text-2xl font-black text-white">{submission.assignment?.title}</h3>
              <p className="mt-2 text-white/65">Student: {submission.student?.name}</p>
              <p className="mt-2 text-white/55">{submission.notes}</p>
            </div>
            <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/5 p-5">
              <motion.div
                key={gradeDrafts[submission._id]?.grade || submission.grade || 0}
                initial={{ scale: 0.9, opacity: 0.7 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-4xl font-black text-white"
              >
                {gradeDrafts[submission._id]?.grade || submission.grade || '--'}%
              </motion.div>
              <input
                type="number"
                min="0"
                max="100"
                placeholder="Grade"
                defaultValue={submission.grade || ''}
                onChange={(e) =>
                  setGradeDrafts((prev) => ({
                    ...prev,
                    [submission._id]: { ...prev[submission._id], grade: Number(e.target.value) },
                  }))
                }
                className="mt-4 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
              />
              <textarea
                placeholder="Feedback"
                defaultValue={submission.feedback || ''}
                onChange={(e) =>
                  setGradeDrafts((prev) => ({
                    ...prev,
                    [submission._id]: { ...prev[submission._id], feedback: e.target.value },
                  }))
                }
                className="mt-3 min-h-28 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
              />
              <GradientButton className="mt-4 w-full" onClick={() => saveGrade(submission)}>
                Submit feedback
              </GradientButton>
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  );

  const renderAttendance = () => (
    <div className="space-y-5">
      {liveClasses.map((liveClass) => (
        <GlassCard key={liveClass._id} className="p-6">
          <h3 className="text-2xl font-black text-white">{liveClass.title}</h3>
          <div className="mt-5 space-y-3">
            {(liveClass.attendees || []).map((attendee, index) => (
              <div key={attendee.user?._id || attendee.user || index} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
                <div>
                  <p className="font-semibold text-white">{attendee.user?.name || `Student ${index + 1}`}</p>
                  <p className="text-sm text-white/55">Status: {attendee.status}</p>
                </div>
                <div className="flex gap-2">
                  {['joined', 'missed'].map((status) => (
                    <motion.button
                      key={status}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleAttendance(liveClass, attendee, status)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold ${
                        attendee.status === status
                          ? status === 'joined'
                            ? 'bg-emerald-500 text-white'
                            : 'bg-rose-500 text-white'
                          : 'bg-white/8 text-white/70'
                      }`}
                    >
                      {status}
                    </motion.button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      ))}
    </div>
  );

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
        <input value={profileForm.avatar} onChange={(e) => setProfileForm((prev) => ({ ...prev, avatar: e.target.value }))} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none md:col-span-2" placeholder="Avatar URL" />
        <input value={profileForm.expertise} onChange={(e) => setProfileForm((prev) => ({ ...prev, expertise: e.target.value }))} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none md:col-span-2" placeholder="Expertise" />
        <textarea value={profileForm.bio} onChange={(e) => setProfileForm((prev) => ({ ...prev, bio: e.target.value }))} className="min-h-36 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none md:col-span-2" placeholder="Bio" />
        <GradientButton type="submit" className="md:col-span-2">Save tutor profile</GradientButton>
      </form>
    </GlassCard>
  );

  const content = {
    overview: renderOverview(),
    courses: renderCourses(),
    live: renderLive(),
    submissions: renderSubmissions(),
    attendance: renderAttendance(),
    messages: renderMessages(),
    profile: renderProfile(),
  };

  return (
    <div className="min-h-screen bg-[#07070a] px-4 py-4 md:px-6">
      <div className="mx-auto grid max-w-[1600px] gap-4 lg:grid-cols-[290px_1fr]">
        <DashboardSidebar items={sidebarItems} role="tutor" />
        <main className="glass-card min-h-[calc(100vh-2rem)] rounded-[32px] p-5 md:p-7">
          <DashboardHeader
            title={`Tutor dashboard · ${section}`}
            subtitle="Create live classes, grade beautifully, and keep learners motivated with fluid feedback loops."
            user={user}
            notifications={notifications}
            onReadNotification={(notification) =>
              setNotifications((prev) => prev.map((item) => (item._id === notification._id ? { ...item, read: true } : item)))
            }
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
          <motion.div key={section} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            {content[section] || renderOverview()}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default TutorPortal;
