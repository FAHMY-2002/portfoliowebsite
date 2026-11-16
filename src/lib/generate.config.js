// Every timing, easing and size used by the "AI builds the page" animation.
// Durations are in seconds. Each section's options (see <Generate>) can scale
// them with `speed` and reorder the content phases with `order`.
export const GENERATE = {
  // Where a section starts generating: its top reaches this point of the viewport.
  start: 'top 78%',
  // Ease for everything that moves; text streaming is always linear.
  ease: 'site',

  // 1. Wireframe outlines draw over every block of the section.
  wireframe: { duration: 0.32, stagger: 0.03, maxBoxes: 28 },
  // 2. Status label, typed in the section's corner.
  status: { at: 0.05, typeDuration: 0.25, doneText: 'done ✓' },

  // 3–5. Content phases. They run in `order`; each one starts when the previous
  // one is `lead` of the way through, so phases overlap instead of queueing.
  contentStart: 0.3,
  lead: 0.5,
  order: ['heading', 'text', 'image', 'components'],
  heading: {
    duration: 0.5, // window shared by all headings of the section
    perItem: 0.6, // each heading streams over this share of the window
    charsUpToWords: 3, // headings with this many words or fewer stream by character
  },
  text: {
    duration: 0.55,
    perItem: 0.65,
    maxSteps: 12, // a paragraph never takes more than this many steps: long ones stream in bigger chunks
    minChunk: 3, // words per step, at least
  },
  image: { duration: 0.55, pixelIn: 0.18, resolve: 0.42, stagger: 0.06 },
  components: { duration: 0.32, stagger: 0.05, fromScale: 0.94, fromY: 10 },

  // 6. Outlines fade, the label switches to "done ✓" and fades.
  complete: { fade: 0.28, hold: 0.25 },

  // The 3D block solidifies during these phases of the first section.
  scene: { from: 'image', to: 'components' },

  // Phones and tablets: wireframe + fades, no per-word streaming, no caret.
  light: {
    text: { duration: 0.4, stagger: 0.05 },
    image: { duration: 0.4 },
  },

  // prefers-reduced-motion: no generation, sections fade in.
  reduced: { fade: 0.4 },

  // Fixed progress indicator.
  progress: { hideAfter: 1.4 },

  // Opening prompt typed on the first visit.
  intro: { prompt: 'build my portfolio', type: 0.55, pause: 0.15, enter: 0.2, lift: 0.75 },
};
