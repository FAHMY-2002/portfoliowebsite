import { gsap, useGSAP } from '../lib/gsap.js';
import { mq } from '../lib/tokens.js';

// Images marked data-parallax (see <Media>) drift slightly inside their frame while scrolling.
export function useParallax(scope) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(mq.motion, () => {
        scope.current?.querySelectorAll('[data-parallax]').forEach((el) => {
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
    { scope },
  );
}
