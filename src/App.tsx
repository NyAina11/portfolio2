import {useEffect, useRef, useState} from 'react';
import {MotionConfig} from 'motion/react';
import {sections} from './content';
import {useTheme} from './lib/hooks';
import {Contact} from './components/Contact';
import {Hero} from './components/Hero';
import {Journey} from './components/Journey';
import {Nav} from './components/Nav';
import {Profile} from './components/Profile';
import {Projects} from './components/Projects';
import {Skills} from './components/Skills';

const GRID = 28;
const GLOW = 440;

/** Halo qui suit le curseur et rallume les points de la grille sur son passage. */
function CanvasGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = ref.current;
    const parent = glow?.parentElement;
    if (!glow || !parent) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let clientX = 0;
    let clientY = 0;
    let frame = 0;
    let seen = false;

    const paint = () => {
      frame = 0;
      const box = parent.getBoundingClientRect();
      const x = clientX - box.left - GLOW / 2;
      const y = clientY - box.top - GLOW / 2;
      const mod = (value: number) => ((value % GRID) + GRID) % GRID;
      glow.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      glow.style.backgroundPosition = `${-mod(x)}px ${-mod(y)}px`;
      glow.style.opacity = '1';
    };
    const schedule = () => {
      if (seen && !frame) frame = requestAnimationFrame(paint);
    };
    const onMove = (event: PointerEvent) => {
      clientX = event.clientX;
      clientY = event.clientY;
      seen = true;
      schedule();
    };
    const onLeave = () => {
      glow.style.opacity = '0';
    };

    window.addEventListener('pointermove', onMove, {passive: true});
    window.addEventListener('scroll', schedule, {passive: true});
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', schedule);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return <div ref={ref} className="canvas-glow" aria-hidden="true" />;
}

/** Section actuellement à l'écran, pour la navigation. */
function useActiveSection(): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const elements = sections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => element !== null);
    const visible = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        const current = sections.find((section) => visible.has(section.id));
        setActive(current ? current.id : null);
      },
      {rootMargin: '-45% 0px -50% 0px'},
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return active;
}

export default function App() {
  const {theme, toggle} = useTheme();
  const active = useActiveSection();

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#profil"
        className="btn btn-primary btn-sm fixed top-3 left-3 z-[60] -translate-y-20 focus-visible:translate-y-0"
      >
        Aller au contenu
      </a>
      <Nav active={active} theme={theme} onToggleTheme={toggle} />
      <div className="canvas">
        <CanvasGlow />
        <main className="relative">
          <Hero />
          <Profile />
          <Skills />
          <Projects />
          <Journey />
          <Contact />
        </main>
      </div>
    </MotionConfig>
  );
}
