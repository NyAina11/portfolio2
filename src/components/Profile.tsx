import {profile} from '../content';
import {Section} from './Section';

export function Profile() {
  return (
    <Section id="profil" title="Profil">
      <div className="grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div>
          <p className="lead max-w-[30ch] md:max-w-[34ch]">{profile.lead}</p>
          <div className="mt-10 grid gap-x-12 gap-y-6 md:grid-cols-2">
            {profile.paragraphs.map((paragraph) => (
              <p key={paragraph} className="prose">
                {paragraph}
              </p>
            ))}
          </div>
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
    </Section>
  );
}
