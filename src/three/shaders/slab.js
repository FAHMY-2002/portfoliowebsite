// Material for one slab of the block: flat "technical drawing" look.
// Ink outlines with a constant on-screen width, and a page-layout wireframe
// drawn on the top face (each slab is a different layout made of boxes).
export const slabVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormalObj;
  void main() {
    vUv = uv;
    vNormalObj = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const slabFragment = /* glsl */ `
  uniform vec3 uPaper;
  uniform vec3 uInk;
  uniform vec3 uAccent;
  uniform float uActive;
  uniform float uInvert;
  uniform float uLayout;
  uniform float uDetail;
  uniform float uLine;
  varying vec2 vUv;
  varying vec3 vNormalObj;

  // Outline of the rectangle a..b, about uLine pixels wide.
  float box(vec2 uv, vec2 a, vec2 b) {
    vec2 d = min(uv - a, b - uv);
    float m = min(d.x, d.y);
    float w = fwidth(m) * uLine;
    return 1.0 - smoothstep(w * 0.9, w * 1.7, abs(m));
  }

  float wire(vec2 uv, float id) {
    float l = 0.0;
    if (id < 0.5) {
      l = max(box(uv, vec2(0.06, 0.8), vec2(0.94, 0.92)), box(uv, vec2(0.06, 0.1), vec2(0.94, 0.72)));
    } else if (id < 1.5) {
      l = max(box(uv, vec2(0.06, 0.1), vec2(0.47, 0.9)), box(uv, vec2(0.53, 0.1), vec2(0.94, 0.9)));
    } else if (id < 2.5) {
      l = max(box(uv, vec2(0.06, 0.1), vec2(0.33, 0.9)), max(box(uv, vec2(0.37, 0.1), vec2(0.63, 0.9)), box(uv, vec2(0.67, 0.1), vec2(0.94, 0.9))));
    } else if (id < 3.5) {
      l = max(box(uv, vec2(0.06, 0.1), vec2(0.28, 0.9)), box(uv, vec2(0.33, 0.1), vec2(0.94, 0.9)));
    } else if (id < 4.5) {
      l = max(max(box(uv, vec2(0.06, 0.54), vec2(0.47, 0.9)), box(uv, vec2(0.53, 0.54), vec2(0.94, 0.9))),
              max(box(uv, vec2(0.06, 0.1), vec2(0.47, 0.46)), box(uv, vec2(0.53, 0.1), vec2(0.94, 0.46))));
    } else if (id < 5.5) {
      l = max(box(uv, vec2(0.06, 0.62), vec2(0.94, 0.9)),
              max(box(uv, vec2(0.06, 0.1), vec2(0.33, 0.54)), max(box(uv, vec2(0.37, 0.1), vec2(0.63, 0.54)), box(uv, vec2(0.67, 0.1), vec2(0.94, 0.54)))));
    } else if (id < 6.5) {
      l = max(box(uv, vec2(0.06, 0.1), vec2(0.6, 0.9)), max(box(uv, vec2(0.65, 0.54), vec2(0.94, 0.9)), box(uv, vec2(0.65, 0.1), vec2(0.94, 0.46))));
    } else if (id < 7.5) {
      l = max(max(box(uv, vec2(0.06, 0.1), vec2(0.26, 0.9)), box(uv, vec2(0.29, 0.1), vec2(0.49, 0.9))),
              max(box(uv, vec2(0.51, 0.1), vec2(0.71, 0.9)), box(uv, vec2(0.74, 0.1), vec2(0.94, 0.9))));
    } else {
      l = max(box(uv, vec2(0.06, 0.3), vec2(0.94, 0.9)), box(uv, vec2(0.06, 0.1), vec2(0.94, 0.22)));
    }
    return l;
  }

  void main() {
    vec3 n = abs(vNormalObj);
    float isTop = step(0.5, n.y);
    float isSide = step(0.5, n.x);

    // Page colors, or swapped when the block sits on the dark footer.
    vec3 paper = mix(uPaper, uInk, uInvert);
    vec3 ink = mix(uInk, uPaper, uInvert);

    // Faux lighting: the top is the brightest face, the two sides step down.
    // (Colors are linear here, so the dark version needs much smaller steps.)
    vec3 top = mix(mix(paper, vec3(1.0), 0.45), mix(paper, ink, 0.012), uInvert);
    vec3 sideA = mix(paper, ink, mix(0.07, 0.03, uInvert));
    vec3 sideB = mix(paper, ink, mix(0.2, 0.07, uInvert));
    vec3 fill = mix(mix(sideA, sideB, isSide), top, isTop);
    fill = mix(fill, uAccent, uActive);

    float edge = box(vUv, vec2(0.0), vec2(1.0));
    float inner = isTop * uDetail * wire(vUv, uLayout) * 0.55;
    vec3 color = mix(fill, mix(ink, uInk, uActive), max(edge, inner));

    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
  }
`;
