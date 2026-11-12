// Where the block sits for each section. x / y are fractions of the viewport
// (0 = center, 0.5 = right / top edge). Tweak these to re-stage the 3D.
export const POSES = {
  desktop: {
    hero: { x: 0.2, y: 0.16, scale: 1, rotX: 0.5, rotY: -0.62, explode: 0, sway: 1 },
    about: { x: 0.43, y: -0.2, scale: 0.6, rotX: 0.62, rotY: -0.3, explode: 0, sway: 0.6 },
    stack: { x: 0.2, y: -0.02, scale: 0.86, rotX: 0.42, rotY: -0.7, explode: 1, sway: 0.3 },
    hidden: { x: 0.36, y: 0.5, scale: 0, rotX: 0.3, rotY: -1.4, explode: 1.5, sway: 0 },
    footer: { x: 0.27, y: -0.1, scale: 1.15, rotX: 0.5, rotY: -0.62, explode: 0, sway: 1 },
    idle: { x: 0.33, y: -0.06, scale: 0.74, rotX: 0.5, rotY: -0.62, explode: 0.12, sway: 1 },
  },
  mobile: {
    hero: { x: 0.14, y: 0.14, scale: 1, rotX: 0.5, rotY: -0.62, explode: 0, sway: 1 },
    about: { x: 0.44, y: 0.3, scale: 0.6, rotX: 0.62, rotY: -0.3, explode: 0, sway: 0.6 },
    stack: { x: 0.34, y: 0, scale: 0.8, rotX: 0.42, rotY: -0.7, explode: 1, sway: 0.3 },
    hidden: { x: 0.5, y: 0.5, scale: 0, rotX: 0.3, rotY: -1.4, explode: 1.5, sway: 0 },
    footer: { x: 0.3, y: -0.14, scale: 0.8, rotX: 0.5, rotY: -0.62, explode: 0, sway: 1 },
    idle: { x: 0.5, y: 0.5, scale: 0, rotX: 0.5, rotY: -0.62, explode: 0, sway: 0 },
  },
};

const KEYS = ['x', 'y', 'scale', 'rotX', 'rotY', 'explode', 'sway'];
const smooth = (t) => t * t * (3 - 2 * t);

function mix(out, to, t) {
  if (t <= 0) return;
  const k = smooth(Math.min(1, t));
  for (const key of KEYS) out[key] += (to[key] - out[key]) * k;
}

// Blends the poses in page order, so the result only depends on scroll position.
export function resolvePose(state, mobile, out) {
  const P = mobile ? POSES.mobile : POSES.desktop;
  const start = state.mode === 'home' ? P.hero : state.mode === 'idle' ? P.idle : P.hidden;
  for (const key of KEYS) out[key] = start[key];
  if (state.mode === 'home') {
    mix(out, P.about, state.t.about);
    mix(out, P.stack, state.t.stack);
    mix(out, P.hidden, state.t.work);
  }
  mix(out, P.footer, state.t.footer);
  return out;
}
