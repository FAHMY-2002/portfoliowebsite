// Verifies the production build loads nothing from other origins:
// no remote scripts, stylesheets, fonts, images or CSS imports.
// (Outbound <a href> links and the contact form's action are navigation, not page resources.)
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const dist = path.resolve('dist');
const files = (await readdir(dist, { recursive: true })).filter((f) => /\.(html|css|js)$/.test(f));
const problems = [];

for (const file of files) {
  const text = await readFile(path.join(dist, file), 'utf8');
  const checks = file.endsWith('.html')
    ? [
        /<(?:script|img|source|iframe|video|audio)\b[^>]*\ssrc=["'](?:https?:)?\/\/[^"']+/gi,
        /<link\b(?![^>]*rel=["'](?:canonical|alternate)["'])[^>]*\shref=["'](?:https?:)?\/\/[^"']+/gi,
        /srcset=["'][^"']*(?:https?:)?\/\/[^"']+/gi,
      ]
    : file.endsWith('.css')
      ? [/url\(\s*["']?(?:https?:)?\/\/[^)]+\)/gi, /@import\s+["'](?:https?:)?\/\/[^"']+/gi]
      : [/import\s*\(\s*["'](?:https?:)?\/\/[^"']+/gi, /\bfrom\s*["']https?:\/\/[^"']+/gi];
  for (const re of checks) for (const match of text.matchAll(re)) problems.push(`${file}: ${match[0].slice(0, 140)}`);
}

if (problems.length) {
  console.error(`Found ${problems.length} external resource reference(s):\n` + problems.join('\n'));
  process.exit(1);
}
console.log(`OK: ${files.length} built files checked, no external resources.`);
