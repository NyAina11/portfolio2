import {useEffect, useRef, type RefObject} from 'react';
import {Life} from '../lib/life';

interface LifeFieldProps {
  /** Suspend l'évolution, sans arrêter l'affichage. */
  paused?: boolean;
  /** Arrête complètement le rendu (champ hors de vue). */
  asleep?: boolean;
  /** Titre à écrire en cellules vivantes au chargement : l'automate part de ses lettres. */
  stamp?: {target: RefObject<HTMLElement | null>; lines: string[]};
  className?: string;
}

const STEP_MS = 115;
const INTRO_HOLD_MS = 1250;
const YOUNG = 2;

interface Palette {
  born: string;
  alive: string;
  ghost: string;
}

/**
 * Fond vivant : un jeu de la vie rendu en matrice de points.
 * Les cellules naissent en couleur d'accent, mûrissent, puis laissent une trace en mourant.
 * Le pointeur sème de nouvelles cellules sur son passage.
 */
export function LifeField({paused = false, asleep = false, stamp, className}: LifeFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(paused);
  const asleepRef = useRef(asleep);
  const wake = useRef<() => void>(() => {});

  useEffect(() => {
    pausedRef.current = paused;
    asleepRef.current = asleep;
    if (!asleep) wake.current();
  }, [paused, asleep]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !host || !ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let life = new Life(1, 1);
    let pitch = 16;
    let width = 0;
    let height = 0;
    let palette: Palette = {born: '#ff6b3d', alive: '#5e68d6', ghost: '#262c66'};
    let frame = 0;
    let lastStep = 0;
    let lastFrame = 0;
    let introStart = -1;
    let frozenUntil = 0;
    let onScreen = true;
    let disposed = false;

    const readPalette = () => {
      const style = getComputedStyle(canvas);
      const pick = (name: string, fallback: string) => style.getPropertyValue(name).trim() || fallback;
      palette = {
        born: pick('--life-born', palette.born),
        alive: pick('--life-alive', palette.alive),
        ghost: pick('--life-ghost', palette.ghost),
      };
    };

    const build = () => {
      const rect = host.getBoundingClientRect();
      width = Math.round(rect.width);
      height = Math.round(rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      pitch = width < 640 ? 10 : 16;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      life = new Life(Math.max(4, Math.ceil(width / pitch)), Math.max(4, Math.ceil(height / pitch)));
    };

    const seed = () => {
      const blobs = Math.max(5, Math.round((life.cols * life.rows) / 700));
      for (let i = 0; i < blobs; i++) {
        life.soup(
          Math.floor(Math.random() * life.cols),
          Math.floor(Math.random() * life.rows),
          4 + Math.floor(Math.random() * 4),
          0.4,
        );
      }
    };

    /** Écrit le titre dans la grille : chaque cellule sous une lettre devient vivante. */
    const stampTitle = (): boolean => {
      const target = stamp?.target.current;
      if (!target || !stamp) return false;
      const box = canvas.getBoundingClientRect();
      const rect = target.getBoundingClientRect();
      const style = getComputedStyle(target);
      const size = parseFloat(style.fontSize);
      const lineHeight = parseFloat(style.lineHeight) || size * 0.88;
      const sample = 4;
      const scale = sample / pitch;

      const sheet = document.createElement('canvas');
      sheet.width = life.cols * sample;
      sheet.height = life.rows * sample;
      const pen = sheet.getContext('2d', {willReadFrequently: true});
      if (!pen) return false;
      pen.font = `800 condensed ${size * scale}px "Bricolage Grotesque Variable", sans-serif`;
      pen.textBaseline = 'middle';
      pen.fillStyle = '#fff';
      if ('letterSpacing' in pen) pen.letterSpacing = `${-0.012 * size * scale}px`;
      stamp.lines.forEach((line, index) => {
        pen.fillText(line, (rect.left - box.left) * scale, (rect.top - box.top + (index + 0.5) * lineHeight) * scale);
      });

      const pixels = pen.getImageData(0, 0, sheet.width, sheet.height).data;
      let count = 0;
      for (let y = 0; y < life.rows; y++) {
        for (let x = 0; x < life.cols; x++) {
          const offset = ((y * sample + sample / 2) * sheet.width + x * sample + sample / 2) * 4 + 3;
          if (pixels[offset] > 110) {
            life.spawn(x, y);
            count++;
          }
        }
      }
      return count > 24;
    };

    const draw = (blend: number, sweep: number) => {
      const {cols, rows, cur, prev, age, heat} = life;
      const radius = pitch * 0.33;
      const half = pitch / 2;
      const full = Math.PI * 2;
      const grow = 1 - (1 - blend) ** 3;
      ctx.clearRect(0, 0, width, height);

      // Trois passes, une par couleur : traces, cellules mûres, naissances.
      for (let pass = 0; pass < 3; pass++) {
        ctx.beginPath();
        for (let y = 0; y < rows; y++) {
          const row = y * cols;
          const cy = y * pitch + half;
          for (let x = 0; x < cols; x++) {
            const index = row + x;
            const alive = cur[index];
            let r = 0;

            if (pass === 0) {
              if (!alive && heat[index] > 0.04) r = 0.8 + radius * 0.5 * heat[index];
            } else if (alive) {
              const young = age[index] < YOUNG;
              if ((pass === 2) !== young) continue;
              if (sweep >= 0) {
                // Entrée en scène : les cellules apparaissent de gauche à droite.
                const local = (sweep - (x / cols) * 620) / 320;
                r = local <= 0 ? 0 : radius * (local >= 1 ? 1 : 1 - (1 - local) ** 3);
              } else {
                r = prev[index] ? radius : radius * grow;
              }
            } else if (pass === 1 && prev[index] && sweep < 0) {
              r = radius * (1 - blend);
            }

            if (r > 0.35) {
              const cx = x * pitch + half;
              ctx.moveTo(cx + r, cy);
              ctx.arc(cx, cy, r, 0, full);
            }
          }
        }
        ctx.fillStyle = pass === 0 ? palette.ghost : pass === 1 ? palette.alive : palette.born;
        ctx.fill();
      }
    };

    /** Empêche l'automate de s'éteindre : planeurs réguliers, et un nouveau foyer si la vie se raréfie. */
    const keepAlive = () => {
      if (life.generation % 16 === 0) {
        life.glider(
          Math.floor(Math.random() * life.cols),
          Math.floor(Math.random() * life.rows),
          Math.random() < 0.5,
          Math.random() < 0.5,
        );
      }
      if (life.density < 0.045) {
        life.soup(Math.floor(Math.random() * life.cols), Math.floor(Math.random() * life.rows), 6, 0.42);
      }
    };

    const tick = (now: number) => {
      frame = 0;
      if (disposed || asleepRef.current || !onScreen || document.hidden) return;
      frame = requestAnimationFrame(tick);

      const delta = Math.min(64, now - lastFrame || 16);
      lastFrame = now;
      const frozen = now < frozenUntil;

      if (!frozen && introStart >= 0) {
        introStart = -1;
        life.settle();
        lastStep = now;
      }
      if (!frozen && !pausedRef.current && now - lastStep >= STEP_MS) {
        life.step();
        keepAlive();
        lastStep = now;
      }

      const decay = 0.9 ** (delta / 16.7);
      const heat = life.heat;
      for (let i = 0; i < heat.length; i++) if (heat[i] > 0.001) heat[i] *= decay;

      const blend = pausedRef.current ? 1 : Math.min(1, (now - lastStep) / STEP_MS);
      draw(blend, frozen ? now - introStart : -1);
    };

    const start = () => {
      if (!frame && !reduced && !disposed) {
        lastFrame = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };
    wake.current = start;

    const settleStatic = () => {
      seed();
      for (let i = 0; i < 24; i++) life.step();
      life.settle();
      life.heat.fill(0);
      draw(1, -1);
    };

    const init = (withTitle: boolean) => {
      build();
      readPalette();
      if (reduced) {
        settleStatic();
        return;
      }
      if (withTitle && stampTitle()) {
        introStart = performance.now();
        frozenUntil = introStart + INTRO_HOLD_MS;
      } else {
        seed();
        life.settle();
      }
      lastStep = performance.now();
      start();
    };

    // Le titre a besoin de la police : on attend qu'elle soit prête, sans bloquer plus d'une seconde.
    let booted = false;
    const boot = () => {
      if (booted || disposed) return;
      booted = true;
      init(true);
    };
    const fallback = window.setTimeout(boot, 1200);
    void document.fonts.ready.then(() => requestAnimationFrame(boot));

    const cellAt = (event: PointerEvent) => {
      const box = canvas.getBoundingClientRect();
      return {
        x: Math.floor((event.clientX - box.left) / pitch),
        y: Math.floor((event.clientY - box.top) / pitch),
      };
    };
    let lastCell = -1;
    const onMove = (event: PointerEvent) => {
      if (!booted || reduced || performance.now() < frozenUntil) return;
      const {x, y} = cellAt(event);
      const key = y * life.cols + x;
      if (key === lastCell) return;
      lastCell = key;
      life.soup(x, y, 2, 0.4);
    };
    const onDown = (event: PointerEvent) => {
      if (!booted || reduced || performance.now() < frozenUntil) return;
      const {x, y} = cellAt(event);
      life.soup(x, y, 5, 0.5);
    };

    let resizeTimer = 0;
    const resizer = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (!booted) return;
        const rect = host.getBoundingClientRect();
        // La barre d'adresse mobile fait varier la hauteur : on ne reconstruit que pour un vrai changement.
        if (Math.abs(rect.width - width) < 2 && Math.abs(rect.height - height) < 120) return;
        init(false);
      }, 180);
    });
    resizer.observe(host);

    const viewport = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) start();
    });
    viewport.observe(canvas);

    const onVisibility = () => {
      if (!document.hidden) start();
    };
    const themeWatcher = new MutationObserver(() => {
      readPalette();
      if (reduced) draw(1, -1);
    });
    themeWatcher.observe(document.documentElement, {attributes: true, attributeFilter: ['data-theme']});

    host.addEventListener('pointermove', onMove, {passive: true});
    host.addEventListener('pointerdown', onDown, {passive: true});
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      disposed = true;
      window.clearTimeout(fallback);
      window.clearTimeout(resizeTimer);
      cancelAnimationFrame(frame);
      resizer.disconnect();
      viewport.disconnect();
      themeWatcher.disconnect();
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerdown', onDown);
      document.removeEventListener('visibilitychange', onVisibility);
    };
    // Le champ est construit une seule fois : `stamp` ne sert qu'au premier rendu.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
