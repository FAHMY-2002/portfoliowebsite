import { DUR, gsap, SplitText, useGSAP } from '../lib/gsap.js';
import { mq } from '../lib/tokens.js';
import { useShown } from '../lib/stage.js';

// SplitText labels the element for screen readers. aria-label is only valid on headings
// here, so plain <p>/<span> elements keep their text readable as it is instead.
export const ariaMode = (el) => (/^H[1-6]$/.test(el.tagName) ? 'auto' : 'none');

// Above-the-fold entrance. Elements opt in with data-intro="chars | lines | fade | rule"
// and an optional data-at="0.4" (seconds into the sequence). The sequence waits until
// the preloader or route transition has uncovered the page.
export function useIntro(scope) {
  const shown = useShown();

  useGSAP(
    () => {
      if (!shown || !scope.current) return;
      const mm = gsap.matchMedia();
      mm.add(mq.motion, () => {
        const tl = gsap.timeline({ delay: 0.1 });
        const lineSplits = [];
        scope.current.querySelectorAll('[data-intro]').forEach((el) => {
          const at = parseFloat(el.dataset.at || '0');
          switch (el.dataset.intro) {
            case 'chars': {
              const split = SplitText.create(el, { type: 'chars', mask: 'chars', aria: ariaMode(el) });
              tl.from(split.chars, { yPercent: 105, duration: DUR.slow, stagger: 0.035 }, at);
              break;
            }
            case 'lines': {
              const split = SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'split-line', aria: ariaMode(el) });
              lineSplits.push(split);
              tl.from(split.lines, { yPercent: 110, duration: DUR.base, stagger: 0.08 }, at);
              break;
            }
            case 'rule':
              tl.from(el, { scaleX: 0, transformOrigin: '0% 50%', duration: DUR.slow }, at);
              break;
            default:
              tl.from(el, { autoAlpha: 0, y: 20, duration: DUR.base }, at);
          }
        });
        // Give line-split text its natural wrapping back once it has animated in.
        tl.call(() => lineSplits.forEach((s) => s.revert()));
      });
    },
    { scope, dependencies: [shown], revertOnUpdate: true },
  );
}
