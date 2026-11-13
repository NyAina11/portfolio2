import {useRef} from 'react';
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from 'motion/react';
import {skills, type Skill} from '../content';

interface RowProps {
  items: Skill[];
  /** Vitesse de base, en pourcentage de la bande par seconde. Négatif : vers la gauche. */
  speed: number;
  outline?: boolean;
}

/** Bande de texte qui défile toute seule et accélère avec la vitesse de défilement de la page. */
function Row({items, speed, outline = false}: RowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, {margin: '20% 0px'});
  const offset = useMotionValue(0);
  const {scrollY} = useScroll();
  const velocity = useSpring(useVelocity(scrollY), {damping: 50, stiffness: 400});
  const boost = useTransform(velocity, [-1500, 0, 1500], [-4, 0, 4], {clamp: false});
  // La bande contient deux fois la liste : on la replie tous les 50 %.
  const x = useTransform(offset, (value) => `${wrap(-50, 0, value)}%`);
  const scrollDirection = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduced || !inView) return;
    // Défiler vers le haut inverse le sens des bandes ; la vitesse de défilement les accélère.
    const push = boost.get();
    if (push < -0.05) scrollDirection.current = -1;
    else if (push > 0.05) scrollDirection.current = 1;
    offset.set(offset.get() + speed * scrollDirection.current * (delta / 1000) * (1 + Math.abs(push)));
  });

  return (
    <div ref={ref} className="marquee" data-outline={outline} aria-hidden="true">
      <motion.div className="marquee-track" style={{x}}>
        {[0, 1].map((copy) => (
          <span key={copy} className="inline-flex">
            {items.map((skill) => (
              <span key={skill.id} className="marquee-item" data-domain={skill.domain}>
                {skill.label}
              </span>
            ))}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/** Deux bandes de compétences qui se croisent. */
export function Marquee() {
  const half = Math.ceil(skills.length / 2);
  return (
    <div className="py-6 md:py-10">
      <Row items={skills.slice(0, half)} speed={-1.6} />
      <Row items={skills.slice(half)} speed={1.6} outline />
    </div>
  );
}
