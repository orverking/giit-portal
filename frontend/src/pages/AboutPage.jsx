import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import AnimatedPage from '../components/AnimatedPage';
import SectionHeader from '../components/SectionHeader';
import GlassCard from '../components/GlassCard';

const AboutPage = () => {
  const content = useSelector((state) => state.portal.publicContent);

  return (
    <AnimatedPage className="mx-auto max-w-7xl px-4 py-20 md:px-6">
      <SectionHeader
        eyebrow="About GIIT"
        title="A practical institution built for ambitious learners"
        description={content.about?.body}
      />
      <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <GlassCard className="mesh-panel p-8">
          <h3 className="text-2xl font-black text-white">Mission</h3>
          <p className="mt-3 text-white/70">{content.about?.mission}</p>
          <h3 className="mt-8 text-2xl font-black text-white">Vision</h3>
          <p className="mt-3 text-white/70">{content.about?.vision}</p>
        </GlassCard>
        <GlassCard className="p-8">
          <h3 className="text-2xl font-black text-white">What makes GIIT different?</h3>
          <div className="mt-6 space-y-4">
            {(content.about?.highlights || []).map((highlight, index) => (
              <motion.div
                key={highlight}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white/75"
              >
                {highlight}
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>
    </AnimatedPage>
  );
};

export default AboutPage;
