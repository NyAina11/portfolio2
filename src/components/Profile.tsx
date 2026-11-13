import {profile} from '../content';
import {Marquee} from './Marquee';
import {ScrubText} from './ScrubText';
import {Section} from './Section';

export function Profile() {
  return (
    <Section id="profil" title="Profil" bleed={<Marquee />}>
      <ScrubText text={profile.lead} className="scrub max-w-[17em]" />

      <div className="mt-14 grid gap-x-16 gap-y-12 md:mt-20 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="grid content-start gap-x-12 gap-y-6 md:grid-cols-2">
          {profile.paragraphs.map((paragraph) => (
            <p key={paragraph} className="prose">
              {paragraph}
            </p>
          ))}
        </div>

        <dl className="self-start border-t border-line">
          {profile.facts.map((fact) => (
            <div key={fact.term} className="border-b border-line py-4">
              <dt className="meta">{fact.term}</dt>
              <dd className="mt-1 leading-snug">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="h-14 md:h-24" />
    </Section>
  );
}
