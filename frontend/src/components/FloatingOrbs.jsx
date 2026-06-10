import { animated, useSprings } from '@react-spring/web';

const orbs = [
  { size: 260, left: '6%', top: '8%', color: 'rgba(109,40,217,0.28)' },
  { size: 180, right: '12%', top: '18%', color: 'rgba(249,115,22,0.2)' },
  { size: 220, left: '40%', bottom: '5%', color: 'rgba(139,92,246,0.18)' },
];

const FloatingOrbs = () => {
  const springs = useSprings(
    orbs.length,
    orbs.map((_, index) => ({
      from: { transform: 'translate3d(0px, 0px, 0px) scale(0.96)' },
      to: async (next) => {
        while (true) {
          await next({
            transform: `translate3d(0px, ${index % 2 === 0 ? -18 : 18}px, 0px) scale(1.03)`,
          });
          await next({ transform: 'translate3d(0px, 0px, 0px) scale(0.96)' });
        }
      },
      config: { mass: 3, tension: 40, friction: 16 },
    }))
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {springs.map((style, index) => {
        const orb = orbs[index];
        return (
          <animated.div
            key={index}
            style={{
              ...style,
              width: orb.size,
              height: orb.size,
              background: orb.color,
              left: orb.left,
              right: orb.right,
              top: orb.top,
              bottom: orb.bottom,
            }}
            className="absolute rounded-full blur-3xl"
          />
        );
      })}
    </div>
  );
};

export default FloatingOrbs;
