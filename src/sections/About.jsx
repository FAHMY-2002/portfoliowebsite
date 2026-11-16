import { copy } from '../data/copy.js';
import { portrait } from '../lib/images.js';
import Generate from '../components/Generate.jsx';
import Media from '../components/Media.jsx';
import SectionHead from '../components/SectionHead.jsx';
import './About.css';

export default function About() {
  const { about } = copy;
  return (
    <Generate as="section" index={2} name="about" id="about" className="about section">
      <div className="wrap">
        <SectionHead num="02" label={about.label} />
        <div className="about__grid grid">
          <h2 className="about__statement display" data-gen="heading">
            {about.statement}
          </h2>
          <div className="about__portrait">
            <Media
              image={portrait}
              alt={about.portraitAlt}
              ratio={3 / 4}
              sizes="(min-width: 768px) 25vw, 62vw"
              className="media--mono"
            />
          </div>
          <div className="about__body">
            {about.body.map((p) => (
              <p key={p} data-gen="text">
                {p}
              </p>
            ))}
          </div>
          <dl className="about__facts">
            {about.facts.map((f) => (
              <div key={f.label} className="about__fact" data-gen="component">
                <dt className="label label--muted">{f.label}</dt>
                <dd className="display">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Generate>
  );
}
