// "Is the page currently uncovered?" False while the preloader or a route transition
// covers the screen. Page intro animations wait for it.
import { createStore, useStore } from './store.js';

export const stage = createStore({ shown: false, booted: false });
export const useShown = () => useStore(stage, (s) => s.shown);
