import {useRef} from 'react';
import {motion, useInView, useReducedMotion, useScroll, useSpring} from 'motion/react';
import {journey, type JourneyItem} from '../content';
import {Section} from './Section';

const kindLabel: Record<JourneyItem['kind'], string> = {
  experience: 'Expérience',
  formation: 'Formation',
};

function Row({item}: {item: JourneyItem}) {
  const ref = useRef<HTMLLIElement>(null);
  const reduced = useReducedMotion();
  const lit = useInView(ref, {once: true, margin: '0px 0px -30% 0px'}) || Boolean(reduced);

  return (
    <li ref={ref} className="journey-row relative pb-12 pl-9 last:pb-0 md:grid md:grid-cols-[11rem_minmax(0,1fr)] md:gap-x-14 md:pl-0 md:pb-16">
      <span className="rail-node" data-lit={lit} data-kind={item.kind} aria-hidden="true" />
      <div className="md:pt-0.5 md:text-right">
        <p className="font-semibold leading-snug">{item.period}</p>
        <p className="meta mt-0.5">{kindLabel[item.kind]}</p>
      </div>
      <div className="mt-3 md:mt-0">
        <h3 className="text-[1.5rem] leading-[1.15] font-bold tracking-tight md:text-[1.75rem]">{item.title}</h3>
        <p className="mt-1.5 text-ink-2">{item.place}</p>
        {item.points && (
          <ul className="bullets prose mt-5">
            {item.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}

export function Journey() {
  const ref = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();
  const {scrollYProgress} = useScroll({target: ref, offset: ['start 70%', 'end 70%']});
  const progress = useSpring(scrollYProgress, {stiffness: 140, damping: 30, restDelta: 0.001});

  return (
    <Section id="parcours" title="Parcours">
      <ol ref={ref} className="journey relative">
        <div className="rail" aria-hidden="true">
          <motion.div className="rail-fill" style={{scaleY: reduced ? 1 : progress}} />
        </div>
        {journey.map((item) => (
          <Row key={item.id} item={item} />
        ))}
      </ol>
    </Section>
  );
}
