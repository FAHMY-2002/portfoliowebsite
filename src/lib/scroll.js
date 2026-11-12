// Lenis smooth scrolling, driven by GSAP's ticker so it stays in sync with ScrollTrigger.
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap.js';
import { scene } from '../three/sceneState.js';

let lenis = null;

export function startSmoothScroll() {
  if (lenis) return () => {};
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true });
  lenis.on('scroll', (e) => {
    ScrollTrigger.update();
    scene.velocity = e.velocity;
    scene.wake();
  });
  const raf = (time) => lenis?.raf(time * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);
  return () => {
    gsap.ticker.remove(raf);
    lenis?.destroy();
    lenis = null;
  };
}

export function scrollTo(target, { immediate = false } = {}) {
  if (lenis) {
    lenis.scrollTo(target, { immediate, force: true, duration: immediate ? 0 : 1.4 });
    return;
  }
  const el = typeof target === 'string' ? document.querySelector(target) : null;
  const top = el ? el.getBoundingClientRect().top + window.scrollY : typeof target === 'number' ? target : 0;
  window.scrollTo({ top, behavior: 'auto' });
}

export const lockScroll = (locked) => {
  if (lenis) locked ? lenis.stop() : lenis.start();
  document.documentElement.style.overflow = locked ? 'hidden' : '';
};
