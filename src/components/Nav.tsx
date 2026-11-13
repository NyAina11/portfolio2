import {useEffect, useState} from 'react';
import {AnimatePresence, motion, useMotionValueEvent, useScroll} from 'motion/react';
import {Menu, Moon, Sun, X} from 'lucide-react';
import {identity, sections} from '../content';
import type {Theme} from '../lib/hooks';
import {Mark} from './icons';

interface NavProps {
  active: string | null;
  theme: Theme;
  onToggleTheme: (origin?: {x: number; y: number}) => void;
}

export function Nav({active, theme, onToggleTheme}: NavProps) {
  const {scrollY, scrollYProgress} = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 24));

  // Menu mobile : fermeture avec Échap, page figée tant qu'il est ouvert.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const themeLabel = theme === 'dark' ? 'Passer au thème clair' : 'Passer au thème sombre';
  const links = sections.filter((section) => section.id !== 'contact');

  return (
    <header className="nav" data-scrolled={scrolled || open}>
      <div className="shell flex h-16 items-center justify-between gap-4">
        <a href="#top" className="flex items-center gap-2.5 font-semibold tracking-tight" aria-label={`${identity.firstName} ${identity.lastName}, retour en haut de page`}>
          <Mark />
          <span>{identity.firstName}</span>
        </a>

        <nav aria-label="Sections" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {links.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="nav-link"
                  aria-current={active === section.id ? 'true' : undefined}
                >
                  {active === section.id && (
                    <motion.span
                      layoutId="nav-pill"
                      className="nav-pill"
                      transition={{type: 'spring', stiffness: 420, damping: 36}}
                    />
                  )}
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="icon-btn"
            aria-label={themeLabel}
            title={themeLabel}
            onClick={(event) => onToggleTheme({x: event.clientX, y: event.clientY})}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{rotate: -60, opacity: 0, scale: 0.6}}
                animate={{rotate: 0, opacity: 1, scale: 1}}
                exit={{rotate: 60, opacity: 0, scale: 0.6}}
                transition={{duration: 0.22}}
                className="grid place-items-center"
              >
                {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
              </motion.span>
            </AnimatePresence>
          </button>
          <a href="#contact" className="btn btn-primary btn-sm hidden sm:inline-flex">
            Me contacter
          </a>
          <button
            type="button"
            className="icon-btn md:hidden"
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={open}
            aria-controls="menu-mobile"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Fil de progression : la page se lit comme une exécution. */}
      <motion.div
        aria-hidden="true"
        className="absolute bottom-[-1px] left-0 h-px w-full origin-left bg-accent"
        style={{scaleX: scrollYProgress}}
      />

      <AnimatePresence>
        {open && (
          <motion.nav
            id="menu-mobile"
            aria-label="Sections"
            className="md:hidden border-t border-line bg-bg"
            initial={{height: 0, opacity: 0}}
            animate={{height: 'calc(100dvh - 4rem)', opacity: 1}}
            exit={{height: 0, opacity: 0}}
            transition={{duration: 0.3, ease: [0.22, 1, 0.36, 1]}}
            style={{overflow: 'hidden'}}
          >
            <ul className="shell flex flex-col py-6">
              {sections.map((section, index) => (
                <motion.li
                  key={section.id}
                  initial={{opacity: 0, x: -12}}
                  animate={{opacity: 1, x: 0}}
                  transition={{delay: 0.05 + index * 0.04}}
                >
                  <a
                    href={`#${section.id}`}
                    className="display flex items-center justify-between py-3 text-4xl"
                    onClick={() => setOpen(false)}
                  >
                    {section.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
