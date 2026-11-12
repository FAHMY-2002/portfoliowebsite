import { skills } from '../data/skills.js';

// Static drawing of the block, shown when WebGL is not available.
// Same idea as the 3D version: one slab per skill, drawn in isometric projection.
const COS = Math.cos(Math.PI / 6);
const SIN = Math.sin(Math.PI / 6);
const W = 150;
const D = 100;
const H = 9;
const GAP = 3;
const iso = (x, y, z) => [(x - z) * COS, (x + z) * SIN - y];
const points = (list) => list.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

export default function BlockFallback({ className = '' }) {
  const accent = skills.indexOf('WordPress');
  const count = skills.length;
  const slabs = skills.map((name, i) => {
    const level = count - 1 - i; // first skill on top
    const y0 = level * (H + GAP);
    const y1 = y0 + H;
    return {
      name,
      active: i === accent,
      top: points([iso(0, y1, 0), iso(W, y1, 0), iso(W, y1, D), iso(0, y1, D)]),
      left: points([iso(0, y1, D), iso(W, y1, D), iso(W, y0, D), iso(0, y0, D)]),
      right: points([iso(W, y1, 0), iso(W, y1, D), iso(W, y0, D), iso(W, y0, 0)]),
    };
  });
  const height = count * (H + GAP);
  return (
    <svg
      className={className}
      viewBox={`${-D * COS - 4} ${-height - 4} ${(W + D) * COS + 8} ${(W + D) * SIN + height + 8}`}
      aria-hidden="true"
      focusable="false"
    >
      {slabs
        .slice()
        .reverse()
        .map((s) => (
          <g key={s.name} stroke="var(--color-ink)" strokeWidth="1.2" strokeLinejoin="round">
            <polygon points={s.left} fill={s.active ? 'var(--color-accent)' : 'rgb(14 14 12 / 0.08)'} />
            <polygon points={s.right} fill={s.active ? 'var(--color-accent)' : 'rgb(14 14 12 / 0.2)'} />
            <polygon points={s.top} fill={s.active ? 'var(--color-accent)' : '#f6f4ef'} />
          </g>
        ))}
    </svg>
  );
}
