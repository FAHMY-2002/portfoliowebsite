// Device capabilities, detected once on the client.
import { createStore, useStore } from './store.js';
import { mq } from './tokens.js';

// Server + first client render use these defaults so hydration matches.
export const env = createStore({
  detected: false,
  webgl: true,
  reduced: false,
  finePointer: false,
  tier: 'high', // 'high' | 'low' (mobile / low-power devices get the lighter 3D scene)
});

function hasWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGL2RenderingContext && canvas.getContext('webgl2')) || !!canvas.getContext('webgl');
  } catch {
    return false;
  }
}

export function detectEnv() {
  if (env.get().detected) return env.get();
  const reduced = window.matchMedia(mq.reduced).matches;
  const finePointer = window.matchMedia(mq.hover).matches;
  const cores = navigator.hardwareConcurrency || 4;
  const memory = navigator.deviceMemory || 8;
  const lowPower = !finePointer || cores <= 4 || memory <= 4 || window.innerWidth < 768;
  const webgl = hasWebGL();
  const root = document.documentElement;
  root.classList.toggle('no-webgl', !webgl);
  root.classList.toggle('is-fine', finePointer);
  env.set({ detected: true, webgl, reduced, finePointer, tier: lowPower ? 'low' : 'high' });
  return env.get();
}

export const useEnv = (selector) => useStore(env, selector);
