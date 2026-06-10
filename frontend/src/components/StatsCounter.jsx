import { animated, useSpring } from '@react-spring/web';

const StatsCounter = ({ value = 0, suffix = '', label }) => {
  const { number } = useSpring({
    from: { number: 0 },
    to: { number: value },
    config: { tension: 90, friction: 18 },
  });

  return (
    <div className="space-y-2 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
      <animated.div className="text-3xl font-black text-white md:text-4xl">
        {number.to((n) => `${Math.round(n)}${suffix}`)}
      </animated.div>
      <p className="text-sm uppercase tracking-[0.22em] text-white/60">{label}</p>
    </div>
  );
};

export default StatsCounter;
