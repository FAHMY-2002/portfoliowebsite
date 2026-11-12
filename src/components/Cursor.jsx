import { useEffect, useRef } from 'react';
import { DUR, EASE, gsap } from '../lib/gsap.js';
import { useEnv } from '../lib/env.js';
import './Cursor.css';

// Custom cursor: a small square (a "div") that follows the pointer, opens up over
// links and shows a label over elements with data-cursor="View".
// Rendered only for mouse users; touch devices never get it.
export default function Cursor() {
  const { detected, finePointer, reduced } = useEnv();
  const root = useRef(null);
  const label = useRef(null);
  const enabled = detected && finePointer && !reduced;

  useEffect(() => {
    if (!enabled) return;
    const el = root.current;
    const xTo = gsap.quickTo(el, 'x', { duration: DUR.fast, ease: EASE });
    const yTo = gsap.quickTo(el, 'y', { duration: DUR.fast, ease: EASE });
    let seen = false;

    const move = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
      if (!seen) {
        seen = true;
        gsap.set(el, { x: e.clientX, y: e.clientY });
        el.classList.add('is-visible');
      }
    };
    const over = (e) => {
      const labelled = e.target.closest?.('[data-cursor]');
      const link = e.target.closest?.('a, button, input, textarea');
      const text = labelled?.dataset.cursor || '';
      label.current.textContent = text;
      el.classList.toggle('has-label', !!text);
      el.classList.toggle('is-link', !!link && !text);
    };
    const leave = () => el.classList.remove('is-visible');
    const enter = () => seen && el.classList.add('is-visible');

    window.addEventListener('mousemove', move, { passive: true });
    document.addEventListener('mouseover', over, { passive: true });
    document.documentElement.addEventListener('mouseleave', leave);
    document.documentElement.addEventListener('mouseenter', enter);
    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseover', over);
      document.documentElement.removeEventListener('mouseleave', leave);
      document.documentElement.removeEventListener('mouseenter', enter);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="cursor" ref={root} aria-hidden="true">
      <span className="cursor__box" />
      <span className="cursor__label label" ref={label} />
    </div>
  );
}
