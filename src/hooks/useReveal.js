import { DUR, gsap, SplitText, useGSAP } from '../lib/gsap.js';
import { mq } from '../lib/tokens.js';
import { ariaMode } from './useIntro.js';

// Scroll reveals, declared in markup:
//   data-reveal="lines"   text rises line by line
//   data-reveal="fade"    fades up
//   data-reveal="rule"    a hairline draws from the left
//   data-reveal="image"   used by <Media>: cover wipes away, image settles
//   data-parallax         used by <Media>: image drifts inside its frame
// Only transform and opacity are animated.
export function useReveal(scope, dependencies = []) {
  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const mm = gsap.matchMedia();
      mm.add(mq.motion, () => {
        root.querySelectorAll('[data-reveal="lines"]').forEach((el) => {
          SplitText.create(el, {
            type: 'lines',
            mask: 'lines',
            linesClass: 'split-line',
            autoSplit: true,
            aria: ariaMode(el),
            onSplit: (self) =>
              gsap.from(self.lines, {
                yPercent: 110,
                duration: DUR.base,
                stagger: 0.08,
                scrollTrigger: { trigger: el, start: 'top 90%' },
              }),
          });
        });

        root.querySelectorAll('[data-reveal="fade"]').forEach((el) => {
          gsap.from(el, {
            autoAlpha: 0,
            y: 28,
            duration: DUR.base,
            delay: parseFloat(el.dataset.delay || '0'),
            scrollTrigger: { trigger: el, start: 'top 92%' },
          });
        });

        root.querySelectorAll('[data-reveal="rule"]').forEach((el) => {
          gsap.from(el, {
            scaleX: 0,
            transformOrigin: '0% 50%',
            duration: DUR.slow,
            scrollTrigger: { trigger: el, start: 'top 95%' },
          });
        });

        root.querySelectorAll('[data-reveal="image"]').forEach((el) => {
          const cover = el.querySelector('.media__cover');
          const inner = el.querySelector('.media__inner');
          gsap
            .timeline({ scrollTrigger: { trigger: el, start: 'top 88%' } })
            .fromTo(cover, { scaleY: 1 }, { scaleY: 0, transformOrigin: '50% 0%', duration: DUR.slow })
            .from(inner, { scale: 1.2, duration: DUR.slow }, 0);
        });

        root.querySelectorAll('[data-parallax]').forEach((el) => {
          gsap.fromTo(
            el,
            { yPercent: -4, scale: 1.1 },
            {
              yPercent: 4,
              scale: 1.1,
              ease: 'none',
              scrollTrigger: { trigger: el.closest('.media') || el, start: 'top bottom', end: 'bottom top', scrub: true },
            },
          );
        });
      });
    },
    { scope, dependencies, revertOnUpdate: true },
  );
}
