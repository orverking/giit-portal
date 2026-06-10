import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const baseClass =
  'inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-giit-purpleLight/80';

const GradientButton = ({
  children,
  to,
  href,
  className = '',
  variant = 'primary',
  ...props
}) => {
  const sharedClass = `${baseClass} ${
    variant === 'ghost'
      ? 'border border-white/15 bg-white/5 text-white hover:bg-white/10'
      : 'bg-gradient-to-r from-giit-purple via-giit-purpleLight to-giit-orange text-white shadow-orange'
  } ${className}`;

  const content = (
    <motion.span whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex items-center gap-2">
      {children}
    </motion.span>
  );

  if (to) {
    return (
      <Link to={to} className={sharedClass} {...props}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={sharedClass} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button className={sharedClass} {...props}>
      {content}
    </button>
  );
};

export default GradientButton;
