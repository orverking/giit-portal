import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import GradientButton from './GradientButton';

const ConfettiButton = ({ children, onClick, ...props }) => {
  const [burst, setBurst] = useState(false);

  useEffect(() => {
    if (!burst) return undefined;
    const timer = setTimeout(() => setBurst(false), 2200);
    return () => clearTimeout(timer);
  }, [burst]);

  return (
    <div className="relative">
      {burst ? <Confetti numberOfPieces={180} recycle={false} className="pointer-events-none !fixed inset-0" /> : null}
      <GradientButton
        {...props}
        className={`animate-pulseGlow ${props.className || ''}`}
        onClick={(event) => {
          setBurst(true);
          onClick?.(event);
        }}
      >
        {children}
      </GradientButton>
    </div>
  );
};

export default ConfettiButton;
