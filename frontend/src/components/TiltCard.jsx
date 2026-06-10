import { useState } from 'react';
import { motion } from 'framer-motion';

const TiltCard = ({ children, className = '' }) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const percentX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const percentY = (event.clientY - bounds.top) / bounds.height - 0.5;
    setRotate({ x: percentY * -10, y: percentX * 12 });
  };

  return (
    <motion.div
      onMouseMove={handleMove}
      onMouseLeave={() => setRotate({ x: 0, y: 0 })}
      animate={{ rotateX: rotate.x, rotateY: rotate.y }}
      transition={{ type: 'spring', stiffness: 180, damping: 18 }}
      style={{ transformStyle: 'preserve-3d' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default TiltCard;
