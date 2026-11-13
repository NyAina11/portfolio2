import {useEffect, useRef, useState} from 'react';
import {motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform} from 'motion/react';
import {ArrowDown, Download, Pause, Play} from 'lucide-react';
import {hero, identity} from '../content';
import {useMediaQuery} from '../lib/hooks';
import {AxisText} from './AxisText';
import {LifeField} from './LifeField';
import {Magnetic} from './Magnetic';

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

/** Moment où le nom apparaît en lettres nettes, après s'être écrit en cellules vivantes. */
const NAME_AT = 1.05;

export function Hero() {
  const reduced = useReducedMotion();
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)');
  const time = useLocalTime(identity.timeZone);
  const heroRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [paused, setPaused] = useState(false);
  const [covered, setCovered] = useState(false);
  const [pinned, setPinned] = useState(true);

  // Le hero n'est épinglé que si tout son contenu tient dans la fenêtre :
  // sur un écran trop court, il défile normalement et rien n'est coupé.
  useEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;
    const check = () => setPinned(inner.scrollHeight <= window.innerHeight + 1);
    check();
    const observer = new ResizeObserver(check);
    observer.observe(inner);
    window.addEventListener('resize', check);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', check);
    };
  }, []);

  // Épinglé, le hero reste en place pendant que la suite de la page glisse par-dessus.
  const {scrollY} = useScroll();
  useMotionValueEvent(scrollY, 'change', (value) =>
    setCovered(value > (heroRef.current?.offsetHeight ?? window.innerHeight) + 40),
  );
  const progress = useTransform(scrollY, (value) => Math.min(1, value / Math.max(1, window.innerHeight)));
  const scale = useTransform(progress, [0, 1], [1, 0.9]);
  const opacity = useTransform(progress, [0, 0.85], [1, 0.15]);
  const y = useTransform(progress, [0, 1], [0, -70]);

  const rise = (delay: number) =>
    reduced
      ? {}
      : {
          initial: {opacity: 0, y: 16},
          animate: {opacity: 1, y: 0},
          transition: {duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const},
        };

  return (
    <section
      ref={heroRef}
      id="top"
      className="hero"
      data-pinned={pinned}
      style={{visibility: covered ? 'hidden' : 'visible'}}
    >
      <LifeField
        className="hero-life"
        stamp={{target: titleRef, lines: [identity.firstName, identity.lastName]}}
        paused={paused}
        asleep={covered}
      />
      <div className="hero-veil" aria-hidden="true" />

      <motion.div
        ref={innerRef}
        className="shell hero-inner"
        style={reduced || !pinned ? undefined : {scale, opacity, y}}
      >
        <motion.div {...rise(NAME_AT + 0.45)} className="hero-top">
          <p className="font-medium">{identity.role}</p>
          <p className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-ops" aria-hidden="true" />
            {identity.availability}
          </p>
        </motion.div>

        <div className="name-wrap hero-name">
          <h1 ref={titleRef} className="display h1">
            <span className="block">
              <AxisText text={identity.firstName} trigger="mount" delay={NAME_AT} stagger={0.045} />
            </span>
            <span className="block">
              <AxisText text={identity.lastName} trigger="mount" delay={NAME_AT + 0.2} stagger={0.035} />
            </span>
          </h1>
        </div>

        <motion.div {...rise(NAME_AT + 0.6)}>
          <div className="hero-foot">
            <p className="lead max-w-[38ch]">{identity.pitch}</p>
            <div className="flex flex-wrap gap-3">
              <Magnetic>
                <a href="#projets" className="btn btn-primary">
                  Voir les projets
                  <ArrowDown size={17} className="nudge-down" />
                </a>
              </Magnetic>
              <Magnetic>
                <a href="#contact" className="btn btn-quiet">
                  Me contacter
                </a>
              </Magnetic>
              {identity.cv && (
                <a href={identity.cv} className="btn btn-quiet" download>
                  <Download size={17} />
                  Télécharger le CV
                </a>
              )}
            </div>
          </div>

          <div className="hero-note">
            <p className="max-w-[62ch]">
              {hero.note} {!reduced && (finePointer ? hero.noteMouse : hero.noteTouch)}
            </p>
            <div className="flex flex-none items-center gap-4">
              <p className="tag-mono hidden sm:block">
                {identity.location} <span>{time}</span> UTC+3
              </p>
              {!reduced && (
                <button
                  type="button"
                  className="icon-btn"
                  style={{width: '2.25rem', height: '2.25rem'}}
                  aria-label={paused ? 'Relancer l’animation de fond' : 'Mettre en pause l’animation de fond'}
                  title={paused ? 'Relancer l’animation' : 'Mettre en pause'}
                  onClick={() => setPaused((value) => !value)}
                >
                  {paused ? <Play size={14} fill="currentColor" /> : <Pause size={14} fill="currentColor" />}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
