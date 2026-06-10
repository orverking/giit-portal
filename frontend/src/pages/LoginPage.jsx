import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { login, clearAuthError } from '../features/auth/authSlice';
import AnimatedPage from '../components/AnimatedPage';
import GlassCard from '../components/GlassCard';
import GradientButton from '../components/GradientButton';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: 'admin@giit.ac.ug', password: 'Admin@123' });

  useEffect(() => {
    if (error) toast.error(error);
    return () => dispatch(clearAuthError());
  }, [dispatch, error]);

  useEffect(() => {
    if (!user) return;
    toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
    const redirect =
      location.state?.from?.pathname ||
      (user.role === 'admin' ? '/portal/admin/overview' : user.role === 'tutor' ? '/portal/tutor/overview' : '/portal/student/overview');
    navigate(redirect, { replace: true });
  }, [user, navigate, location.state]);

  return (
    <AnimatedPage className="mx-auto grid min-h-[calc(100vh-160px)] max-w-7xl items-center gap-6 px-4 py-12 md:grid-cols-[0.95fr_1.05fr] md:px-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-giit-orange">Login</p>
        <h1 className="mt-4 text-5xl font-black text-white">Enter your GIIT learning universe</h1>
        <p className="mt-4 max-w-xl text-white/65">
          Admins, tutors and students sign in here. Pending student and tutor registrations must be approved before login.
        </p>
        <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-white/70">
          Demo accounts: admin@giit.ac.ug / Admin@123 • sarah.nakyewa@giit.ac.ug / Tutor@123 • brian@student.giit.ac.ug / Student@123
        </div>
      </div>
      <GlassCard className="p-8">
        <form
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            dispatch(login(form));
          }}
        >
          <input
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none"
            placeholder="Email"
          />
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none"
            placeholder="Password"
          />
          <GradientButton type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </GradientButton>
        </form>
      </GlassCard>
    </AnimatedPage>
  );
};

export default LoginPage;
