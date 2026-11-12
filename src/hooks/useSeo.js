import { useEffect } from 'react';
import { getSeo } from '../data/seo.js';

// Keeps <title>, description and Open Graph tags correct after client-side navigation.
// (The first load already has them: scripts/prerender.mjs writes them into each HTML file.)
export function useSeo(pathname) {
  useEffect(() => {
    const seo = getSeo(pathname);
    document.title = seo.title;
    const set = (selector, attr, value) => document.head.querySelector(selector)?.setAttribute(attr, value);
    set('meta[name="description"]', 'content', seo.description);
    set('meta[property="og:title"]', 'content', seo.title);
    set('meta[property="og:description"]', 'content', seo.description);
    set('meta[name="twitter:title"]', 'content', seo.title);
    set('meta[name="twitter:description"]', 'content', seo.description);
    const canonical = document.head.querySelector('link[rel="canonical"]');
    if (canonical) {
      const url = new URL(canonical.href).origin + (seo.path === '/' ? '/' : seo.path);
      canonical.setAttribute('href', url);
      set('meta[property="og:url"]', 'content', url);
    }
  }, [pathname]);
}
