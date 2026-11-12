// Converts source screenshots/photos into responsive WebP files.
// Usage: put originals in ./images-src, map them below, then run `npm run images`.
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const SRC = path.resolve(process.argv[2] || 'images-src');
const OUT = path.resolve('src/assets/images');

// output name -> source file (inside images-src)
const MAP = {
  'al-mohandes': 'al-mohandes.png',
  megafresh: 'megafresh.png',
  'nova-pharmacy': 'Screenshot 2026-03-10 120132.png',
  wurx: 'Screenshot 2025-12-04 221629.png',
  realdealexperts: 'realdealpng.png',
  decoandesign: 'Screenshot 2026-03-10 124544.png',
  archilines: 'Archillins.png',
  'hm-gallery': 'Hm.png',
  portrait: 'WhatsApp Image 2025-12-03 at 23.45.12_e8619099.jpg',
};
const WIDTHS = { default: [800, 1600], portrait: [480, 960] };

await mkdir(OUT, { recursive: true });
const report = {};
for (const [name, file] of Object.entries(MAP)) {
  const input = path.join(SRC, file);
  const meta = await sharp(input).metadata();
  const widths = WIDTHS[name] || WIDTHS.default;
  report[name] = { ratio: +(meta.width / meta.height).toFixed(4), widths: [] };
  for (const w of widths) {
    const width = Math.min(w, meta.width);
    const info = await sharp(input)
      .resize({ width })
      .flatten({ background: '#ffffff' })
      .webp({ quality: 78, effort: 6 })
      .toFile(path.join(OUT, `${name}-${w}.webp`));
    report[name].widths.push({ w, width: info.width, height: info.height, kb: Math.round(info.size / 1024) });
  }
}
console.log(JSON.stringify(report, null, 1));
