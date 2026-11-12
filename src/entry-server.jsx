// Build-time only. scripts/prerender.mjs calls render() once per route to produce static HTML.
import { prerenderToNodeStream } from 'react-dom/static';
import { StaticRouter } from 'react-router';
import App from './App.jsx';

export { getSeo, prerenderRoutes } from './data/seo.js';
export { site } from './data/site.js';

export async function render(url) {
  const { prelude } = await prerenderToNodeStream(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>,
  );
  let html = '';
  for await (const chunk of prelude) html += chunk;
  return html;
}
