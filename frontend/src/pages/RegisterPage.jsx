import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { register, clearAuthError } from '../features/auth/authSlice';
import AnimatedPage from '../components/AnimatedPage';
import GlassCard from '../components/GlassCard';
import GradientButton from '../components/GradientButton';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const { loading, error, registrationMessage } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student', phone: '', programme: '', expertise: '' });

  useEffect(() => {
    if (error) toast.error(error);
    if (registrationMessage) toast.success(registrationMessage);
    return () => dispatch(clearAuthError());
  }, [dispatch, error, registrationMessage]);

  return (
    <AnimatedPage className="mx-auto grid max-w-7xl gap-6 px-4 py-20 md:grid-cols-[0.95fr_1.05fr] md:px-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-giit-orange">Apply / Register</p>
        <h1 className="mt-4 text-5xl font-black text-white">Start your GIIT journey</h1>
        <p className="mt-4 max-w-xl text-white/65">
          Student and tutor accounts enter an admin approval queue before portal access is enabled. That keeps the platform secure and role-specific.
        </p>
      </div>
      <GlassCard className="p-8">
        <form
          className="grid gap-4 md:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            dispatch(register(form));
          }}
        >
          <input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none md:col-span-2" placeholder="Full name" />
          <input value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none md:col-span-2" placeholder="Email" />
          <input type="password" value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none" placeholder="Password" />
          <select value={form.role} onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none">
            <option value="student">Student</option>
            <option value="tutor">Tutor</option>
          </select>
          <input value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none" placeholder="Phone number" />
          <input value={form.programme} onChange={(e) => setForm((prev) => ({ ...prev, programme: e.target.value }))} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none" placeholder="Programme (for students)" />
          <input value={form.expertise} onChange={(e) => setForm((prev) => ({ ...prev, expertise: e.target.value }))} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none md:col-span-2" placeholder="Expertise (for tutors, comma-separated)" />
          <GradientButton type="submit" disabled={loading} className="md:col-span-2">
            {loading ? 'Submitting...' : 'Submit for Approval'}
          </GradientButton>
        </form>
      </GlassCard>
    </AnimatedPage>
  );
};

export default RegisterPage;
