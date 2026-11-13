import {useLayoutEffect, useMemo, useRef, useState} from 'react';
import {AnimatePresence, motion, useInView, useReducedMotion} from 'motion/react';
import {domains, patchProjects, projectTitles, skills, type Domain, type Skill} from '../content';
import {useMediaQuery} from '../lib/hooks';
import {Section} from './Section';

type Focus = {type: 'skill' | 'project'; id: string} | null;

const domainOrder: Domain[] = ['ia', 'ops', 'dev', 'net'];
const grouped = domainOrder.map((domain) => ({
  domain,
  items: skills.filter((skill) => skill.domain === domain),
}));

const edges = skills.flatMap((skill) =>
  skill.projects.map((project) => ({key: `${skill.id}:${project}`, skill: skill.id, project, domain: skill.domain})),
);

const skillById = Object.fromEntries(skills.map((skill) => [skill.id, skill])) as Record<string, Skill>;

function skillHot(focus: Focus, skill: Skill): boolean {
  if (!focus) return false;
  return focus.type === 'skill' ? skill.id === focus.id : skill.projects.includes(focus.id);
}

function projectHot(focus: Focus, projectId: string): boolean {
  if (!focus) return false;
  return focus.type === 'project' ? projectId === focus.id : skillById[focus.id].projects.includes(projectId);
}

function edgeHot(focus: Focus, edge: {skill: string; project: string}): boolean {
  if (!focus) return false;
  return focus.type === 'skill' ? edge.skill === focus.id : edge.project === focus.id;
}

/* ------------------------------------------------------------------ */
/* Grand écran : tableau de brassage                                   */
/* ------------------------------------------------------------------ */

interface Measure {
  skills: Record<string, {x: number; y: number}>;
  projects: Record<string, {x: number; y: number}>;
}

