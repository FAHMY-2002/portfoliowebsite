import { useEffect } from 'react';
import { DUR, EASE, gsap } from '../lib/gsap.js';
import { mq } from '../lib/tokens.js';

// Pulls an element toward the cursor while hovered. Desktop pointers only.
export function useMagnetic(ref, strength = 0.35) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia(mq.hover).matches || window.matchMedia(mq.reduced).matches) return;
    const xTo = gsap.quickTo(el, 'x', { duration: DUR.base, ease: EASE });
    const yTo = gsap.quickTo(el, 'y', { duration: DUR.base, ease: EASE });
    const move = (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => {
      xTo(0);
      yTo(0);
    };
    el.addEventListener('mousemove', move);
    el.addEventListener('mouseleave', leave);
    return () => {
      el.removeEventListener('mousemove', move);
      el.removeEventListener('mouseleave', leave);
      gsap.set(el, { clearProps: 'x,y' });
    };
  }, [ref, strength]);
}
