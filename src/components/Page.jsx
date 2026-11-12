import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import { useIntro } from '../hooks/useIntro.js';
import { useReveal } from '../hooks/useReveal.js';
import { useSeo } from '../hooks/useSeo.js';
import { scene } from '../three/sceneState.js';
import Footer from './Footer.jsx';
import { useTransition } from './Transition.jsx';

// Wrapper every page renders through. It sets the document head, tells the 3D scene
// which mode the page wants, wires up intro + scroll reveals, and renders the footer.
//   scene: 'home' (full scroll choreography) | 'idle' (block resting at the side) | 'off'
export default function Page({ children, className = '', sceneMode = 'off', footer = 'full', footerNum }) {
  const root = useRef(null);
  const { pathname } = useLocation();
  const { pageMounted } = useTransition();

  useSeo(pathname);
  useIntro(root);
  useReveal(root);

  useEffect(() => {
    scene.resetScroll();
    scene.mode = sceneMode;
    scene.wake();
    pageMounted();
  }, [sceneMode, pageMounted]);

  return (
    <div ref={root} className="page-root">
      <main id="main" className={`page ${className}`}>
        {children}
      </main>
      <Footer variant={footer} num={footerNum} />
    </div>
  );
}