function PatchPanel() {
  const reduced = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const skillPorts = useRef<Record<string, HTMLElement | null>>({});
  const projectPorts = useRef<Record<string, HTMLElement | null>>({});
  const [measure, setMeasure] = useState<Measure | null>(null);
  const [hover, setHover] = useState<Focus>(null);
  const [pinned, setPinned] = useState<Focus>(null);
  const focus = hover ?? pinned;
  const inView = useInView(panelRef, {once: true, amount: 0.2});

  useLayoutEffect(() => {
    const panel = panelRef.current;
    const svg = svgRef.current;
    if (!panel || !svg) return;

    const update = () => {
      const box = svg.getBoundingClientRect();
      const read = (ports: Record<string, HTMLElement | null>) => {
        const out: Record<string, {x: number; y: number}> = {};
        for (const [id, element] of Object.entries(ports)) {
          if (!element) continue;
          const rect = element.getBoundingClientRect();
          out[id] = {x: rect.left + rect.width / 2 - box.left, y: rect.top + rect.height / 2 - box.top};
        }
        return out;
      };
      setMeasure({skills: read(skillPorts.current), projects: read(projectPorts.current)});
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(panel);
    void document.fonts?.ready.then(update);
    return () => observer.disconnect();
  }, []);

  const paths = useMemo(() => {
    if (!measure) return [];
    return edges.flatMap((edge) => {
      const from = measure.skills[edge.skill];
      const to = measure.projects[edge.project];
      if (!from || !to) return [];
      const bend = (to.x - from.x) * 0.5;
      return [{...edge, d: `M${from.x} ${from.y} C${from.x + bend} ${from.y} ${to.x - bend} ${to.y} ${to.x} ${to.y}`}];
    });
  }, [measure]);

  const leave = () => setHover(null);

  return (
    <div ref={panelRef} className="grid grid-cols-[minmax(0,20rem)_minmax(7rem,1fr)_minmax(0,20rem)]">
      <div className="flex flex-col gap-7">
        {grouped.map((group) => (
          <div key={group.domain} data-domain={group.domain}>
            <h3 className="mb-2 flex items-center gap-2.5 pl-3 text-[0.95rem] font-semibold text-ink-2">
              <span className="dot" />
              {domains[group.domain].label}
            </h3>
            <ul>
              {group.items.map((skill) => {
                const hot = skillHot(focus, skill);
                return (
                  <li key={skill.id}>
                    <button
                      type="button"
                      className="patch-row"
                      data-hot={hot}
                      data-dim={Boolean(focus) && !hot}
                      aria-pressed={pinned?.type === 'skill' && pinned.id === skill.id}
                      onMouseEnter={() => setHover({type: 'skill', id: skill.id})}
                      onMouseLeave={leave}
                      onFocus={() => setHover({type: 'skill', id: skill.id})}
                      onBlur={leave}
                      onClick={() =>
                        setPinned((current) =>
                          current?.type === 'skill' && current.id === skill.id ? null : {type: 'skill', id: skill.id},
                        )
                      }
                    >
                      <span>{skill.label}</span>
                      <span
                        className="patch-port"
                        ref={(element) => {
                          skillPorts.current[skill.id] = element;
                        }}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <svg ref={svgRef} className="h-full w-full overflow-visible" aria-hidden="true">
        {paths.map((path, index) => {
          const hot = edgeHot(focus, path);
          return (
            <g key={path.key} data-domain={path.domain}>
              <motion.path
                className="patch-wire"
                d={path.d}
                data-hot={hot}
                data-dim={Boolean(focus) && !hot}
                initial={reduced ? false : {pathLength: 0}}
                animate={inView || reduced ? {pathLength: 1} : {pathLength: 0}}
                transition={{duration: 1.1, delay: index * 0.014, ease: [0.22, 1, 0.36, 1]}}
              />
              {hot && !reduced && (
                <motion.path
                  key={`${focus?.type}-${focus?.id}`}
                  className="wire-head"
                  d={path.d}
                  initial={{pathLength: 0.1, pathOffset: focus?.type === 'project' ? 1 : -0.1}}
                  animate={{pathOffset: focus?.type === 'project' ? -0.1 : 1}}
                  transition={{duration: 0.7, ease: 'easeInOut'}}
                />
              )}
            </g>
          );
        })}
      </svg>

      <ul className="flex flex-col justify-between py-6">
        {patchProjects.map((id) => {
          const hot = projectHot(focus, id);
          return (
            <li key={id}>
              <a
                href={`#projet-${id}`}
                className="patch-row justify-start gap-3 pl-0 pr-3 font-medium"
                style={{height: '2.4rem'}}
                data-hot={hot}
                data-dim={Boolean(focus) && !hot}
                onMouseEnter={() => setHover({type: 'project', id})}
                onMouseLeave={leave}
                onFocus={() => setHover({type: 'project', id})}
                onBlur={leave}
              >
                <span
                  className="patch-port"
                  ref={(element) => {
                    projectPorts.current[id] = element;
                  }}
                />
                <span>{projectTitles[id]}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Petit écran : pastilles                                             */
/* ------------------------------------------------------------------ */

function SkillChips() {
  const [selected, setSelected] = useState<string | null>(null);
  const current = skills.find((skill) => skill.id === selected);

  return (
    <div className="flex flex-col gap-9">
      {grouped.map((group) => (
        <div key={group.domain} data-domain={group.domain}>
          <h3 className="mb-3.5 flex items-center gap-2.5 font-semibold">
            <span className="dot" />
            {domains[group.domain].label}
          </h3>
          <ul className="flex flex-wrap gap-2">
            {group.items.map((skill) => (
              <li key={skill.id}>
                <button
                  type="button"
                  className="skill-chip"
                  aria-pressed={selected === skill.id}
                  onClick={() => setSelected((value) => (value === skill.id ? null : skill.id))}
                >
                  {skill.label}
                </button>
              </li>
            ))}
          </ul>
          <AnimatePresence initial={false}>
            {current && current.domain === group.domain && (
              <motion.div
                key={current.id}
                initial={{height: 0, opacity: 0}}
                animate={{height: 'auto', opacity: 1}}
                exit={{height: 0, opacity: 0}}
                transition={{duration: 0.3, ease: [0.22, 1, 0.36, 1]}}
                style={{overflow: 'hidden'}}
                aria-live="polite"
              >
                <div className="mt-4 border-l-[1.5px] pl-4" style={{borderColor: 'var(--c)'}}>
                  <p className="meta">{current.label}, utilisé dans</p>
                  <ul className="mt-1.5 flex flex-col gap-1">
                    {current.projects.map((id) => (
                      <li key={id}>
                        <a href={`#projet-${id}`} className="link">
                          {projectTitles[id]}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

export function Skills() {
  const wide = useMediaQuery('(min-width: 64rem)');

  return (
    <Section
      id="competences"
      title="Compétences"
      intro={
        wide
          ? 'Chaque compétence est reliée aux projets où je l’ai utilisée. Survolez-en une pour suivre ses câbles, ou partez d’un projet.'
          : 'Chaque compétence est reliée aux projets où je l’ai utilisée. Touchez-en une pour les afficher.'
      }
    >
      {wide ? <PatchPanel /> : <SkillChips />}
    </Section>
  );
}
