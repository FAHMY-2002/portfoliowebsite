import { Suspense, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router';
import Cursor from './components/Cursor.jsx';
import Header from './components/Header.jsx';
import Preloader from './components/Preloader.jsx';
import { TransitionProvider } from './components/Transition.jsx';
import { detectEnv } from './lib/env.js';
import { startSmoothScroll } from './lib/scroll.js';
import { routes } from './routes.js';
import SceneLoader from './three/SceneLoader.jsx';

export default function App() {
  const location = useLocation();

  useEffect(() => {
    const { reduced } = detectEnv();
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    // Smooth scrolling is skipped entirely for visitors who prefer reduced motion.
    if (!reduced) return startSmoothScroll();
  }, []);

  return (
    <div className="app">
      <a className="skip-link label" href="#main">
        Skip to content
      </a>
      <TransitionProvider>
        <Preloader />
        <Header />
        <SceneLoader />
        <Suspense fallback={null}>
          {/* Keyed by pathname so every route change mounts a fresh page. */}
          <Routes location={location} key={location.pathname}>
            {routes.map(({ path, Component }) => (
              <Route key={path} path={path} element={<Component />} />
            ))}
          </Routes>
        </Suspense>
        <Cursor />
      </TransitionProvider>
    </div>
  );
}
