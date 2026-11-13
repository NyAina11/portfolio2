import {useRef} from 'react';
import {motion, useReducedMotion, useScroll, useTransform, type MotionValue} from 'motion/react';

function Word({text, progress, range}: {text: string; progress: MotionValue<number>; range: [number, number]}) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <motion.span className="scrub-word" style={{opacity}}>
      {text}
    </motion.span>
  );
}

/** Paragraphe dont les mots s'allument un à un à mesure que la page défile. */
export function ScrubText({text, className}: {text: string; className?: string}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  const {scrollYProgress} = useScroll({target: ref, offset: ['start 88%', 'end 48%']});
  const words = text.split(' ');

  if (reduced) return <p className={className}>{text}</p>;

  return (
    <p ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, index) => (
          <Word
            key={index}
            text={word}
            progress={scrollYProgress}
            range={[index / words.length, Math.min(1, (index + 1.5) / words.length)]}
          />
        ))}
      </span>
    </p>
  );
}
