import {type RefObject, useCallback, useEffect, useState} from 'react';
import {flushSync} from 'react-dom';

/** Suit une media query CSS. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/** Largeur courante d'un élément, mise à jour quand il est redimensionné. */
export function useElementWidth(ref: RefObject<HTMLElement | null>): number {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setWidth(el.clientWidth);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return width;
}

export type Theme = 'dark' | 'light';

const THEME_COLORS: Record<Theme, string> = {dark: '#0b0e24', light: '#eceef7'};

/** Thème clair ou sombre, mémorisé et révélé par un cercle qui part du bouton. */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.dataset.theme === 'light' ? 'light' : 'dark',
  );

  const toggle = useCallback(
    (origin?: {x: number; y: number}) => {
      const next: Theme = theme === 'dark' ? 'light' : 'dark';
      const apply = () => {
        document.documentElement.dataset.theme = next;
        document
          .querySelector('meta[name="theme-color"]')
          ?.setAttribute('content', THEME_COLORS[next]);
        try {
          localStorage.setItem('theme', next);
        } catch {
          /* stockage indisponible : le thème reste valable pour la session */
        }
        setTheme(next);
      };

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!origin || reduced || typeof document.startViewTransition !== 'function') {
        apply();
        return;
      }

      const {x, y} = origin;
      const radius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      );
      const transition = document.startViewTransition(() => flushSync(apply));
      transition.ready
        .then(() => {
          document.documentElement.animate(
            {clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`]},
            {
              duration: 620,
              easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
              pseudoElement: '::view-transition-new(root)',
            },
          );
        })
        .catch(() => {
          /* transition interrompue : le thème est déjà appliqué */
        });
    },
    [theme],
  );

  return {theme, toggle};
}
