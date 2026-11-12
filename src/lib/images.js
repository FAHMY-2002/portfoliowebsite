// Resolves optimized images in src/assets/images to their bundled URLs.
const files = import.meta.glob('../assets/images/*.webp', { eager: true, query: '?url', import: 'default' });

const url = (name, width) => files[`../assets/images/${name}-${width}.webp`];

export function projectImage(name) {
  return {
    src: url(name, 1600),
    srcSet: `${url(name, 800)} 800w, ${url(name, 1600)} 1600w`,
    small: url(name, 800),
  };
}

export const portrait = {
  src: url('portrait', 960),
  srcSet: `${url('portrait', 480)} 480w, ${url('portrait', 960)} 960w`,
  width: 960,
  height: 1280,
};
