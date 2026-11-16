import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import './styles/tokens.css';
import './styles/fonts.css';
import './styles/global.css';
import './styles/generate.css';
import App from './App.jsx';
import { preloadRoute } from './routes.js';

const container = document.getElementById('root');
const app = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// Production pages are prerendered, so React hydrates the existing HTML.
// In `npm run dev` the root is empty and React renders from scratch.
if (container.firstElementChild) {
  await preloadRoute(window.location.pathname);
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
