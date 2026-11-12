import { Component, lazy, Suspense, useEffect, useState } from 'react';
import { env, useEnv } from '../lib/env.js';
import { stage } from '../lib/stage.js';
import { useStore } from '../lib/store.js';
import { scene } from './sceneState.js';
import './scene.css';

// three.js, React Three Fiber and drei live in this lazy chunk. It is requested
// after the first paint, so the page is usable before any 3D code arrives.
const Scene = lazy(() => import('./Scene.jsx'));

class SceneBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError?.();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function SceneLoader() {
  const { detected, webgl, reduced, tier, finePointer } = useEnv();
  const booted = useStore(stage, (s) => s.booted);
  const [load, setLoad] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!detected || !webgl || load) return;
    // Low-power devices wait until the intro has finished; others start once the browser is idle.
    if (tier === 'low' && !booted) return;
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 250));
    const cancel = window.cancelIdleCallback || clearTimeout;
    const id = idle(() => setLoad(true), { timeout: 1500 });
    return () => cancel(id);
  }, [detected, webgl, tier, booted, load]);

  // Pointer position for the block tilt and the work preview.
  useEffect(() => {
    if (!finePointer || reduced) return;
    const onMove = (e) => {
      scene.pointer.px = e.clientX;
      scene.pointer.py = e.clientY;
      scene.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      scene.pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [finePointer, reduced]);

  if (!load || !webgl) return null;

  const onError = () => {
    document.documentElement.classList.add('no-webgl');
    env.set({ webgl: false });
  };

  return (
    <div className={`scene${ready ? ' is-ready' : ''}${reduced ? ' scene--static' : ''}`} aria-hidden="true">
      <SceneBoundary onError={onError}>
        <Suspense fallback={null}>
          <Scene tier={tier} staticMode={reduced} onReady={() => setReady(true)} />
        </Suspense>
      </SceneBoundary>
    </div>
  );
}
