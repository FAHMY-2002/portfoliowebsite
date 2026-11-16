// Bookkeeping for the page build: which sections exist, which are done, and which
// sections have already been built this session (those never replay).
import { createStore, useStore } from './store.js';

export const build = createStore({ total: 0, done: 0, current: 0, active: false });
export const useBuild = () => useStore(build);

const builtThisSession = new Set();
const sections = new Map(); // index -> { finish(), done }

export const sectionKey = (pathname, index) => `${pathname}#${index}`;
export const isBuilt = (key) => builtThisSession.has(key);
export let headerBuilt = false;

function sync() {
  const list = [...sections.values()];
  const done = list.filter((s) => s.done).length;
  const next = [...sections.entries()].sort((a, b) => a[0] - b[0]).find(([, s]) => !s.done);
  build.set({ total: list.length, done, current: next ? next[0] : list.length, active: list.length > 0 && done < list.length });
}

export function registerSection(index, entry) {
  sections.set(index, entry);
  sync();
  return () => {
    sections.delete(index);
    sync();
  };
}

export function markDone(index, key) {
  const s = sections.get(index);
  if (s) s.done = true;
  builtThisSession.add(key);
  if (index === 1) headerBuilt = true;
  sync();
}

// Sections build top to bottom: before one starts, every earlier one finishes instantly.
export function finishBefore(index) {
  [...sections.entries()].filter(([i, s]) => i < index && !s.done).forEach(([, s]) => s.finish());
}

export function resetBuild() {
  sections.clear();
  sync();
}
