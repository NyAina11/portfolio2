import {Fragment, useRef, type CSSProperties} from 'react';
import {motion, useInView, useReducedMotion, useScroll, useTransform, type MotionValue} from 'motion/react';
import {ArrowUpRight} from 'lucide-react';
import {featuredProjects, smallProjects, type FeaturedProject, type ProjectLink} from '../content';
import {useMediaQuery} from '../lib/hooks';
import {GitHubIcon} from './icons';
import {Section} from './Section';

const pad = (value: number) => String(value).padStart(2, '0');

function LinkIcon({kind}: {kind: ProjectLink['kind']}) {
  return kind === 'code' ? <GitHubIcon width={16} height={16} /> : <ArrowUpRight size={17} />;
}

/** Schéma en couches : comment le projet est construit, du haut vers le bas. */
function StackDiagram({project}: {project: FeaturedProject}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {once: true, amount: 0.3});
  const shown = inView || reduced;
  const description = `Architecture, de haut en bas : ${project.layers
    .map((layer) => `${layer.label} (${layer.tech})`)
    .join(', puis ')}.${project.wrap ? ` Le tout dans ${project.wrap}.` : ''}`;

  return (
    <div ref={ref} className="stack self-center" data-wrap={Boolean(project.wrap)} role="img" aria-label={description}>
      {project.wrap && <span className="stack-wrap">{project.wrap}</span>}
      {project.layers.map((layer, index) => (
        <Fragment key={layer.label}>
          <motion.div
            className="layer"
            data-domain={layer.domain}
            initial={reduced ? false : {opacity: 0, y: 12}}
            animate={shown ? {opacity: 1, y: 0} : undefined}
            transition={{duration: 0.55, delay: index * 0.14, ease: [0.22, 1, 0.36, 1]}}
          >
            <span className="dot" />
            <div>
              <div className="layer-label">{layer.label}</div>
              <div className="layer-tech">{layer.tech}</div>
            </div>
          </motion.div>
          {layer.link && (
            <div
              className="layer-link"
              data-domain={project.layers[index + 1]?.domain}
              style={{'--i': index, '--grow': shown ? 1 : 0} as CSSProperties}
            >
              <motion.span
                initial={reduced ? false : {opacity: 0}}
                animate={shown ? {opacity: 1} : undefined}
                transition={{duration: 0.4, delay: index * 0.14 + 0.3}}
              >
                {layer.link}
              </motion.span>
            </div>
          )}
        </Fragment>
      ))}
    </div>
  );
}

interface PanelProps {
  project: FeaturedProject;
  index: number;
  total: number;
  stacking: boolean;
  progress: MotionValue<number>;
}

/** Un projet, sur son aplat de couleur. En pile, il rétrécit quand le suivant le recouvre. */
function Panel({project, index, total, stacking, progress}: PanelProps) {
  const target = 1 - (total - 1 - index) * 0.035;
  const scale = useTransform(progress, [index / total, 1], [1, target]);

  return (
    <div className="panel-slot" style={{'--i': index} as CSSProperties}>
      <motion.article
        id={stacking ? undefined : `projet-${project.id}`}
        className="panel project"
        data-pop={project.pop}
        style={stacking ? {scale} : undefined}
      >
        <div className="panel-main">
          <p className="tag-mono flex flex-wrap gap-x-5 gap-y-1 text-ink-3">
            <span>
              {pad(index + 1)} / {pad(total)}
            </span>
            <span>{project.context}</span>
          </p>
          <h3 className="display panel-title">{project.title}</h3>
          <p className="panel-sum">{project.summary}</p>
          <ul className="bullets panel-points">
            {project.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <div className="mt-auto pt-6">
            <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
              {project.stack.map((tech) => (
                <li key={tech} className="chip">
                  {tech}
                </li>
              ))}
            </ul>
            {project.links.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2.5">
                {project.links.map((link) => (
                  <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="btn btn-quiet btn-sm">
                    <LinkIcon kind={link.kind} />
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
        <StackDiagram project={project} />
      </motion.article>
    </div>
  );
}

function PanelStack() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  // L'empilement a besoin d'un écran assez large et assez haut pour qu'un panneau tienne en entier.
  const roomy = useMediaQuery('(min-width: 80rem) and (min-height: 50rem)');
  const stacking = roomy && !reduced;
  const {scrollYProgress} = useScroll({target: ref, offset: ['start start', 'end end']});
  const total = featuredProjects.length;

  return (
    <div ref={ref} className="stack-area" data-stacking={stacking}>
      {stacking &&
        featuredProjects.map((project, index) => (
          <span
            key={project.id}
            id={`projet-${project.id}`}
            className="stack-anchor"
            style={{'--i': index} as CSSProperties}
          />
        ))}
      {featuredProjects.map((project, index) => (
        <Panel
          key={project.id}
          project={project}
          index={index}
          total={total}
          stacking={stacking}
          progress={scrollYProgress}
        />
      ))}
    </div>
  );
}

export function Projects() {
  const canHover = useMediaQuery('(hover: hover) and (pointer: fine)');

  return (
    <Section
      id="projets"
      title="Projets"
      intro={`Cinq projets détaillés, chacun avec son architecture.${
        canHover ? ' Survolez un panneau pour voir les données y circuler.' : ''
      }`}
    >
      <PanelStack />

      <div className="mt-24 md:mt-32">
        <h3 className="display h3">Et aussi</h3>
        <ul className="mt-8 border-b border-line">
          {smallProjects.map((project) => (
            <li key={project.id} id={`projet-${project.id}`} className="row">
              <p className="tag-mono pt-1.5 text-ink-3">{project.context}</p>
              <h4 className="row-title">{project.title}</h4>
              <div>
                <p className="max-w-[58ch] text-[0.98rem] leading-relaxed text-ink-2">{project.summary}</p>
                <p className="meta mt-2.5">{project.stack.join(', ')}</p>
              </div>
              <div className="flex flex-wrap gap-2 lg:justify-end">
                {project.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-quiet btn-sm"
                    aria-label={`${link.label} : ${project.title}`}
                  >
                    <LinkIcon kind={link.kind} />
                    {link.label}
                  </a>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
