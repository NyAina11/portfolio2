import {useCallback, useEffect, useMemo, useRef, useState, type RefObject} from 'react';
import {
  animate,
  AnimatePresence,
  motion,
  motionValue,
  useInView,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from 'motion/react';
import {LayoutGrid, Play, RotateCcw} from 'lucide-react';
import {flows, type Flow} from '../content';
import {useElementWidth, useMediaQuery} from '../lib/hooks';
import {flowIcons} from './icons';

type NodeState = 'idle' | 'running' | 'done';
type EdgeState = 'idle' | 'flowing' | 'done';
type RunStatus = 'idle' | 'running' | 'done';

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
  /** Nœud secondaire, décalé de la chaîne principale. */
  sub: boolean;
}

interface Geometry {
  mode: 'graph' | 'rail';
  height: number;
  rects: Record<string, Rect>;
}

interface Point2 {
  x: MotionValue<number>;
  y: MotionValue<number>;
}

const PULSE_MS = 620;
const RAIL_GUTTER = 22;
const RAIL_INDENT = 46;

/* ------------------------------------------------------------------ */
/* Géométrie                                                           */
/* ------------------------------------------------------------------ */

/** Place les nœuds : graphe horizontal sur grand écran, rail vertical sur mobile. */
function computeGeometry(flow: Flow, width: number): Geometry {
  const rects: Record<string, Rect> = {};

  if (width >= 760) {
    const cols = Math.max(...flow.nodes.filter((n) => n.row === 0).map((n) => n.col)) + 1;
    const rows = Math.max(...flow.nodes.map((n) => n.row)) + 1;
    const h = 64;
    const rowGap = 54;
    const w = Math.min(204, Math.floor((width - (cols - 1) * 40) / cols));
    const step = cols > 1 ? Math.min((width - w) / (cols - 1), w + 160) : 0;
    for (const node of flow.nodes) {
      rects[node.id] = {x: node.col * step, y: node.row * (h + rowGap), w, h, sub: node.row > 0};
    }
    return {mode: 'graph', height: rows * h + (rows - 1) * rowGap, rects};
  }

  const h = 58;
  const gap = 20;
  const w = Math.min(width - RAIL_INDENT, 460);
  const ordered = [...flow.nodes].sort((a, b) => a.col - b.col || a.row - b.row);
  ordered.forEach((node, index) => {
    rects[node.id] = {
      x: node.row > 0 ? RAIL_INDENT : 0,
      y: index * (h + gap),
      w,
      h,
      sub: node.row > 0,
    };
  });
  return {mode: 'rail', height: ordered.length * (h + gap) - gap, rects};
}

