import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import AnimatedPage from '../components/AnimatedPage';
import SectionHeader from '../components/SectionHeader';
import GlassCard from '../components/GlassCard';
import TiltCard from '../components/TiltCard';

const ProgrammesPage = () => {
  const programmes = useSelector((state) => state.portal.publicContent.programmes || []);

  return (
    <AnimatedPage className="mx-auto max-w-7xl px-4 py-20 md:px-6">
      <SectionHeader
        eyebrow="Programmes"
        title="Certificate, diploma, career and short courses"
        description="Inspired by GIIT’s public programme catalog, now reimagined with rich interactions and polished motion design."
      />
      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {programmes.map((programme, index) => (
          <TiltCard key={programme.title} className="h-full">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
              <GlassCard className="h-full overflow-hidden p-6">
                <div className="rounded-[28px] bg-gradient-to-br from-giit-purpleDeep via-giit-purple to-giit-orange p-6">
                  <p className="text-sm uppercase tracking-[0.28em] text-white/60">{programme.category}</p>
                  <h3 className="mt-3 text-2xl font-black text-white">{programme.title}</h3>
                  <p className="mt-2 text-sm text-white/70">{programme.department}</p>
                </div>
                <p className="mt-6 text-white/70">{programme.description}</p>
                <div className="mt-6 grid grid-cols-2 gap-3 text-sm text-white/60">
                  <div className="rounded-2xl bg-white/5 p-4">
                    <p>Duration</p>
                    <p className="mt-1 font-semibold text-white">{programme.duration}</p>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-4">
                    <p>Fees</p>
                    <p className="mt-1 font-semibold text-white">{programme.price}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </TiltCard>
        ))}
      </div>
    </AnimatedPage>
  );
};

export default ProgrammesPage;
