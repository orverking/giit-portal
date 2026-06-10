import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js';
import { BarChart3, CheckCheck, Home, ShieldCheck, Users, User, XCircle } from 'lucide-react';
import api, { withFallback } from '../services/api';
import { fetchDashboard } from '../features/portal/portalSlice';
import { logout } from '../features/auth/authSlice';
import { mockAdminData } from '../data/mockPortal';
import DashboardSidebar from '../components/DashboardSidebar';
import DashboardHeader from '../components/DashboardHeader';
import GlassCard from '../components/GlassCard';
import GradientButton from '../components/GradientButton';
import PageLoader from '../components/PageLoader';
import MotivationalBanner from '../components/MotivationalBanner';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const AdminPortal = () => {
  const { section = 'overview' } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const dashboardState = useSelector((state) => state.portal.dashboard);

  const [loading, setLoading] = useState(true);
  const [approvals, setApprovals] = useState([]);
  const [analytics, setAnalytics] = useState(mockAdminData);
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const sidebarItems = useMemo(
    () => [
      { to: '/portal/admin/overview', label: 'Overview', icon: Home },
      { to: '/portal/admin/approvals', label: 'Approvals', icon: ShieldCheck },
      { to: '/portal/admin/analytics', label: 'Analytics', icon: BarChart3 },
      { to: '/portal/admin/users', label: 'Users', icon: Users },
    ],
    []
  );

  const dashboard = dashboardState || mockAdminData;

  useEffect(() => {
    dispatch(fetchDashboard('admin'));
  }, [dispatch]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [approvalData, analyticsData, userData, notificationData] = await Promise.all([
        withFallback(() => api.get('/admin/approvals'), []),
        withFallback(() => api.get('/admin/analytics'), mockAdminData),
        withFallback(() => api.get('/admin/users'), []),
        withFallback(() => api.get('/notifications'), []),
      ]);
      setApprovals(approvalData);
      setAnalytics(analyticsData);
      setUsers(userData);
      setNotifications(notificationData);
      setLoading(false);
    };
    load();
  }, []);

  const reviewApplicant = async (applicant, status) => {
    await withFallback(() => api.patch(`/admin/approvals/${applicant._id}`, { status }), { applicant: { ...applicant, status } });
    setApprovals((prev) => prev.filter((item) => item._id !== applicant._id));
    toast.success(`Applicant ${status}.`);
  };

  if (loading) {
    return <PageLoader label="Loading admin command center..." />;
  }

  const overviewCards = [
    { label: 'Total Users', value: dashboard.metrics?.totalUsers || analytics.metrics?.totalUsers || users.length },
    { label: 'Pending Approvals', value: dashboard.metrics?.pendingApprovals || approvals.length },
    { label: 'Total Courses', value: dashboard.metrics?.totalCourses || analytics.metrics?.courses || 0 },
    { label: 'Planner Events', value: dashboard.metrics?.totalEvents || analytics.metrics?.totalEvents || 0 },
  ];

  const userMixData = {
    labels: ['Students', 'Tutors', 'Admins'],
    datasets: [
      {
        data: analytics.charts?.userMix || [96, 22, 6],
        backgroundColor: ['#8B5CF6', '#6D28D9', '#F97316'],
        borderWidth: 0,
      },
    ],
  };

  const engagementData = {
    labels: ['Avg Progress', 'Avg Attendance', 'Pending Approvals'],
    datasets: [
      {
        label: 'Platform metrics',
        data: analytics.charts?.engagement || [78, 88, approvals.length],
        backgroundColor: ['#8B5CF6', '#F97316', '#2E1065'],
        borderRadius: 18,
      },
    ],
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <MotivationalBanner
        title="Admin command center"
        message="Approval queues, analytics and platform health all flow through one polished, animated operations dashboard."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {overviewCards.map((item) => (
          <GlassCard key={item.label} className="p-5">
            <p className="text-sm text-white/55">{item.label}</p>
            <h3 className="mt-3 text-3xl font-black text-white">{item.value}</h3>
          </GlassCard>
        ))}
      </div>
    </div>
  );

  const renderApprovals = () => (
    <div className="grid gap-5 lg:grid-cols-2">
      <AnimatePresence>
        {approvals.map((applicant) => (
          <motion.div
            key={applicant._id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: applicant.status === 'approved' ? 120 : -120, scale: 0.9 }}
            transition={{ duration: 0.35 }}
          >
            <GlassCard className="p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-giit-orange">{applicant.role}</p>
              <h3 className="mt-2 text-2xl font-black text-white">{applicant.name}</h3>
              <p className="mt-2 text-white/65">{applicant.email}</p>
              <p className="mt-1 text-sm text-white/50">{applicant.programme || (applicant.expertise || []).join(', ')}</p>
              <div className="mt-6 flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => reviewApplicant(applicant, 'approved')}
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-3 font-semibold text-white"
                >
                  <CheckCheck className="h-4 w-4" /> Approve
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => reviewApplicant(applicant, 'rejected')}
                  className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-4 py-3 font-semibold text-white"
                >
                  <XCircle className="h-4 w-4" /> Reject
                </motion.button>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </AnimatePresence>
      {!approvals.length ? (
        <GlassCard className="col-span-full p-10 text-center">
          <p className="text-lg font-semibold text-white">Approval queue is clear ✨</p>
          <p className="mt-2 text-white/60">No pending registrations at the moment.</p>
        </GlassCard>
      ) : null}
    </div>
  );

  const renderAnalytics = () => (
    <div className="grid gap-6 xl:grid-cols-2">
      <GlassCard className="p-6">
        <h3 className="text-2xl font-black text-white">User Mix</h3>
        <div className="mt-6">
          <Doughnut
            data={userMixData}
            options={{
              animation: { animateRotate: true, duration: 1500 },
              plugins: { legend: { labels: { color: 'rgba(255,255,255,0.75)' } } },
            }}
          />
        </div>
      </GlassCard>
      <GlassCard className="p-6">
        <h3 className="text-2xl font-black text-white">Engagement Draw Effect</h3>
        <div className="mt-6">
          <Bar
            data={engagementData}
            options={{
              animation: { duration: 1500, easing: 'easeOutQuart' },
              plugins: { legend: { display: false } },
              scales: {
                x: { ticks: { color: 'rgba(255,255,255,0.7)' }, grid: { display: false } },
                y: { ticks: { color: 'rgba(255,255,255,0.7)' }, grid: { color: 'rgba(255,255,255,0.08)' } },
              },
            }}
          />
        </div>
      </GlassCard>
    </div>
  );

  const renderUsers = () => (
    <GlassCard className="overflow-hidden p-0">
      <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] border-b border-white/10 bg-white/5 px-6 py-4 text-xs uppercase tracking-[0.22em] text-white/45">
        <span>User</span>
        <span>Role</span>
        <span>Status</span>
        <span>Programme</span>
      </div>
      <div className="divide-y divide-white/10">
        {users.map((member) => (
          <motion.div key={member._id} whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }} className="grid grid-cols-[1.5fr_1fr_1fr_1fr] px-6 py-5 text-sm">
            <div>
              <p className="font-semibold text-white">{member.name}</p>
              <p className="text-white/55">{member.email}</p>
            </div>
            <span className="text-white/70">{member.role}</span>
            <span className="text-white/70">{member.status}</span>
            <span className="text-white/55">{member.programme || '—'}</span>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );

  const content = {
    overview: renderOverview(),
    approvals: renderApprovals(),
    analytics: renderAnalytics(),
    users: renderUsers(),
  };

  return (
    <div className="min-h-screen bg-[#07070a] px-4 py-4 md:px-6">
      <div className="mx-auto grid max-w-[1600px] gap-4 lg:grid-cols-[290px_1fr]">
        <DashboardSidebar items={sidebarItems} role="admin" />
        <main className="glass-card min-h-[calc(100vh-2rem)] rounded-[32px] p-5 md:p-7">
          <DashboardHeader
            title={`Admin dashboard · ${section}`}
            subtitle="Approve users, inspect engagement, and steer GIIT’s digital campus with confidence."
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

export default AdminPortal;
