// Material for the project preview plane that follows the cursor in the work list.
// The plane bends with cursor velocity and the color channels separate slightly.
export const previewVertex = /* glsl */ `
  uniform vec2 uVelocity;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 p = position;
    float pi = 3.14159265;
    p.x += sin(uv.y * pi) * uVelocity.x * 0.9;
    p.y += sin(uv.x * pi) * uVelocity.y * 0.9;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

export const previewFragment = /* glsl */ `
  uniform sampler2D uTexA;
  uniform sampler2D uTexB;
  uniform float uMix;
  uniform float uAlpha;
  uniform float uRatioA;
  uniform float uRatioB;
  uniform float uPlaneRatio;
  uniform vec2 uVelocity;
  varying vec2 vUv;

  // "object-fit: cover" for a texture of the given aspect ratio.
  vec2 cover(vec2 uv, float ratio) {
    vec2 s = vec2(min(uPlaneRatio / ratio, 1.0), min(ratio / uPlaneRatio, 1.0));
    return (uv - 0.5) * s + 0.5;
  }

  vec3 shifted(sampler2D tex, vec2 uv, vec2 off) {
    return vec3(texture2D(tex, uv + off).r, texture2D(tex, uv).g, texture2D(tex, uv - off).b);
  }

  void main() {
    vec2 off = uVelocity * 0.06;
    vec3 a = shifted(uTexA, cover(vUv, uRatioA), off);
    vec3 b = shifted(uTexB, cover(vUv, uRatioB), off);
    // Vertical wipe between the previous and the current project.
    float wipe = smoothstep(uMix * 1.3 - 0.3, uMix * 1.3, 1.0 - vUv.y);
    vec3 color = mix(b, a, wipe);
    gl_FragColor = vec4(color, uAlpha);
    #include <colorspace_fragment>
  }
`;
