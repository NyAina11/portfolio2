import {useEffect, useState} from 'react';
import {motion, useReducedMotion} from 'motion/react';
import {ArrowDown, Download} from 'lucide-react';
import {identity} from '../content';
import {AxisText} from './AxisText';
import {FlowCanvas} from './FlowCanvas';

function useLocalTime(timeZone: string) {
  const format = () =>
    new Intl.DateTimeFormat('fr-FR', {hour: '2-digit', minute: '2-digit', timeZone}).format(new Date());
  const [time, setTime] = useState(format);

  useEffect(() => {
    const timer = window.setInterval(() => setTime(format()), 20_000);
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeZone]);

  return time;
}

export function Hero() {
  const reduced = useReducedMotion();
  const time = useLocalTime(identity.timeZone);

  const rise = (delay: number) =>
    reduced
      ? {}
      : {
          initial: {opacity: 0, y: 14},
          animate: {opacity: 1, y: 0},
          transition: {duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const},
        };

  return (
    <section id="top" className="shell pt-24 pb-20 md:pt-28 md:pb-28">
      <div className="grid gap-x-12 gap-y-9 lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-end xl:grid-cols-[minmax(0,1fr)_26rem]">
        <div className="name-wrap">
          <h1 className="display h1">
            <span className="block">
              <AxisText text={identity.firstName} trigger="mount" delay={0.1} stagger={0.045} />
            </span>
            <span className="block">
              <AxisText text={identity.lastName} trigger="mount" delay={0.32} stagger={0.035} />
            </span>
          </h1>
        </div>

        <div className="lg:pb-2 xl:pb-3">
          <motion.dl {...rise(0.75)} className="flex flex-col gap-y-1 text-[0.95rem]">
            <div>
              <dt className="sr-only">Disponibilité</dt>
              <dd className="flex items-center gap-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-ops" aria-hidden="true" />
                {identity.availability}
              </dd>
            </div>
            <div className="pl-5 text-ink-3">
              <dt className="sr-only">Heure locale</dt>
              <dd>
                {identity.location}, <span className="tabular-nums">{time}</span> (UTC+3)
              </dd>
            </div>
          </motion.dl>

          <motion.p {...rise(0.85)} className="lead mt-6 max-w-[34ch] lg:text-[1.3rem] xl:text-[1.45rem]">
            {identity.role}. {identity.pitch}
          </motion.p>

          <motion.div {...rise(0.95)} className="mt-7 flex flex-wrap gap-3">
            <a href="#projets" className="btn btn-primary">
              Voir les projets
              <ArrowDown size={17} className="nudge-down" />
            </a>
            <a href="#contact" className="btn btn-quiet">
              Me contacter
            </a>
            {identity.cv && (
              <a href={identity.cv} className="btn btn-quiet" download>
                <Download size={17} />
                Télécharger le CV
              </a>
            )}
          </motion.div>
        </div>
      </div>

      <motion.div {...rise(1.05)} className="mt-14 md:mt-16">
        <FlowCanvas introDelay={reduced ? 0 : 1.15} />
      </motion.div>
    </section>
  );
}
