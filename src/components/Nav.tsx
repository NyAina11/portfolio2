import {useEffect, useState} from 'react';
import {AnimatePresence, motion, useReducedMotion, useScroll} from 'motion/react';
import {Menu, Moon, Sun, X} from 'lucide-react';
import {identity, sections} from '../content';
import type {Theme} from '../lib/hooks';
import {lockScroll} from '../lib/scroll';
import {GitHubIcon, LinkedInIcon, Mark} from './icons';

interface NavProps {
  active: string | null;
  theme: Theme;
  onToggleTheme: (origin?: {x: number; y: number}) => void;
}

const links = sections.filter((section) => section.nav);

export function Nav({active, theme, onToggleTheme}: NavProps) {
  const reduced = useReducedMotion();
  const {scrollYProgress} = useScroll();
  const [open, setOpen] = useState(false);

  // Menu mobile : fermeture avec Échap, page figée tant qu'il est ouvert.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    lockScroll(true);
    window.addEventListener('keydown', onKey);
    return () => {
      lockScroll(false);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const themeLabel = theme === 'dark' ? 'Passer au thème clair' : 'Passer au thème sombre';
  const curtain = 'calc(100% - 2.6rem) 2.6rem';

  return (
    <>
      <motion.header
        className="nav"
        initial={reduced ? false : {opacity: 0, y: -24}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.8, delay: 1.3, ease: [0.22, 1, 0.36, 1]}}
      >
        <div className="nav-bar">
          <a
            href="#top"
            className="flex items-center gap-2.5 font-semibold tracking-tight"
            aria-label={`${identity.firstName} ${identity.lastName}, retour en haut de page`}
            onClick={() => setOpen(false)}
          >
            <Mark />
            <span>{identity.firstName}</span>
          </a>

          <nav aria-label="Sections" className="hidden md:block">
            <ul className="flex items-center gap-0.5">
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

          <div className="flex items-center gap-1.5">
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

          {/* Fil de progression : la page se lit comme une exécution. */}
          <motion.span aria-hidden="true" className="nav-progress" style={{scaleX: scrollYProgress}} />
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="menu-mobile"
            aria-label="Sections"
            className="menu md:hidden"
            initial={{clipPath: `circle(0% at ${curtain})`}}
            animate={{clipPath: `circle(150% at ${curtain})`}}
            exit={{clipPath: `circle(0% at ${curtain})`}}
            transition={{duration: reduced ? 0 : 0.55, ease: [0.22, 1, 0.36, 1]}}
          >
            <ul>
              {sections
                .filter((section) => section.id !== 'demo')
                .map((section, index) => (
                  <motion.li
                    key={section.id}
                    initial={reduced ? false : {opacity: 0, y: 28}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.16 + index * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1]}}
                  >
                    <a href={`#${section.id}`} className="display menu-link" onClick={() => setOpen(false)}>
                      {section.label}
                    </a>
                  </motion.li>
                ))}
            </ul>
            <div className="flex items-center justify-between gap-4 border-t border-line pt-5 text-[0.95rem]">
              <a href={`mailto:${identity.email}`} className="link truncate">
                {identity.email}
              </a>
              <span className="flex flex-none items-center gap-2">
                <a href={identity.github} target="_blank" rel="noreferrer" className="icon-btn" aria-label="GitHub">
                  <GitHubIcon />
                </a>
                <a href={identity.linkedin} target="_blank" rel="noreferrer" className="icon-btn" aria-label="LinkedIn">
                  <LinkedInIcon />
                </a>
              </span>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
