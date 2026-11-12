import { useRef, useState } from 'react';
import { DUR, gsap, ScrollTrigger, useGSAP } from '../lib/gsap.js';
import { mq } from '../lib/tokens.js';
import { stage } from '../lib/stage.js';
import { site } from '../data/site.js';
import './Preloader.css';

// Short intro: a box draws itself while a counter runs to 100, then the panel lifts.
// It is part of the prerendered HTML, so it is the very first thing painted.
export default function Preloader() {
  const root = useRef(null);
  const count = useRef(null);
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
      const fonts = Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, 1800))]);
      const progress = { value: 0 };
      const tl = gsap.timeline();
      tl.to(progress, {
        value: 100,
        duration: DUR.base * 1.1,
        ease: 'power2.inOut',
        onUpdate: () => {
          count.current.textContent = String(Math.round(progress.value)).padStart(3, '0');
        },
      })
        .fromTo('.preloader__edge--x', { scaleX: 0 }, { scaleX: 1, duration: DUR.base, stagger: 0.12 }, 0)
        .fromTo('.preloader__edge--y', { scaleY: 0 }, { scaleY: 1, duration: DUR.base, stagger: 0.12 }, 0.1)
        .fromTo('.preloader__fill', { scale: 0 }, { scale: 1, duration: DUR.fast }, 0.7)
        .addPause('+=0', () => fonts.then(() => tl.resume()))
        .call(() => {
          ScrollTrigger.refresh();
          stage.set({ shown: true, booted: true });
        })
        .to('.preloader__inner', { autoAlpha: 0, y: -24, duration: DUR.fast })
        .to(root.current, { yPercent: -100, duration: DUR.base, onComplete: () => setDone(true) }, '<0.05');
    },
    { scope: root },
  );

  if (done) return null;

  return (
    <div className="preloader" ref={root} aria-hidden="true">
      <div className="preloader__inner">
        <div className="preloader__box">
          <span className="preloader__edge preloader__edge--x preloader__edge--t" />
          <span className="preloader__edge preloader__edge--x preloader__edge--b" />
          <span className="preloader__edge preloader__edge--y preloader__edge--l" />
          <span className="preloader__edge preloader__edge--y preloader__edge--r" />
          <span className="preloader__fill" />
        </div>
        <div className="preloader__meta label">
          <span>{site.brand}</span>
          <span className="num" ref={count}>
            000
          </span>
        </div>
      </div>
    </div>
  );
}
