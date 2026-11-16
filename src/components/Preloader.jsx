import { useRef, useState } from 'react';
import { DUR, gsap, ScrollTrigger, useGSAP } from '../lib/gsap.js';
import { GENERATE } from '../lib/generate.config.js';
import { mq } from '../lib/tokens.js';
import { stage } from '../lib/stage.js';
import { site } from '../data/site.js';
import './Preloader.css';

// First-visit intro: a prompt is typed into an input bar, "sent", and the panel lifts
// so the header and the first section can generate. Part of the prerendered HTML,
// so it is the very first thing painted.
export default function Preloader() {
  const root = useRef(null);
  const typed = useRef(null);
  const status = useRef(null);
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      const finish = () => {
        stage.set({ shown: true, booted: true });
        setDone(true);
      };
      if (window.matchMedia(mq.reduced).matches) {
        finish();
        return;
      }
      window.scrollTo(0, 0);
      const { prompt, type, pause, enter, lift } = GENERATE.intro;
      const fonts = Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, 1800))]);
      const chars = { n: 0 };
      const tl = gsap.timeline();
      tl.fromTo('.preloader__bar', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: DUR.fast })
        .fromTo('.preloader__meta', { opacity: 0 }, { opacity: 1, duration: DUR.fast }, 0.1)
        .to(
          chars,
          {
            n: prompt.length,
            duration: type,
            ease: 'none',
            onUpdate: () => (typed.current.textContent = prompt.slice(0, Math.round(chars.n))),
          },
          0.3,
        )
        .addPause(`+=${pause}`, () => fonts.then(() => tl.resume()))
        .to('.preloader__key', { scale: 0.88, duration: enter / 2, ease: 'power2.in' })
        .to('.preloader__key', { scale: 1, duration: enter / 2 })
        .call(() => {
          status.current.textContent = 'generating…';
          ScrollTrigger.refresh();
          stage.set({ shown: true, booted: true });
        })
        .to('.preloader__inner', { opacity: 0, y: -16, duration: DUR.fast }, '+=0.1')
        .to(root.current, { yPercent: -100, duration: lift, onComplete: () => setDone(true) }, '<0.05');
    },
    { scope: root },
  );

  if (done) return null;

  return (
    <div className="preloader" ref={root} aria-hidden="true">
      <div className="preloader__inner">
        <div className="preloader__bar">
          <span className="preloader__sign">›</span>
          <span className="preloader__typed" ref={typed} />
          <span className="preloader__caret" />
          <span className="preloader__key">↵</span>
        </div>
        <div className="preloader__meta label">
          <span>{site.brand}</span>
          <span ref={status}>ready</span>
        </div>
      </div>
    </div>
  );
}
