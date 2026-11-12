import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { skills } from '../data/skills.js';
import { token } from '../lib/tokens.js';
import { scene } from './sceneState.js';
import { resolvePose } from './poses.js';
import { slabFragment, slabVertex } from './shaders/slab.js';

// "The Div": a block made of one slab per skill. Assembled it reads as a single
// box; scrolling to the Stack section pulls it apart into its layers.
const SIZE = { w: 2.5, h: 0.14, d: 1.65 };
const GAP = 0.014;
const SPREAD = 0.36;
const DEFAULT_ACCENT = Math.max(0, skills.indexOf('WordPress'));
const { damp, clamp } = THREE.MathUtils;

export default function DivBlock({ tier, staticMode }) {
  const group = useRef(null);
  const slabs = useRef([]);
  const time = useRef(0);
  const target = useRef({});
  const current = useRef({ x: 0.2, y: 0.1, scale: 0, rotX: 0.9, rotY: -1.3, explode: 0.6, sway: 1, px: 0, py: 0, twist: 0, invert: 0 });

  const geometry = useMemo(() => new THREE.BoxGeometry(SIZE.w, SIZE.h, SIZE.d), []);
  const materials = useMemo(() => {
    const paper = new THREE.Color(token('--color-bg', '#edeae3'));
    const ink = new THREE.Color(token('--color-ink', '#0e0e0c'));
    const accent = new THREE.Color(token('--color-accent', '#ff4a1c'));
    return skills.map(
      (_, i) =>
        new THREE.ShaderMaterial({
          vertexShader: slabVertex,
          fragmentShader: slabFragment,
          toneMapped: false,
          uniforms: {
            uPaper: { value: paper },
            uInk: { value: ink },
            uAccent: { value: accent },
            uActive: { value: 0 },
            uInvert: { value: 0 },
            uLayout: { value: i % 9 },
            uDetail: { value: tier === 'low' ? 0 : 1 },
            uLine: { value: 1 },
          },
        }),
    );
  }, [tier]);

  useEffect(
    () => () => {
      geometry.dispose();
      materials.forEach((m) => m.dispose());
    },
    [geometry, materials],
  );

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const dt = Math.min(delta, 0.05);
    const { viewport, size } = state;
    const c = current.current;
    const to = resolvePose(scene, size.width < 768, target.current);
    const speed = staticMode ? 1000 : 4.5;

    c.x = damp(c.x, to.x, speed, dt);
    c.y = damp(c.y, to.y, speed, dt);
    c.scale = damp(c.scale, to.scale, speed, dt);
    c.rotX = damp(c.rotX, to.rotX, speed, dt);
    c.rotY = damp(c.rotY, to.rotY, speed, dt);
    c.explode = damp(c.explode, to.explode, speed, dt);
    c.sway = damp(c.sway, to.sway, speed, dt);
    c.invert = damp(c.invert, scene.t.footer > 0.001 ? 1 : 0, staticMode ? 1000 : 12, dt);

    if (!staticMode) {
      time.current += dt;
      const usePointer = tier !== 'low';
      c.px = damp(c.px, usePointer ? scene.pointer.x : 0, 3.5, dt);
      c.py = damp(c.py, usePointer ? scene.pointer.y : 0, 3.5, dt);
      c.twist = damp(c.twist, clamp(scene.velocity * 0.012, -0.3, 0.3), 6, dt);
      scene.velocity *= 0.9;
    }

    const unit = clamp(viewport.width / 9.5, 0.5, 1.2);
    const visible = c.scale > 0.004;
    scene.blockVisible = visible;
    g.visible = visible;
    if (!visible) return;

    g.position.set(c.x * viewport.width, c.y * viewport.height, 0);
    g.scale.setScalar(c.scale * unit);
    g.rotation.set(
      c.rotX + c.py * 0.14,
      c.rotY + Math.sin(time.current * 0.35) * 0.26 * c.sway + c.px * 0.3,
      0,
    );

    const mid = (skills.length - 1) / 2;
    const step = SIZE.h + GAP + c.explode * SPREAD;
    const activeIndex = scene.active >= 0 ? scene.active : DEFAULT_ACCENT;
    for (let i = 0; i < slabs.current.length; i++) {
      const slab = slabs.current[i];
      if (!slab) continue;
      slab.position.set(c.explode * (i % 2 ? 0.16 : -0.16), (mid - i) * step, 0);
      slab.rotation.y = (i - mid) * (c.twist + c.explode * 0.085);
      const u = materials[i].uniforms;
      u.uActive.value = damp(u.uActive.value, i === activeIndex ? 1 : 0, staticMode ? 1000 : 9, dt);
      u.uInvert.value = c.invert;
    }
  });

  return (
    <group ref={group} visible={false}>
      {skills.map((name, i) => (
        <mesh key={name} ref={(el) => (slabs.current[i] = el)} geometry={geometry} material={materials[i]} />
      ))}
    </group>
  );
}
