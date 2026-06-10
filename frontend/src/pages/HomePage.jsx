import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowRight, CheckCircle2, PlayCircle, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { fetchPublicContent } from '../features/portal/portalSlice';
import { useTypewriter } from '../hooks/useTypewriter';
import AnimatedPage from '../components/AnimatedPage';
import FloatingOrbs from '../components/FloatingOrbs';
import SectionHeader from '../components/SectionHeader';
import StatsCounter from '../components/StatsCounter';
import TiltCard from '../components/TiltCard';
import GlassCard from '../components/GlassCard';
import GradientButton from '../components/GradientButton';
import RemoteLottie from '../components/RemoteLottie';
import ConfettiButton from '../components/ConfettiButton';
import { animationUrls } from '../constants/animations';

const HomePage = () => {
  const dispatch = useDispatch();
  const { publicContent } = useSelector((state) => state.portal);
  const typed = useTypewriter(publicContent.hero?.typewriter || [], 52, 1800);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    dispatch(fetchPublicContent());
  }, [dispatch]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % (publicContent.testimonials?.length || 1));
    }, 4800);
    return () => clearInterval(timer);
  }, [publicContent.testimonials?.length]);

  const motivationalBullets = useMemo(
    () => [
      'Framer Motion page transitions and silky micro-interactions',
      'Live classes, planner, feed, messaging and approvals in one portal',
      'Motivational progress tracking built for joyful, persistent learning',
    ],
    []
  );

  return (
    <AnimatedPage>
      <section className="relative overflow-hidden bg-giit-mesh">
        <FloatingOrbs />
        <div className="mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-10 px-4 py-20 md:grid-cols-[1.1fr_0.9fr] md:px-6">
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 backdrop-blur-xl"
            >
              <Sparkles className="h-4 w-4 text-giit-orange" /> {publicContent.hero?.badge}
            </motion.div>
            <h1 className="max-w-4xl text-5xl font-black leading-[0.95] text-white md:text-7xl">
              Build your future at <span className="gradient-text">GIIT</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70 md:text-xl">{publicContent.hero?.subtitle}</p>
            <div className="mt-4 min-h-[36px] text-base font-medium text-giit-orange md:text-lg">
              {typed}
              <span className="ml-1 inline-block h-5 w-0.5 animate-pulse bg-giit-orange align-middle" />
            </div>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <ConfettiButton to="/register">
                Apply Now <ArrowRight className="h-4 w-4" />
              </ConfettiButton>
              <GradientButton to="/programmes" variant="ghost">
                <PlayCircle className="h-4 w-4" /> Explore Programmes
              </GradientButton>
            </div>
            <div className="mt-8 grid gap-3 text-sm text-white/70 sm:grid-cols-3">
              {motivationalBullets.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-black/25 p-4 backdrop-blur-xl">
                  <CheckCircle2 className="mb-3 h-5 w-5 text-emerald-400" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="relative z-10">
            <GlassCard className="mesh-panel relative overflow-hidden p-8">
              <motion.div
                animate={{ y: [0, -12, 0], rotate: [0, 2, 0, -2, 0] }}
                transition={{ duration: 7, repeat: Infinity }}
                className="mx-auto flex flex-col items-center text-center"
              >
                <RemoteLottie url={animationUrls.trophy} fallback="🎓" className="h-64 w-64" />
                <h3 className="mt-3 text-2xl font-black text-white">A portal that celebrates every milestone</h3>
                <p className="mt-2 max-w-md text-white/70">
                  Smooth transitions, uplifting feedback and real-time learning tools designed to keep GIIT learners motivated.
                </p>
              </motion.div>
              <div className="mt-8 grid grid-cols-2 gap-4">
                {(publicContent.stats || []).map((stat) => (
                  <StatsCounter key={stat.label} value={stat.value} suffix={stat.suffix || ''} label={stat.label} />
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 md:px-6">
        <SectionHeader
          eyebrow="Explore"
          title="Programmes designed for real-world readiness"
          description="Academic, career and short courses shaped around practical relevance, flexible study modes and employability."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {(publicContent.programmes || []).slice(0, 6).map((programme, index) => (
            <TiltCard key={programme.title} className="h-full">
              <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }}>
                <GlassCard className="group h-full overflow-hidden p-6">
                  <div className="mb-5 flex h-44 items-end rounded-[28px] bg-gradient-to-br from-giit-purpleDeep via-giit-purple to-giit-orange p-5 transition duration-500 group-hover:scale-[1.03]">
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-white/65">{programme.category}</p>
                      <h3 className="mt-2 text-2xl font-black text-white">{programme.title}</h3>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-giit-orange">{programme.department}</p>
                  <p className="mt-3 text-white/65">{programme.description}</p>
                  <div className="mt-6 flex items-center justify-between text-sm text-white/55">
                    <span>{programme.duration}</span>
                    <span>{programme.price}</span>
                  </div>
                  <motion.div
                    initial={{ y: 16, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                    className="mt-6 rounded-full bg-white/5 px-4 py-3 text-sm font-semibold text-white"
                  >
                    Continue exploring this track →
                  </motion.div>
                </GlassCard>
              </motion.div>
            </TiltCard>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-8 md:grid-cols-[1.1fr_0.9fr] md:px-6 md:py-16">
        <GlassCard className="p-8">
          <SectionHeader
            eyebrow="Why GIIT"
            title={publicContent.about?.headline || 'Get ready for the future'}
            description={publicContent.about?.body}
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {(publicContent.about?.highlights || []).map((highlight) => (
              <motion.div
                key={highlight}
                whileHover={{ scale: 1.02, y: -4 }}
                className="rounded-2xl border border-white/10 bg-black/20 p-5 text-white/75"
              >
                {highlight}
              </motion.div>
            ))}
          </div>
        </GlassCard>
        <GlassCard className="mesh-panel flex flex-col justify-between p-8">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-giit-orange">Admissions</p>
            <h3 className="mt-3 text-3xl font-black text-white">Fast, simple & credible</h3>
            <p className="mt-4 text-white/70">
              Diploma and certificate programmes run for two years, with flexible schedules and open admissions throughout the year.
            </p>
          </div>
          <div className="mt-8 space-y-4">
            {['Three intakes: January, May, September', 'Application support from admissions', 'Blended, online and on-campus learning'].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white/80">
                {item}
              </div>
            ))}
          </div>
        </GlassCard>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 md:px-6">
        <SectionHeader
          eyebrow="Student voices"
          title="Proof that practical training changes trajectories"
          description="Every testimonial transitions in with a soft cross-fade, reflecting the uplifting GIIT learning experience."
          align="center"
        />
        <div className="mx-auto mt-10 max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTestimonial}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.45 }}
            >
              <GlassCard className="p-10 text-center">
                <p className="text-xl leading-8 text-white/80 md:text-2xl">
                  “{publicContent.testimonials?.[activeTestimonial]?.quote}”
                </p>
                <h3 className="mt-6 text-2xl font-black text-white">{publicContent.testimonials?.[activeTestimonial]?.name}</h3>
                <p className="mt-2 text-sm uppercase tracking-[0.22em] text-giit-orange">
                  {publicContent.testimonials?.[activeTestimonial]?.programme}
                </p>
                <p className="mt-2 text-white/60">{publicContent.testimonials?.[activeTestimonial]?.role}</p>
              </GlassCard>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </AnimatedPage>
  );
};

export default HomePage;
