import {Fragment} from 'react';
import {motion, useReducedMotion, type Variants} from 'motion/react';

interface AxisTextProps {
  text: string;
  /** `mount` : joué au chargement. `view` : joué quand le texte entre à l'écran. */
  trigger?: 'mount' | 'view';
  delay?: number;
  stagger?: number;
}

const letter: Variants = {
  hidden: {opacity: 0, y: '0.2em', '--wght': 200, '--soft': 0} as never,
  show: {
    opacity: 1,
    y: '0em',
    '--wght': 800,
    '--soft': 100,
    transition: {duration: 0.85, ease: [0.22, 1, 0.36, 1]},
  } as never,
};

/**
 * Titre dont chaque lettre passe de fine et pointue à grasse et arrondie : l'animation
 * joue sur les axes variables de la police (graisse et « SOFT »), pas sur un simple
 * fondu. L'état de départ est plus étroit que l'état final, donc le titre ne déborde
 * jamais de sa colonne pendant l'animation.
 */
export function AxisText({text, trigger = 'view', delay = 0, stagger = 0.03}: AxisTextProps) {
  const reduced = useReducedMotion();
  const words = text.split(' ');
  let index = 0;

  if (reduced) return <>{text}</>;

  const container: Variants = {
    hidden: {},
    show: {transition: {staggerChildren: stagger, delayChildren: delay}},
  };

  return (
    <>
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden="true"
        variants={container}
        initial="hidden"
        {...(trigger === 'mount'
          ? {animate: 'show'}
          : {whileInView: 'show', viewport: {once: true, amount: 0.7}})}
      >
        {words.map((word, w) => (
          <Fragment key={w}>
            <span className="display-word">
              {Array.from(word).map((char) => (
                <motion.span key={index++} className="display-char" variants={letter}>
                  {char}
                </motion.span>
              ))}
            </span>
            {w < words.length - 1 ? ' ' : null}
          </Fragment>
        ))}
      </motion.span>
    </>
  );
}
