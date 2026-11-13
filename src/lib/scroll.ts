import Lenis from 'lenis';
import {useEffect} from 'react';

let instance: Lenis | null = null;

/** Hauteur réservée à la navigation flottante quand on saute vers une ancre. */
const NAV_OFFSET = 88;

/**
 * Défilement fluide de la page et liens d'ancre.
 *
 * Les ancres sont gérées ici plutôt que par le navigateur : le hero est épinglé et
 * les panneaux de projets sont collants, ce qui fausse le saut natif. Si le système
 * demande un mouvement réduit, le défilement reste natif et les sauts sont immédiats.
 */
export function useSmoothScroll(): void {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lenis = reduced ? null : new Lenis({autoRaf: true, lerp: 0.11});
    instance = lenis;

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest('a[href^="#"]') : null;
      const hash = link?.getAttribute('href');
      if (!hash) return;

      const toTop = hash === '#top';
      const target = toTop ? null : document.getElementById(decodeURIComponent(hash.slice(1)));
      if (!toTop && !target) return;

      event.preventDefault();
      const top = target ? Math.max(0, target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET) : 0;
      // `force` : le menu mobile vient peut-être de figer le défilement, le saut doit passer quand même.
      if (lenis) lenis.scrollTo(top, {force: true});
      else window.scrollTo({top});
      history.pushState(null, '', toTop ? window.location.pathname + window.location.search : hash);

      // Le focus suit le saut, pour que la lecture au clavier reprenne au bon endroit.
      if (target) {
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
        target.focus({preventScroll: true});
      }
    };

    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('click', onClick);
      lenis?.destroy();
      instance = null;
    };
  }, []);
}

/** Fige ou relâche le défilement, par exemple pendant que le menu mobile est ouvert. */
export function lockScroll(locked: boolean): void {
  document.body.style.overflow = locked ? 'hidden' : '';
  if (locked) instance?.stop();
  else instance?.start();
}
