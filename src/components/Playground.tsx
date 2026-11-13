import {demo} from '../content';
import {FlowCanvas} from './FlowCanvas';
import {Section} from './Section';

/** Les trois workflows de démonstration, dans leur cadre. */
export function Playground() {
  return (
    <Section id="demo" title={demo.title} intro={demo.intro}>
      <div className="stage">
        <FlowCanvas />
      </div>
    </Section>
  );
}
