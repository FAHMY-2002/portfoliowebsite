import { useRef } from 'react';
import Page from '../components/Page.jsx';
import { ScrollTrigger, useGSAP } from '../lib/gsap.js';
import { scene } from '../three/sceneState.js';
import Hero from '../sections/Hero.jsx';
import About from '../sections/About.jsx';
import Stack from '../sections/Stack.jsx';
import Work from '../sections/Work.jsx';

export default function Home() {
  const root = useRef(null);

  // Scroll choreography for the 3D block: each trigger writes one progress value,
  // and three/poses.js blends the block between section poses from those values.
  useGSAP(
    () => {
      const track = (key, trigger, start, end) => {
        const set = (self) => {
          scene.t[key] = self.progress;
          scene.wake();
        };
        ScrollTrigger.create({ trigger, start, end, onUpdate: set, onRefresh: set });
      };
      track('about', '#about', 'top bottom', 'top 25%');
      track('stack', '#stack', 'top bottom', 'top top');
      track('work', '#work', 'top bottom', 'top 45%');
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <Page sceneMode="home" footer="full" footerNum="05" footerIndex={5}>
        <Hero />
        <About />
        <Stack />
        <Work />
      </Page>
    </div>
  );
}
