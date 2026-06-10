import { motion } from 'framer-motion';
import RemoteLottie from './RemoteLottie';
import { animationUrls } from '../constants/animations';

const PageLoader = ({ label = 'Loading your momentum...' }) => (
  <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
    <motion.div animate={{ scale: [1, 1.06, 1] }} transition={{ repeat: Infinity, duration: 1.8 }}>
      <RemoteLottie url={animationUrls.loader} fallback="⏳" className="h-24 w-24" />
    </motion.div>
    <p className="text-sm uppercase tracking-[0.3em] text-white/60">{label}</p>
  </div>
);

export default PageLoader;
