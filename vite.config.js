import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2022',
    manifest: true, // read by scripts/prerender.mjs to preload each route's JS + CSS
    assetsInlineLimit: 0,
  },
  ssr: {
    // These ship ESM without "type": "module", so they must be bundled for the prerender step.
    noExternal: ['gsap', '@gsap/react', 'lenis'],
  },
});
