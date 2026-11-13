import type {ReactNode} from 'react';
import {motion, useReducedMotion} from 'motion/react';
import {sections, type SectionId} from '../content';
import {AxisText} from './AxisText';

interface SectionProps {
  id: SectionId;
  title: string;
  intro?: ReactNode;
  children: ReactNode;
  /** Contenu pleine largeur, placé sous le titre mais hors de la grille de la page. */
  bleed?: ReactNode;
}

const pad = (value: number) => String(value).padStart(2, '0');

/** En-tête de section : un filet qui se trace, un repère, puis un très grand titre. */
export function SectionHead({id, title, intro}: Pick<SectionProps, 'id' | 'title' | 'intro'>) {
  const reduced = useReducedMotion();
  const position = sections.findIndex((section) => section.id === id) + 1;

  return (
    <header className="sec-head">
      <div className="relative">
        <motion.span
          aria-hidden="true"
          className="absolute top-0 left-0 h-px w-full origin-left bg-ink"
          initial={reduced ? false : {scaleX: 0}}
          whileInView={{scaleX: 1}}
          viewport={{once: true, amount: 1}}
          transition={{duration: 1.1, ease: [0.22, 1, 0.36, 1]}}
        />
        <p className="sec-rule tag-mono" aria-hidden="true">
          <span>{pad(position)}</span>
          <span>
            {pad(position)} / {pad(sections.length)}
          </span>
        </p>
      </div>
      <div className="sec-grid">
        <h2 id={`${id}-title`} className="display h2">
          <AxisText text={title} />
        </h2>
        {intro && <p className="prose text-[1.12rem] lg:pb-3">{intro}</p>}
      </div>
    </header>
  );
}

export function Section({id, title, intro, children, bleed}: SectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="section">
      <div className="shell">
        <SectionHead id={id} title={title} intro={intro} />
        {children}
      </div>
      {bleed}
    </section>
  );
}
