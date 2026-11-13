import {Fragment, useRef, type CSSProperties} from 'react';
import {motion, useInView, useReducedMotion} from 'motion/react';
import {ArrowUpRight} from 'lucide-react';
import {featuredProjects, smallProjects, type FeaturedProject, type ProjectLink} from '../content';
import {useMediaQuery} from '../lib/hooks';
import {GitHubIcon} from './icons';
import {Section} from './Section';

function LinkIcon({kind}: {kind: ProjectLink['kind']}) {
  return kind === 'code' ? <GitHubIcon width={16} height={16} /> : <ArrowUpRight size={17} />;
}

/** Schéma en couches : comment le projet est construit, du haut vers le bas. */
function StackDiagram({project}: {project: FeaturedProject}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {once: true, amount: 0.35});
  const shown = inView || reduced;
  const description = `Architecture, de haut en bas : ${project.layers
    .map((layer) => `${layer.label} (${layer.tech})`)
    .join(', puis ')}.${project.wrap ? ` Le tout dans ${project.wrap}.` : ''}`;

  return (
    <div
      ref={ref}
      className="stack self-start lg:mt-12"
      data-wrap={Boolean(project.wrap)}
      role="img"
      aria-label={description}
    >
      {project.wrap && <span className="stack-wrap">{project.wrap}</span>}
      {project.layers.map((layer, index) => (
        <Fragment key={layer.label}>
          <motion.div
            className="layer"
            data-domain={layer.domain}
            initial={reduced ? false : {opacity: 0, y: 12}}
            animate={shown ? {opacity: 1, y: 0} : undefined}
            transition={{duration: 0.55, delay: index * 0.16, ease: [0.22, 1, 0.36, 1]}}
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
                transition={{duration: 0.4, delay: index * 0.16 + 0.3}}
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

function Featured({project}: {project: FeaturedProject}) {
  return (
    <article
      id={`projet-${project.id}`}
      className="project grid gap-x-16 gap-y-10 border-t border-line py-14 md:py-20 lg:grid-cols-[minmax(0,1fr)_23rem]"
    >
      <div>
        <p className="meta">{project.context}</p>
        <h3 className="display h3 mt-3 max-w-[20ch]">{project.title}</h3>
        <p className="prose mt-5 text-[1.1rem]">{project.summary}</p>
        <ul className="bullets prose mt-6">
          {project.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
        <ul className="mt-7 flex flex-wrap gap-2" aria-label="Technologies">
          {project.stack.map((tech) => (
            <li key={tech} className="chip">
              {tech}
            </li>
          ))}
        </ul>
        {project.links.length > 0 && (
          <div className="mt-7 flex flex-wrap gap-3">
            {project.links.map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="btn btn-quiet btn-sm">
                <LinkIcon kind={link.kind} />
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
      <StackDiagram project={project} />
    </article>
  );
}

export function Projects() {
  const canHover = useMediaQuery('(hover: hover) and (pointer: fine)');

  return (
    <Section
      id="projets"
      title="Projets"
      intro={`Cinq projets détaillés, chacun avec son architecture.${
        canHover ? ' Survolez un projet pour voir les données y circuler.' : ''
      }`}
    >
      <div>
        {featuredProjects.map((project) => (
          <Featured key={project.id} project={project} />
        ))}
      </div>

      <div className="border-t border-line pt-14 md:pt-20">
        <h3 className="display h3">Et aussi</h3>
        <ul className="mt-8 grid gap-x-12 md:grid-cols-2 lg:grid-cols-3">
          {smallProjects.map((project) => (
            <li key={project.id} id={`projet-${project.id}`} className="project-small border-t border-line py-7">
              <p className="meta">{project.context}</p>
              <h4 className="mt-2 text-[1.45rem] leading-tight font-bold tracking-tight">{project.title}</h4>
              <p className="mt-3 text-[0.98rem] leading-relaxed text-ink-2">{project.summary}</p>
              <p className="meta mt-4">{project.stack.join(', ')}</p>
              {project.links.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                  {project.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="link inline-flex items-center gap-1.5 text-[0.95rem] font-medium"
                    >
                      <LinkIcon kind={link.kind} />
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
