// Reads design tokens from src/styles/tokens.css so JS never hard-codes them.
const cache = new Map();

export function token(name, fallback = '') {
  if (typeof window === 'undefined') return fallback;
  if (!cache.has(name)) {
    const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    cache.set(name, value || fallback);
  }
  return cache.get(name);
}

export const seconds = (name, fallback) => parseFloat(token(name, `${fallback}s`)) || fallback;

// "cubic-bezier(0.16, 1, 0.3, 1)" -> "0.16,1,0.3,1" (the format CustomEase expects)
export const bezier = (name, fallback) => {
  const match = token(name).match(/cubic-bezier\(([^)]+)\)/);
  return match ? match[1].replace(/\s+/g, '') : fallback;
};

export const mq = {
  md: () => `(min-width: ${token('--bp-md', '768px')})`,
  lg: () => `(min-width: ${token('--bp-lg', '1024px')})`,
  motion: '(prefers-reduced-motion: no-preference)',
  reduced: '(prefers-reduced-motion: reduce)',
  hover: '(hover: hover) and (pointer: fine)',
};
