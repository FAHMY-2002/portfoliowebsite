// Turns the client-rendered React app into static HTML: one file per route, each with
// its own <title>, description, canonical and Open Graph tags, so search engines and
// link previews get real content without running JavaScript.
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const dist = path.join(root, 'dist');
const { render, getSeo, prerenderRoutes, site } = await import(pathToFileURL(path.join(root, 'dist-server/entry-server.js')));

// Public URL of the site. Vercel provides it at build time; set SITE_URL to override
// (for example when you add a custom domain).
const siteUrl = (
  process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '')
).replace(/\/+$/, '');

const template = await readFile(path.join(dist, 'index.html'), 'utf8');
const manifest = JSON.parse(await readFile(path.join(dist, '.vite/manifest.json'), 'utf8'));
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

const pageEntry = (route) => {
  if (route === '/') return 'src/pages/Home.jsx';
  if (route.startsWith('/work/')) return 'src/pages/Project.jsx';
  if (route === '/contact') return 'src/pages/Contact.jsx';
  if (route === '/thanks') return 'src/pages/Thanks.jsx';
  return 'src/pages/NotFound.jsx';
};

// Preload the route's own JS chunk and link its CSS so the first paint is fully styled.
function routeAssets(route) {
  const seen = new Set();
  const css = new Set();
  const js = new Set();
  const walk = (key) => {
    if (seen.has(key) || !manifest[key]) return;
    seen.add(key);
    const chunk = manifest[key];
    if (!chunk.isEntry) js.add(chunk.file);
    (chunk.css || []).forEach((file) => css.add(file));
    (chunk.imports || []).forEach(walk);
  };
  walk(pageEntry(route));
  const entryCss = new Set(Object.values(manifest).filter((c) => c.isEntry).flatMap((c) => c.css || []));
  return [
    ...[...css].filter((f) => !entryCss.has(f)).map((f) => `<link rel="stylesheet" href="/${f}">`),
    ...[...js].map((f) => `<link rel="modulepreload" href="/${f}">`),
  ];
}

const displayFont = Object.values(manifest).find((c) => /bricolage.*\.woff2$/.test(c.file || ''))?.file;

function head(route) {
  const seo = getSeo(route);
  const url = siteUrl ? siteUrl + (seo.path === '/' ? '/' : seo.path) : '';
  const image = siteUrl ? `${siteUrl}/og.png` : '/og.png';
  return [
    `<title>${esc(seo.title)}</title>`,
    `<meta name="description" content="${esc(seo.description)}">`,
    seo.noindex ? '<meta name="robots" content="noindex">' : '',
    url && !seo.noindex ? `<link rel="canonical" href="${url}">` : '',
    '<meta property="og:type" content="website">',
    `<meta property="og:site_name" content="${esc(site.name)}">`,
    `<meta property="og:title" content="${esc(seo.title)}">`,
    `<meta property="og:description" content="${esc(seo.description)}">`,
    url ? `<meta property="og:url" content="${url}">` : '',
    `<meta property="og:image" content="${image}">`,
    '<meta property="og:image:width" content="1200">',
    '<meta property="og:image:height" content="630">',
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${esc(seo.title)}">`,
    `<meta name="twitter:description" content="${esc(seo.description)}">`,
    `<meta name="twitter:image" content="${image}">`,
    displayFont ? `<link rel="preload" href="/${displayFont}" as="font" type="font/woff2" crossorigin>` : '',
    ...routeAssets(route),
  ]
    .filter(Boolean)
    .join('\n    ');
}

for (const route of prerenderRoutes) {
  const html = template.replace('<!--app-head-->', head(route)).replace('<!--app-html-->', await render(route));
  // Flat files (contact.html, work/slug.html): Vercel's cleanUrls serves them at /contact, /work/slug.
  const file = route === '/' ? 'index.html' : `${route.slice(1)}.html`;
  await mkdir(path.dirname(path.join(dist, file)), { recursive: true });
  await writeFile(path.join(dist, file), html);
  console.log(`prerendered ${route.padEnd(28)} -> dist/${file}`);
}

// robots.txt + sitemap.xml (the sitemap needs absolute URLs, so it is only written when the URL is known).
const indexable = prerenderRoutes.filter((r) => !getSeo(r).noindex);
if (siteUrl) {
  const today = new Date().toISOString().slice(0, 10);
  const urls = indexable.map((r) => `  <url><loc>${siteUrl}${r === '/' ? '/' : r}</loc><lastmod>${today}</lastmod></url>`);
  await writeFile(
    path.join(dist, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`,
  );
}
await writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n${siteUrl ? `Sitemap: ${siteUrl}/sitemap.xml\n` : ''}`);
if (!siteUrl) console.warn('SITE_URL not set: canonical URLs and sitemap.xml were skipped (Vercel sets this automatically).');

await rm(path.join(root, 'dist-server'), { recursive: true, force: true });
await rm(path.join(dist, '.vite'), { recursive: true, force: true });
