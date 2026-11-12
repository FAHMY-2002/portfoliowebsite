// Route table. Each page is its own lazy chunk (code-split per route).
import { lazy } from 'react';
import { matchPath } from 'react-router';

const loaders = {
  home: () => import('./pages/Home.jsx'),
  project: () => import('./pages/Project.jsx'),
  contact: () => import('./pages/Contact.jsx'),
  thanks: () => import('./pages/Thanks.jsx'),
  notFound: () => import('./pages/NotFound.jsx'),
};

export const routes = [
  { path: '/', name: 'home' },
  { path: '/work/:slug', name: 'project' },
  { path: '/contact', name: 'contact' },
  { path: '/thanks', name: 'thanks' },
  { path: '*', name: 'notFound' },
].map((route) => ({ ...route, load: loaders[route.name], Component: lazy(loaders[route.name]) }));

// Loads the chunk for a URL ahead of rendering (used before hydration).
export function preloadRoute(pathname) {
  const route = routes.find((r) => r.path !== '*' && matchPath(r.path, pathname)) || routes.at(-1);
  return route.load();
}
