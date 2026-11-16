// Resolves optimized images in src/assets/images to their bundled URLs.
const files = import.meta.glob(['../assets/images/*.webp', '!../assets/images/*-px.webp'], {
  eager: true,
  query: '?url',
  import: 'default',
});
// The tiny pixelated placeholders are inlined as data URIs so they show instantly.
const pixels = import.meta.glob('../assets/images/*-px.webp', { eager: true, query: '?inline', import: 'default' });

const url = (name, width) => files[`../assets/images/${name}-${width}.webp`];
const pixel = (name) => pixels[`../assets/images/${name}-px.webp`];

export function projectImage(name) {
  return {
    src: url(name, 1600),
    srcSet: `${url(name, 800)} 800w, ${url(name, 1600)} 1600w`,
    small: url(name, 800),
    px: pixel(name),
  };
}

export const portrait = {
  src: url('portrait', 960),
  srcSet: `${url('portrait', 480)} 480w, ${url('portrait', 960)} 960w`,
  px: pixel('portrait'),
  width: 960,
  height: 1280,
};
