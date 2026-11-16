// Shared, mutable state between the DOM (GSAP / ScrollTrigger) and the 3D scene.
// It has no three.js import on purpose: the main bundle can write to it before
// (or without) the lazy-loaded WebGL chunk ever arriving.
const wakeListeners = new Set();

export const scene = {
  mode: 'off', // 'home' | 'idle' | 'off' : set by each page
  // Scroll progress (0..1) of each transition, written by ScrollTrigger.
  t: { about: 0, stack: 0, work: 0, footer: 0 },
  active: -1, // highlighted slab (index into data/skills.js)
  build: 1, // 0 = wireframe only, 1 = solid; driven by the first section's generate timeline
  velocity: 0, // scroll velocity from Lenis
  pointer: { x: 0, y: 0, px: 0, py: 0 },
  preview: { visible: false, index: 0, sources: [], ratio: 2.1 },
  wake() {
    wakeListeners.forEach((fn) => fn());
  },
  onWake(fn) {
    wakeListeners.add(fn);
    return () => wakeListeners.delete(fn);
  },
  resetScroll() {
    scene.t.about = scene.t.stack = scene.t.work = scene.t.footer = 0;
    scene.active = -1;
    scene.preview.visible = false;
  },
};
