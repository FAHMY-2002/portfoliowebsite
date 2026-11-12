import { copy } from '../data/copy.js';
import { site } from '../data/site.js';
import { useEnv } from '../lib/env.js';
import BlockFallback from '../components/BlockFallback.jsx';
import { TLink } from '../components/Transition.jsx';
import './Hero.css';

export default function Hero() {
  const webgl = useEnv((e) => e.webgl);
  const [first, second] = copy.hero.nameLines;

  return (
    <section className="hero section">
      <div className="hero__top wrap">
        <p className="label" data-intro="fade" data-at="0.7">
          <span className="section-head__num num">(01)</span>
          {copy.hero.label}
        </p>
        <p className="label status" data-intro="fade" data-at="0.8">
          <span className="dot" aria-hidden="true" />
          {site.availability}
        </p>
      </div>

      {!webgl && <BlockFallback className="hero__fallback" />}

      <div className="hero__bottom wrap">
        <div className="hero__aside">
          <p className="hero__intro lead" data-intro="lines" data-at="0.75">
            {copy.hero.intro}
          </p>
          <p data-intro="fade" data-at="1">
            <TLink to="/#work" className="label link">
              {copy.hero.cta} <span className="arrow" aria-hidden="true">↓</span>
            </TLink>
          </p>
        </div>
        <h1 className="hero__name display" aria-label={copy.hero.nameLines.join(' ')}>
          <span className="hero__line" data-intro="chars" data-at="0" aria-hidden="true">
            {first}
          </span>{' '}
          <span className="hero__line hero__line--end" data-intro="chars" data-at="0.18" aria-hidden="true">
            {second}
          </span>
        </h1>
      </div>
    </section>
  );
}
