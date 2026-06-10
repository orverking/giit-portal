import { motion } from 'framer-motion';

const GlassCard = ({ children, className = '', hover = true, ...props }) => (
  <motion.div
    whileHover={hover ? { y: -6, scale: 1.01 } : undefined}
    transition={{ type: 'spring', stiffness: 240, damping: 18 }}
    className={`glass-card rounded-3xl ${className}`}
    {...props}
  >
    {children}
  </motion.div>
);

export default GlassCard;
