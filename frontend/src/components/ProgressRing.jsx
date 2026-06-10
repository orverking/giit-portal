import { useSpring, animated } from '@react-spring/web';
import { motion } from 'framer-motion';

const radius = 54;
const circumference = 2 * Math.PI * radius;

const ProgressRing = ({ value = 0, label = 'Progress', showCelebration = false }) => {
  const strokeDashoffset = circumference - (Math.min(value, 100) / 100) * circumference;
  const pulse = useSpring({
    from: { scale: 0.96 },
    to: async (next) => {
      while (true) {
        await next({ scale: 1.02 });
        await next({ scale: 0.98 });
      }
    },
    config: { tension: 60, friction: 10 },
  });

  return (
    <animated.div style={pulse} className="relative flex h-40 w-40 items-center justify-center">
      <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
        <circle cx="70" cy="70" r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth="12" fill="transparent" />
        <motion.circle
          cx="70"
          cy="70"
          r={radius}
          stroke="url(#ringGradient)"
          strokeWidth="12"
          strokeLinecap="round"
          fill="transparent"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
          strokeDasharray={circumference}
        />
        <defs>
          <linearGradient id="ringGradient" x1="0" x2="1">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#F97316" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="text-3xl font-black text-white">{value}%</div>
          <div className="text-xs uppercase tracking-[0.22em] text-white/60">{label}</div>
          {showCelebration && value >= 100 && <div className="mt-1 text-lg">⭐</div>}
        </div>
      </div>
    </animated.div>
  );
};

export default ProgressRing;
