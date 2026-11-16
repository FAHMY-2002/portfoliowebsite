// Title + description for every route. Used by the build-time prerender and on client navigation.
import { projects } from './projects.js';
import { site } from './site.js';

const base = {
  '/': {
    title: `${site.name} | ${site.role}`,
    description:
      'Portfolio of Mohamed Fahmy, a WordPress developer building custom themes, plugins and WooCommerce stores that are responsive, fast and easy to use.',
  },
  '/contact': {
    title: `Contact | ${site.name}`,
    description: 'Get in touch with Mohamed Fahmy, WordPress developer. Send a message, or reach out on LinkedIn or WhatsApp.',
  },
  '/thanks': {
    title: `Message sent | ${site.name}`,
    description: 'Your message was sent. Mohamed Fahmy will get back to you as soon as possible.',
    noindex: true,
  },
  '/404': {
    title: `Page not found | ${site.name}`,
    description: 'This page does not exist.',
    noindex: true,
  },
};

export function getSeo(pathname) {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  if (base[path]) return { path, ...base[path] };
  const match = path.match(/^\/work\/([^/]+)$/);
  const project = match && projects.find((p) => p.slug === match[1]);
  if (project) {
    return {
      path,
      title: `${project.name}: ${project.description} | ${site.name}`,
      description: `${project.name}, ${project.description.toLowerCase()}. Built by ${site.name} with ${project.stack.join(', ')}.`,
    };
  }
  return { path: '/404', ...base['/404'] };
}

// Every route that gets its own HTML file at build time.
export const prerenderRoutes = ['/', '/contact', '/thanks', ...projects.map((p) => `/work/${p.slug}`), '/404'];
