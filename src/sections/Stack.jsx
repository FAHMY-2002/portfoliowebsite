import { useRef } from 'react';
import { copy } from '../data/copy.js';
import { skills } from '../data/skills.js';
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap.js';
import { mq } from '../lib/tokens.js';
import { scene } from '../three/sceneState.js';
import SectionHead from '../components/SectionHead.jsx';
import './Stack.css';

// The skills list. On desktop the section pins while the 3D block (one slab per
// skill) is pulled apart; the slab that matches the highlighted row turns accent.
export default function Stack() {
  const root = useRef(null);
  const items = useRef([]);

  useGSAP(
    () => {
      const setActive = (index) => {
        if (scene.active === index) return;
        scene.active = index;
        items.current.forEach((el, i) => el?.classList.toggle('is-active', i === index));
        scene.wake();
      };
      const mm = gsap.matchMedia();

      // Desktop: pin and step through the list with scroll.
      mm.add(`${mq.lg()} and ${mq.motion}`, () => {
        root.current.classList.add('stack--stepped');
        ScrollTrigger.create({
          trigger: root.current,
          start: 'top top',
          end: () => `+=${window.innerHeight * 1.8}`,
          pin: true,
          onUpdate: (self) => setActive(Math.min(skills.length - 1, Math.floor(self.progress * skills.length))),
          onLeave: () => setActive(-1),
          onLeaveBack: () => setActive(-1),
        });
        return () => root.current?.classList.remove('stack--stepped');
      });

      // Smaller screens: no pin, each row lights up as it crosses the middle of the screen.
      mm.add(`(max-width: ${parseFloat(mq.lg().match(/[\d.]+/)[0]) - 0.02}px) and ${mq.motion}`, () => {
        root.current.classList.add('stack--stepped');
        items.current.forEach((el, i) => {
          ScrollTrigger.create({
            trigger: el,
            start: 'top 58%',
            end: 'bottom 58%',
            onToggle: (self) => self.isActive && setActive(i),
          });
        });
        return () => root.current?.classList.remove('stack--stepped');
      });
    },
    { scope: root },
  );

  return (
    <section id="stack" className="stack section" ref={root}>
      <div className="stack__inner wrap">
        <SectionHead num="03" label={copy.stack.label}>
          <p className="label label--muted">{copy.stack.title}</p>
        </SectionHead>
        <ol className="stack__list">
          {skills.map((name, i) => (
            <li key={name} className="stack__item" ref={(el) => (items.current[i] = el)}>
              <span className="stack__num num label">{String(i + 1).padStart(2, '0')}</span>
              <span className="stack__name display">{name}</span>
              <span className="stack__mark" aria-hidden="true" />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
