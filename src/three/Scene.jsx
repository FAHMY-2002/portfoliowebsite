import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import DivBlock from './DivBlock.jsx';
import PreviewPlane from './PreviewPlane.jsx';
import { scene } from './sceneState.js';

// Stops the render loop whenever nothing is on screen (block hidden, no preview)
// or the tab is in the background, and starts it again on scroll / hover.
function FrameGate({ staticMode }) {
  const setFrameloop = useThree((s) => s.setFrameloop);
  const invalidate = useThree((s) => s.invalidate);
  const running = useRef(true);
  const idle = useRef(0);

  useEffect(() => {
    if (staticMode) return scene.onWake(() => invalidate());
    const wake = () => {
      idle.current = 0;
      if (!running.current && !document.hidden) {
        running.current = true;
        setFrameloop('always');
      }
    };
    const onVisibility = () => {
      if (document.hidden) {
        running.current = false;
        setFrameloop('never');
      } else wake();
    };
    const off = scene.onWake(wake);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      off();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [staticMode, setFrameloop, invalidate]);

  useFrame((_, delta) => {
    if (staticMode) return;
    if (scene.blockVisible || scene.previewVisible) {
      idle.current = 0;
      return;
    }
    idle.current += delta;
    if (idle.current > 0.5) {
      running.current = false;
      setFrameloop('never');
    }
  });

  return null;
}

export default function Scene({ tier, staticMode, onReady }) {
  // Pixel ratio is capped at 2 (1.5 on low-power devices) and drops to 1 if the frame rate dips.
  const [maxDpr, setMaxDpr] = useState(tier === 'low' ? 1.5 : 2);

  return (
    <Canvas
      flat
      dpr={[1, maxDpr]}
      frameloop={staticMode ? 'demand' : 'always'}
      gl={{ antialias: true, alpha: true, stencil: false, powerPreference: tier === 'low' ? 'default' : 'high-performance' }}
      camera={{ fov: 30, position: [0, 0, 10], near: 0.1, far: 40 }}
      onCreated={onReady}
      style={{ pointerEvents: 'none' }}
      tabIndex={-1}
    >
      {!staticMode && <PerformanceMonitor onDecline={() => setMaxDpr(1)} />}
      <FrameGate staticMode={staticMode} />
      <DivBlock tier={tier} staticMode={staticMode} />
      {!staticMode && tier === 'high' && <PreviewPlane />}
    </Canvas>
  );
}
