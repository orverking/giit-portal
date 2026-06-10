import { motion } from 'framer-motion';
import GlassCard from './GlassCard';
import RemoteLottie from './RemoteLottie';
import { animationUrls } from '../constants/animations';

const MotivationalBanner = ({ title, message, type = 'trophy' }) => (
  <GlassCard className="mesh-panel overflow-hidden p-6">
    <div className="flex flex-col items-center gap-5 md:flex-row md:justify-between">
      <div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2 text-xs font-semibold uppercase tracking-[0.32em] text-giit-orange"
        >
          Motivation booster
        </motion.p>
        <h3 className="text-2xl font-black text-white">{title}</h3>
        <p className="mt-2 max-w-2xl text-white/70">{message}</p>
      </div>
      <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2.4 }}>
        <RemoteLottie
          url={type === 'rocket' ? animationUrls.rocket : animationUrls.trophy}
          fallback={type === 'rocket' ? '🚀' : '🏆'}
          className="h-28 w-28"
        />
      </motion.div>
    </div>
  </GlassCard>
);

export default MotivationalBanner;
