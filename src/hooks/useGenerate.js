import { useLocation } from 'react-router';
import { gsap, ScrollTrigger, SplitText, useGSAP } from '../lib/gsap.js';
import { GENERATE as G } from '../lib/generate.config.js';
import { finishBefore, headerBuilt, isBuilt, markDone, registerSection, sectionKey } from '../lib/build.js';
import { stage } from '../lib/stage.js';
import { mq } from '../lib/tokens.js';
import { scene } from '../three/sceneState.js';

// Builds a section "live" the first time it scrolls into view:
//   wireframe -> status label -> headings -> text -> images -> components -> done.
//
// Targets are declared in markup with data-gen="heading | text | image | component".
// data-gen-box marks an element that only gets an outline (e.g. a list row whose
// children animate on their own). All real content stays in the DOM the whole time:
// text is split into word/char spans whose opacity changes, so screen readers and
// search engines always get the full text. Overlays (outlines, caret, label) are
// aria-hidden and absolutely positioned, so nothing shifts the layout.

// aria-label is only valid on headings here; other elements keep their text readable as is.
export const ariaMode = (el) => (/^H[1-6]$/.test(el.tagName) ? 'auto' : 'none');

const pad = (n) => String(n).padStart(2, '0');
const KIND_LABEL = { heading: 'h', text: 'p', image: 'img', component: 'ui' };

function visible(el) {
  const r = el.getBoundingClientRect();
  return r.width > 0 && r.height > 0;
}

function collect(root, includeHeader) {
  const q = (sel) => [...root.querySelectorAll(sel)];
  const header = includeHeader ? [...document.querySelectorAll('[data-gen-header] [data-gen]')] : [];
  return {
    heading: q('[data-gen="heading"]'),
    text: q('[data-gen="text"]'),
    image: q('[data-gen="image"]'),
    components: [...header, ...q('[data-gen="component"]')],
    boxes: [...header, ...q('[data-gen-box]'), ...q('[data-gen]').filter((el) => !el.parentElement.closest('[data-gen-box]'))],
  };
}

// Phase start times: content phases run in `order`, each starting when the previous is `lead` done.
function schedule(order, has, speed) {
  const times = {};
  let t = G.contentStart * speed;
  let prev = 0;
  order.forEach((phase, i) => {
    if (!has[phase]) return;
    if (i > 0 && prev) t += prev * G.lead;
    times[phase] = t;
    prev = G[phase].duration * speed;
    times[`${phase}End`] = t + prev;
  });
  times.end = Math.max(G.wireframe.duration * speed, ...order.filter((p) => has[p]).map((p) => times[`${p}End`]));
  return times;
}

function createOverlay(root, label, kinds, first) {
  const overlay = document.createElement('div');
  overlay.className = `gen-overlay${first ? ' gen-overlay--first' : ''}`;
  overlay.setAttribute('aria-hidden', 'true');
  const status = document.createElement('div');
  status.className = 'gen-status label';
  status.innerHTML = '<span class="gen-status__text"></span><span class="gen-status__cursor"></span>';
  const caret = document.createElement('span');
  caret.className = 'gen-caret';
  overlay.append(status, caret);
  root.appendChild(overlay);

  const origin = root.getBoundingClientRect();
  const boxes = kinds.slice(0, G.wireframe.maxBoxes).map(([el, kind]) => {
    const r = el.getBoundingClientRect();
    const box = document.createElement('span');
    box.className = 'gen-box';
    box.style.width = `${r.width}px`;
    box.style.height = `${r.height}px`;
    box.style.transform = `translate(${r.left - origin.left}px, ${r.top - origin.top}px)`;
    box.innerHTML =
      '<i class="gen-box__e gen-box__e--t"></i><i class="gen-box__e gen-box__e--r"></i>' +
      '<i class="gen-box__e gen-box__e--b"></i><i class="gen-box__e gen-box__e--l"></i>' +
      (r.width > 64 && r.height > 14 ? `<b class="gen-box__tag">${KIND_LABEL[kind] || ''}</b>` : '');
    overlay.appendChild(box);
    return box;
  });
  return { overlay, status, text: status.firstChild, caret, boxes, label };
}

function moveCaret(caret, root, el) {
  const o = root.getBoundingClientRect();
  const r = el.getBoundingClientRect();
  caret.style.transform = `translate(${r.right - o.left + 3}px, ${r.top - o.top}px) scaleY(${r.height / 100})`;
}

// Reveals `units` (arrays of elements) one step at a time over `duration`.
function stream(tl, units, at, duration, onStep) {
  const proxy = { n: 0 };
  let shown = 0;
  tl.to(
    proxy,
    {
      n: units.length,
      duration,
      ease: 'none',
      onUpdate: () => {
        const target = Math.min(units.length, Math.ceil(proxy.n - 1e-6));
        if (target === shown) return;
        while (shown < target) units[shown++].forEach((u) => (u.style.opacity = '1'));
        onStep?.(units[shown - 1].at(-1));
      },
    },
    at,
  );
}

