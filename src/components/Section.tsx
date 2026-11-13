import type {ReactNode} from 'react';
import {AxisText} from './AxisText';

interface SectionProps {
  id: string;
  title: string;
  intro?: ReactNode;
  children: ReactNode;
}

export function Section({id, title, intro, children}: SectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="shell py-16 md:py-24">
      <header className="mb-10 md:mb-14">
        <h2 id={`${id}-title`} className="display h2">
          <AxisText text={title} />
        </h2>
        {intro && <p className="prose mt-5 text-[1.15rem]">{intro}</p>}
      </header>
      {children}
    </section>
  );
}
