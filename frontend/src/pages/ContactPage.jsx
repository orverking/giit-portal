import { Mail, MapPin, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import AnimatedPage from '../components/AnimatedPage';
import SectionHeader from '../components/SectionHeader';
import GlassCard from '../components/GlassCard';
import GradientButton from '../components/GradientButton';

const ContactPage = () => {
  const contact = useSelector((state) => state.portal.publicContent.contact);

  return (
    <AnimatedPage className="mx-auto max-w-7xl px-4 py-20 md:px-6">
      <SectionHeader
        eyebrow="Contact"
        title="Speak to admissions, request info, or start your application"
        description="Based on GIIT’s public contact details for Makerere, Kampala."
      />
      <div className="mt-12 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <GlassCard className="mesh-panel space-y-5 p-8">
          <div className="flex items-start gap-4 rounded-2xl bg-white/5 p-4">
            <MapPin className="mt-1 h-5 w-5 text-giit-orange" />
            <div>
              <p className="font-semibold text-white">Address</p>
              <p className="text-white/70">{contact?.address}</p>
            </div>
          </div>
          <div className="flex items-start gap-4 rounded-2xl bg-white/5 p-4">
            <Phone className="mt-1 h-5 w-5 text-giit-orange" />
            <div>
              <p className="font-semibold text-white">Phone</p>
              <p className="text-white/70">{contact?.phone}</p>
            </div>
          </div>
          <div className="flex items-start gap-4 rounded-2xl bg-white/5 p-4">
            <Mail className="mt-1 h-5 w-5 text-giit-orange" />
            <div>
              <p className="font-semibold text-white">Email</p>
              <p className="text-white/70">{contact?.email}</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard className="p-8">
          <form
            className="grid gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              toast.success('Message sent — GIIT admissions will get back to you.');
              e.currentTarget.reset();
            }}
          >
            <input className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none" placeholder="Your name" />
            <input className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none" placeholder="Email" />
            <input className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none" placeholder="Subject" />
            <textarea className="min-h-40 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none" placeholder="Message" />
            <GradientButton type="submit">Send Message</GradientButton>
          </form>
        </GlassCard>
      </div>
    </AnimatedPage>
  );
};

export default ContactPage;
