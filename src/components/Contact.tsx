import {useRef, useState} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {ArrowUp, Check, Copy} from 'lucide-react';
import {contact, identity} from '../content';
import {AxisText} from './AxisText';
import {GitHubIcon, LinkedInIcon} from './icons';

const strip = (url: string) => url.replace(/^https?:\/\//, '');

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
    <section id="contact" aria-labelledby="contact-title" className="shell pt-20 pb-10 md:pt-28">
      <div className="border-t border-line pt-14 md:pt-20">
        <h2 id="contact-title" className="display h2 max-w-[19ch]">
          <AxisText text={contact.title} stagger={0.012} />
        </h2>
        <p className="prose mt-6 text-[1.15rem]">{contact.text}</p>

        <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-4">
          <a href={`mailto:${identity.email}`} className="email link">
            {identity.email}
          </a>
          <button type="button" className="btn btn-quiet btn-sm" onClick={copy}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={copied ? 'done' : 'idle'}
                className="inline-flex items-center gap-2"
                initial={{opacity: 0, y: 6}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: -6}}
                transition={{duration: 0.16}}
              >
                {copied ? <Check size={15} /> : <Copy size={15} />}
                {copied ? 'Adresse copiée' : 'Copier l’adresse'}
              </motion.span>
            </AnimatePresence>
          </button>
          <span className="sr-only" aria-live="polite">
            {copied ? 'Adresse e-mail copiée dans le presse-papiers' : ''}
          </span>
        </div>

        <dl className="mt-14 grid border-t border-line sm:grid-cols-3">
          <div className="border-b border-line py-5 sm:border-b-0 sm:pr-6">
            <dt className="meta">LinkedIn</dt>
            <dd className="mt-1.5">
              <a href={identity.linkedin} target="_blank" rel="noreferrer" className="link inline-flex items-center gap-2">
                <LinkedInIcon width={16} height={16} />
                {strip(identity.linkedin)}
              </a>
            </dd>
          </div>
          <div className="border-b border-line py-5 sm:border-b-0 sm:border-l sm:px-6">
            <dt className="meta">GitHub</dt>
            <dd className="mt-1.5">
              <a href={identity.github} target="_blank" rel="noreferrer" className="link inline-flex items-center gap-2">
                <GitHubIcon width={16} height={16} />
                {strip(identity.github)}
              </a>
            </dd>
          </div>
          <div className="py-5 sm:border-l sm:border-line sm:pl-6">
            <dt className="meta">Téléphone</dt>
            <dd className="mt-1.5">
              <a href={identity.phoneHref} className="link tabular-nums">
                {identity.phone}
              </a>
            </dd>
          </div>
        </dl>
      </div>

      <footer className="mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6 text-[0.92rem] text-ink-3">
        <p>
          © {new Date().getFullYear()} {identity.firstName} {identity.lastName}
        </p>
        <a href="#top" className="link inline-flex items-center gap-1.5 text-ink-2">
          <ArrowUp size={15} />
          Retour en haut
        </a>
      </footer>
    </section>
  );
}
