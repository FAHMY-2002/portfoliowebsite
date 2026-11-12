import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { scene } from './sceneState.js';
import { previewFragment, previewVertex } from './shaders/preview.js';

// Project preview shown while hovering the work list (desktop only).
// One WebGL plane follows the cursor, bends with its velocity and wipes
// between project screenshots.
const PLANE_RATIO = 1.7;
const { damp, clamp } = THREE.MathUtils;
const ease = (t) => 1 - Math.pow(1 - t, 3);

export default function PreviewPlane() {
  const mesh = useRef(null);
  const textures = useRef(new Map());
  const s = useRef({ x: 0, y: 0, alpha: 0, current: -1, incoming: -1, mix: 0 });

  const geometry = useMemo(() => new THREE.PlaneGeometry(1, 1, 24, 24), []);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: previewVertex,
        fragmentShader: previewFragment,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        toneMapped: false,
        uniforms: {
          uTexA: { value: null },
          uTexB: { value: null },
          uMix: { value: 0 },
          uAlpha: { value: 0 },
          uRatioA: { value: 2.1 },
          uRatioB: { value: 2.1 },
          uPlaneRatio: { value: PLANE_RATIO },
          uVelocity: { value: new THREE.Vector2() },
        },
      }),
    [],
  );

  useEffect(() => {
    const cache = textures.current;
    return () => {
      cache.forEach((t) => t.dispose());
      cache.clear();
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  const getTexture = (index) => {
    const cache = textures.current;
    if (!cache.has(index)) {
      const texture = new THREE.TextureLoader().load(scene.preview.sources[index], () => scene.wake());
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.generateMipmaps = false;
      texture.minFilter = THREE.LinearFilter;
      cache.set(index, texture);
    }
    return cache.get(index);
  };

  useFrame((state, delta) => {
    const plane = mesh.current;
    const p = scene.preview;
    if (!plane) return;
    const dt = Math.min(delta, 0.05);
    const st = s.current;
    const u = material.uniforms;
    const { viewport, size } = state;

    const tx = (scene.pointer.px / size.width - 0.5) * viewport.width;
    const ty = -(scene.pointer.py / size.height - 0.5) * viewport.height;
    if (st.alpha < 0.02) {
      st.x = tx;
      st.y = ty;
    }

    st.alpha = damp(st.alpha, p.visible ? 1 : 0, 9, dt);
    const visible = st.alpha > 0.005;
    plane.visible = visible;
    scene.previewVisible = visible;
    if (!visible) return;

    // Which screenshot to show, and the wipe between two of them.
    if (p.visible && p.index !== st.current && p.index !== st.incoming) {
      if (st.current === -1 || st.alpha < 0.08) {
        st.current = p.index;
        st.incoming = -1;
        u.uTexA.value = getTexture(p.index);
        u.uRatioA.value = p.ratios?.[p.index] || 2.1;
        u.uMix.value = 0;
      } else {
        st.incoming = p.index;
        st.mix = 0;
        u.uTexB.value = getTexture(p.index);
        u.uRatioB.value = p.ratios?.[p.index] || 2.1;
      }
    }
    if (st.incoming !== -1) {
      st.mix = Math.min(1, st.mix + dt / 0.5);
      u.uMix.value = ease(st.mix);
      if (st.mix >= 1) {
        st.current = st.incoming;
        st.incoming = -1;
        u.uTexA.value = u.uTexB.value;
        u.uRatioA.value = u.uRatioB.value;
        u.uMix.value = 0;
      }
    }

    const px = viewport.width / size.width;
    const w = clamp(size.width * 0.3, 320, 540) * px;
    const h = w / PLANE_RATIO;
    const lastX = st.x;
    const lastY = st.y;
    st.x = damp(st.x, tx, 7, dt);
    st.y = damp(st.y, ty, 7, dt);
    const vx = clamp(((st.x - lastX) / dt) * 0.035, -0.22, 0.22);
    const vy = clamp(((st.y - lastY) / dt) * 0.035, -0.22, 0.22);
    u.uVelocity.value.x = damp(u.uVelocity.value.x, vx, 8, dt);
    u.uVelocity.value.y = damp(u.uVelocity.value.y, vy, 8, dt);
    u.uAlpha.value = st.alpha;

    const k = 0.86 + 0.14 * st.alpha;
    plane.position.set(st.x + w * 0.62, st.y - h * 0.06, 0);
    plane.scale.set(w * k, h * k, 1);
  });

  return <mesh ref={mesh} geometry={geometry} material={material} renderOrder={10} visible={false} />;
}
