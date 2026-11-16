import { useRef } from 'react';
import { copy } from '../data/copy.js';
import { site } from '../data/site.js';
import { ScrollTrigger, useGSAP } from '../lib/gsap.js';
import { scrollTo } from '../lib/scroll.js';
import { scene } from '../three/sceneState.js';
import Generate from './Generate.jsx';
import RoundButton from './RoundButton.jsx';
import SectionHead from './SectionHead.jsx';
import './Footer.css';

function FooterBottom() {
  return (
    <div className="footer__bottom">
      <ul className="footer__social">
        {site.social.map((s) => (
          <li key={s.label} data-gen="component">
            <a className="label link" href={s.href} target="_blank" rel="noopener noreferrer">
              {s.label}{' '}
              <span className="arrow" aria-hidden="true">
                ↗
              </span>
            </a>
          </li>
        ))}
      </ul>
      <button type="button" className="label link" onClick={() => scrollTo(0)} data-gen="component">
        {copy.footer.top}{' '}
        <span className="arrow" aria-hidden="true">
          ↑
        </span>
      </button>
      <p className="label footer__rights" data-gen="text">
        © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {site.name}. {copy.footer.rights}
      </p>
    </div>
  );
}

// variant="full": dark closing section with the big call to action (and the 3D block).
// variant="compact": just the links row, used on pages that already are the call to action.
export default function Footer({ variant = 'full', num, index = 99 }) {
  const root = useRef(null);

  useGSAP(
    () => {
      if (variant !== 'full') return;
      const set = (self) => {
        scene.t.footer = self.progress;
        scene.wake();
      };
      ScrollTrigger.create({ trigger: root.current, start: 'top 55%', end: 'bottom bottom', onUpdate: set, onRefresh: set });
      return () => {
        scene.t.footer = 0;
      };
    },
    { scope: root },
  );

  if (variant === 'compact') {
    return (
      <Generate as="footer" index={index} name="footer" className="footer footer--compact section wrap">
        <FooterBottom />
      </Generate>
    );
  }

  return (
    <footer className="footer" ref={root}>
      <span className="footer__bg" aria-hidden="true" />
      <Generate as="div" index={index} name="contact" className="footer__content wrap">
        <SectionHead num={num} label={copy.footer.label} inverse>
          <p className="label status">
            <span className="dot" aria-hidden="true" />
            {site.availability}
          </p>
        </SectionHead>
        <h2 className="footer__title display">
          {copy.footer.titleLines.map((line) => (
            <span key={line} className="footer__line" data-gen="heading">
              {line}
            </span>
          ))}
        </h2>
        <div className="footer__cta" data-gen="component">
          <RoundButton to="/contact" label={copy.contact.label} data-cursor="">
            {copy.footer.cta}
          </RoundButton>
        </div>
        <FooterBottom />
      </Generate>
    </footer>
  );
}
