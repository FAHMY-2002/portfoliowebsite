import { copy } from '../data/copy.js';
import { site } from '../data/site.js';
import { useEnv } from '../lib/env.js';
import BlockFallback from '../components/BlockFallback.jsx';
import Generate from '../components/Generate.jsx';
import { TLink } from '../components/Transition.jsx';
import './Hero.css';

export default function Hero() {
  const webgl = useEnv((e) => e.webgl);
  const [first, second] = copy.hero.nameLines;

  return (
    <Generate as="section" index={1} name="hero" className="hero section">
      <div className="hero__top wrap">
        <p className="label" data-gen="component">
          <span className="section-head__num num">(01)</span>
          {copy.hero.label}
        </p>
        <p className="label status" data-gen="component">
          <span className="dot" aria-hidden="true" />
          {site.availability}
        </p>
      </div>

      {!webgl && (
        <div className="hero__fallback" data-gen="component">
          <BlockFallback />
        </div>
      )}

      <div className="hero__bottom wrap">
        <div className="hero__aside">
          <p className="hero__intro lead" data-gen="text">
            {copy.hero.intro}
          </p>
          <p data-gen="component">
            <TLink to="/#work" className="label link">
              {copy.hero.cta}{' '}
              <span className="arrow" aria-hidden="true">
                ↓
              </span>
            </TLink>
          </p>
        </div>
        <h1 className="hero__name display" aria-label={copy.hero.nameLines.join(' ')}>
          <span className="hero__line" data-gen="heading" aria-hidden="true">
            {first}
          </span>{' '}
          <span className="hero__line hero__line--end" data-gen="heading" aria-hidden="true">
            {second}
          </span>
        </h1>
      </div>
    </Generate>
  );
}