interface Route {
  d: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

/** Courbe de Bézier entre deux nœuds, qui choisit ses ports selon leur position. */
function routeGraph(a: Rect, b: Rect): Route {
  const dx = b.x + b.w / 2 - (a.x + a.w / 2);
  const dy = b.y + b.h / 2 - (a.y + a.h / 2);

  if (Math.abs(dx) > Math.abs(dy) * 1.2) {
    const forward = dx > 0;
    const x1 = forward ? a.x + a.w : a.x;
    const x2 = forward ? b.x : b.x + b.w;
    const y1 = a.y + a.h / 2;
    const y2 = b.y + b.h / 2;
    const k = Math.max(28, Math.abs(x2 - x1) * 0.5) * (forward ? 1 : -1);
    return {d: `M${x1} ${y1} C${x1 + k} ${y1} ${x2 - k} ${y2} ${x2} ${y2}`, x1, y1, x2, y2};
  }

  const down = dy > 0;
  const x1 = a.x + a.w / 2;
  const x2 = b.x + b.w / 2;
  const y1 = down ? a.y + a.h : a.y;
  const y2 = down ? b.y : b.y + b.h;
  const k = Math.max(22, Math.abs(y2 - y1) * 0.5) * (down ? 1 : -1);
  return {d: `M${x1} ${y1} C${x1} ${y1 + k} ${x2} ${y2 - k} ${x2} ${y2}`, x1, y1, x2, y2};
}

/** Tracé en rail : une ligne principale à gauche, des coudes vers les nœuds secondaires. */
function routeRail(a: Rect, b: Rect): Route {
  const gx = RAIL_GUTTER;
  const r = 12;
  const down = b.y > a.y;

  if (!a.sub && b.sub) {
    const x1 = gx;
    const y1 = down ? a.y + a.h : a.y;
    const x2 = b.x;
    const y2 = b.y + b.h / 2;
    const turn = y2 + (down ? -r : r);
    return {d: `M${x1} ${y1} L${gx} ${turn} Q${gx} ${y2} ${gx + r} ${y2} L${x2} ${y2}`, x1, y1, x2, y2};
  }

  if (a.sub && !b.sub) {
    const x1 = a.x;
    const y1 = a.y + a.h / 2;
    const x2 = gx;
    const y2 = down ? b.y : b.y + b.h;
    const turn = y1 + (down ? r : -r);
    return {d: `M${x1} ${y1} L${gx + r} ${y1} Q${gx} ${y1} ${gx} ${turn} L${x2} ${y2}`, x1, y1, x2, y2};
  }

  const x1 = gx;
  const y1 = down ? a.y + a.h : a.y;
  const y2 = down ? b.y : b.y + b.h;
  return {d: `M${x1} ${y1} L${gx} ${y2}`, x1, y1, x2: gx, y2};
}

/* ------------------------------------------------------------------ */
/* Exécution simulée                                                   */
/* ------------------------------------------------------------------ */

interface LogLine {
  node: string;
  text: string;
}

function useFlowRun(flow: Flow, instant: boolean) {
  const [nodes, setNodes] = useState<Record<string, NodeState>>({});
  const [edges, setEdges] = useState<Record<number, EdgeState>>({});
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [status, setStatus] = useState<RunStatus>('idle');
  const token = useRef(0);

  const reset = useCallback(() => {
    token.current += 1;
    setNodes({});
    setEdges({});
    setLogs([]);
    setStatus('idle');
  }, []);

  const run = useCallback(async () => {
    const mine = ++token.current;
    const alive = () => token.current === mine;
    const wait = (ms: number) =>
      new Promise<void>((resolve) => window.setTimeout(resolve, instant ? 0 : ms));
    const mark = (indexes: number[], state: EdgeState) =>
      setEdges((current) => {
        const next = {...current};
        for (const index of indexes) next[index] = state;
        return next;
      });

    setNodes({});
    setEdges({});
    setLogs([]);
    setStatus('running');
    await wait(120);

    for (const step of flow.steps) {
      if (!alive()) return;

      if (step.via?.length) {
        mark(step.via, 'flowing');
        await wait(PULSE_MS);
        if (!alive()) return;
        mark(step.via, 'done');
      }

      setNodes((current) => ({...current, [step.node]: 'running'}));
      await wait(step.ms ?? 560);
      if (!alive()) return;
      setNodes((current) => ({...current, [step.node]: 'done'}));
      setLogs((current) => [...current, {node: step.node, text: step.log}]);

      if (step.emit?.length) {
        const emitted = step.emit;
        mark(emitted, 'flowing');
        window.setTimeout(
          () => {
            if (!alive()) return;
            mark(emitted, 'done');
            setNodes((current) => {
              const next = {...current};
              for (const index of emitted) {
                const target = flow.edges[index][1];
                if (!next[target]) next[target] = 'running';
              }
              return next;
            });
          },
          instant ? 0 : PULSE_MS,
        );
      }

      await wait(140);
    }

    if (alive()) setStatus('done');
  }, [flow, instant]);

  // Annule toute exécution en cours quand le composant disparaît.
  useEffect(
    () => () => {
      token.current += 1;
    },
    [],
  );

  return {nodes, edges, logs, status, run, reset};
}

/* ------------------------------------------------------------------ */
/* Câbles                                                              */
/* ------------------------------------------------------------------ */

interface WireProps {
  a: Point2;
  b: Point2;
  ra: Rect;
  rb: Rect;
  mode: Geometry['mode'];
  state: EdgeState;
  domain: string;
  index: number;
  animated: boolean;
  delay: number;
}

function useRoute({a, b, ra, rb, mode}: Pick<WireProps, 'a' | 'b' | 'ra' | 'rb' | 'mode'>) {
  return useTransform(() => {
    const from = {...ra, x: a.x.get(), y: a.y.get()};
    const to = {...rb, x: b.x.get(), y: b.y.get()};
    return mode === 'graph' ? routeGraph(from, to) : routeRail(from, to);
  });
}

function Wire(props: WireProps) {
  const {state, domain, index, animated, delay} = props;
  const route = useRoute(props);
  const d = useTransform(() => route.get().d);

  return (
    <g data-domain={domain}>
      <motion.path
        className="wire"
        d={d}
        initial={animated ? {pathLength: 0, opacity: 0} : false}
        animate={{pathLength: 1, opacity: 1}}
        transition={{duration: 0.6, delay: delay + 0.35 + index * 0.09, ease: [0.22, 1, 0.36, 1]}}
      />
      {state !== 'idle' && (
        <motion.path
          className="wire-on"
          d={d}
          initial={animated ? {pathLength: 0} : false}
          animate={{pathLength: 1}}
          transition={{duration: PULSE_MS / 1000, ease: 'easeInOut'}}
        />
      )}
      {state === 'flowing' && animated && (
        <motion.path
          className="wire-head"
          d={d}
          initial={{pathLength: 0.14, pathOffset: -0.14}}
          animate={{pathOffset: 1}}
          transition={{duration: PULSE_MS / 1000, ease: 'easeInOut'}}
        />
      )}
    </g>
  );
}

function WirePorts(props: WireProps) {
  const {state, domain, index, animated, delay} = props;
  const route = useRoute(props);
  const x1 = useTransform(() => route.get().x1);
  const y1 = useTransform(() => route.get().y1);
  const x2 = useTransform(() => route.get().x2);
  const y2 = useTransform(() => route.get().y2);

  return (
    <g data-domain={domain}>
      <motion.circle
        className="wire-port"
        r={4}
        cx={x1}
        cy={y1}
        data-on={state !== 'idle'}
        initial={animated ? {opacity: 0} : false}
        animate={{opacity: 1}}
        transition={{duration: 0.3, delay: delay + 0.35 + index * 0.09}}
      />
      <motion.circle
        className="wire-port"
        r={4}
        cx={x2}
        cy={y2}
        data-on={state === 'done'}
        initial={animated ? {opacity: 0} : false}
        animate={{opacity: 1}}
        transition={{duration: 0.3, delay: delay + 0.8 + index * 0.09}}
      />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Graphe                                                              */
/* ------------------------------------------------------------------ */

interface GraphProps {
  flow: Flow;
  geometry: Geometry;
  nodeStates: Record<string, NodeState>;
  edgeStates: Record<number, EdgeState>;
  draggable: boolean;
  animated: boolean;
  /** Délai avant l'entrée en scène, en secondes. */
  delay: number;
  bounds: RefObject<HTMLDivElement | null>;
  realign: number;
  onMoved: () => void;
}

function Graph({flow, geometry, nodeStates, edgeStates, draggable, animated, delay, bounds, realign, onMoved}: GraphProps) {
  // Une paire de valeurs animées par nœud : le glisser-déposer les modifie, les câbles les suivent.
  const points = useMemo(() => {
    const map: Record<string, Point2> = {};
    for (const node of flow.nodes) {
      const rect = geometry.rects[node.id];
      map[node.id] = {x: motionValue(rect.x), y: motionValue(rect.y)};
    }
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flow]);

  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const controls = flow.nodes.flatMap((node) => {
      const rect = geometry.rects[node.id];
      const point = points[node.id];
      if (!animated) {
        point.x.set(rect.x);
        point.y.set(rect.y);
        return [];
      }
      const spring = {type: 'spring', stiffness: 240, damping: 26} as const;
      return [animate(point.x, rect.x, spring), animate(point.y, rect.y, spring)];
    });
    return () => controls.forEach((control) => control.stop());
  }, [geometry, realign, flow, points, animated]);

  const wires = flow.edges.map(([from, to], index) => {
    const target = flow.nodes.find((node) => node.id === to)!;
    return {
      key: `${from}-${to}`,
      a: points[from],
      b: points[to],
      ra: geometry.rects[from],
      rb: geometry.rects[to],
      mode: geometry.mode,
      state: edgeStates[index] ?? 'idle',
      domain: target.domain,
      index,
      animated,
      delay,
    } satisfies WireProps & {key: string};
  });

  return (
    <motion.div
      className="absolute inset-0"
      initial={animated ? {opacity: 0} : false}
      animate={{opacity: 1}}
      exit={{opacity: 0, transition: {duration: 0.16}}}
    >
      <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
        {wires.map(({key, ...wire}) => (
          <Wire key={key} {...wire} />
        ))}
      </svg>

      {flow.nodes.map((node, index) => {
        const rect = geometry.rects[node.id];
        const Icon = flowIcons[node.icon];
        return (
          <motion.div
            key={node.id}
            className="node"
            data-domain={node.domain}
            data-state={nodeStates[node.id] ?? 'idle'}
            data-drag={draggable}
            style={{x: points[node.id].x, y: points[node.id].y, width: rect.w, height: rect.h}}
            drag={draggable}
            dragConstraints={bounds}
            dragElastic={0.12}
            dragMomentum={false}
            whileDrag={{scale: 1.04}}
            onDragStart={onMoved}
          >
            <motion.div
              className="node-body"
              initial={animated ? {opacity: 0, scale: 0.86} : false}
              animate={{opacity: 1, scale: 1}}
              transition={{type: 'spring', stiffness: 320, damping: 24, delay: delay + 0.08 + index * 0.08}}
            >
              <span className="node-icon">
                <Icon size={18} strokeWidth={2} />
              </span>
              <span className="min-w-0">
                <span className="node-label">{node.label}</span>
                <span className="node-sub">{node.sub}</span>
              </span>
            </motion.div>
          </motion.div>
        );
      })}

      <svg className="pointer-events-none absolute inset-0 z-[2] h-full w-full overflow-visible" aria-hidden="true">
        {wires.map(({key, ...wire}) => (
          <WirePorts key={key} {...wire} />
        ))}
      </svg>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Canevas complet                                                     */
/* ------------------------------------------------------------------ */

export function FlowCanvas({introDelay = 0}: {introDelay?: number}) {
  const reduced = useReducedMotion() ?? false;
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)');
  const [flowId, setFlowId] = useState(flows[0].id);
  const flow = flows.find((candidate) => candidate.id === flowId) ?? flows[0];

  const stageRef = useRef<HTMLDivElement>(null);
  const boundsRef = useRef<HTMLDivElement>(null);
  const width = useElementWidth(stageRef);
  const geometry = useMemo(() => (width > 0 ? computeGeometry(flow, width) : null), [flow, width]);

  const {nodes, edges, logs, status, run, reset} = useFlowRun(flow, reduced);
  const [moved, setMoved] = useState(false);
  const [realign, setRealign] = useState(0);
  // Le journal n'est annoncé aux lecteurs d'écran qu'après une action de la personne.
  const [announce, setAnnounce] = useState(false);

  const draggable = finePointer && geometry?.mode === 'graph';
  const ready = geometry !== null;

  // Première exécution quand le canevas arrive à l'écran, puis à chaque changement d'onglet.
  const inView = useInView(stageRef, {amount: 0.35});
  const played = useRef(new Set<string>());
  const started = useRef(false);
  const intro = !started.current && !reduced ? introDelay : 0;
  useEffect(() => {
    if (!inView || !ready || played.current.has(flow.id)) return;
    const delay = started.current ? 620 : introDelay * 1000 + 1400;
    const timer = window.setTimeout(() => {
      started.current = true;
      played.current.add(flow.id);
      void run();
    }, delay);
    return () => window.clearTimeout(timer);
  }, [inView, ready, flow.id, run, introDelay]);

  const select = (id: string) => {
    if (id === flowId) return;
    reset();
    setMoved(false);
    setAnnounce(true);
    // Choisir un workflow le lance : c'est la réponse attendue à ce clic.
    played.current.delete(id);
    setFlowId(id);
  };

  const labelOf = (id: string) => flow.nodes.find((node) => node.id === id);
  const runLabel = status === 'running' ? 'Exécution…' : status === 'done' ? 'Relancer' : 'Exécuter';
  const hint =
    status === 'running'
      ? 'Exécution en cours.'
      : status === 'done'
        ? `${flow.outcome}.`
        : draggable
          ? 'Simulation dans votre navigateur. Les nœuds se déplacent à la souris.'
          : 'Simulation dans votre navigateur.';

  return (
    <section aria-label="Démonstration de workflows">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <div role="group" aria-label="Workflow à afficher" className="seg">
          {flows.map((candidate) => {
            const selected = candidate.id === flow.id;
            return (
              <button
                key={candidate.id}
                type="button"
                aria-pressed={selected}
                className="seg-btn"
                onClick={() => select(candidate.id)}
              >
                {selected && (
                  <motion.span
                    layoutId="seg-pill"
                    className="seg-pill"
                    transition={{type: 'spring', stiffness: 440, damping: 36}}
                  />
                )}
                {candidate.tab}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          {moved && (
            <button
              type="button"
              className="icon-btn"
              aria-label="Réaligner les nœuds"
              title="Réaligner les nœuds"
              onClick={() => {
                setRealign((value) => value + 1);
                setMoved(false);
              }}
            >
              <LayoutGrid size={16} />
            </button>
          )}
          <button
            type="button"
            className="btn btn-quiet btn-sm"
            onClick={() => {
              setAnnounce(true);
              void run();
            }}
            disabled={status === 'running'}
            style={{opacity: status === 'running' ? 0.6 : 1}}
          >
            {status === 'done' ? <RotateCcw size={15} /> : <Play size={15} fill="currentColor" />}
            {runLabel}
          </button>
        </div>
      </div>

      <p className="mt-5 text-[1.05rem] font-medium text-ink-2">{flow.title}</p>

      <div
        ref={stageRef}
        role="img"
        aria-label={`${flow.title}. Étapes : ${flow.nodes.map((node) => node.label).join(', ')}.`}
        className="relative mt-6"
        style={{height: geometry?.height ?? 182, transition: 'height 0.35s cubic-bezier(0.22, 1, 0.36, 1)'}}
      >
        <div ref={boundsRef} className="pointer-events-none absolute -inset-x-3 -inset-y-10" />
        <AnimatePresence mode="wait" initial>
          {geometry && (
            <Graph
              key={`${flow.id}-${geometry.mode}`}
              flow={flow}
              geometry={geometry}
              nodeStates={nodes}
              edgeStates={edges}
              draggable={draggable}
              animated={!reduced}
              delay={intro}
              bounds={boundsRef}
              realign={realign}
              onMoved={() => setMoved(true)}
            />
          )}
        </AnimatePresence>
      </div>

      <div className="mt-7 grid gap-x-10 gap-y-4 border-t border-line pt-5 lg:grid-cols-[minmax(0,1fr)_auto]">
        <ol
          className="console grid content-start gap-y-1.5"
          aria-live={announce ? 'polite' : 'off'}
          aria-label="Journal d’exécution"
          style={{minHeight: `calc(${flow.steps.length} * 1.5em + ${flow.steps.length - 1} * 0.375rem)`}}
        >
          <AnimatePresence initial={false}>
            {logs.map((line, index) => {
              const node = labelOf(line.node);
              return (
                <motion.li
                  key={`${flow.id}-${index}`}
                  className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-3 sm:grid-cols-[8.5rem_minmax(0,1fr)]"
                  initial={reduced ? false : {opacity: 0, x: -8}}
                  animate={{opacity: 1, x: 0}}
                  transition={{duration: 0.3}}
                >
                  <span className="console-tag truncate" data-domain={node?.domain}>
                    {node?.label}
                  </span>
                  <span>{line.text}</span>
                </motion.li>
              );
            })}
          </AnimatePresence>
          {logs.length === 0 && status === 'idle' && (
            <li className="text-ink-3">En attente. Appuyez sur Exécuter pour lancer le workflow.</li>
          )}
        </ol>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 self-end text-[0.95rem] lg:flex-col lg:items-end lg:gap-y-1.5">
          <p className="text-ink-3">{hint}</p>
          <a href={`#projet-${flow.projectId}`} className="link">
            Voir le projet
          </a>
        </div>
      </div>
    </section>
  );
}
