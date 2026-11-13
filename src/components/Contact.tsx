import {useRef, useState} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {ArrowUp, Check, Copy} from 'lucide-react';
import {contact, identity, sections} from '../content';
import {AxisText} from './AxisText';
import {GitHubIcon, LinkedInIcon} from './icons';
import {LifeField} from './LifeField';
import {Magnetic} from './Magnetic';

const strip = (url: string) => url.replace(/^https?:\/\//, '');
const pad = (value: number) => String(value).padStart(2, '0');

/** Final de la page : un aplat orange où la vie reprend, et l'adresse en très grand. */
export function Contact() {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(identity.email);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2400);
    } catch {
      // Presse-papiers indisponible : on ouvre le client mail à la place.
      window.location.href = `mailto:${identity.email}`;
    }
  };

  return (
    <section id="contact" aria-labelledby="contact-title" className="finale">
      <LifeField className="hero-life" />

      <div className="shell finale-inner">
        <p className="sec-rule tag-mono" aria-hidden="true">
          <span>{pad(sections.length)}</span>
          <span>
            {pad(sections.length)} / {pad(sections.length)}
          </span>
        </p>

        <h2 id="contact-title" className="display finale-title">
          <AxisText text={contact.title} stagger={0.02} />
        </h2>
        <p className="prose mt-7 text-[1.15rem]">{contact.text}</p>

        <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-4 pt-14">
          <a href={`mailto:${identity.email}`} className="email link">
            {identity.email}
          </a>
          <Magnetic>
            <button type="button" className="btn btn-primary" onClick={copy}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={copied ? 'done' : 'idle'}
                  className="inline-flex items-center gap-2"
                  initial={{opacity: 0, y: 6}}
                  animate={{opacity: 1, y: 0}}
                  exit={{opacity: 0, y: -6}}
                  transition={{duration: 0.16}}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? 'Adresse copiée' : 'Copier l’adresse'}
                </motion.span>
              </AnimatePresence>
            </button>
          </Magnetic>
          <span className="sr-only" aria-live="polite">
            {copied ? 'Adresse e-mail copiée dans le presse-papiers' : ''}
          </span>
        </div>

        <dl className="mt-10 grid border-t border-line sm:grid-cols-3">
          <div className="border-b border-line py-4 sm:border-b-0 sm:pr-6">
            <dt className="meta">LinkedIn</dt>
            <dd className="mt-1">
              <a href={identity.linkedin} target="_blank" rel="noreferrer" className="link inline-flex items-center gap-2">
                <LinkedInIcon width={16} height={16} />
                {strip(identity.linkedin)}
              </a>
            </dd>
          </div>
          <div className="border-b border-line py-4 sm:border-b-0 sm:border-l sm:px-6">
            <dt className="meta">GitHub</dt>
            <dd className="mt-1">
              <a href={identity.github} target="_blank" rel="noreferrer" className="link inline-flex items-center gap-2">
                <GitHubIcon width={16} height={16} />
                {strip(identity.github)}
              </a>
            </dd>
          </div>
          <div className="py-4 sm:border-l sm:border-line sm:pl-6">
            <dt className="meta">Téléphone</dt>
            <dd className="mt-1">
              <a href={identity.phoneHref} className="link tabular-nums">
                {identity.phone}
              </a>
            </dd>
          </div>
        </dl>

        <footer className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5 text-[0.92rem] text-ink-3">
          <p>
            © {new Date().getFullYear()} {identity.firstName} {identity.lastName}
          </p>
          <a href="#top" className="link inline-flex items-center gap-1.5 text-ink-2">
            <ArrowUp size={15} />
            Retour en haut
          </a>
        </footer>
      </div>
    </section>
  );
}
