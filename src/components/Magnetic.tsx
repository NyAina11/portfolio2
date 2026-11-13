import {useRef, type PointerEvent, type ReactNode} from 'react';
import {motion, useMotionValue, useSpring} from 'motion/react';

/** Attire légèrement son contenu vers le curseur qui s'en approche. */
export function Magnetic({children, strength = 0.28}: {children: ReactNode; strength?: number}) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, {stiffness: 240, damping: 16, mass: 0.5});
  const springY = useSpring(y, {stiffness: 240, damping: 16, mass: 0.5});

  const onMove = (event: PointerEvent<HTMLSpanElement>) => {
    if (event.pointerType !== 'mouse' || !ref.current) return;
    const box = ref.current.getBoundingClientRect();
    x.set((event.clientX - (box.left + box.width / 2)) * strength);
    y.set((event.clientY - (box.top + box.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      ref={ref}
      className="inline-flex"
      style={{x: springX, y: springY}}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.span>
  );
}