const chunk = (list, size) => {
  const out = [];
  for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size));
  return out;
};

export function useGenerate(ref, { index, name, order = G.order, speed = 1 }) {
  const { pathname } = useLocation();

  useGSAP(
    (context) => {
      const root = ref.current;
      if (!root || typeof window === 'undefined') return;
      const key = sectionKey(pathname, index);
      const isFirst = index === 1;

      // Already built this session (or reduced data in the store): show the finished section.
      if (isBuilt(key)) {
        if (isFirst) scene.build = 1;
        return;
      }

      const reduced = window.matchMedia(mq.reduced).matches;
      const light = !window.matchMedia(`${mq.md()} and ${mq.hover}`).matches;
      const entry = { done: false, finish: () => {} };
      const unregister = registerSection(index, entry);
      const includeHeader = isFirst && !headerBuilt;
      const t = collect(root, includeHeader);
      const splits = [];
      let tl = null;
      let st = null;
      let finished = false;

      // ---- Hidden start state (set straight away, before the section is ever seen) ----
      if (isFirst) scene.build = reduced ? 1 : 0;
      if (reduced) {
        gsap.set(root, { opacity: 0 });
      } else {
        const units = { heading: [], text: [] };
        if (light) {
          gsap.set([...t.heading, ...t.text], { opacity: 0 });
        } else {
          t.heading.forEach((el) => {
            const words = (el.textContent || '').trim().split(/\s+/).length;
            const byChar = words <= G.heading.charsUpToWords;
            const split = SplitText.create(el, { type: byChar ? 'words,chars' : 'words', aria: ariaMode(el) });
            splits.push(split);
            const parts = byChar ? split.chars : split.words;
            gsap.set(parts, { opacity: 0 });
            units.heading.push(parts.map((p) => [p]));
          });
          t.text.forEach((el) => {
            const split = SplitText.create(el, { type: 'words', aria: ariaMode(el) });
            splits.push(split);
            gsap.set(split.words, { opacity: 0 });
            const size = Math.max(G.text.minChunk, Math.ceil(split.words.length / G.text.maxSteps));
            units.text.push(chunk(split.words, size));
          });
        }
        t.units = units;
        t.image.forEach((el) => {
          gsap.set(el.querySelector('.media__grid'), { opacity: 1 });
          gsap.set(el.querySelector('.media__px'), { opacity: 0 });
          gsap.set(el.querySelector('.media__inner'), { clipPath: 'inset(0% 0% 100% 0%)' });
        });
        gsap.set(t.components, { opacity: 0, scale: G.components.fromScale, y: G.components.fromY });
      }

      const finalize = () => {
        if (finished) return;
        finished = true;
        splits.forEach((s) => s.revert());
        gsap.set([root, ...t.heading, ...t.text, ...t.components], { clearProps: 'opacity,transform' });
        t.image.forEach((el) => {
          gsap.set(el.querySelectorAll('.media__grid, .media__px'), { clearProps: 'opacity' });
          gsap.set(el.querySelector('.media__inner'), { clearProps: 'clipPath' });
        });
        tl?.data?.overlay?.remove();
        if (isFirst) {
          scene.build = 1;
          scene.wake();
        }
        entry.done = true;
        markDone(index, key);
        // Kill the trigger outside ScrollTrigger's own callback loop.
        gsap.delayedCall(0, () => st?.kill());
      };

      const buildTimeline = () => {
        if (reduced) {
          return gsap
            .timeline({ paused: true, onComplete: finalize })
            .to(root, { opacity: 1, duration: G.reduced.fade, ease: G.ease });
        }
        const s = speed;
        const has = {
          heading: t.heading.length > 0,
          text: t.text.length > 0,
          image: t.image.length > 0,
          components: t.components.length > 0,
        };
        const at = schedule(order, has, s);
        const kinds = t.boxes.filter(visible).map((el) => [el, el.dataset.gen || 'component']);
        const ov = createOverlay(root, name, kinds, isFirst);
        const tl = gsap.timeline({ paused: true, defaults: { ease: G.ease }, onComplete: finalize });
        tl.data = ov;

        // 1. Wireframe
        ov.boxes.forEach((box, i) => {
          const edges = box.querySelectorAll('.gen-box__e');
          const d = G.wireframe.duration * s;
          const start = i * G.wireframe.stagger * s;
          tl.fromTo([edges[0], edges[2]], { scaleX: 0 }, { scaleX: 1, duration: d * 0.6 }, start)
            .fromTo([edges[1], edges[3]], { scaleY: 0 }, { scaleY: 1, duration: d * 0.6 }, start + d * 0.25)
            .fromTo(box.querySelector('.gen-box__tag'), { opacity: 0 }, { opacity: 1, duration: d * 0.4 }, start + d * 0.3);
        });

        // 2. Status label, typed
        const full = `generating section ${pad(index)} / ${name}…`;
        // Fixed width (monospace: one ch plus letter-spacing per character) so typing never resizes the label.
        ov.status.style.width = `calc(${full.length + 1} * (1ch + var(--track-label)) + 1.9em)`;
        const typed = { n: 0 };
        tl.fromTo(ov.status, { opacity: 0 }, { opacity: 1, duration: 0.15 }, G.status.at * s).to(
          typed,
          {
            n: full.length,
            duration: G.status.typeDuration * s,
            ease: 'none',
            onUpdate: () => (ov.text.textContent = full.slice(0, Math.round(typed.n))),
          },
          G.status.at * s,
        );

        // 3. Headings and text
        if (light) {
          if (has.heading)
            tl.to(t.heading, { opacity: 1, duration: G.light.text.duration * s, stagger: G.light.text.stagger }, at.heading);
          if (has.text)
            tl.to(t.text, { opacity: 1, duration: G.light.text.duration * s, stagger: G.light.text.stagger }, at.text);
        } else {
          const caretTo = (el) => moveCaret(ov.caret, root, el);
          ['heading', 'text'].forEach((kind) => {
            if (!has[kind]) return;
            const list = t.units[kind];
            const win = G[kind].duration * s;
            const each = win * G[kind].perItem;
            const gap = list.length > 1 ? (win - each) / (list.length - 1) : 0;
            list.forEach((units, i) => units.length && stream(tl, units, at[kind] + i * gap, each, caretTo));
          });
          const caretStart = at.heading ?? at.text;
          const caretEnd = Math.max(at.headingEnd ?? 0, at.textEnd ?? 0);
          if (caretStart !== undefined) tl.set(ov.caret, { opacity: 1 }, caretStart).set(ov.caret, { opacity: 0 }, caretEnd);
        }

        // 4. Images: grid placeholder -> pixelated -> real image
        t.image.forEach((el, i) => {
          const start = at.image + i * G.image.stagger * s;
          const px = el.querySelector('.media__px');
          if (!light) tl.to(px, { opacity: 1, duration: G.image.pixelIn * s }, start);
          tl.to(
            el.querySelector('.media__inner'),
            { clipPath: 'inset(0% 0% 0% 0%)', duration: G.image.resolve * s },
            start + (light ? 0 : G.image.pixelIn * 0.6 * s),
          ).to(
            [el.querySelector('.media__grid'), px],
            { opacity: 0, duration: 0.2 * s },
            start + (G.image.pixelIn * 0.6 + G.image.resolve) * s,
          );
        });

        // 5. Components snap in
        if (has.components) {
          tl.to(
            t.components,
            { opacity: 1, scale: 1, y: 0, duration: G.components.duration * s, stagger: G.components.stagger * s },
            at.components,
          );
        }

        // The 3D block solidifies alongside the first section's images and components.
        if (isFirst) {
          const from = at[G.scene.from] ?? at.components ?? at.end * 0.5;
          const to = at[`${G.scene.to}End`] ?? at.end;
          tl.fromTo(
            scene,
            { build: 0 },
            { build: 1, duration: Math.max(0.2, to - from), ease: 'none', onUpdate: () => scene.wake() },
            from,
          );
        }

        // 6. Complete
        const end = Math.max(at.end, tl.duration());
        tl.to(ov.boxes, { opacity: 0, duration: G.complete.fade * s }, end)
          .call(
            () => {
              ov.text.textContent = G.status.doneText;
              ov.status.classList.add('is-done');
            },
            null,
            end,
          )
          .to(ov.status, { opacity: 0, duration: G.complete.fade * s }, end + G.complete.hold * s);
        return tl;
      };

      const play = () => {
        if (tl || finished) return;
        finishBefore(index);
        tl = context.add(() => buildTimeline());
        tl.play();
      };
      const finish = () => {
        if (finished) return;
        if (!tl) tl = context.add(() => buildTimeline());
        tl.progress(1);
      };
      entry.finish = finish;

      // Start only once the page is uncovered (intro or route transition finished).
      const arm = () =>
        context.add(() => {
          st = ScrollTrigger.create({
            trigger: root,
            start: G.start,
            end: 'bottom top',
            onEnter: play,
            onLeave: finish,
          });
          if (st.progress >= 1) finish();
          else if (st.isActive) play();
        });
      let unsubscribe = () => {};
      if (stage.get().shown) arm();
      else
        unsubscribe = stage.subscribe(() => {
          if (!stage.get().shown) return;
          unsubscribe();
          arm();
        });

      return () => {
        unsubscribe();
        unregister();
      };
    },
    { scope: ref, dependencies: [pathname, index] },
  );
}
